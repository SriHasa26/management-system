import React, { useState } from 'react';
import { mockStudents } from '../../data/mockStudents';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { StudentIdCard } from '../../components/cards/StudentIdCard';
import { useToast } from '../../hooks/useToast';
import { formatCurrency, formatDate } from '../../lib/utils';
import {
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const { success } = useToast();
  const [students, setStudents] = useState(mockStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [viewingStudent, setViewingStudent] = useState<any | null>(null);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // New Student Form State
  const [newStudent, setNewStudent] = useState({
    name: '',
    grade: 'Class 10',
    board: 'CBSE',
    parentName: '',
    parentPhone: '',
    monthlyFee: 3500,
  });

  const filtered = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = selectedGrade === 'All' || s.grade === selectedGrade;
    return matchesSearch && matchesGrade;
  });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SRI-2026-${String(students.length + 1).padStart(3, '0')}`;
    const created: any = {
      id: newId,
      name: newStudent.name,
      gender: 'Male',
      dob: '2010-01-01',
      grade: newStudent.grade,
      board: newStudent.board,
      batchId: 'batch-10-a',
      batchName: `${newStudent.grade} - Standard Batch`,
      rollNumber: `ROLL-${students.length + 1}`,
      admissionDate: new Date().toISOString().split('T')[0],
      photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      status: 'Active',
      parentName: newStudent.parentName,
      parentPhone: newStudent.parentPhone,
      parentEmail: 'parent@example.com',
      parentRelation: 'Guardian',
      address: 'Hyderabad Regional Campus',
      overallAttendance: 100,
      feeStatus: 'Paid',
      monthlyFee: Number(newStudent.monthlyFee),
      dueAmount: 0,
      lastTestScore: 85,
    };

    setStudents([created, ...students]);
    setAddModalOpen(false);
    success('Student Enrolled!', `Student ${created.name} registered with ID ${created.id}`);
  };

  const gradeList = ['All', 'Class 4', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Intermediate 2nd Year'];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Student Management Directory</h2>
          <p className="text-xs text-stone-500">
            Enrolled students ({students.length}), ID allocation, batch assignment, and fee status.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddModalOpen(true)}
        >
          Add New Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by ID (e.g. SRI-2026-001) or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F7F3EA] border border-[#E6DDCF] focus:outline-none focus:border-[#173F35]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-stone-400 font-semibold">Filter Class:</span>
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            {gradeList.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Student Records Table */}
      <Card variant="paper" className="p-0 border-[#EDE6D8] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F7F3EA] border-b border-[#EDE6D8] text-stone-500 uppercase font-bold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Student ID</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Class & Board</th>
                <th className="py-3.5 px-4">Guardian & Contact</th>
                <th className="py-3.5 px-4">Attendance</th>
                <th className="py-3.5 px-4">Fee Status</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDE6D8]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F7F3EA]/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#173F35]">
                    {s.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={s.photoUrl}
                        alt={s.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#C99A3D]"
                      />
                      <span className="font-bold text-[#173F35]">{s.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-stone-800">{s.grade}</span>
                    <span className="text-[10px] text-stone-500 block">{s.board}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-stone-800">{s.parentName}</span>
                    <span className="text-[10px] text-stone-500 font-mono block">{s.parentPhone}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[#2E6B57]">{s.overallAttendance}%</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge
                      variant={s.feeStatus === 'Paid' ? 'forest' : s.feeStatus === 'Overdue' ? 'terracotta' : 'gold'}
                      size="sm"
                    >
                      {s.feeStatus}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-700 font-semibold">{s.status}</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingStudent(s)}
                        className="p-1.5 rounded-lg bg-[#F7F3EA] hover:bg-[#173F35] hover:text-white text-[#173F35] transition-colors"
                        title="View Digital ID & Records"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => success('Edit Mode', `Editing record for ${s.name}`)}
                        className="p-1.5 rounded-lg bg-[#F7F3EA] hover:bg-[#C99A3D] hover:text-white text-[#7F5C1B] transition-colors"
                        title="Edit Student"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Digital ID Card Modal */}
      <Modal
        isOpen={!!viewingStudent}
        onClose={() => setViewingStudent(null)}
        title="Student Digital ID & Academic Card"
        subtitle={`Viewing record for ${viewingStudent?.name} (${viewingStudent?.id})`}
      >
        {viewingStudent && (
          <div className="space-y-6">
            <StudentIdCard student={viewingStudent} />
            <div className="p-4 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] text-xs space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-stone-400">Monthly Tuition:</span>{' '}
                  <strong>{formatCurrency(viewingStudent.monthlyFee)}</strong>
                </div>
                <div>
                  <span className="text-stone-400">Due Balance:</span>{' '}
                  <strong className="text-[#B85C45]">{formatCurrency(viewingStudent.dueAmount)}</strong>
                </div>
              </div>
              <p className="text-stone-500">
                Registered Address: {viewingStudent.address}
              </p>
            </div>
            <div className="flex justify-end">
              <Button variant="primary" onClick={() => setViewingStudent(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Student Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Enroll New Student"
        subtitle="Registers student in official directory and generates mock SRI-2026 ID"
      >
        <form onSubmit={handleAddStudent} className="space-y-4">
          <Input
            label="Student Full Name *"
            placeholder="e.g. Aditi Rao"
            value={newStudent.name}
            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Class / Grade *"
              options={[
                { label: 'Class 9', value: 'Class 9' },
                { label: 'Class 10', value: 'Class 10' },
                { label: 'Class 8', value: 'Class 8' },
                { label: 'Intermediate 1st Year', value: 'Intermediate 1st Year' },
                { label: 'Intermediate 2nd Year', value: 'Intermediate 2nd Year' },
              ]}
              value={newStudent.grade}
              onChange={(e) => setNewStudent({ ...newStudent, grade: e.target.value })}
            />
            <Select
              label="Board *"
              options={[
                { label: 'CBSE', value: 'CBSE' },
                { label: 'State Board', value: 'State Board' },
                { label: 'MPC', value: 'MPC' },
              ]}
              value={newStudent.board}
              onChange={(e) => setNewStudent({ ...newStudent, board: e.target.value as any })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Parent / Guardian Name *"
              placeholder="e.g. Mr. K. Rao"
              value={newStudent.parentName}
              onChange={(e) => setNewStudent({ ...newStudent, parentName: e.target.value })}
              required
            />
            <Input
              label="Parent Mobile Phone *"
              placeholder="+91 98480 99999"
              value={newStudent.parentPhone}
              onChange={(e) => setNewStudent({ ...newStudent, parentPhone: e.target.value })}
              required
            />
          </div>

          <Input
            label="Monthly Tuition Fee (₹)"
            type="number"
            value={newStudent.monthlyFee}
            onChange={(e) => setNewStudent({ ...newStudent, monthlyFee: Number(e.target.value) })}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Enroll Student
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
