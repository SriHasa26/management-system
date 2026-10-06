import React, { useState } from 'react';
import { mockTeachers } from '../../data/mockTeachers';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { Plus, Mail, Phone, BookOpen, GraduationCap, Award } from 'lucide-react';

export const AdminTeachersPage: React.FC = () => {
  const { success } = useToast();
  const [teachers, setTeachers] = useState(mockTeachers);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTeacher, setNewTeacher] = useState({ name: '', qualification: '', subjects: '', email: '', phone: '' });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `tch-00${teachers.length + 1}`,
      name: newTeacher.name,
      email: newTeacher.email,
      phone: newTeacher.phone,
      qualification: newTeacher.qualification,
      subjects: newTeacher.subjects.split(',').map((s) => s.trim()),
      classesHandled: ['Class 9', 'Class 10'],
      batchesHandled: ['batch-10-a'],
      joiningDate: new Date().toISOString().split('T')[0],
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      status: 'Active',
      bio: 'Experienced mentor specializing in concept clarity.',
    };
    setTeachers([...teachers, created]);
    setModalOpen(false);
    success('Faculty Enrolled', `${created.name} added to teaching roster.`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Faculty Management Roster</h2>
          <p className="text-xs text-stone-500">
            Teaching staff ({teachers.length}), subject allocations, and batch responsibilities.
          </p>
        </div>

        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Add Faculty Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map((t) => (
          <Card key={t.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8] flex flex-col justify-between">
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#C99A3D] bg-stone-200"
                />
                <div>
                  <h4 className="text-base font-serif font-bold text-[#173F35]">{t.name}</h4>
                  <p className="text-xs text-[#B85C45] font-semibold">{t.qualification}</p>
                  <Badge variant="forest" size="sm" className="mt-1">
                    {t.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#2E6B57]" />
                  <span className="font-mono text-[11px]">{t.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#2E6B57]" />
                  <span className="font-mono text-[11px]">{t.phone}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] mt-2">
                  <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">Assigned Subjects:</span>
                  <div className="flex flex-wrap gap-1">
                    {t.subjects.map((sub, sIdx) => (
                      <span key={sIdx} className="bg-white px-2 py-0.5 rounded text-[10px] font-semibold text-stone-800 border">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-xs text-stone-500">
              <span>Batches: {t.batchesHandled.length} active</span>
              <button
                onClick={() => success('Teacher Schedule', `Viewing timetable for ${t.name}`)}
                className="text-[#B85C45] font-bold hover:underline"
              >
                Schedule →
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Faculty Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Faculty Mentor"
        subtitle="Registers educator in SRI SAI subject faculty directory"
      >
        <form onSubmit={handleAddTeacher} className="space-y-4">
          <Input
            label="Faculty Name *"
            placeholder="e.g. Dr. Ramesh Chary"
            value={newTeacher.name}
            onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
            required
          />
          <Input
            label="Academic Qualifications *"
            placeholder="e.g. M.Sc. Physics, Ph.D."
            value={newTeacher.qualification}
            onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })}
            required
          />
          <Input
            label="Specialist Subjects (Comma separated) *"
            placeholder="Physics, Advanced Optics, Numerical Workshop"
            value={newTeacher.subjects}
            onChange={(e) => setNewTeacher({ ...newTeacher, subjects: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Staff Email *"
              type="email"
              placeholder="ramesh@srisai.edu"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              required
            />
            <Input
              label="Contact Phone *"
              placeholder="+91 98480 00000"
              value={newTeacher.phone}
              onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Mentor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
