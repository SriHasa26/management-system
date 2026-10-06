import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { attendanceService, AttendanceStats } from '../../services/attendanceService';
import { AttendanceRecord } from '../../types';
import { mockAttendanceRecords } from '../../data/mockAttendance';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceChart } from '../../components/charts/AttendanceChart';
import { formatDate } from '../../lib/utils';
import { CalendarCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';

export const StudentAttendancePage: React.FC = () => {
  const { currentStudent } = useAuth();
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats>({
    overallPercentage: currentStudent.overallAttendance || 92,
    totalClasses: 32,
    presentCount: 30,
    absentCount: 1,
    lateCount: 1,
    subjectBreakdown: [],
  });

  useEffect(() => {
    async function loadAttendance() {
      try {
        const [recData, statsData] = await Promise.all([
          attendanceService.getStudentAttendance(currentStudent.id),
          attendanceService.getStudentAttendanceStats(currentStudent.id),
        ]);
        if (recData && recData.length > 0) setRecords(recData);
        else setRecords(mockAttendanceRecords.filter((r) => r.studentId === currentStudent.id));
        if (statsData) setStats(statsData);
      } catch (e) {
        console.error('Error loading student attendance:', e);
      }
    }
    loadAttendance();
  }, [currentStudent]);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Attendance Tracker</h2>
        <p className="text-xs text-stone-500">
          Monitor your class presence, monthly consistency, and punctuality logs.
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Overall Attendance"
          value={`${stats.overallPercentage}%`}
          change={stats.overallPercentage >= 75 ? 'Eligible' : 'Warning'}
          changeType={stats.overallPercentage >= 75 ? 'positive' : 'negative'}
          subtext="Min 75% requirement met"
          icon={CalendarCheck}
        />
        <StatCard
          title="Classes Attended"
          value={stats.presentCount}
          subtext={`Out of ${stats.totalClasses} total sessions`}
          icon={CheckCircle2}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />
        <StatCard
          title="Absences"
          value={stats.absentCount}
          change={`Absence rate: ${(100 - stats.overallPercentage).toFixed(1)}%`}
          changeType="neutral"
          subtext="Recorded logs"
          icon={XCircle}
          iconBg="bg-[#FAF2F0] text-[#B85C45]"
        />
        <StatCard
          title="Late Check-ins"
          value={stats.lateCount}
          subtext="Punctuality tracked"
          icon={Clock}
          iconBg="bg-[#FAF6EE] text-[#C99A3D]"
        />
      </div>

      {/* Chart & Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card variant="paper" className="lg:col-span-6 p-6 border-[#EDE6D8]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#173F35]">Monthly Consistency Trend</h4>
              <p className="text-xs text-stone-500">Past 6 months attendance %</p>
            </div>
            <Badge variant="forest" size="sm">Active Term</Badge>
          </div>
          <AttendanceChart />
        </Card>

        {/* Detailed Attendance Log Table */}
        <Card variant="paper" className="lg:col-span-6 p-6 border-[#EDE6D8]">
          <h4 className="text-base font-serif font-bold text-[#173F35] mb-4">Recent Daily Logs</h4>
          <div className="divide-y divide-[#EDE6D8] overflow-y-auto max-h-72">
            {records.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-[#173F35]">{rec.subject || 'Core Subjects'}</p>
                  <p className="text-[11px] text-stone-500">
                    {formatDate(rec.date)} • Marked by {rec.markedBy || 'Faculty'}
                  </p>
                  {rec.remarks && <p className="text-[10px] text-[#B85C45] italic mt-0.5">{rec.remarks}</p>}
                </div>

                <Badge
                  variant={
                    rec.status === 'Present'
                      ? 'forest'
                      : rec.status === 'Absent'
                      ? 'terracotta'
                      : 'gold'
                  }
                  size="sm"
                  className="font-bold"
                >
                  {rec.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
