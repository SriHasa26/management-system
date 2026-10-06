import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { StudentIdCard } from '../../components/cards/StudentIdCard';
import { MaterialCard } from '../../components/cards/MaterialCard';
import { TestCard } from '../../components/cards/TestCard';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { PerformanceChart } from '../../components/charts/AttendanceChart';
import { materialService } from '../../services/materialService';
import { testService } from '../../services/testService';
import { assignmentService } from '../../services/assignmentService';
import { announcementService } from '../../services/announcementService';
import { timetableService } from '../../services/timetableService';
import { attendanceService, AttendanceStats } from '../../services/attendanceService';
import { StudyMaterial, MockTest, Assignment, Announcement, TimetableSlot } from '../../types';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  ClipboardList,
  FileText,
  CreditCard,
  ArrowRight,
  BookOpen,
  Clock,
  HelpCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { currentStudent } = useAuth();

  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [tests, setTests] = useState<MockTest[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [attStats, setAttStats] = useState<AttendanceStats>({
    overallPercentage: currentStudent.overallAttendance || 94,
    totalClasses: 32,
    presentCount: 30,
    absentCount: 1,
    lateCount: 1,
    subjectBreakdown: [],
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [matData, testData, asgData, annData, ttData, statsData] = await Promise.all([
          materialService.getMaterials({ className: currentStudent.grade }),
          testService.getTests(currentStudent.grade),
          assignmentService.getAssignments(currentStudent.grade),
          announcementService.getAllAnnouncements(),
          timetableService.getTimetable({ className: currentStudent.grade }),
          attendanceService.getStudentAttendanceStats(currentStudent.id),
        ]);

        setMaterials(matData);
        setTests(testData);
        setAssignments(asgData);
        setAnnouncements(annData);
        setTimetable(ttData);
        if (statsData) setAttStats(statsData);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    }
    loadData();
  }, [currentStudent]);

  const pendingAssignmentsCount = assignments.filter((a) => a.status === 'Pending').length;
  const upcomingTests = tests.filter((t) => t.status === 'Upcoming' || t.status === 'Live');
  const todayClasses = timetable.slice(0, 3);

  return (
    <div className="space-y-8 text-left">
      {/* Top Greeting & Student Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173F35] to-[#2E6B57] text-[#FFFDF8] shadow-elevated border-2 border-[#C99A3D]/30 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 bg-[#0E2822]/60 px-3 py-1 rounded-full text-xs text-[#C99A3D] font-bold border border-[#2E6B57]">
            <span>Active Student Portal</span>
            <span>•</span>
            <span>Academic Year 2026-27</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
            Good afternoon, {currentStudent.name.split(' ')[0]}
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-200">
            <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded font-bold text-[#C99A3D]">
              ID: {currentStudent.id}
            </span>
            <span>•</span>
            <span className="font-semibold">{currentStudent.grade}</span>
            <span>•</span>
            <span className="font-semibold">{currentStudent.board}</span>
            <span>•</span>
            <span className="text-stone-300">{currentStudent.batchName}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <Link to="/student/doubt-buddy">
            <Button size="sm" variant="accent" icon={<Sparkles className="w-4 h-4 text-[#173F35]" />} className="bg-[#C99A3D] hover:bg-[#b0842f] text-[#173F35] font-bold shadow-md">
              AI Doubt Buddy ✨
            </Button>
          </Link>
          <Link to="/student/doubts">
            <Button size="sm" variant="glass" className="text-white border-white/20 hover:bg-white/20" icon={<HelpCircle className="w-4 h-4" />}>
              Ask Teacher
            </Button>
          </Link>
          <Link to="/student/tests">
            <Button size="sm" variant="glass" className="text-white border-white/20 hover:bg-white/20">
              My Tests
            </Button>
          </Link>
        </div>
      </div>

      {/* AI Doubt Buddy Smart Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF6EE] via-[#FFFDF8] to-[#F0F5F3] border-2 border-[#C99A3D]/30 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center text-[#C99A3D] shadow-md shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-base text-[#173F35]">
                SRI SAI AI Doubt Buddy
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full bg-[#173F35] text-[#C99A3D]">
                24/7 Live
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Instant step-by-step solutions, voice queries, formulas, and verified SRI SAI study materials.
            </p>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <Link to="/student/doubt-buddy">
            <Button size="sm" variant="primary" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
              Ask Doubt Buddy
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Attendance"
          value={`${currentStudent.overallAttendance}%`}
          change="+1.5%"
          changeType="positive"
          subtext="Above minimum criteria"
          icon={CalendarCheck}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />

        <StatCard
          title="Upcoming Tests"
          value={upcomingTests.length}
          change="This Week"
          changeType="neutral"
          subtext="Next: Quadratic Equations"
          icon={ClipboardList}
          iconBg="bg-[#FAF2F0] text-[#B85C45]"
        />

        <StatCard
          title="Pending Homework"
          value={pendingAssignmentsCount}
          change="2 Due Soon"
          changeType="negative"
          subtext="Math & Physics"
          icon={FileText}
          iconBg="bg-[#FAF6EE] text-[#C99A3D]"
        />

        <StatCard
          title="Fee Status"
          value={currentStudent.feeStatus}
          change="Current Month"
          changeType="positive"
          subtext="No arrears pending"
          icon={CreditCard}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />
      </div>

      {/* Main Grid: Student ID + Schedule + Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: ID Card & Timetable */}
        <div className="lg:col-span-5 space-y-6">
          <StudentIdCard student={currentStudent} />

          {/* Today's Schedule Card */}
          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2E6B57]" />
                <h4 className="text-sm font-serif font-bold text-[#173F35]">Today's Classes</h4>
              </div>
              <Link to="/student/timetable" className="text-xs font-semibold text-[#B85C45] hover:underline">
                Full Week →
              </Link>
            </div>

            <div className="space-y-3">
              {todayClasses.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="text-xs font-bold text-[#173F35]">{item.subject}</p>
                    <p className="text-[11px] text-stone-500">{item.teacherName} • {item.room}</p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#B85C45] bg-white px-2 py-1 rounded border border-[#E6DDCF]">
                    {item.timeSlot}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Column: Performance Analytics & Announcements */}
        <div className="lg:col-span-7 space-y-6">
          {/* Performance Chart Card */}
          <Card variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-serif font-bold text-[#173F35] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#2E6B57]" /> Subject Performance Snapshot
                </h4>
                <p className="text-xs text-stone-500">Your recent test score vs batch median</p>
              </div>
              <Link to="/student/results">
                <Button size="sm" variant="outline" className="text-xs py-1">
                  Full Analysis
                </Button>
              </Link>
            </div>
            <PerformanceChart />
          </Card>

          {/* Latest Announcements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-serif font-bold text-[#173F35]">Notices & Circulars</h4>
              <Link to="/student/announcements" className="text-xs font-semibold text-[#B85C45] hover:underline">
                View All
              </Link>
            </div>
            {announcements.slice(0, 1).map((ann) => (
              <AnnouncementCard key={ann.id} announcement={ann} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Study Materials Section */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#173F35] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#2E6B57]" /> High-Yield Study Materials
            </h3>
            <p className="text-xs text-stone-500">Recently uploaded formula sheets and chapter question banks</p>
          </div>
          <Link to="/student/materials">
            <Button size="sm" variant="outline" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
              Browse All Materials
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.slice(0, 3).map((mat) => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      </div>
    </div>
  );
};
