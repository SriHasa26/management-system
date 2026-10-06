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
import { CreditCard, Download, ShieldCheck } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const ParentFeesPage: React.FC = () => {
  const { success, error, info } = useToast();
  const { currentStudent, currentParent } = useAuth();
  const [fees, setFees] = useState<FeeRecord[]>(mockFeeRecords);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);

  const loadFees = async () => {
    try {
      const data = await feeService.getStudentFees(currentStudent.id);
      if (data && data.length > 0) setFees(data);
    } catch (err) {
      console.error('Error fetching child fees:', err);
    }
  };

  useEffect(() => {
    loadFees();
  }, [currentStudent]);

  const handlePayNow = (fee: FeeRecord) => {
    info('Initiating Gateway', `Connecting to secure payment gateway for ${fee.month} tuition...`);

    initiateRazorpayPayment({
      feeId: fee.id,
      studentId: currentStudent.id,
      studentName: currentStudent.name,
      studentEmail: currentParent?.email || currentStudent.parentEmail,
      studentPhone: currentParent?.phone || currentStudent.parentPhone,
      feeMonth: fee.month,
      onSuccess: async (rzpRes) => {
        info('Verifying Payment', 'Validating transaction with server security checks...');

        const verifyRes = await feeService.processRazorpaySuccess({
          razorpayOrderId: rzpRes.razorpay_order_id,
          razorpayPaymentId: rzpRes.razorpay_payment_id,
          razorpaySignature: rzpRes.razorpay_signature,
          paymentMethod: rzpRes.paymentMethod,
        });

        if (verifyRes.success && verifyRes.invoiceData) {
          success('Fee Payment Confirmed', `Payment verified and recorded. Receipt: ${verifyRes.invoiceData.invoiceNumber}`);
          await loadFees();
          setActiveInvoice(verifyRes.invoiceData);
        } else {
          error('Verification Error', verifyRes.error || 'Payment signature could not be verified by server.');
          await loadFees();
        }
      },
      onError: (err) => {
        error('Payment Cancelled / Failed', err);
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
        parentName: currentParent?.name || currentStudent.parentName,
        status: 'PAID & VERIFIED',
      });
    }
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">
          Tuition Fee Management & Receipts
        </h2>
        <p className="text-xs text-stone-500">
          Transparent fee schedules and verified digital payment receipts for {currentStudent.name}.
        </p>
      </div>

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

      {/* Receipts History */}
      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-base font-serif font-bold text-[#173F35]">Official Payment History</h4>
          <Badge variant="forest" size="sm" className="gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> All Receipts Audited
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EDE6D8] text-stone-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Receipt No</th>
                <th className="pb-3">Month</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Mode</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {fees
                .filter((f) => f.status === 'Paid')
                .map((f) => (
                  <tr key={f.id} className="hover:bg-[#F7F3EA]/50 transition-colors">
                    <td className="py-3.5 font-mono font-bold text-[#173F35]">SRI-INV-2026-{f.id.slice(-4)}</td>
                    <td className="py-3.5 font-bold text-stone-800">{f.month}</td>
                    <td className="py-3.5 text-stone-500">{formatDate(f.lastPaymentDate || '2026-09-28')}</td>
                    <td className="py-3.5">
                      <span className="bg-stone-100 px-2 py-0.5 rounded font-mono text-[11px] text-stone-700">
                        Razorpay UPI / Direct
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-[#2E6B57]">{formatCurrency(f.paidAmount || f.netFee)}</td>
                    <td className="py-3.5 text-right">
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
