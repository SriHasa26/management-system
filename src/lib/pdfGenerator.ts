import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from './utils';

export interface InvoiceData {
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  studentGrade: string;
  batchName: string;
  feeMonth: string;
  amount: number;
  paidAmount: number;
  paymentMethod: string;
  transactionRef: string;
  paymentDate: string;
  parentName?: string;
  status?: string;
}

export const generateReceiptPDF = (data: InvoiceData, shouldPrint = false) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner & Branding
  doc.setFillColor(23, 63, 53); // #173F35 Forest Green
  doc.rect(0, 0, pageWidth, 42, 'F');

  doc.setFillColor(201, 154, 61); // #C99A3D Gold accent bar
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Title
  doc.setTextColor(255, 253, 248);
  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.text('SRI SAI TUITION & LEARNING CENTRE', pageWidth / 2, 16, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(230, 220, 207);
  doc.text('Premier Mathematics & Sciences Coaching Centre • Class 1 to 10 & Intermediate (MPC / BiPC)', pageWidth / 2, 23, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setTextColor(201, 154, 61);
  doc.text('Patamata, Vijayawada, Andhra Pradesh - 520007 • Tel: +91 63012 93925', pageWidth / 2, 30, { align: 'center' });
  doc.text('Founder & Head Faculty: Mrs. Telu Dhana Lakshmi (M.Sc, B.Ed)', pageWidth / 2, 36, { align: 'center' });

  // 2. Receipt Badge & Invoice Metadata Box
  doc.setTextColor(23, 63, 53);
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.text('OFFICIAL TUITION FEE RECEIPT', 14, 58);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(184, 92, 69); // Terracotta status badge
  doc.text(`STATUS: ${data.status || 'PAID & VERIFIED'}`, pageWidth - 14, 58, { align: 'right' });

  // Metadata Card
  doc.setFillColor(250, 246, 238); // #FAF6EE Soft Cream
  doc.roundedRect(14, 63, pageWidth - 28, 30, 3, 3, 'F');
  doc.setDrawColor(230, 221, 207);
  doc.roundedRect(14, 63, pageWidth - 28, 30, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Receipt Number:', 20, 72);
  doc.text('Issue Date:', 20, 80);
  doc.text('Transaction Ref:', 20, 88);

  doc.setTextColor(23, 63, 53);
  doc.setFont('courier', 'bold');
  doc.text(data.invoiceNumber, 55, 72);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(data.paymentDate), 55, 80);
  doc.setFont('courier', 'bold');
  doc.text(data.transactionRef, 55, 88);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 100, 100);
  doc.text('Payment Mode:', pageWidth / 2 + 10, 72);
  doc.text('Billing Month:', pageWidth / 2 + 10, 80);
  doc.text('Academic Term:', pageWidth / 2 + 10, 88);

  doc.setTextColor(23, 63, 53);
  doc.text(data.paymentMethod, pageWidth / 2 + 45, 72);
  doc.text(data.feeMonth, pageWidth / 2 + 45, 80);
  doc.text('Academic Year 2026-27', pageWidth / 2 + 45, 88);

  // 3. Student Details Card
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 63, 53);
  doc.text('Student Identification & Batch Details', 14, 103);

  doc.setFillColor(255, 253, 248);
  doc.roundedRect(14, 106, pageWidth - 28, 26, 3, 3, 'F');
  doc.roundedRect(14, 106, pageWidth - 28, 26, 3, 3, 'D');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Student Name:', 20, 114);
  doc.text('Student ID:', 20, 122);
  doc.text('Enrolled Class:', 20, 128);

  doc.setTextColor(23, 63, 53);
  doc.setFontSize(9.5);
  doc.text(data.studentName, 50, 114);
  doc.setFont('courier', 'bold');
  doc.text(data.studentId, 50, 122);
  doc.setFont('helvetica', 'bold');
  doc.text(data.studentGrade, 50, 128);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('Batch / Timing:', pageWidth / 2 + 10, 114);
  doc.text('Guardian Name:', pageWidth / 2 + 10, 122);
  doc.text('Centre Branch:', pageWidth / 2 + 10, 128);

  doc.setTextColor(23, 63, 53);
  doc.setFontSize(9);
  doc.text(data.batchName, pageWidth / 2 + 45, 114);
  doc.text(data.parentName || 'Parent / Guardian', pageWidth / 2 + 45, 122);
  doc.text('Patamata Main Campus', pageWidth / 2 + 45, 128);

  // 4. Financial Table
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(23, 63, 53);
  doc.text('Fee Breakdown', 14, 142);

  // Table Header
  doc.setFillColor(23, 63, 53);
  doc.rect(14, 146, pageWidth - 28, 8, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('Description', 18, 151.5);
  doc.text('Period / Month', 105, 151.5);
  doc.text('Amount (INR)', pageWidth - 18, 151.5, { align: 'right' });

  // Table Row
  doc.setFillColor(250, 246, 238);
  doc.rect(14, 154, pageWidth - 28, 12, 'F');
  doc.setDrawColor(230, 221, 207);
  doc.rect(14, 154, pageWidth - 28, 12, 'D');

  doc.setTextColor(23, 63, 53);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('Monthly Tuition & Academic Assessment Fee', 18, 161.5);
  doc.setFont('helvetica', 'normal');
  doc.text(data.feeMonth, 105, 161.5);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(data.amount), pageWidth - 18, 161.5, { align: 'right' });

  // Summary Box
  const summaryY = 172;
  doc.setFillColor(247, 243, 234);
  doc.roundedRect(pageWidth - 90, summaryY, 76, 26, 2, 2, 'F');
  doc.setDrawColor(201, 154, 61);
  doc.roundedRect(pageWidth - 90, summaryY, 76, 26, 2, 2, 'D');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text('Total Amount Due:', pageWidth - 84, summaryY + 7);
  doc.text('Discount / Concession:', pageWidth - 84, summaryY + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(23, 63, 53);
  doc.text('Net Amount Paid:', pageWidth - 84, summaryY + 20);

  doc.text(formatCurrency(data.amount), pageWidth - 18, summaryY + 7, { align: 'right' });
  doc.text('₹0.00', pageWidth - 18, summaryY + 13, { align: 'right' });
  doc.setFontSize(10.5);
  doc.setTextColor(46, 107, 87);
  doc.text(formatCurrency(data.paidAmount), pageWidth - 18, summaryY + 20, { align: 'right' });

  // 5. Terms, QR placeholder, and Seal Area
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('Terms & Notice:', 14, 215);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.text('• This is a computer-generated official receipt verified by SRI SAI Tuition & Learning Centre.', 14, 220);
  doc.text('• Fees once paid are non-refundable and non-transferable under centre guidelines.', 14, 225);
  doc.text('• For payment queries, please reach out to admin desk at +91 63012 93925.', 14, 230);

  // Authorized Signature Box
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth - 75, 245, pageWidth - 15, 245);

  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(23, 63, 53);
  doc.text('Mrs. Telu Dhana Lakshmi', pageWidth - 45, 250, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text('M.Sc, B.Ed • Head Faculty & Administrator', pageWidth - 45, 254, { align: 'center' });

  // Stamp circle
  doc.setDrawColor(201, 154, 61);
  doc.circle(pageWidth - 45, 235, 9, 'S');
  doc.setFontSize(6.5);
  doc.setTextColor(201, 154, 61);
  doc.text('SRI SAI', pageWidth - 45, 234, { align: 'center' });
  doc.text('VERIFIED', pageWidth - 45, 237, { align: 'center' });

  // 6. Bottom footer line
  doc.setFillColor(23, 63, 53);
  doc.rect(0, 285, pageWidth, 12, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.text('Thank you for choosing SRI SAI Tuition & Learning Centre — Dedicated to Academic Excellence', pageWidth / 2, 292, { align: 'center' });

  if (shouldPrint) {
    doc.autoPrint();
    window.open(doc.output('bloburl'), '_blank');
  } else {
    doc.save(`${data.invoiceNumber}_${data.studentName.replace(/\s+/g, '_')}.pdf`);
  }
};
