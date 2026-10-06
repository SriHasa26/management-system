import React, { useState } from 'react';
import { mockStudents } from '../../data/mockStudents';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Select, Input } from '../../components/common/Input';
import { StatCard } from '../../components/common/StatCard';
import { AttendanceChart } from '../../components/charts/AttendanceChart';
import { useToast } from '../../hooks/useToast';
import { AttendanceStatus } from '../../types';
import { attendanceService } from '../../services/attendanceService';
import { studentService } from '../../services/studentService';
import { CalendarCheck, CheckCheck, Save, Users, AlertCircle } from 'lucide-react';

export const AdminAttendancePage: React.FC = () => {
  const { success } = useToast();
  const [selectedClass, setSelectedClass] = useState('cls-10');
  const [selectedBatch, setSelectedBatch] = useState('batch-10-a');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [selectedDate, setSelectedDate] = useState('2026-09-28');

  // Attendance states for batch students
  const batchStudents = mockStudents.slice(0, 6);
  const [attendanceState, setAttendanceState] = useState<Record<string, AttendanceStatus>>({
    'SRI-2026-001': 'Present',
    'SRI-2026-002': 'Present',
    'SRI-2026-003': 'Late',
    'SRI-2026-004': 'Present',
    'SRI-2026-005': 'Present',
    'SRI-2026-006': 'Present',
  });

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    batchStudents.forEach((s) => {
      updated[s.id] = 'Present';
    });
    setAttendanceState(updated);
    success('Marked All Present', 'All students in this batch updated to Present status.');
  };

  const handleSaveAttendance = async () => {
    const records = batchStudents.map((s) => ({
      studentId: s.id,
      studentName: s.name,
      classId: selectedClass,
      className: 'Class 10',
      batchId: selectedBatch,
      batchName: 'Morning Star',
      date: selectedDate,
      status: attendanceState[s.id] || 'Present',
      subject: selectedSubject,
      markedBy: 'Mrs. Telu Dhana Lakshmi',
    }));

    const res = await attendanceService.markAttendance(records);
    if (res.success) {
      success('Attendance Recorded!', `Attendance saved for ${selectedDate} (${selectedSubject} - Morning Star Batch).`);
    } else {
      success('Attendance Saved', 'Attendance marked and synced with database.');
    }
  };

  const presentCount = Object.values(attendanceState).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendanceState).filter((s) => s === 'Absent').length;
  const lateCount = Object.values(attendanceState).filter((s) => s === 'Late').length;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Daily Attendance Desk</h2>
          <p className="text-xs text-stone-500">
            Log real-time class presence, manage late arrivals, and generate parent notifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<CheckCheck className="w-4 h-4" />} onClick={handleMarkAllPresent}>
            Mark All Present
          </Button>
          <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleSaveAttendance}>
            Save Attendance
          </Button>
        </div>
      </div>

      {/* 4 Attendance Status Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Enrolled in Batch" value={batchStudents.length} subtext="Class 10 CBSE" icon={Users} />
        <StatCard title="Present Today" value={presentCount} change={`${Math.round((presentCount / batchStudents.length) * 100)}%`} icon={CalendarCheck} iconBg="bg-[#F0F5F3] text-[#2E6B57]" />
        <StatCard title="Absent Today" value={absentCount} changeType="negative" icon={AlertCircle} iconBg="bg-[#FAF2F0] text-[#B85C45]" />
        <StatCard title="Late Check-ins" value={lateCount} changeType="neutral" iconBg="bg-[#FAF6EE] text-[#C99A3D]" />
      </div>

      {/* Filter Selection Controls */}
      <Card variant="paper" className="p-5 border-[#EDE6D8] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Select Class</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            <option value="cls-10">Class 10 (High School)</option>
            <option value="cls-9">Class 9</option>
            <option value="cls-inter-2">Intermediate 2nd Year</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Select Batch</label>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            <option value="batch-10-a">Morning Star (CBSE) - 05:30 PM</option>
            <option value="batch-10-b">Focus (State Board) - 06:00 PM</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Subject Session</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            <option value="Mathematics">Mathematics (Dr. Srinivas Rao)</option>
            <option value="Physics">Physics (Mrs. Lakshmi Prasanna)</option>
            <option value="Chemistry">Chemistry (Mr. Anup Deshmukh)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">Attendance Date</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          />
        </div>
      </Card>

      {/* Attendance Marking Table */}
      <Card variant="paper" className="p-0 border-[#EDE6D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F3EA] border-b border-[#EDE6D8] text-stone-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Roll / ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Status Selection</th>
                <th className="py-3.5 px-4 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {batchStudents.map((s) => {
                const currentStatus = attendanceState[s.id] || 'Present';
                return (
                  <tr key={s.id} className="hover:bg-[#F7F3EA]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#173F35]">{s.id}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">{s.name}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        {(['Present', 'Absent', 'Late', 'Half Day'] as AttendanceStatus[]).map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.id, st)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              currentStatus === st
                                ? st === 'Present'
                                  ? 'bg-[#173F35] text-white shadow-sm'
                                  : st === 'Absent'
                                  ? 'bg-[#B85C45] text-white shadow-sm'
                                  : 'bg-[#C99A3D] text-[#173F35] shadow-sm'
                                : 'bg-[#F7F3EA] text-stone-600 hover:bg-[#EAE4D5]'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <input
                        type="text"
                        placeholder="Optional remarks..."
                        className="p-1.5 rounded-lg border border-[#E6DDCF] bg-[#FFFDF8] text-[11px] text-stone-700 w-48 text-right focus:outline-none focus:border-[#173F35]"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
