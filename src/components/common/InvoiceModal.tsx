import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Badge } from './Badge';
import { InvoiceData, generateReceiptPDF } from '../../lib/pdfGenerator';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Download, Printer, CheckCircle2, ShieldCheck, Building, GraduationCap } from 'lucide-react';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: InvoiceData | null;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ isOpen, onClose, invoiceData }) => {
  if (!invoiceData) return null;

  const handleDownload = () => {
    generateReceiptPDF(invoiceData, false);
  };

  const handlePrint = () => {
    generateReceiptPDF(invoiceData, true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Official Tuition Fee Receipt"
      subtitle={`Receipt No: ${invoiceData.invoiceNumber}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-left">
        {/* Receipt Header Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#173F35] to-[#2E6B57] text-[#FFFDF8] border border-[#C99A3D]/40 shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-serif font-black tracking-wider text-[#C99A3D]">
              SRI SAI TUITION & LEARNING CENTRE
            </span>
            <Badge variant="gold" size="sm" className="font-bold">
              {invoiceData.status || 'PAID & VERIFIED'}
            </Badge>
          </div>

          <div>
            <h3 className="text-xl font-serif font-bold text-white">
              Tuition Fee Receipt
            </h3>
            <p className="text-xs text-stone-200">
              Patamata, Vijayawada, Andhra Pradesh • Tel: +91 63012 93925
            </p>
          </div>
        </div>

        {/* Student and Payment Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F3EA] border border-[#E6DDCF] text-xs">
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Student Details
            </span>
            <p className="font-bold text-[#173F35] text-sm">{invoiceData.studentName}</p>
            <p className="text-stone-600 font-mono">ID: {invoiceData.studentId}</p>
            <p className="text-stone-600">{invoiceData.studentGrade} • {invoiceData.batchName}</p>
          </div>

          <div className="space-y-1.5 sm:border-l sm:border-[#E6DDCF] sm:pl-4">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Payment Record
            </span>
            <p className="font-bold text-[#173F35] font-mono">{invoiceData.invoiceNumber}</p>
            <p className="text-stone-600">Month: <strong>{invoiceData.feeMonth}</strong></p>
            <p className="text-stone-600">Mode: {invoiceData.paymentMethod}</p>
            <p className="text-stone-500 text-[11px]">Txn Ref: {invoiceData.transactionRef}</p>
          </div>
        </div>

        {/* Amount Table */}
        <div className="border border-[#EDE6D8] rounded-2xl overflow-hidden text-xs">
          <div className="bg-[#FAF6EE] px-4 py-2.5 font-bold text-[#173F35] flex justify-between border-b border-[#EDE6D8]">
            <span>Fee Item</span>
            <span>Amount</span>
          </div>
          <div className="p-4 space-y-2">
            <div className="flex justify-between text-stone-700">
              <span>Monthly Academic Coaching & Assessment</span>
              <span className="font-bold">{formatCurrency(invoiceData.amount)}</span>
            </div>
            <div className="flex justify-between text-stone-500 text-[11px]">
              <span>Discount / Scholarship</span>
              <span>₹0.00</span>
            </div>
            <div className="pt-2 border-t border-[#EDE6D8] flex justify-between text-sm font-bold text-[#2E6B57]">
              <span>Total Amount Paid</span>
              <span>{formatCurrency(invoiceData.paidAmount)}</span>
            </div>
          </div>
        </div>

        {/* Signatory & Security Seal */}
        <div className="p-3 rounded-xl bg-[#FFFDF8] border border-[#EDE6D8] flex items-center justify-between text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#2E6B57]" />
            <div>
              <p className="font-bold text-[#173F35]">Mrs. Telu Dhana Lakshmi (M.Sc, B.Ed)</p>
              <p className="text-[10px] text-stone-500">Authorized Signatory • Head Faculty</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#C99A3D] font-bold">DIGITALLY VERIFIED</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
          <Button variant="outline" icon={<Printer className="w-4 h-4" />} onClick={handlePrint}>
            Print Receipt
          </Button>
          <Button variant="primary" icon={<Download className="w-4 h-4" />} onClick={handleDownload}>
            Download PDF
          </Button>
        </div>
      </div>
    </Modal>
  );
};
