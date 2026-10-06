import React from 'react';
import { mockAssignments } from '../../data/mockAssignments';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';
import { Clock, CheckCircle2, FileText } from 'lucide-react';

export const ParentAssignmentsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Daily Homework & Submission Status</h2>
        <p className="text-xs text-stone-500">
          Supervise your child's daily practice consistency and worksheet evaluations.
        </p>
      </div>

      <div className="space-y-4">
        {mockAssignments.map((a) => (
          <Card key={a.id} variant="paper" className="p-6 border-[#EDE6D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm">{a.subject}</Badge>
                <Badge variant={a.status === 'Pending' ? 'terracotta' : a.status === 'Evaluated' ? 'sage' : 'neutral'} size="sm">
                  {a.status}
                </Badge>
              </div>
              <h4 className="text-base font-bold text-[#173F35]">{a.title}</h4>
              <p className="text-xs text-stone-600">{a.description}</p>
            </div>

            <div className="text-left md:text-right text-xs text-stone-500 shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-stone-200">
              <span className="font-semibold text-[#B85C45] block">Due: {formatDate(a.dueDate)}</span>
              <span>Assigned: {formatDate(a.assignedDate)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
