import React from 'react';
import { Card } from '../../components/common/Card';

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
            <span className="text-emerald-700 font-bold">Active</span>
          </div>

          <div className="py-3 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-[#173F35]">Test Score Publication Notification</p>
              <p className="text-stone-500">Sent immediately upon score verification</p>
            </div>
            <span className="text-emerald-700 font-bold">Active</span>
          </div>
        </div>
      </Card>
    </div>
  );
};
