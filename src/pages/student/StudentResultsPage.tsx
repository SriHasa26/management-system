import React from 'react';
import { mockTestResults, mockSubjectPerformance } from '../../data/mockTests';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { PerformanceChart } from '../../components/charts/AttendanceChart';
import { formatDate } from '../../lib/utils';
import { Award, TrendingUp, CheckCircle, BarChart3, HelpCircle } from 'lucide-react';

export const StudentResultsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Results & Performance Analytics</h2>
        <p className="text-xs text-stone-500">
          Subject-wise breakdowns, examination reports, and mentor recommendations.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Latest Aggregate"
          value="92.2%"
          change="Grade: A1"
          changeType="positive"
          subtext="Rank: Top 5% in batch"
          icon={Award}
          iconBg="bg-[#FAF6EE] text-[#C99A3D]"
        />
        <StatCard
          title="Strongest Subject"
          value="Mathematics"
          change="94/100"
          changeType="positive"
          subtext="Algebra & Geometry"
          icon={TrendingUp}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />
        <StatCard
          title="Focus Needed"
          value="Social Studies"
          change="86/100"
          changeType="neutral"
          subtext="Map work & Timelines"
          icon={HelpCircle}
          iconBg="bg-[#FAF2F0] text-[#B85C45]"
        />
        <StatCard
          title="Assessments Taken"
          value="18"
          subtext="Unit & Term Tests"
          icon={BarChart3}
        />
      </div>

      {/* Chart Section */}
      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-base font-serif font-bold text-[#173F35]">Subject Diagnostic Comparison</h4>
            <p className="text-xs text-stone-500">Individual Score vs Class Average</p>
          </div>
          <Badge variant="forest" size="sm">Term Benchmark</Badge>
        </div>
        <PerformanceChart />
      </Card>

      {/* Detailed Past Test Score Reports */}
      <div className="space-y-4">
        <h3 className="text-lg font-serif font-bold text-[#173F35]">Exam Score Cards</h3>
        <div className="space-y-3">
          {mockTestResults.map((res) => (
            <Card key={res.id} variant="paper" className="p-6 border-[#EDE6D8] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="forest" size="sm" className="font-bold">{res.subject}</Badge>
                  <Badge variant="gold" size="sm" className="font-bold">Grade {res.grade}</Badge>
                  <span className="text-xs text-stone-400">Date: {formatDate(res.date)}</span>
                </div>
                <h4 className="text-base font-bold text-[#173F35]">{res.testTitle}</h4>
                {res.teacherRemarks && (
                  <p className="text-xs text-stone-600 italic bg-[#F7F3EA] p-2.5 rounded-lg border border-[#E6DDCF] mt-2">
                    <strong>Mentor Remark:</strong> "{res.teacherRemarks}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-stone-200 shrink-0">
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Obtained Score</span>
                  <p className="text-xl font-serif font-bold text-[#173F35]">
                    {res.score} <span className="text-xs font-sans text-stone-400">/ {res.totalMarks}</span>
                  </p>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-stone-400 uppercase font-bold">Percentage</span>
                  <p className="text-xl font-serif font-bold text-[#2E6B57]">{res.percentage}%</p>
                </div>
                {res.rank && (
                  <div className="text-center">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Batch Rank</span>
                    <p className="text-xl font-serif font-bold text-[#C99A3D]">#{res.rank}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
