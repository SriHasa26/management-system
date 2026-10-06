import React from 'react';
import { mockAnnouncements } from '../../data/mockAnnouncements';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';

export const ParentAnnouncementsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Parent Circulars & Notifications</h2>
        <p className="text-xs text-stone-500">
          Official centre circulars, parent-teacher meet reminders, and vacation date sheets.
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
