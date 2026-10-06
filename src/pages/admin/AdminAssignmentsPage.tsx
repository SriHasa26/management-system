import React, { useState } from 'react';
import { mockAssignments } from '../../data/mockAssignments';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Input, Select } from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { formatDate } from '../../lib/utils';
import { Plus, FileCheck, Clock, Users } from 'lucide-react';

export const AdminAssignmentsPage: React.FC = () => {
  const { success } = useToast();
  const [assignments, setAssignments] = useState(mockAssignments);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAsg, setNewAsg] = useState({
    title: '',
    subject: 'Mathematics',
    dueDate: '2026-10-10',
    totalMarks: 25,
    description: '',
  });

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `asg-00${assignments.length + 1}`,
      title: newAsg.title,
      description: newAsg.description || 'Assigned via administrative desk.',
      subject: newAsg.subject,
      className: 'Class 10',
      batchName: 'Class 10 - Morning Star',
      dueDate: newAsg.dueDate,
      assignedDate: new Date().toISOString().split('T')[0],
      totalMarks: Number(newAsg.totalMarks),
      status: 'Pending',
      submissionCount: 0,
      totalSubmissionsExpected: 18,
    };
    setAssignments([created, ...assignments]);
    setModalOpen(false);
    success('Assignment Created', `Homework "${created.title}" broadcast to student portals.`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Assignment & Homework Control</h2>
          <p className="text-xs text-stone-500">
            Create daily practice assignments and review batch submission percentages.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Create Assignment
        </Button>
      </div>

      <div className="space-y-4">
        {assignments.map((a) => (
          <Card key={a.id} variant="paper" className="p-6 border-[#EDE6D8] flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge variant="forest" size="sm" className="font-bold">{a.subject}</Badge>
                <Badge variant="gold" size="sm">{a.className}</Badge>
                <span className="text-xs text-stone-400 font-medium">Due: {formatDate(a.dueDate)}</span>
              </div>
              <h4 className="text-base font-bold text-[#173F35]">{a.title}</h4>
              <p className="text-xs text-stone-600">{a.description}</p>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-stone-200 shrink-0">
              <div className="text-center">
                <span className="text-[10px] text-stone-400 block uppercase font-bold">Submissions</span>
                <span className="text-base font-serif font-bold text-[#173F35]">
                  {a.submissionCount || 12} / {a.totalSubmissionsExpected || 18}
                </span>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => success('Reviewing Submissions', `Opening submission review sheet for ${a.title}`)}
              >
                Evaluate Papers
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Homework Worksheet"
        subtitle="Broadcasts assignment to selected class batches"
      >
        <form onSubmit={handleCreateAssignment} className="space-y-4">
          <Input
            label="Assignment Title *"
            placeholder="e.g. Word Problems on Quadratic Equations"
            value={newAsg.title}
            onChange={(e) => setNewAsg({ ...newAsg, title: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Subject *"
              options={[
                { label: 'Mathematics', value: 'Mathematics' },
                { label: 'Physics', value: 'Physics' },
                { label: 'Chemistry', value: 'Chemistry' },
                { label: 'Biology', value: 'Biology' },
              ]}
              value={newAsg.subject}
              onChange={(e) => setNewAsg({ ...newAsg, subject: e.target.value })}
            />
            <Input
              label="Due Date *"
              type="date"
              value={newAsg.dueDate}
              onChange={(e) => setNewAsg({ ...newAsg, dueDate: e.target.value })}
              required
            />
          </div>
          <Input
            label="Total Marks"
            type="number"
            value={newAsg.totalMarks}
            onChange={(e) => setNewAsg({ ...newAsg, totalMarks: Number(e.target.value) })}
            required
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Assign to Batch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
