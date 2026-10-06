import React, { useState } from 'react';
import { mockTests } from '../../data/mockTests';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { Plus, Clock, Award, HelpCircle, ArrowRight } from 'lucide-react';

export const AdminTestsPage: React.FC = () => {
  const { success } = useToast();
  const [tests, setTests] = useState(mockTests);
  const [modalOpen, setModalOpen] = useState(false);
  const [newTest, setNewTest] = useState({
    title: '',
    subject: 'Mathematics',
    chapter: '',
    durationMinutes: 60,
    totalMarks: 50,
    difficulty: 'Medium',
    startDate: '2026-10-15 05:30 PM',
  });

  const handleCreateTest = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `tst-${Date.now()}`,
      title: newTest.title,
      description: 'Standardized assessment configured via Test Builder.',
      subject: newTest.subject,
      className: 'Class 10',
      chapter: newTest.chapter,
      durationMinutes: Number(newTest.durationMinutes),
      totalMarks: Number(newTest.totalMarks),
      difficulty: newTest.difficulty as any,
      startDate: newTest.startDate,
      endDate: newTest.startDate,
      status: 'Upcoming',
      questionsCount: 20,
    };
    setTests([created, ...tests]);
    setModalOpen(false);
    success('Mock Test Scheduled', `"${created.title}" scheduled for batch delivery.`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Assessment & Test Builder Desk</h2>
          <p className="text-xs text-stone-500">
            Design timed examinations, set scoring keys, and schedule unit assessments.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Create New Test
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((t) => (
          <Card key={t.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="forest" size="sm" className="font-bold">{t.subject}</Badge>
                <Badge variant={t.status === 'Completed' ? 'sage' : 'terracotta'} size="sm">{t.status}</Badge>
              </div>
              <h4 className="text-base font-serif font-bold text-[#173F35] mb-1">{t.title}</h4>
              <p className="text-xs text-[#B85C45] font-semibold mb-3">{t.chapter}</p>

              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] text-center text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">Time</span>
                  <strong>{t.durationMinutes}m</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Marks</span>
                  <strong>{t.totalMarks}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block">Difficulty</span>
                  <strong className="text-[#B85C45]">{t.difficulty}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-xs text-stone-500">
              <span>{t.startDate.split(' ')[0]}</span>
              <button
                onClick={() => success('Test Builder', `Editing question bank for ${t.title}`)}
                className="text-[#B85C45] font-bold hover:underline"
              >
                Manage Questions →
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* Test Builder Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Assessment Builder Wizard"
        subtitle="Configure blueprint, marks scheme, and duration"
      >
        <form onSubmit={handleCreateTest} className="space-y-4">
          <Input
            label="Examination Name *"
            placeholder="e.g. Class 10 Math Term 2 Simulation"
            value={newTest.title}
            onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
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
              value={newTest.subject}
              onChange={(e) => setNewTest({ ...newTest, subject: e.target.value })}
            />
            <Select
              label="Difficulty Level *"
              options={[
                { label: 'Easy (Foundational)', value: 'Easy' },
                { label: 'Medium (Standard)', value: 'Medium' },
                { label: 'Hard (Olympiad/Board High Yield)', value: 'Hard' },
              ]}
              value={newTest.difficulty}
              onChange={(e) => setNewTest({ ...newTest, difficulty: e.target.value })}
            />
          </div>

          <Input
            label="Chapter / Syllabus Range *"
            placeholder="e.g. Chapters 4 to 7 Comprehensive"
            value={newTest.chapter}
            onChange={(e) => setNewTest({ ...newTest, chapter: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (Minutes) *"
              type="number"
              value={newTest.durationMinutes}
              onChange={(e) => setNewTest({ ...newTest, durationMinutes: Number(e.target.value) })}
              required
            />
            <Input
              label="Total Marks *"
              type="number"
              value={newTest.totalMarks}
              onChange={(e) => setNewTest({ ...newTest, totalMarks: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Examination
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
