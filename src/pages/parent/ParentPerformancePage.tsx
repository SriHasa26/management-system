import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockTestResults } from '../../data/mockTests';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { PerformanceChart } from '../../components/charts/AttendanceChart';
import { formatDate } from '../../lib/utils';
import { TrendingUp, Award, CheckCircle2, AlertTriangle } from 'lucide-react';

export const ParentPerformancePage: React.FC = () => {
  const { currentStudent } = useAuth();
  const studentResults = mockTestResults.filter((r) => r.studentId === currentStudent.id);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">
          Academic Performance & Strengths
        </h2>
        <p className="text-xs text-stone-500">
          In-depth evaluation reports and learning velocity for {currentStudent.name}.
        </p>
      </div>

      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-bold text-[#173F35]">Subject Diagnostic Comparison</h4>
            <p className="text-xs text-stone-500">Student marks benchmarked against the batch standard</p>
          </div>
          <Badge variant="forest" size="sm">Comprehensive</Badge>
        </div>
        <PerformanceChart />
      </Card>

      {/* Strengths & Areas for Attention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="paper" className="p-6 border-[#EDE6D8] border-l-4 border-l-[#2E6B57]">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-5 h-5 text-[#2E6B57]" />
            <h4 className="text-base font-serif font-bold text-[#173F35]">Key Academic Strengths</h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-700">
            <li>• <strong>Mathematics:</strong> Superior speed in algebraic factorization & formula recall (94%).</li>
            <li>• <strong>Chemistry:</strong> Flawless understanding of redox equations and reactions (92%).</li>
            <li>• <strong>Classroom Engagement:</strong> Consistently active during doubt clearing sessions.</li>
          </ul>
        </Card>

        <Card variant="paper" className="p-6 border-[#EDE6D8] border-l-4 border-l-[#B85C45]">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-[#B85C45]" />
            <h4 className="text-base font-serif font-bold text-[#173F35]">Recommended Focus Areas</h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-700">
            <li>• <strong>Physics Ray Diagrams:</strong> Minor sign convention mix-ups on convex lens problems.</li>
            <li>• <strong>Social Science:</strong> Advised to spend 20 mins weekly on map work precision.</li>
            <li>• <strong>Time Management:</strong> Allocate first 5 mins in exams to review question choice.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};
