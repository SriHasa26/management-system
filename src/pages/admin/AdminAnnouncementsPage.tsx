import React, { useState } from 'react';
import { mockAnnouncements } from '../../data/mockAnnouncements';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input, Select } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../hooks/useToast';
import { Plus, Bell } from 'lucide-react';

export const AdminAnnouncementsPage: React.FC = () => {
  const { success } = useToast();
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [modalOpen, setModalOpen] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    priority: 'Normal',
    audience: 'All',
  });

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    const created: any = {
      id: `ann-00${announcements.length + 1}`,
      title: newNotice.title,
      content: newNotice.content,
      priority: newNotice.priority as any,
      audience: newNotice.audience as any,
      publishedAt: new Date().toISOString().split('T')[0],
      author: 'Principal / Admin',
      pinned: newNotice.priority === 'Important' || newNotice.priority === 'Urgent',
    };
    setAnnouncements([created, ...announcements]);
    setModalOpen(false);
    success('Notice Published', `"${created.title}" broadcast to ${created.audience}.`);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Notice & Broadcast Manager</h2>
          <p className="text-xs text-stone-500">
            Publish circulars, test reminders, holiday schedules, and workshop invitations.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Create Notice
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <AnnouncementCard key={ann.id} announcement={ann} />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast New Notice"
        subtitle="Publishes circular across selected portals"
      >
        <form onSubmit={handleCreateNotice} className="space-y-4">
          <Input
            label="Notice Title *"
            placeholder="e.g. Special Sunday Revision Workshop"
            value={newNotice.title}
            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority Level *"
              options={[
                { label: 'Normal Notice', value: 'Normal' },
                { label: 'Important (Highlighted)', value: 'Important' },
                { label: 'Urgent Alert', value: 'Urgent' },
              ]}
              value={newNotice.priority}
              onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
            />
            <Select
              label="Audience Target *"
              options={[
                { label: 'All Users (Students + Parents)', value: 'All' },
                { label: 'Students Only', value: 'Students' },
                { label: 'Parents Only', value: 'Parents' },
              ]}
              value={newNotice.audience}
              onChange={(e) => setNewNotice({ ...newNotice, audience: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#202522] uppercase tracking-wider">
              Notice Content *
            </label>
            <textarea
              rows={4}
              placeholder="Write full circular instructions..."
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
              required
              className="w-full rounded-xl border border-[#E6DDCF] bg-[#FFFDF8] p-3 text-xs text-[#202522] focus:border-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]/15"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export const AdminNotificationsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">System Alerts & Push Notifications</h2>
        <p className="text-xs text-stone-500">
          Automated event dispatch logs for attendance, tests, and payment alerts.
        </p>
      </div>

      <Card variant="paper" className="p-6 border-[#EDE6D8] space-y-4">
        <div className="p-4 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] text-xs space-y-1">
          <p className="font-bold text-[#173F35]">Automated Trigger Queue:</p>
          <p className="text-stone-600">SMS / WhatsApp integration prepared for Phase 2 gateway hooks.</p>
        </div>

        <div className="divide-y divide-[#EDE6D8]">
          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#173F35]">Daily Absence Notification Trigger</p>
              <p className="text-stone-500">Sent to guardians when student is marked Absent before 06:00 PM</p>
            </div>
            <span className="text-emerald-700 font-bold">Enabled</span>
          </div>

          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#173F35]">Test Score Publication Notification</p>
              <p className="text-stone-500">Sent immediately upon score verification</p>
            </div>
            <span className="text-emerald-700 font-bold">Enabled</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
