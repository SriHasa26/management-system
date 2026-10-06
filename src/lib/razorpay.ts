/**
 * Razorpay Payment Gateway Integration Bridge for SRI SAI Tuition & Learning Centre
 * Connects securely to Supabase Edge Functions for order creation and verification.
 */

import { supabase, isSupabaseConfigured } from './supabase';

export interface RazorpayOptions {
  key?: string;
  amount: number; // in paise
  currency?: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (options: {
  feeId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  studentPhone?: string;
  feeMonth: string;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
    paymentMethod: string;
  }) => void;
  onError: (errorMsg: string) => void;
  onDismiss?: () => void;
}) => {
  if (!isSupabaseConfigured()) {
    options.onError('Supabase backend is not configured. Real Razorpay payments require an active backend.');
    return;
  }

  // 1. Get authenticated session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    options.onError('You must be logged in to pay fees. Please login and try again.');
    return;
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const createOrderUrl = `${supabaseUrl}/functions/v1/create-razorpay-order`;

  let orderData: {
    order_id: string;
    amount: number;
    amount_in_rupees: number;
    currency: string;
    key_id: string;
    fee_id: string;
    student_name: string;
    fee_month: string;
  };

  try {
    // 2. Create authoritative order server-side
    const resp = await fetch(createOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ feeId: options.feeId }),
    });

    const json = await resp.json();
    if (!resp.ok) {
      options.onError(json.error || 'Failed to create payment order on server.');
      return;
    }

    orderData = json;
  } catch (err: any) {
    options.onError(`Server communication error: ${err.message || 'Unable to connect to payment server.'}`);
    return;
  }

  // 3. Load Razorpay Checkout SDK
  const isScriptLoaded = await loadRazorpayScript();
  if (!isScriptLoaded || !(window as any).Razorpay) {
    options.onError('Unable to load Razorpay payment gateway checkout. Please check your internet connection.');
    return;
  }

  const razorpayKey = orderData.key_id || import.meta.env.VITE_RAZORPAY_KEY_ID;

  // 4. Open real Razorpay Checkout bound to server-created order_id
  const rzp = new (window as any).Razorpay({
    key: razorpayKey,
    order_id: orderData.order_id,
    amount: orderData.amount,
    currency: orderData.currency || 'INR',
    name: 'SRI SAI Tuition & Learning Centre',
    description: `Tuition Fee for ${orderData.fee_month} - ${orderData.student_name}`,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80',
    handler: (response: any) => {
      if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
        options.onError('Payment response from gateway was incomplete.');
        return;
      }

      options.onSuccess({
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,
        paymentMethod: 'Razorpay UPI',
      });
    },
    prefill: {
      name: options.studentName,
      email: options.studentEmail || 'parent@srisai.edu',
      contact: options.studentPhone || '+916301293925',
    },
    notes: {
      feeId: options.feeId,
      studentId: options.studentId,
      feeMonth: options.feeMonth,
      centre: 'SRI SAI Tuition Point, Patamata, Vijayawada',
    },
    theme: {
      color: '#173F35',
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) options.onDismiss();
      },
    },
  });

  rzp.on('payment.failed', (response: any) => {
    options.onError(response.error?.description || 'Payment transaction failed or was cancelled');
  });

  rzp.open();
};

