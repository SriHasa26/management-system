import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';

export const AdminResultsPage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Result Management & Moderation</h2>
          <p className="text-xs text-stone-500">
            Publish assessment scorecards, assign ranks, and approve teacher remarks.
          </p>
        </div>
        <Button variant="primary" onClick={() => success('Results Published', 'Approved scores published to all student & parent portals.')}>
          Publish Pending Scores
        </Button>
      </div>

      <Card variant="paper" className="p-6 border-[#EDE6D8]">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#EDE6D8] text-stone-400 font-bold uppercase">
                <th className="pb-3">Student</th>
                <th className="pb-3">Test Title</th>
                <th className="pb-3">Score / Max</th>
                <th className="pb-3">Percentage</th>
                <th className="pb-3">Grade</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              <tr className="hover:bg-[#F7F3EA]/50">
                <td className="py-3 font-bold text-[#173F35]">Rahul Sharma (SRI-2026-001)</td>
                <td className="py-3">Chemistry Periodic Test</td>
                <td className="py-3 font-bold">46 / 50</td>
                <td className="py-3 text-[#2E6B57] font-bold">92.0%</td>
                <td className="py-3"><Badge variant="forest" size="sm">A1</Badge></td>
                <td className="py-3 text-right">
                  <span className="text-emerald-700 font-bold">Published</span>
                </td>
              </tr>
              <tr className="hover:bg-[#F7F3EA]/50">
                <td className="py-3 font-bold text-[#173F35]">Ananya Reddy (SRI-2026-002)</td>
                <td className="py-3">Chemistry Periodic Test</td>
                <td className="py-3 font-bold">49 / 50</td>
                <td className="py-3 text-[#2E6B57] font-bold">98.0%</td>
                <td className="py-3"><Badge variant="gold" size="sm">A1 Rank #1</Badge></td>
                <td className="py-3 text-right">
                  <span className="text-emerald-700 font-bold">Published</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
