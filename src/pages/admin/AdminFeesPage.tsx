import React, { useState, useEffect } from 'react';
import { feeService, FeeSummaryMetrics } from '../../services/feeService';
import { FeeRecord } from '../../types';
import { mockFeeRecords, mockFeeSummary } from '../../data/mockFees';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { FeeCollectionChart } from '../../components/charts/AttendanceChart';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import { InvoiceData } from '../../lib/pdfGenerator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { CreditCard, Receipt, Plus, Calendar, Search, Filter, BellRing, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminFeesPage: React.FC = () => {
  const { success, error } = useToast();
  const [fees, setFees] = useState<FeeRecord[]>(mockFeeRecords);
  const [metrics, setMetrics] = useState<FeeSummaryMetrics>({
    totalExpected: mockFeeSummary.targetCollectionThisMonth,
    totalCollected: mockFeeSummary.totalCollectionThisMonth,
    totalPending: mockFeeSummary.pendingTotal,
    totalOverdue: 16000,
    collectionPercentage: 87.8,
    paidCount: 38,
    pendingCount: 8,
    overdueCount: 4,
    totalAccounts: 50,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeRecord | null>(null);
  const [generatedInvoice, setGeneratedInvoice] = useState<InvoiceData | null>(null);

  // Form states
  const [genMonth, setGenMonth] = useState('November 2026');
  const [genDueDate, setGenDueDate] = useState('2026-11-10');
  const [genClass, setGenClass] = useState('All');

  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'Cash' | 'Direct UPI' | 'Bank Transfer' | 'Cheque'>('Direct UPI');
  const [payNotes, setPayNotes] = useState('');

  const loadData = async () => {
    try {
      const [feesData, metricsData] = await Promise.all([
        feeService.getAllFees(),
        feeService.getFeeSummaryAnalytics(),
      ]);
      if (feesData && feesData.length > 0) setFees(feesData);
      if (metricsData) setMetrics(metricsData);
    } catch (err) {
      console.error('Error loading fees:', err);
    }
  };

  useEffect(() => {
    loadData();
    feeService.checkAndUpdateOverdueFees();
  }, []);

  const filteredFees = fees.filter((fee) => {
    const matchesStatus = statusFilter === 'All' || fee.status === statusFilter;
    const matchesSearch =
      fee.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fee.className.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleGenerateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await feeService.generateMonthlyFees({
      month: genMonth,
      dueDate: genDueDate,
      className: genClass,
    });

    if (res.success) {
      success('Monthly Fees Generated', `Generated ${res.generatedCount} billing entries for ${genMonth}.`);
      setIsGenerateModalOpen(false);
      loadData();
    } else {
      error('Generation Failed', res.error || 'Failed to generate fees');
    }
  };

  const handleOpenRecordPayment = (fee: FeeRecord) => {
    setSelectedFeeForPayment(fee);
    setPayAmount(String(fee.pendingAmount || fee.netFee));
    setIsRecordModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFeeForPayment) return;

    const res = await feeService.recordManualPayment({
      feeId: selectedFeeForPayment.id,
      studentId: selectedFeeForPayment.studentId,
      studentName: selectedFeeForPayment.studentName,
      amount: Number(payAmount),
      paymentMethod: payMethod,
      feeMonth: selectedFeeForPayment.month,
      notes: payNotes,
    });

    if (res.success && res.invoiceData) {
      success('Payment Recorded', `Receipt generated for ${selectedFeeForPayment.studentName}.`);
      setIsRecordModalOpen(false);
      setGeneratedInvoice(res.invoiceData);
      loadData();
    } else {
      error('Payment Failed', res.error || 'Failed to record payment');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Tuition Fee Management Desk</h2>
          <p className="text-xs text-stone-500">
            Monthly fee structures, collection targets, overdue reminders, and receipts.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            icon={<Calendar className="w-4 h-4" />}
            onClick={() => setIsGenerateModalOpen(true)}
          >
            Generate Monthly Fees
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => {
              if (fees.length > 0) handleOpenRecordPayment(fees[0]);
            }}
          >
            Record Payment
          </Button>
        </div>
      </div>

      {/* 4 Financial Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Collected"
          value={formatCurrency(metrics.totalCollected)}
          change={`${metrics.collectionPercentage}% Met`}
          changeType="positive"
          icon={CreditCard}
        />
        <StatCard
          title="Target Expected"
          value={formatCurrency(metrics.totalExpected)}
          subtext={`${metrics.totalAccounts} Student Accounts`}
        />
        <StatCard
          title="Pending Collection"
          value={formatCurrency(metrics.totalPending)}
          changeType="neutral"
          subtext={`${metrics.pendingCount} Pending Accounts`}
        />
        <StatCard
          title="Overdue Accounts"
          value={metrics.overdueCount}
          change={formatCurrency(metrics.totalOverdue)}
          changeType="negative"
          subtext="Reminders triggered"
        />
      </div>

      {/* Collection Chart Card */}
      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8]">
        <h4 className="text-base font-serif font-bold text-[#173F35] mb-4">Collection Trend & Projections</h4>
        <FeeCollectionChart />
      </Card>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by student ID, name, class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F7F3EA] border border-[#E6DDCF] focus:outline-none focus:border-[#173F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-stone-500">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Waived">Waived</option>
          </select>
        </div>
      </div>

      {/* Fee Table */}
      <Card variant="paper" className="p-0 border-[#EDE6D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F3EA] border-b border-[#EDE6D8] text-stone-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Class Batch</th>
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4">Monthly Fee</th>
                <th className="py-3.5 px-4">Paid</th>
                <th className="py-3.5 px-4">Pending</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-[#F7F3EA]/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#173F35]">{fee.studentId}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-800">{fee.studentName}</td>
                  <td className="py-3.5 px-4">{fee.className}</td>
                  <td className="py-3.5 px-4 font-medium">{fee.month}</td>
                  <td className="py-3.5 px-4 font-medium">{formatCurrency(fee.netFee)}</td>
                  <td className="py-3.5 px-4 font-bold text-[#2E6B57]">{formatCurrency(fee.paidAmount)}</td>
                  <td className="py-3.5 px-4 font-bold text-[#B85C45]">{formatCurrency(fee.pendingAmount)}</td>
                  <td className="py-3.5 px-4 text-stone-500">{formatDate(fee.dueDate)}</td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        fee.status === 'Paid'
                          ? 'forest'
                          : fee.status === 'Overdue'
                          ? 'terracotta'
                          : 'gold'
                      }
                      size="sm"
                    >
                      {fee.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {fee.status !== 'Paid' ? (
                        <Button
                          size="sm"
                          variant="primary"
                          className="text-[11px] py-1 px-2.5"
                          onClick={() => handleOpenRecordPayment(fee)}
                        >
                          Collect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[11px] py-1 px-2.5"
                          onClick={() => {
                            setGeneratedInvoice({
                              invoiceNumber: `SRI-INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                              studentId: fee.studentId,
                              studentName: fee.studentName,
                              studentGrade: fee.className,
                              batchName: fee.batchName,
                              feeMonth: fee.month,
                              amount: fee.netFee,
                              paidAmount: fee.paidAmount,
                              paymentMethod: 'Direct Payment',
                              transactionRef: `REC-${fee.id.slice(-6)}`,
                              paymentDate: fee.lastPaymentDate || '2026-09-28',
                              status: 'PAID & VERIFIED',
                            });
                          }}
                        >
                          Receipt
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[11px] p-1.5 text-stone-500 hover:text-[#B85C45]"
                        title="Send SMS/WhatsApp Due Reminder"
                        onClick={() => success('Fee Reminder Sent', `Reminder alert sent to parent of ${fee.studentName}`)}
                      >
                        <BellRing className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Generate Monthly Fees Modal */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Batch Generate Monthly Fees"
        subtitle="Creates fee ledger records for enrolled students without duplicates"
      >
        <form onSubmit={handleGenerateBatch} className="space-y-4 text-left">
          <Input
            label="Billing Month"
            value={genMonth}
            onChange={(e) => setGenMonth(e.target.value)}
            placeholder="e.g. November 2026"
            required
          />

          <Input
            label="Payment Due Date"
            type="date"
            value={genDueDate}
            onChange={(e) => setGenDueDate(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Target Class</label>
            <select
              value={genClass}
              onChange={(e) => setGenClass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#E6DDCF] bg-[#FFFDF8] text-xs text-[#202522] focus:outline-none focus:border-[#173F35]"
            >
              <option value="All">All Active Classes (Centre-wide)</option>
              <option value="Class 10">Class 10 Only</option>
              <option value="Intermediate">Intermediate 1st & 2nd Year</option>
              <option value="Class 9">Class 9 Only</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button type="button" variant="outline" onClick={() => setIsGenerateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Generate Fees
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Manual Payment Modal */}
      <Modal
        isOpen={isRecordModalOpen}
        onClose={() => setIsRecordModalOpen(false)}
        title="Record Fee Payment"
        subtitle={selectedFeeForPayment ? `Student: ${selectedFeeForPayment.studentName} (${selectedFeeForPayment.studentId})` : ''}
      >
        <form onSubmit={handleRecordPaymentSubmit} className="space-y-4 text-left">
          <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] text-xs space-y-1">
            <p className="text-stone-600">Month: <strong>{selectedFeeForPayment?.month}</strong></p>
            <p className="text-stone-600">Pending Balance: <strong>{formatCurrency(selectedFeeForPayment?.pendingAmount || 0)}</strong></p>
          </div>

          <Input
            label="Amount Paid (INR)"
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Payment Method</label>
            <select
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-[#E6DDCF] bg-[#FFFDF8] text-xs text-[#202522] focus:outline-none focus:border-[#173F35]"
            >
              <option value="Direct UPI">Direct UPI (PhonePe / GPay / Paytm)</option>
              <option value="Cash">Cash at Desk</option>
              <option value="Bank Transfer">NEFT / RTGS / IMPS</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <Input
            label="Cashier / Ledger Notes (Optional)"
            value={payNotes}
            onChange={(e) => setPayNotes(e.target.value)}
            placeholder="e.g. Received at centre by Mrs. Telu Dhana Lakshmi"
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
            <Button type="button" variant="outline" onClick={() => setIsRecordModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm & Generate Receipt
            </Button>
          </div>
        </form>
      </Modal>

      {/* Invoice Modal for Viewing and Downloading PDF */}
      <InvoiceModal
        isOpen={!!generatedInvoice}
        onClose={() => setGeneratedInvoice(null)}
        invoiceData={generatedInvoice}
      />
    </div>
  );
};
