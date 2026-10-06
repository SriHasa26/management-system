// Supabase Edge Function: create-razorpay-order
// Authenticated server-side Razorpay order generation based on authoritative Supabase fee data

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
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
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Supabase server environment is not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Authenticate requesting user
    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized: invalid or expired session token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let requestBody: any = {};
    try {
      requestBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { feeId } = requestBody;
    if (!feeId) {
      return new Response(JSON.stringify({ error: 'Missing required field: feeId' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Fetch authoritative fee record
    const { data: fee, error: feeError } = await supabaseAdmin
      .from('fees')
      .select('*')
      .eq('id', feeId)
      .maybeSingle();

    if (feeError || !fee) {
      return new Response(JSON.stringify({ error: 'Fee record not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Authorize user: Check if admin, linked student, or linked parent
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = profile?.role === 'admin';

    let isAuthorized = isAdmin;
    if (!isAuthorized) {
      // Check if authenticated user is the student
      const { data: studentRecord } = await supabaseAdmin
        .from('students')
        .select('id, parent_id')
        .eq('id', fee.student_id)
        .eq('profile_id', user.id)
        .maybeSingle();

      if (studentRecord) {
        isAuthorized = true;
      } else {
        // Check if authenticated user is the linked parent
        const { data: parentRecord } = await supabaseAdmin
          .from('parents')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle();

        if (parentRecord) {
          const { data: childRecord } = await supabaseAdmin
            .from('students')
            .select('id')
            .eq('id', fee.student_id)
            .eq('parent_id', parentRecord.id)
            .maybeSingle();

          if (childRecord) {
            isAuthorized = true;
          }
        }
      }
    }

    if (!isAuthorized) {
      return new Response(JSON.stringify({ error: 'Forbidden: You are not authorized to pay this fee record' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 3. Calculate authoritative outstanding balance server-side
    const baseAmount = Number(fee.amount) || 0;
    const discount = Number(fee.discount) || 0;
    const paidAmount = Number(fee.paid_amount) || 0;
    const outstandingAmount = Math.max(0, baseAmount - discount - paidAmount);

    if (outstandingAmount <= 0 || fee.status === 'Paid') {
      return new Response(JSON.stringify({ error: 'Fee is already fully paid or has no outstanding balance' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 4. Verify Razorpay credentials
    const keyId = Deno.env.get('RAZORPAY_KEY_ID') || '';
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || '';

    if (!keyId || !keySecret || keySecret === 'secret_placeholder') {
      return new Response(JSON.stringify({ error: 'Razorpay payment gateway credentials not configured on server' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const amountInPaise = Math.round(outstandingAmount * 100);
    const receipt = `rec_${Date.now()}_${fee.student_id.replace(/[^a-zA-Z0-9]/g, '').slice(-6)}`;
    const auth = btoa(`${keyId}:${keySecret}`);

    // 5. Create Razorpay order via official API
    const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt,
        notes: {
          feeId: fee.id,
          studentId: fee.student_id,
          studentName: fee.student_name,
          month: fee.month,
          institution: 'SRI SAI Tuition & Learning Centre',
        },
      }),
    });

    if (!rzpResponse.ok) {
      const errText = await rzpResponse.text();
      return new Response(JSON.stringify({ error: `Razorpay order creation failed: ${errText.slice(0, 200)}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const orderData = await rzpResponse.json();

    // 6. Store trusted order in payment_orders table
    await supabaseAdmin.from('payment_orders').insert({
      order_id: orderData.id,
      fee_id: fee.id,
      student_id: fee.student_id,
      user_id: user.id,
      amount_in_paise: amountInPaise,
      amount: outstandingAmount,
      currency: 'INR',
      receipt,
      status: 'CREATED',
    });

    // 7. Return safe public order payload to client
    return new Response(
      JSON.stringify({
        order_id: orderData.id,
        amount: amountInPaise,
        amount_in_rupees: outstandingAmount,
        currency: 'INR',
        key_id: keyId,
        fee_id: fee.id,
        student_id: fee.student_id,
        student_name: fee.student_name,
        student_grade: fee.class_name,
        batch_name: fee.batch_name,
        fee_month: fee.month,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

