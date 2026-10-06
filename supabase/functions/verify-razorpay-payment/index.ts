// Supabase Edge Function: verify-razorpay-payment
// Cryptographically verifies Razorpay signature server-side against trusted database orders

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ success: false, error: 'Server environment not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Authenticate user
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized: invalid session token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let bodyData: any = {};
    try {
      bodyData = await req.json();
    } catch {
      return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentMethod = 'Razorpay UPI',
    } = bodyData;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Missing required Razorpay payment response parameters (order_id, payment_id, signature)',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Cryptographic signature verification with fail-closed security
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    if (!keySecret || keySecret === 'secret_placeholder') {
      return new Response(
        JSON.stringify({ success: false, error: 'Razorpay secret key not configured on server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const verificationPayload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = createHmac('sha256', keySecret)
      .update(verificationPayload)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment signature verification failed: invalid signature' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Look up trusted order from database
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: orderRecord, error: orderError } = await supabaseAdmin
      .from('payment_orders')
      .select('*')
      .eq('order_id', razorpay_order_id)
      .maybeSingle();

    if (orderError || !orderRecord) {
      return new Response(
        JSON.stringify({ success: false, error: 'Payment order was not found in trusted records' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Verify user authorization for this order
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = profile?.role === 'admin';
    let isAuthorized = isAdmin;

    if (!isAuthorized) {
      const { data: studentRecord } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('id', orderRecord.student_id)
        .eq('profile_id', user.id)
        .maybeSingle();

      if (studentRecord) {
        isAuthorized = true;
      } else {
        const { data: parentRecord } = await supabaseAdmin
          .from('parents')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle();

        if (parentRecord) {
          const { data: childRecord } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('id', orderRecord.student_id)
            .eq('parent_id', parentRecord.id)
            .maybeSingle();

          if (childRecord) isAuthorized = true;
        }
      }
    }

    if (!isAuthorized) {
      return new Response(
        JSON.stringify({ success: false, error: 'Forbidden: You are not authorized to verify this payment' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 5. Idempotency check: check if payment was already recorded
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id, transaction_ref, fee_id')
      .eq('razorpay_payment_id', razorpay_payment_id)
      .maybeSingle();

    if (existingPayment) {
      const { data: existingInvoice } = await supabaseAdmin
        .from('invoices')
        .select('*')
        .eq('payment_id', existingPayment.id)
        .maybeSingle();

      return new Response(
        JSON.stringify({
          success: true,
          alreadyProcessed: true,
          paymentId: existingPayment.id,
          invoiceId: existingInvoice?.id,
          invoiceNumber: existingInvoice?.invoice_number,
          transactionRef: existingPayment.transaction_ref,
          status: 'PAID',
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // 6. Fetch authoritative fee record
    const { data: fee, error: feeError } = await supabaseAdmin
      .from('fees')
      .select('*')
      .eq('id', orderRecord.fee_id)
      .maybeSingle();

    if (feeError || !fee) {
      return new Response(
        JSON.stringify({ success: false, error: 'Associated fee record not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const transactionRef = `TXN-${Date.now()}-${razorpay_payment_id.slice(-6)}`;
    const invoiceNumber = `SRI-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    // 7. Insert payment into payments table
    const { data: paymentRecord, error: pError } = await supabaseAdmin
      .from('payments')
      .insert({
        fee_id: orderRecord.fee_id,
        student_id: orderRecord.student_id,
        student_name: fee.student_name,
        amount: orderRecord.amount,
        payment_method: paymentMethod,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        status: 'SUCCESS',
        transaction_ref: transactionRef,
      })
      .select()
      .single();

    if (pError) throw pError;

    // 8. Update fee balance and status
    const currentPaid = Number(fee.paid_amount || 0);
    const newPaidAmount = currentPaid + Number(orderRecord.amount);
    const netFee = Number(fee.amount) - Number(fee.discount || 0);
    const newFeeStatus = newPaidAmount >= netFee ? 'Paid' : 'Partially Paid';

    await supabaseAdmin
      .from('fees')
      .update({
        paid_amount: newPaidAmount,
        status: newFeeStatus,
        last_payment_date: today,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderRecord.fee_id);

    // 9. Update order status
    await supabaseAdmin
      .from('payment_orders')
      .update({ status: 'PAID', updated_at: new Date().toISOString() })
      .eq('order_id', razorpay_order_id);

    // 10. Generate authoritative invoice
    const { data: invoiceRecord } = await supabaseAdmin
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        fee_id: orderRecord.fee_id,
        payment_id: paymentRecord.id,
        student_id: orderRecord.student_id,
        student_name: fee.student_name,
        student_grade: fee.class_name || 'Class 10',
        batch_name: fee.batch_name || 'Morning Star',
        fee_month: fee.month,
        amount_paid: orderRecord.amount,
        payment_method: paymentMethod,
        transaction_ref: transactionRef,
        status: 'PAID',
      })
      .select()
      .single();

    // 11. Create in-app notification
    await supabaseAdmin.from('notifications').insert({
      user_id: orderRecord.student_id,
      title: 'Fee Payment Successful',
      message: `Receipt ${invoiceNumber} generated for ${fee.month} tuition fee (₹${orderRecord.amount}).`,
      type: 'fee',
      link: '/student/fees',
    });

    return new Response(
      JSON.stringify({
        success: true,
        paymentId: paymentRecord.id,
        invoiceId: invoiceRecord?.id,
        invoiceNumber,
        transactionRef,
        amountPaid: orderRecord.amount,
        feeMonth: fee.month,
        status: 'PAID',
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Payment verification failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

