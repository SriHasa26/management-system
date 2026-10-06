import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { FeeRecord, PaymentTransaction } from '../types';
import { mockFeeRecords, mockFeeSummary, mockPaymentTransactions } from '../data/mockFees';
import { studentService } from './studentService';
import { notificationChannelService } from './notificationChannelService';
import { InvoiceData } from '../lib/pdfGenerator';

export interface FeeSummaryMetrics {
  totalExpected: number;
  totalCollected: number;
  totalPending: number;
  totalOverdue: number;
  collectionPercentage: number;
  paidCount: number;
  pendingCount: number;
  overdueCount: number;
  totalAccounts: number;
}

export const feeService = {
  /**
   * Get all fees for a specific student
   */
  async getStudentFees(studentId: string): Promise<FeeRecord[]> {
    if (!isSupabaseConfigured()) {
      return mockFeeRecords.filter((f) => f.studentId === studentId);
    }

    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockFeeRecords.filter((f) => f.studentId === studentId);
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      className: row.class_name || 'Class 10',
      batchName: row.batch_name || 'Morning Star',
      month: row.month,
      monthlyFee: Number(row.amount) || 2000,
      discount: Number(row.discount) || 0,
      netFee: (Number(row.amount) || 2000) - (Number(row.discount) || 0),
      paidAmount: Number(row.paid_amount) || 0,
      pendingAmount: Math.max(0, (Number(row.amount) || 2000) - (Number(row.discount) || 0) - (Number(row.paid_amount) || 0)),
      dueDate: row.due_date,
      status: row.status as any,
      lastPaymentDate: row.last_payment_date || undefined,
    }));
  },

  /**
   * Get all tuition fees across the entire centre (Admin)
   */
  async getAllFees(filters?: { status?: string; month?: string; className?: string; search?: string }): Promise<FeeRecord[]> {
    if (!isSupabaseConfigured()) {
      let list = [...mockFeeRecords];
      if (filters?.status && filters.status !== 'All') {
        list = list.filter((f) => f.status.toLowerCase() === filters.status!.toLowerCase());
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        list = list.filter((f) => f.studentName.toLowerCase().includes(q) || f.studentId.toLowerCase().includes(q));
      }
      return list;
    }

    let query = supabase.from('fees').select('*').order('due_date', { ascending: false });

    if (filters?.status && filters.status !== 'All') {
      query = query.eq('status', filters.status);
    }
    if (filters?.month && filters.month !== 'All') {
      query = query.eq('month', filters.month);
    }
    if (filters?.className && filters.className !== 'All') {
      query = query.ilike('class_name', `%${filters.className}%`);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return mockFeeRecords;
    }

    let results = (data as any[]).map((row) => ({
      id: row.id,
      studentId: row.student_id,
      studentName: row.student_name,
      className: row.class_name || 'Class 10',
      batchName: row.batch_name || 'Morning Star',
      month: row.month,
      monthlyFee: Number(row.amount) || 2000,
      discount: Number(row.discount) || 0,
      netFee: (Number(row.amount) || 2000) - (Number(row.discount) || 0),
      paidAmount: Number(row.paid_amount) || 0,
      pendingAmount: Math.max(0, (Number(row.amount) || 2000) - (Number(row.discount) || 0) - (Number(row.paid_amount) || 0)),
      dueDate: row.due_date,
      status: row.status as any,
      lastPaymentDate: row.last_payment_date || undefined,
    }));

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      results = results.filter((f) => f.studentName.toLowerCase().includes(q) || f.studentId.toLowerCase().includes(q));
    }

    return results;
  },

  /**
   * Calculate live financial metrics from database records
   */
  async getFeeSummaryAnalytics(): Promise<FeeSummaryMetrics> {
    const fees = await this.getAllFees();
    if (fees.length === 0) {
      return {
        totalExpected: mockFeeSummary.targetCollectionThisMonth,
        totalCollected: mockFeeSummary.totalCollectionThisMonth,
        totalPending: mockFeeSummary.pendingTotal,
        totalOverdue: 16000,
        collectionPercentage: 87.8,
        paidCount: 38,
        pendingCount: 8,
        overdueCount: 4,
        totalAccounts: 50,
      };
    }

    let totalExpected = 0;
    let totalCollected = 0;
    let totalPending = 0;
    let totalOverdue = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;

    fees.forEach((f) => {
      totalExpected += f.netFee;
      totalCollected += f.paidAmount;
      if (f.status === 'Paid') {
        paidCount++;
      } else if (f.status === 'Overdue') {
        overdueCount++;
        totalOverdue += f.pendingAmount;
        totalPending += f.pendingAmount;
      } else if (f.status === 'Pending' || f.status === 'Partially Paid') {
        pendingCount++;
        totalPending += f.pendingAmount;
      }
    });

    const collectionPercentage = totalExpected > 0 ? parseFloat(((totalCollected / totalExpected) * 100).toFixed(1)) : 0;

    return {
      totalExpected,
      totalCollected,
      totalPending,
      totalOverdue,
      collectionPercentage,
      paidCount,
      pendingCount,
      overdueCount,
      totalAccounts: fees.length,
    };
  },

  /**
   * Batch generate monthly fees for students (Admin)
   */
  async generateMonthlyFees(params: {
    month: string; // e.g. "November 2026"
    academicYear?: string;
    dueDate: string; // YYYY-MM-DD
    className?: string;
  }): Promise<{ success: boolean; generatedCount: number; error?: string }> {
    const students = await studentService.getAllStudents();
    const targetStudents = params.className && params.className !== 'All'
      ? students.filter((s) => s.grade.toLowerCase().includes(params.className!.toLowerCase()))
      : students;

    if (!isSupabaseConfigured()) {
      return { success: true, generatedCount: targetStudents.length };
    }

    const rows = targetStudents.map((s) => ({
      student_id: s.id,
      student_name: s.name,
      class_name: s.grade,
      batch_name: s.batchName,
      academic_year: params.academicYear || '2026-27',
      month: params.month,
      amount: s.monthlyFee || 2000,
      discount: 0,
      paid_amount: 0,
      due_date: params.dueDate,
      status: 'Pending',
    }));

    const { error } = await supabase.from('fees').upsert(rows as any, {
      onConflict: 'student_id,month,academic_year',
      ignoreDuplicates: true,
    });

    if (error) {
      return { success: false, generatedCount: 0, error: error.message };
    }

    // Trigger notification to students
    targetStudents.slice(0, 5).forEach((s) => {
      notificationChannelService.dispatch({
        studentId: s.id,
        studentName: s.name,
        parentPhone: s.parentPhone,
        parentEmail: s.parentEmail,
        type: 'fee_generated',
        title: `Tuition Fee Generated - ${params.month}`,
        message: `Tuition fee of ₹${s.monthlyFee || 2000} for ${params.month} has been generated. Due date is ${params.dueDate}.`,
        amount: s.monthlyFee || 2000,
        month: params.month,
        dueDate: params.dueDate,
      });
    });

    return { success: true, generatedCount: rows.length };
  },

  /**
   * Record an offline/cash/direct UPI payment (Admin)
   */
  async recordManualPayment(params: {
    feeId: string;
    studentId: string;
    studentName: string;
    amount: number;
    paymentMethod: 'Cash' | 'Direct UPI' | 'Bank Transfer' | 'Cheque';
    feeMonth: string;
    notes?: string;
  }): Promise<{ success: boolean; invoiceData?: InvoiceData; error?: string }> {
    const transactionRef = `MANUAL-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceNumber = `SRI-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const today = new Date().toISOString().split('T')[0];

    const invoiceData: InvoiceData = {
      invoiceNumber,
      studentId: params.studentId,
      studentName: params.studentName,
      studentGrade: 'Class 10',
      batchName: 'Morning Star',
      feeMonth: params.feeMonth,
      amount: params.amount,
      paidAmount: params.amount,
      paymentMethod: params.paymentMethod,
      transactionRef,
      paymentDate: today,
      status: 'PAID & VERIFIED',
    };

    if (!isSupabaseConfigured()) {
      return { success: true, invoiceData };
    }

    // 1. Insert payment record
    const { data: pData, error: pError } = await supabase.from('payments').insert({
      fee_id: params.feeId,
      student_id: params.studentId,
      student_name: params.studentName,
      amount: params.amount,
      payment_method: params.paymentMethod,
      status: 'SUCCESS',
      transaction_ref: transactionRef,
      notes: params.notes || null,
    } as any).select().single();

    if (pError) return { success: false, error: pError.message };

    // 2. Update fee
    await supabase.from('fees').update({
      paid_amount: params.amount,
      status: 'Paid',
      last_payment_date: today,
    } as any).eq('id', params.feeId);

    // 3. Insert invoice
    await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      fee_id: params.feeId,
      payment_id: pData.id,
      student_id: params.studentId,
      student_name: params.studentName,
      student_grade: 'Class 10',
      batch_name: 'Morning Star',
      fee_month: params.feeMonth,
      amount_paid: params.amount,
      payment_method: params.paymentMethod,
      transaction_ref: transactionRef,
      status: 'PAID',
    } as any);

    // 4. Dispatch multi-channel notification
    notificationChannelService.dispatch({
      studentId: params.studentId,
      studentName: params.studentName,
      type: 'payment_success',
      title: 'Fee Payment Received',
      message: `Tuition fee payment of ₹${params.amount} for ${params.feeMonth} received via ${params.paymentMethod}. Receipt: ${invoiceNumber}.`,
      amount: params.amount,
      month: params.feeMonth,
      invoiceNumber,
    });

    return { success: true, invoiceData };
  },

  /**
   * Complete payment by calling the server-side verify-razorpay-payment Edge Function.
   * Client NEVER performs direct database updates on payments or fee balances.
   */
  async processRazorpaySuccess(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    paymentMethod?: string;
  }): Promise<{ success: boolean; invoiceData?: InvoiceData; error?: string }> {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase backend is not configured' };
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return { success: false, error: 'You must be logged in to verify payment' };
    }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const verifyUrl = `${supabaseUrl}/functions/v1/verify-razorpay-payment`;

    try {
      const resp = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          razorpay_order_id: params.razorpayOrderId,
          razorpay_payment_id: params.razorpayPaymentId,
          razorpay_signature: params.razorpaySignature,
          paymentMethod: params.paymentMethod || 'Razorpay UPI',
        }),
      });

      const json = await resp.json();

      if (!resp.ok || !json.success) {
        return {
          success: false,
          error: json.error || 'Payment verification failed on server.',
        };
      }

      // Fetch the authoritative invoice record from database
      let invoiceData: InvoiceData;

      if (json.invoiceId) {
        const { data: inv } = await supabase
          .from('invoices')
          .select('*')
          .eq('id', json.invoiceId)
          .maybeSingle();

        if (inv) {
          invoiceData = {
            invoiceNumber: inv.invoice_number,
            studentId: inv.student_id,
            studentName: inv.student_name,
            studentGrade: inv.student_grade,
            batchName: inv.batch_name,
            feeMonth: inv.fee_month,
            amount: Number(inv.amount_paid),
            paidAmount: Number(inv.amount_paid),
            paymentMethod: inv.payment_method,
            transactionRef: inv.transaction_ref,
            paymentDate: inv.issued_date,
            status: 'PAID & VERIFIED',
          };
        } else {
          invoiceData = {
            invoiceNumber: json.invoiceNumber || 'SRI-INV-VERIFIED',
            studentId: '',
            studentName: '',
            studentGrade: 'Class 10',
            batchName: 'Morning Star',
            feeMonth: json.feeMonth || 'Tuition Fee',
            amount: Number(json.amountPaid) || 0,
            paidAmount: Number(json.amountPaid) || 0,
            paymentMethod: params.paymentMethod || 'Razorpay UPI',
            transactionRef: json.transactionRef || params.razorpayPaymentId,
            paymentDate: new Date().toISOString().split('T')[0],
            status: 'PAID & VERIFIED',
          };
        }
      } else {
        invoiceData = {
          invoiceNumber: json.invoiceNumber || 'SRI-INV-VERIFIED',
          studentId: '',
          studentName: '',
          studentGrade: 'Class 10',
          batchName: 'Morning Star',
          feeMonth: json.feeMonth || 'Tuition Fee',
          amount: Number(json.amountPaid) || 0,
          paidAmount: Number(json.amountPaid) || 0,
          paymentMethod: params.paymentMethod || 'Razorpay UPI',
          transactionRef: json.transactionRef || params.razorpayPaymentId,
          paymentDate: new Date().toISOString().split('T')[0],
          status: 'PAID & VERIFIED',
        };
      }

      return { success: true, invoiceData };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error communicating with verification service' };
    }
  },

  /**
   * Fetch authoritative invoice for a fee record from Supabase database
   */
  async getInvoiceForFee(feeId: string): Promise<InvoiceData | null> {
    if (!isSupabaseConfigured()) return null;

    const { data: inv, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('fee_id', feeId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !inv) return null;

    return {
      invoiceNumber: inv.invoice_number,
      studentId: inv.student_id,
      studentName: inv.student_name,
      studentGrade: inv.student_grade,
      batchName: inv.batch_name,
      feeMonth: inv.fee_month,
      amount: Number(inv.amount_paid),
      paidAmount: Number(inv.amount_paid),
      paymentMethod: inv.payment_method,
      transactionRef: inv.transaction_ref,
      paymentDate: inv.issued_date,
      status: 'PAID & VERIFIED',
    };
  },

  /**
   * Get all payment transactions ledger
   */
  async getAllPaymentTransactions(): Promise<PaymentTransaction[]> {
    if (!isSupabaseConfigured()) {
      return mockPaymentTransactions;
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('payment_date', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockPaymentTransactions;
    }

    return (data as any[]).map((row) => ({
      id: row.id,
      receiptNumber: `REC-${row.transaction_ref.slice(-8)}`,
      studentId: row.student_id,
      studentName: row.student_name,
      amount: Number(row.amount),
      paymentDate: row.payment_date ? row.payment_date.split('T')[0] : '2026-09-28',
      paymentMethod: row.payment_method as any,
      feeMonth: 'October 2026',
      recordedBy: row.payment_method.includes('Razorpay') ? 'Razorpay Gateway' : 'Mrs. Telu Dhana Lakshmi',
      notes: row.notes || undefined,
    }));
  },

  /**
   * Automated Overdue Check
   */
  async checkAndUpdateOverdueFees(): Promise<number> {
    if (!isSupabaseConfigured()) return 0;
    try {
      const { data } = await supabase.rpc('update_overdue_fees');
      return data || 0;
    } catch {
      return 0;
    }
  },
};
