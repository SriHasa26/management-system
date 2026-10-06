import React, { useState, useEffect } from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { StatCard } from '../../components/common/StatCard';
import { FeeCollectionChart, AttendanceChart } from '../../components/charts/AttendanceChart';
import { studentService } from '../../services/studentService';
import { admissionService } from '../../services/admissionService';
import { announcementService } from '../../services/announcementService';
import { Student, AdmissionEnquiry } from '../../types';
import { mockStudents } from '../../data/mockStudents';
import { mockAdmissions } from '../../data/mockTimetable';
import { mockFeeSummary } from '../../data/mockFees';
import { formatCurrency, formatDate } from '../../lib/utils';
import { Link } from 'react-router-dom';
import {
  Users,
  Boxes,
  CalendarCheck,
  CreditCard,
  Inbox,
  ClipboardList,
  FileCheck,
  ArrowRight,
  TrendingUp,
  Plus,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [admissions, setAdmissions] = useState<AdmissionEnquiry[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [studData, admData] = await Promise.all([
          studentService.getAllStudents(),
          admissionService.getAllAdmissions(),
        ]);
        if (studData && studData.length > 0) setStudents(studData);
        if (admData && admData.length > 0) setAdmissions(admData);
      } catch (err) {
        console.error('Error loading admin dashboard:', err);
      }
    }
    loadData();
  }, []);

  const newEnquiries = (admissions.length > 0 ? admissions : mockAdmissions).filter((a) => a.status === 'New');

  return (
    <div className="space-y-8 text-left">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#173F35] via-[#1B4638] to-[#2E6B57] text-[#FFFDF8] shadow-elevated border-2 border-[#C99A3D]/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <Badge variant="gold" size="sm" className="font-bold">
            Administrative Command
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
            SRI SAI Operations Overview
          </h2>
          <p className="text-xs text-stone-200">
            Real-time batch metrics, daily attendance records, and collection reports.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link to="/admin/students">
            <Button size="sm" variant="accent" icon={<Plus className="w-4 h-4" />}>
              Add Student
            </Button>
          </Link>
          <Link to="/admin/attendance">
            <Button size="sm" variant="glass" className="text-white border-white/20 hover:bg-white/20">
              Mark Attendance
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Students"
          value="240"
          change="+14 This Month"
          changeType="positive"
          subtext="LKG to Intermediate"
          icon={Users}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />

        <StatCard
          title="Active Batches"
          value="8"
          change="Morning & Evening"
          changeType="positive"
          subtext="CBSE & State Boards"
          icon={Boxes}
          iconBg="bg-[#FAF2F0] text-[#B85C45]"
        />

        <StatCard
          title="Today's Attendance"
          value="95.2%"
          change="228 / 240 Present"
          changeType="positive"
          subtext="8 Morning Batches"
          icon={CalendarCheck}
          iconBg="bg-[#F0F5F3] text-[#2E6B57]"
        />

        <StatCard
          title="Monthly Fee Collection"
          value={formatCurrency(mockFeeSummary.totalCollectionThisMonth)}
          change={`${mockFeeSummary.collectionRate}% target`}
          changeType="positive"
          subtext={`Pending: ${formatCurrency(mockFeeSummary.pendingTotal)}`}
          icon={CreditCard}
          iconBg="bg-[#FAF6EE] text-[#C99A3D]"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <Card variant="paper" className="lg:col-span-7 p-6 sm:p-8 border-[#EDE6D8]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#173F35]">
                Monthly Fee Collection Trend
              </h4>
              <p className="text-xs text-stone-500">Collected amount vs target budget (FY 2026-27)</p>
            </div>
            <Link to="/admin/fees">
              <Button size="sm" variant="outline" className="text-xs py-1">
                Fee Details
              </Button>
            </Link>
          </div>
          <FeeCollectionChart />
        </Card>

        <Card variant="paper" className="lg:col-span-5 p-6 sm:p-8 border-[#EDE6D8]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#173F35]">
                Attendance Aggregates
              </h4>
              <p className="text-xs text-stone-500">Average weekly presence</p>
            </div>
            <Link to="/admin/attendance">
              <Badge variant="forest" size="sm">Live Logs</Badge>
            </Link>
          </div>
          <AttendanceChart />
        </Card>
      </div>

      {/* Recent Admission Enquiries & Fast Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Enquiries Table */}
        <Card variant="paper" className="lg:col-span-8 p-6 sm:p-8 border-[#EDE6D8]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-base font-serif font-bold text-[#173F35]">
                Recent Admission Enquiries
              </h4>
              <p className="text-xs text-stone-500">Prospective student applications awaiting counseling</p>
            </div>
            <Link to="/admin/admissions">
              <Button size="sm" variant="outline" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                All Enquiries ({mockAdmissions.length})
              </Button>
            </Link>
          </div>

          <div className="divide-y divide-[#EDE6D8] overflow-x-auto">
            {mockAdmissions.slice(0, 4).map((enq) => (
              <div key={enq.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div>
                  <p className="font-bold text-[#173F35]">{enq.studentName}</p>
                  <p className="text-[11px] text-stone-500">
                    Parent: {enq.parentName} ({enq.phone}) • {enq.gradeApplying} ({enq.board})
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      enq.status === 'New'
                        ? 'terracotta'
                        : enq.status === 'Enrolled'
                        ? 'forest'
                        : 'gold'
                    }
                    size="sm"
                  >
                    {enq.status}
                  </Badge>
                  <span className="text-[10px] text-stone-400 font-mono">{enq.createdAt.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Operational Quick Nav */}
        <Card variant="paper" className="lg:col-span-4 p-6 border-[#EDE6D8] flex flex-col justify-between">
          <div>
            <h4 className="text-base font-serif font-bold text-[#173F35] mb-2">
              Operational Shortcuts
            </h4>
            <p className="text-xs text-stone-500 mb-4">Jump directly to key management desks</p>

            <div className="space-y-2">
              <Link
                to="/admin/attendance"
                className="p-3 rounded-xl bg-[#F7F3EA] hover:bg-[#EAE4D5] flex items-center justify-between text-xs font-bold text-[#173F35] transition-colors"
              >
                <span>Mark Class Attendance</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E6B57]" />
              </Link>
              <Link
                to="/admin/materials"
                className="p-3 rounded-xl bg-[#F7F3EA] hover:bg-[#EAE4D5] flex items-center justify-between text-xs font-bold text-[#173F35] transition-colors"
              >
                <span>Upload Study Material</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E6B57]" />
              </Link>
              <Link
                to="/admin/tests"
                className="p-3 rounded-xl bg-[#F7F3EA] hover:bg-[#EAE4D5] flex items-center justify-between text-xs font-bold text-[#173F35] transition-colors"
              >
                <span>Create Mock Test</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E6B57]" />
              </Link>
              <Link
                to="/admin/announcements"
                className="p-3 rounded-xl bg-[#F7F3EA] hover:bg-[#EAE4D5] flex items-center justify-between text-xs font-bold text-[#173F35] transition-colors"
              >
                <span>Broadcast Notice</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#2E6B57]" />
              </Link>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EDE6D8] text-[11px] text-stone-400">
            System status: <span className="text-[#2E6B57] font-bold">Online • Phase 1 Demo</span>
          </div>
        </Card>
      </div>
    </div>
  );
};
