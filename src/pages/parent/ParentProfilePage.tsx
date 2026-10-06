import React from 'react';
import { mockTimetable } from '../../data/mockTimetable';
import { mockAnnouncements } from '../../data/mockAnnouncements';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { useAuth } from '../../hooks/useAuth';
import { User, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const ParentTimetablePage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Class Timetable & Schedule</h2>
        <p className="text-xs text-stone-500">
          Weekly timetable and educator slot allocations for your enrolled children.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTimetable.map((slot) => (
          <Card key={slot.id} variant="paper" className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="terracotta" size="sm">{slot.dayOfWeek}</Badge>
              <span className="text-xs font-mono font-bold text-[#173F35]">{slot.timeSlot}</span>
            </div>
            <h4 className="text-base font-serif font-bold text-[#173F35]">{slot.subject}</h4>
            <p className="text-xs text-stone-600 mt-1">Faculty: {slot.teacherName} • {slot.room}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const ParentAnnouncementsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Parent Circulars & Notifications</h2>
        <p className="text-xs text-stone-500">
          Important announcements regarding examinations, parent-teacher conferences, and schedules.
        </p>
      </div>

      <div className="space-y-4">
        {mockAnnouncements.map((ann) => (
          <AnnouncementCard key={ann.id} announcement={ann} />
        ))}
      </div>
    </div>
  );
};

export const ParentProfilePage: React.FC = () => {
  const { currentParent, currentStudent } = useAuth();

  return (
    <div className="space-y-8 text-left max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Guardian Profile & Registered Children</h2>
        <p className="text-xs text-stone-500">
          Official parent account information and linked student admission records.
        </p>
      </div>

      <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] space-y-6">
        <div>
          <h4 className="text-base font-serif font-bold text-[#173F35] border-b border-[#EDE6D8] pb-2 mb-4">
            Parent Account Details
          </h4>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block">Guardian Name:</span>
              <span className="font-bold text-stone-800">{currentParent?.name || 'Mrs. Sunita Sharma'}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Mobile Phone:</span>
              <span className="font-mono font-bold text-stone-800">{currentParent?.phone || '+91 98480 12345'}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Registered Email:</span>
              <span className="font-mono font-semibold text-stone-800">{currentParent?.email || 'sunita.sharma@example.com'}</span>
            </div>
            <div>
              <span className="text-stone-400 block">Occupation:</span>
              <span className="font-semibold text-stone-800">{currentParent?.occupation || 'Senior Software Architect'}</span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="text-base font-serif font-bold text-[#173F35] border-b border-[#EDE6D8] pb-2 mb-4">
            Linked Children Enrolled at SRI SAI
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#F0F5F3] border border-[#B8CEC6] text-xs">
              <span className="font-bold text-[#173F35] block">Rahul Sharma</span>
              <span className="text-stone-500">ID: SRI-2026-001 • Class 10 CBSE</span>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF2F0] border border-[#E8C1B7] text-xs">
              <span className="font-bold text-[#173F35] block">Rohan Sharma</span>
              <span className="text-stone-500">ID: SRI-2026-005 • Class 7 CBSE</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
