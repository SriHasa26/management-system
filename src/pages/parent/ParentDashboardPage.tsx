import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { PerformanceChart, AttendanceChart } from '../../components/charts/AttendanceChart';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { announcementService } from '../../services/announcementService';
import { attendanceService, AttendanceStats } from '../../services/attendanceService';
import { testService } from '../../services/testService';
import { assignmentService } from '../../services/assignmentService';
import { Announcement } from '../../types';
import { mockAnnouncements } from '../../data/mockAnnouncements';
import { mockTests } from '../../data/mockTests';
import { mockAssignments } from '../../data/mockAssignments';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  TrendingUp,
  CreditCard,
  ClipboardList,
  FileCheck,
  Users,
  ShieldCheck,
  ArrowRight,
  MessageSquareHeart,
} from 'lucide-react';

export const ParentDashboardPage: React.FC = () => {
  const { user, currentStudent, selectedChildId, setSelectedChildId, currentParent } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    overallPercentage: currentStudent.overallAttendance || 92,
    totalClasses: 32,
    presentCount: 30,
    absentCount: 1,
    lateCount: 1,
    subjectBreakdown: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [annData, statData] = await Promise.all([
          announcementService.getAllAnnouncements(),
          attendanceService.getStudentAttendanceStats(currentStudent.id),
        ]);
        if (annData && annData.length > 0) setAnnouncements(annData);
        if (statData) setStats(statData);
      } catch (err) {
        console.error('Error loading parent dashboard data:', err);
      }
    }
    loadData();
  }, [currentStudent]);

  return (
    <div className="space-y-8 text-left">
      {/* Top Parent Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#B85C45] to-[#7E3626] text-[#FFFDF8] shadow-elevated border-2 border-[#C99A3D]/40 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs text-[#FFFDF8] font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C99A3D]" />
            <span>Guardian Oversight Portal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
            Good evening, {currentParent?.name || 'Mrs. Sharma'}
          </h2>

          <p className="text-xs text-stone-200">
            Currently monitoring academic records and tuition for{' '}
            <strong className="text-white underline">{currentStudent.name}</strong> ({currentStudent.grade} - {currentStudent.board}).
          </p>
        </div>

        {/* Child Selector Pills */}
        <div className="z-10 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#C99A3D] block">
            Select Child Record:
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedChildId('SRI-2026-001')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedChildId === 'SRI-2026-001'
                  ? 'bg-white text-[#7E3626] shadow-sm'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              Rahul (Class 10)
            </button>
            <button
              onClick={() => setSelectedChildId('SRI-2026-005')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedChildId === 'SRI-2026-005'
                  ? 'bg-white text-[#7E3626] shadow-sm'
                  : 'bg-black/20 text-white hover:bg-black/30'
              }`}
            >
              Rohan (Class 7)
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${currentStudent.overallAttendance}%`}
          change="Consistent"
          changeType="positive"
          subtext="No unexcused absences"
          icon={CalendarCheck}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />

        <StatCard
          title="Academic Grade"
          value="A1 (92.2%)"
          change="Rank #2"
          changeType="positive"
          subtext="Latest term test"
          icon={TrendingUp}
          iconBg="bg-[#FAF6EE] text-[#C99A3D]"
        />

        <StatCard
          title="Tuition Fee"
          value={currentStudent.feeStatus}
          change="Paid on 05 Sep"
          changeType="positive"
          subtext="Next due: 10 Oct"
          icon={CreditCard}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />

        <StatCard
          title="Upcoming Tests"
          value={mockTests.filter((t) => t.status === 'Upcoming').length}
          subtext="Math & Physics Optics"
          icon={ClipboardList}
          iconBg="bg-[#FAF2F0] text-[#B85C45]"
        />
      </div>

      {/* Analytics & Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card variant="paper" className="lg:col-span-7 p-6 sm:p-8 border-[#EDE6D8]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#173F35]">
                {currentStudent.name}'s Subject Diagnostics
              </h4>
              <p className="text-xs text-stone-500">Benchmark comparison against batch performance</p>
            </div>
            <Link to="/parent/performance">
              <Button size="sm" variant="outline" className="text-xs py-1">
                View Trends
              </Button>
            </Link>
          </div>
          <PerformanceChart />
        </Card>

        <Card variant="paper" className="lg:col-span-5 p-6 sm:p-8 border-[#EDE6D8]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#173F35]">
                Attendance Regularity
              </h4>
              <p className="text-xs text-stone-500">Monthly presence percentage</p>
            </div>
            <Link to="/parent/attendance">
              <Badge variant="forest" size="sm">Monthly Log</Badge>
            </Link>
          </div>
          <AttendanceChart />
        </Card>
      </div>

      {/* Announcements for Parents */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-serif font-bold text-[#173F35] flex items-center gap-2">
            <MessageSquareHeart className="w-5 h-5 text-[#B85C45]" /> Important Circulars for Parents
          </h3>
          <Link to="/parent/announcements" className="text-xs font-semibold text-[#B85C45] hover:underline">
            View All Circulars →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockAnnouncements.slice(0, 2).map((ann) => (
            <AnnouncementCard key={ann.id} announcement={ann} />
          ))}
        </div>
      </div>
    </div>
  );
};
