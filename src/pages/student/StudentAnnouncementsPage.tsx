import React from 'react';
import { mockAnnouncements } from '../../data/mockAnnouncements';
import { AnnouncementCard } from '../../components/cards/AnnouncementCard';

export const StudentAnnouncementsPage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Notice Board & Circulars</h2>
        <p className="text-xs text-stone-500">
          Official centre notifications, holiday calendars, exam guidelines, and workshop alerts.
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
