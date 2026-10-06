import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PerformanceChart, AttendanceChart } from '../charts/AttendanceChart';
import { TrendingUp, Users, CalendarCheck, FileCheck, Info } from 'lucide-react';

export const PerformanceSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Academic Metrics"
          badgeVariant="forest"
          title="Measurable Student Progress & Growth"
          subtitle="Real-time analytics and benchmarked evaluations that empower educators, students, and parents."
        />

        {/* Mandatory Phase 1 Demo Notice */}
        <div className="mb-8 p-3.5 rounded-2xl bg-[#FFFDF8] border border-[#C99A3D]/40 shadow-sm flex items-center gap-3 text-left max-w-2xl mx-auto">
          <Info className="w-5 h-5 text-[#C99A3D] shrink-0" />
          <p className="text-xs text-stone-600">
            <strong>Phase 1 Demonstration Mode:</strong> Metrics and charts displayed below are representative sample models showcasing the platform's diagnostic capability.
          </p>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 text-left">
          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-stone-500">Attendance Rate</span>
              <div className="p-2 rounded-xl bg-[#F0F5F3] text-[#2E6B57]">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35] mt-2">94.8%</div>
            <div className="flex items-center gap-1 text-xs text-[#2E6B57] font-semibold mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> +4.2% term improvement
            </div>
          </Card>

          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-stone-500">Test Participation</span>
              <div className="p-2 rounded-xl bg-[#FAF2F0] text-[#B85C45]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35] mt-2">98.2%</div>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
              Weekly benchmarked exams
            </div>
          </Card>

          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-stone-500">Homework Completion</span>
              <div className="p-2 rounded-xl bg-[#FAF6EE] text-[#C99A3D]">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35] mt-2">93.5%</div>
            <div className="flex items-center gap-1 text-xs text-[#2E6B57] font-semibold mt-1">
              Daily guided submissions
            </div>
          </Card>

          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-stone-500">Subject Growth</span>
              <div className="p-2 rounded-xl bg-[#F0F5F3] text-[#2E6B57]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35] mt-2">+18.4%</div>
            <div className="flex items-center gap-1 text-xs text-stone-500 mt-1">
              Average score leap
            </div>
          </Card>
        </div>

        {/* Visual Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          <Card variant="paper" className="lg:col-span-7 p-6 sm:p-8 border-[#EDE6D8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-serif font-bold text-[#173F35]">
                  Subject-Wise Diagnostic Comparison
                </h4>
                <p className="text-xs text-stone-500">Individual student score vs. batch benchmark (Sample)</p>
              </div>
              <Badge variant="forest" size="sm">
                Demo Analytics
              </Badge>
            </div>
            <PerformanceChart />
          </Card>

          <Card variant="paper" className="lg:col-span-5 p-6 sm:p-8 border-[#EDE6D8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-serif font-bold text-[#173F35]">
                  Consistency & Attendance Trend
                </h4>
                <p className="text-xs text-stone-500">Monthly classroom presence percentage</p>
              </div>
              <Badge variant="gold" size="sm">
                Trendline
              </Badge>
            </div>
            <AttendanceChart />
          </Card>
        </div>
      </div>
    </section>
  );
};
