import React from 'react';
import { FeeRecord } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { formatCurrency, formatDate } from '../../lib/utils';
import { CreditCard, Receipt, AlertCircle, CheckCircle2 } from 'lucide-react';

interface FeeCardProps {
  fee: FeeRecord;
  onPayNow?: (fee: FeeRecord) => void;
  onViewReceipt?: (fee: FeeRecord) => void;
}

export const FeeCard: React.FC<FeeCardProps> = ({ fee, onPayNow, onViewReceipt }) => {
  return (
    <Card variant="paper" className="p-6 border-[#EDE6D8] text-left">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Tuition Installment</span>
          <h4 className="text-lg font-serif font-bold text-[#173F35] mt-0.5">{fee.month}</h4>
          <p className="text-xs text-stone-500">{fee.className} • Due by {formatDate(fee.dueDate)}</p>
        </div>

        <Badge
          variant={fee.status === 'Paid' ? 'forest' : fee.status === 'Overdue' ? 'terracotta' : 'gold'}
          size="md"
          className="font-bold gap-1"
        >
          {fee.status === 'Paid' && <CheckCircle2 className="w-3.5 h-3.5" />}
          {fee.status === 'Overdue' && <AlertCircle className="w-3.5 h-3.5" />}
          {fee.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 my-5 p-4 rounded-xl bg-[#F7F3EA]/70 border border-[#E6DDCF]">
        <div>
          <span className="text-[11px] text-stone-500">Monthly Tuition Fee</span>
          <p className="text-sm font-bold text-stone-800">{formatCurrency(fee.netFee)}</p>
        </div>
        <div>
          <span className="text-[11px] text-stone-500">
            {fee.status === 'Paid' ? 'Settled Amount' : 'Amount Due'}
          </span>
          <p className={`text-base font-extrabold ${fee.status === 'Paid' ? 'text-[#2E6B57]' : 'text-[#B85C45]'}`}>
            {fee.status === 'Paid' ? formatCurrency(fee.paidAmount) : formatCurrency(fee.pendingAmount)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#EDE6D8] pt-4">
        <span className="text-xs text-stone-500">
          {fee.lastPaymentDate ? `Paid on ${formatDate(fee.lastPaymentDate)}` : 'Payment awaited'}
        </span>

        {fee.status === 'Paid' ? (
          <Button
            size="sm"
            variant="outline"
            icon={<Receipt className="w-3.5 h-3.5" />}
            onClick={() => onViewReceipt && onViewReceipt(fee)}
          >
            Download Receipt
          </Button>
        ) : (
          <Button
            size="sm"
            variant="primary"
            icon={<CreditCard className="w-3.5 h-3.5" />}
            onClick={() => onPayNow && onPayNow(fee)}
          >
            Pay Now
          </Button>
        )}
      </div>
    </Card>
  );
};
