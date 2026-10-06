import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockDoubts } from '../../data/mockDoubts';
import { DoubtCard } from '../../components/cards/AnnouncementCard';
import { Card } from '../../components/common/Card';
import { Input, Select } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { HelpCircle, Send, Plus, Sparkles, ArrowRight } from 'lucide-react';

export const StudentDoubtsPage: React.FC = () => {
  const { success } = useToast();
  const [doubts, setDoubts] = useState(mockDoubts);
  const [modalOpen, setModalOpen] = useState(false);

  const [newDoubt, setNewDoubt] = useState({
    subject: 'Mathematics',
    title: '',
    question: '',
  });

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `dbt-00${doubts.length + 1}`,
      studentId: 'SRI-2026-001',
      studentName: 'Rahul Sharma',
      subject: newDoubt.subject,
      className: 'Class 10',
      title: newDoubt.title,
      question: newDoubt.question,
      status: 'Pending',
      createdAt: 'Just now',
    };

    setDoubts([created, ...doubts]);
    setModalOpen(false);
    setNewDoubt({ subject: 'Mathematics', title: '', question: '' });
    success('Doubt Posted', 'Your question has been routed to the subject mentor for clarification.');
  };

  const subjectOptions = [
    { label: 'Mathematics', value: 'Mathematics' },
    { label: 'Physics', value: 'Physics' },
    { label: 'Chemistry', value: 'Chemistry' },
    { label: 'Biology', value: 'Biology' },
    { label: 'English', value: 'English' },
    { label: 'Social Studies', value: 'Social Studies' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* AI Doubt Buddy Instant Resolution Promo */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#173F35] to-[#2E6B57] text-[#FFFDF8] border-2 border-[#C99A3D]/40 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#C99A3D] text-[#173F35] flex items-center justify-center font-bold shadow-md shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-white flex items-center gap-2">
              Want an instant answer right now?
              <span className="text-[10px] bg-[#C99A3D] text-[#173F35] px-2 py-0.5 rounded-full font-bold">
                Instant AI
              </span>
            </h4>
            <p className="text-xs text-stone-200">
              Try SRI SAI AI Doubt Buddy for step-by-step explanations, formulas, and verified study notes in seconds.
            </p>
          </div>
        </div>
        <Link to="/student/doubt-buddy" className="shrink-0">
          <Button size="sm" variant="accent" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
            Open AI Doubt Buddy
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Ask Teacher & Faculty</h2>
          <p className="text-xs text-stone-500">
            Submit conceptual or problem-solving queries directly to your subject educators.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Ask New Doubt
        </Button>
      </div>

      <div className="space-y-4">
        {doubts.map((d) => (
          <DoubtCard key={d.id} doubt={d} />
        ))}
      </div>

      {/* Ask Doubt Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Submit a Academic Doubt"
        subtitle="Your query will be answered by our senior subject educators"
      >
        <form onSubmit={handlePostDoubt} className="space-y-4">
          <Select
            label="Subject"
            options={subjectOptions}
            value={newDoubt.subject}
            onChange={(e) => setNewDoubt({ ...newDoubt, subject: e.target.value })}
          />

          <Input
            label="Topic / Chapter / Question Reference"
            placeholder="e.g. Chapter 4 Quadratic Formula Discriminant Calculation"
            value={newDoubt.title}
            onChange={(e) => setNewDoubt({ ...newDoubt, title: e.target.value })}
            required
          />

          <div className="space-y-1.5 text-left">
            <label className="block text-xs font-semibold text-[#202522] uppercase tracking-wider">
              Explain your doubt clearly *
            </label>
            <textarea
              rows={4}
              placeholder="Describe where you got stuck or paste the exact equation..."
              value={newDoubt.question}
              onChange={(e) => setNewDoubt({ ...newDoubt, question: e.target.value })}
              required
              className="w-full rounded-xl border border-[#E6DDCF] bg-[#FFFDF8] p-3 text-xs text-[#202522] focus:border-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]/15"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" iconRight={<Send className="w-4 h-4" />}>
              Submit Doubt Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
