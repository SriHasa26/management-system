import React, { useState } from 'react';
import { mockAdmissions } from '../../data/mockTimetable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatDate } from '../../lib/utils';
import { Phone, Mail, CheckCircle2, MessageSquare, Plus } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminAdmissionsPage: React.FC = () => {
  const { success } = useToast();
  const [enquiries, setEnquiries] = useState(mockAdmissions);

  const handleUpdateStatus = (id: string, newStatus: any) => {
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e))
    );
    success('Status Updated', `Enquiry status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Admission Enquiries CRM</h2>
          <p className="text-xs text-stone-500">
            Prospective parent enquiries, counseling callback logs, and enrollment conversions.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {enquiries.map((enq) => (
          <Card key={enq.id} variant="paper" className="p-6 border-[#EDE6D8] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge
                    variant={
                      enq.status === 'New'
                        ? 'terracotta'
                        : enq.status === 'Enrolled'
                        ? 'forest'
                        : 'gold'
                    }
                    size="sm"
                  >
                    {enq.status}
                  </Badge>
                  <span className="text-xs text-stone-400">{enq.createdAt}</span>
                </div>
                <h4 className="text-lg font-serif font-bold text-[#173F35]">{enq.studentName}</h4>
                <p className="text-xs text-[#B85C45] font-semibold">
                  Applying for: {enq.gradeApplying} ({enq.board})
                </p>
              </div>

              {/* Status Update Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateStatus(enq.id, 'Contacted')}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF6EE] text-[#7F5C1B] text-xs font-semibold hover:bg-[#F3EAD7]"
                >
                  Mark Contacted
                </button>
                <button
                  onClick={() => handleUpdateStatus(enq.id, 'Visit Scheduled')}
                  className="px-2.5 py-1 rounded-lg bg-[#FAF2F0] text-[#B85C45] text-xs font-semibold hover:bg-[#F5E2DC]"
                >
                  Schedule Visit
                </button>
                <button
                  onClick={() => handleUpdateStatus(enq.id, 'Enrolled')}
                  className="px-2.5 py-1 rounded-lg bg-[#F0F5F3] text-[#2E6B57] text-xs font-bold hover:bg-[#DCE7E3]"
                >
                  Enroll Student
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-3.5 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF]">
              <div>
                <span className="text-stone-400 block">Parent / Guardian:</span>
                <span className="font-bold text-stone-800">{enq.parentName}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Contact Phone:</span>
                <span className="font-mono font-bold text-[#173F35]">{enq.phone}</span>
              </div>
              {enq.message && (
                <div className="col-span-full">
                  <span className="text-stone-400 block">Parent Query / Message:</span>
                  <p className="text-stone-700 italic mt-0.5">"{enq.message}"</p>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
