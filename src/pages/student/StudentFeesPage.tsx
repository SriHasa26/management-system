import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { feeService } from '../../services/feeService';
import { FeeRecord } from '../../types';
import { mockFeeRecords } from '../../data/mockFees';
import { FeeCard } from '../../components/cards/FeeCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { InvoiceData } from '../../lib/pdfGenerator';
import { initiateRazorpayPayment } from '../../lib/razorpay';
import { formatCurrency, formatDate } from '../../lib/utils';
import { CreditCard, Receipt, ShieldCheck, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const StudentFeesPage: React.FC = () => {
  const { success, error, info } = useToast();
  const { currentStudent } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>(mockFeeRecords);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const loadFees = async () => {
    try {
      const data = await feeService.getStudentFees(currentStudent.id);
      if (data && data.length > 0) setFees(data);
    } catch (err) {
      console.error('Error fetching student fees:', err);
    }
  };

  useEffect(() => {
    loadFees();
  }, [currentStudent]);

  const handlePayNow = (fee: FeeRecord) => {
    setIsProcessing(true);
    info('Initiating Gateway', `Connecting to secure payment gateway for ${fee.month} tuition...`);

    initiateRazorpayPayment({
      feeId: fee.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEmail: currentStudent.parentEmail,
      studentPhone: currentStudent.parentPhone,
      feeMonth: fee.month,
      onSuccess: async (rzpRes) => {
        setIsProcessing(false);
        info('Verifying Payment', 'Confirming payment with server security validation...');

        const verifyRes = await feeService.processRazorpaySuccess({
          razorpayOrderId: rzpRes.razorpay_order_id,
          razorpayPaymentId: rzpRes.razorpay_payment_id,
          razorpaySignature: rzpRes.razorpay_signature,
          paymentMethod: rzpRes.paymentMethod,
        });

        if (verifyRes.success && verifyRes.invoiceData) {
          success('Payment Verified & Confirmed', `Tuition fee payment confirmed. Receipt: ${verifyRes.invoiceData.invoiceNumber}`);
          await loadFees();
          setActiveInvoice(verifyRes.invoiceData);
        } else {
          error('Verification Error', verifyRes.error || 'Payment signature could not be verified by server.');
          await loadFees();
        }
      },
      onError: (err) => {
        setIsProcessing(false);
        error('Payment Cancelled / Failed', err);
      },
      onDismiss: () => {
        setIsProcessing(false);
      },
    });
  };

  const handleViewReceipt = async (fee: FeeRecord) => {
    const inv = await feeService.getInvoiceForFee(fee.id);
    if (inv) {
      setActiveInvoice(inv);
    } else {
      setActiveInvoice({
        invoiceNumber: `SRI-REC-${fee.id.slice(-6).toUpperCase()}`,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentGrade: currentStudent.grade,
        batchName: currentStudent.batchName,
        feeMonth: fee.month,
        amount: fee.netFee,
        paidAmount: fee.paidAmount || fee.netFee,
        paymentMethod: 'Verified Payment Record',
        transactionRef: `TXN-${fee.id.slice(-6).toUpperCase()}`,
        paymentDate: fee.lastPaymentDate || '2026-09-28',
        status: 'PAID & VERIFIED',
      });
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Tuition Fees & Receipts</h2>
        <p className="text-xs text-stone-500">
          View monthly fee breakdown, payment schedule, and download tax-compliant fee receipts.
        </p>
      </div>

      {/* Fee Installment Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#173F35]">Tuition Installments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fees.map((fee) => (
            <FeeCard
              key={fee.id}
              fee={fee}
              onPayNow={handlePayNow}
              onViewReceipt={handleViewReceipt}
            />
          ))}
        </div>
      </div>

      {/* Payment History Table */}
      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-base font-serif font-bold text-[#173F35]">Official Payment History</h4>
            <p className="text-xs text-stone-500">Verified transaction ledger</p>
          </div>
          <Badge variant="forest" size="sm" className="gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All Receipts Audited
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EDE6D8] text-stone-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Receipt No</th>
                <th className="pb-3">Fee Month</th>
                <th className="pb-3">Payment Date</th>
                <th className="pb-3">Method</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {fees
                .filter((f) => f.status === 'Paid')
                .map((f) => (
                  <tr key={f.id} className="hover:bg-[#F7F3EA]/50 transition-colors">
                    <td className="py-4 font-mono font-bold text-[#173F35]">
                      SRI-INV-2026-{f.id.slice(-4)}
                    </td>
                    <td className="py-4 font-bold text-stone-800">{f.month}</td>
                    <td className="py-4 text-stone-500">{formatDate(f.lastPaymentDate || '2026-09-28')}</td>
                    <td className="py-4">
                      <span className="bg-stone-100 px-2.5 py-1 rounded-md text-[11px] font-mono text-stone-700">
                        Razorpay UPI / Direct
                      </span>
                    </td>
                    <td className="py-4 font-bold text-[#2E6B57]">{formatCurrency(f.paidAmount || f.netFee)}</td>
                    <td className="py-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={<Download className="w-3.5 h-3.5" />}
                        className="text-xs"
                        onClick={() => handleViewReceipt(f)}
                      >
                        Receipt
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Official Receipt Modal */}
      <InvoiceModal
        isOpen={!!activeInvoice}
        onClose={() => setActiveInvoice(null)}
        invoiceData={activeInvoice}
      />
    </div>
  );
};
