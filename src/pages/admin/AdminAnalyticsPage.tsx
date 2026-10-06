import React from 'react';
import { Card } from '../../components/common/Card';
import { StatCard } from '../../components/common/StatCard';
import { FeeCollectionChart, AttendanceChart, PerformanceChart } from '../../components/charts/AttendanceChart';
import { BarChart3, TrendingUp, Users, Award } from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-8 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Centre Growth & Academic Analytics</h2>
        <p className="text-xs text-stone-500">
          Cross-batch insights, learning velocity benchmarks, and fee collection efficiency.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Enrollment Growth" value="+24%" change="YoY" icon={Users} />
        <StatCard title="Exam Retention" value="96.2%" change="A & B Grades" icon={Award} iconBg="bg-[#FAF6EE] text-[#C99A3D]" />
        <StatCard title="Avg Attendance" value="94.5%" change="+3.1%" icon={TrendingUp} iconBg="bg-[#F0F5F3] text-[#2E6B57]" />
        <StatCard title="Collection Velocity" value="92.4%" subtext="On-time fee settlement" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card variant="paper" className="lg:col-span-6 p-6 sm:p-8 border-[#EDE6D8]">
          <h4 className="text-base font-serif font-bold text-[#173F35] mb-4">Fee Collection Trajectory</h4>
          <FeeCollectionChart />
        </Card>
        <Card variant="paper" className="lg:col-span-6 p-6 sm:p-8 border-[#EDE6D8]">
          <h4 className="text-base font-serif font-bold text-[#173F35] mb-4">Student Subject Mastery Index</h4>
          <PerformanceChart />
        </Card>
      </div>
    </div>
  );
};

export const AdminGalleryPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Media & Photo Gallery Manager</h2>
        <p className="text-xs text-stone-500">
          Upload and manage campus photos, laboratory sessions, and award ceremony images.
        </p>
      </div>

      <Card variant="paper" className="p-8 text-center border-dashed border-[#EDE6D8]">
        <h4 className="text-base font-bold text-[#173F35]">6 Published Gallery Assets</h4>
        <p className="text-xs text-stone-500 mt-1">Displayed on the public website showcase.</p>
      </Card>
    </div>
  );
};
