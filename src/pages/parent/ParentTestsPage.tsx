import React from 'react';
import { mockTests, mockTestResults } from '../../data/mockTests';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';
import { ClipboardList, Award, Calendar, CheckCircle } from 'lucide-react';

export const ParentTestsPage: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Assessment Schedule & Scores</h2>
        <p className="text-xs text-stone-500">
          Review upcoming examination schedules and verified score cards.
        </p>
      </div>

      {/* Upcoming tests */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#173F35]">Upcoming Examinations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockTests.filter((t) => t.status === 'Upcoming').map((test) => (
            <Card key={test.id} variant="paper" className="p-6 border-[#EDE6D8]">
              <div className="flex items-start justify-between mb-2">
                <Badge variant="forest" size="sm" className="font-bold">{test.subject}</Badge>
                <Badge variant="terracotta" size="sm">{test.difficulty}</Badge>
              </div>
              <h4 className="text-base font-bold text-[#173F35]">{test.title}</h4>
              <p className="text-xs text-stone-600 mt-1">{test.description}</p>
              <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-xs text-stone-500">
                <span>Date: <strong>{test.startDate}</strong></span>
                <span>Duration: <strong>{test.durationMinutes}m</strong></span>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Evaluated Test Score Records */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#173F35]">Past Score Reports</h3>
        <div className="space-y-3">
          {mockTestResults.slice(0, 2).map((res) => (
            <Card key={res.id} variant="paper" className="p-6 border-[#EDE6D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="forest" size="sm">{res.subject}</Badge>
                  <span className="text-xs text-stone-400">{formatDate(res.date)}</span>
                </div>
                <h4 className="text-base font-bold text-[#173F35]">{res.testTitle}</h4>
                <p className="text-xs text-stone-600 italic mt-1">"{res.teacherRemarks}"</p>
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-stone-200">
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 block font-bold">Score</span>
                  <span className="text-lg font-serif font-bold text-[#173F35]">{res.score}/{res.totalMarks}</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 block font-bold">Grade</span>
                  <span className="text-lg font-serif font-bold text-[#2E6B57]">{res.grade} ({res.percentage}%)</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
