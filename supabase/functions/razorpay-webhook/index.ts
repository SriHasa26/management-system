// Supabase Edge Function: razorpay-webhook
// Securely and idempotently handles asynchronous webhook events from Razorpay

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createHmac } from 'https://deno.land/std@0.168.0/node/crypto.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const webhookSecret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET');
    if (!webhookSecret || webhookSecret === 'your_razorpay_webhook_secret') {
      return new Response(JSON.stringify({ error: 'Webhook secret is not configured on server' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const signature = req.headers.get('x-razorpay-signature');
    if (!signature) {
      return new Response(JSON.stringify({ error: 'Missing x-razorpay-signature header' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const rawBody = await req.text();

    // 1. Verify webhook signature (Fail closed if mismatched)
    const expectedSignature = createHmac('sha256', webhookSecret)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      return new Response(JSON.stringify({ error: 'Invalid webhook signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    const payment = payload.payload?.payment?.entity;

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Server environment not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 2. Handle Payment Captured Event
    if (event === 'payment.captured' && payment) {
      const razorpayPaymentId = payment.id;
      const razorpayOrderId = payment.order_id;
      const notes = payment.notes || {};
      const amount = payment.amount / 100;

      // Idempotency check: verify if payment was already recorded
      const { data: existingPayment } = await supabaseAdmin
        .from('payments')
        .select('id')
        .eq('razorpay_payment_id', razorpayPaymentId)
        .maybeSingle();

      if (existingPayment) {
        return new Response(JSON.stringify({ status: 'already_processed' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Look up trusted order record
      let feeId = notes.feeId;
      let studentId = notes.studentId;
      let studentName = notes.studentName || 'Student';

      if (razorpayOrderId) {
        const { data: orderRecord } = await supabaseAdmin
          .from('payment_orders')
          .select('*')
          .eq('order_id', razorpayOrderId)
          .maybeSingle();

        if (orderRecord) {
          feeId = orderRecord.fee_id;
          studentId = orderRecord.student_id;
        }
      }

      // Fetch fee details
      let fee: any = null;
      if (feeId) {
        const { data: feeData } = await supabaseAdmin
          .from('fees')
          .select('*')
          .eq('id', feeId)
          .maybeSingle();
        fee = feeData;
        if (fee) studentName = fee.student_name;
      }

      const transactionRef = `TXN-${Date.now()}-${razorpayPaymentId.slice(-6)}`;
      const invoiceNumber = `SRI-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const today = new Date().toISOString().split('T')[0];

      // A. Insert Payment Record
      const { data: paymentRecord } = await supabaseAdmin.from('payments').insert({
        fee_id: feeId || null,
        student_id: studentId || 'SRI-2026-001',
        student_name: studentName,
        amount,
        payment_method: payment.method ? `Razorpay ${payment.method.toUpperCase()}` : 'Razorpay UPI',
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        status: 'SUCCESS',
        transaction_ref: transactionRef,
      }).select().single();

      // B. Update Fee Record
      if (fee && feeId) {
        const currentPaid = Number(fee.paid_amount || 0);
        const newPaidAmount = currentPaid + amount;
        const netFee = Number(fee.amount) - Number(fee.discount || 0);
        const newFeeStatus = newPaidAmount >= netFee ? 'Paid' : 'Partially Paid';

        await supabaseAdmin.from('fees').update({
          paid_amount: newPaidAmount,
          status: newFeeStatus,
          last_payment_date: today,
          updated_at: new Date().toISOString(),
        }).eq('id', feeId);
      }

      // C. Update Order Record
      if (razorpayOrderId) {
        await supabaseAdmin
          .from('payment_orders')
          .update({ status: 'PAID', updated_at: new Date().toISOString() })
          .eq('order_id', razorpayOrderId);
      }

      // D. Insert Invoice Record
      if (paymentRecord && fee) {
        await supabaseAdmin.from('invoices').insert({
          invoice_number: invoiceNumber,
          fee_id: feeId || null,
          payment_id: paymentRecord.id,
          student_id: studentId || 'SRI-2026-001',
          student_name: studentName,
          student_grade: fee.class_name || 'Class 10',
          batch_name: fee.batch_name || 'Morning Star',
          fee_month: fee.month || 'Tuition Fee',
          amount_paid: amount,
          payment_method: 'Razorpay UPI',
          transaction_ref: transactionRef,
          status: 'PAID',
        });
      }

      // E. Create Notification
      if (studentId) {
        await supabaseAdmin.from('notifications').insert({
          user_id: studentId,
          title: 'Fee Payment Confirmed',
          message: `Tuition fee payment of ₹${amount} received. Receipt: ${invoiceNumber}.`,
          type: 'fee',
          link: '/student/fees',
        });
      }

      return new Response(JSON.stringify({ received: true, status: 'payment_captured' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Handle Payment Failed Event
    if (event === 'payment.failed' && payment) {
      const razorpayPaymentId = payment.id;
      const razorpayOrderId = payment.order_id;
      const amount = (payment.amount || 0) / 100;
      const notes = payment.notes || {};

      if (razorpayOrderId) {
        await supabaseAdmin
          .from('payment_orders')
          .update({ status: 'FAILED', updated_at: new Date().toISOString() })
          .eq('order_id', razorpayOrderId);
      }

      // Log failure in payments table with FAILED status
      await supabaseAdmin.from('payments').insert({
        fee_id: notes.feeId || null,
        student_id: notes.studentId || 'SRI-2026-001',
        student_name: notes.studentName || 'Student',
        amount,
        payment_method: 'Razorpay',
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        status: 'FAILED',
        transaction_ref: `FAIL-${Date.now()}-${razorpayPaymentId.slice(-6)}`,
        notes: payment.error_description || 'Payment failed or cancelled at gateway',
      });

      // DO NOT mark fee as paid

      return new Response(JSON.stringify({ received: true, status: 'payment_failed_recorded' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. Safely Acknowledge Unsupported or Refund Events without altering fee status
    return new Response(JSON.stringify({ received: true, status: 'event_acknowledged', event }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Webhook processing failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

