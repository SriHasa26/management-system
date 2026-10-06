import React, { useState, useEffect } from 'react';
import { feeService } from '../../services/feeService';
import { PaymentTransaction } from '../../types';
import { mockPaymentTransactions } from '../../data/mockFees';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { InvoiceData } from '../../lib/pdfGenerator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Receipt, Search, Filter, Download, Eye, ShieldCheck } from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentTransaction[]>(mockPaymentTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);

  useEffect(() => {
    async function loadPayments() {
      try {
        const data = await feeService.getAllPaymentTransactions();
        if (data && data.length > 0) setPayments(data);
      } catch (err) {
        console.error('Error loading payments:', err);
      }
    }
    loadPayments();
  }, []);

  const filtered = payments.filter((tx) => {
    const matchesMethod = methodFilter === 'All' || tx.paymentMethod.toLowerCase().includes(methodFilter.toLowerCase());
    const matchesSearch =
      tx.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const handleOpenReceipt = (tx: PaymentTransaction) => {
    setActiveInvoice({
      invoiceNumber: `SRI-INV-2026-${tx.receiptNumber.slice(-4)}`,
      studentId: tx.studentId,
      studentName: tx.studentName,
      studentGrade: 'Class 10',
      batchName: 'Morning Star',
      feeMonth: tx.feeMonth,
      amount: tx.amount,
      paidAmount: tx.amount,
      paymentMethod: tx.paymentMethod,
      transactionRef: tx.receiptNumber,
      paymentDate: tx.paymentDate,
      status: 'PAID & VERIFIED',
    });
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Payment Transactions & Receipts Audit</h2>
          <p className="text-xs text-stone-500">
            Complete ledger of all collected fees, payment modes, and cashier audit logs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student, receipt, transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F7F3EA] border border-[#E6DDCF] focus:outline-none focus:border-[#173F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500">Mode:</span>
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            <option value="All">All Modes</option>
            <option value="UPI">UPI / Razorpay</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cheque">Cheque</option>
          </select>
        </div>
      </div>

      {/* Payment Ledger Table */}
      <Card variant="paper" className="p-0 border-[#EDE6D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F3EA] border-b border-[#EDE6D8] text-stone-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Receipt Number</th>
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Fee Month</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Recorded By</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F7F3EA]/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#173F35]">{tx.receiptNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">{tx.studentName} ({tx.studentId})</td>
                  <td className="py-3.5 px-4">{tx.feeMonth}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2E6B57]">{formatCurrency(tx.amount)}</td>
                  <td className="py-3.5 px-4 text-stone-500">{formatDate(tx.paymentDate)}</td>
                  <td className="py-3.5 px-4">
                    <span className="bg-stone-100 px-2 py-0.5 rounded font-mono text-[11px] text-stone-700">
                      {tx.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-500">{tx.recordedBy}</td>
                  <td className="py-3.5 px-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[11px] py-1 px-2.5"
                      icon={<Receipt className="w-3.5 h-3.5" />}
                      onClick={() => handleOpenReceipt(tx)}
                    >
                      View Receipt
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
