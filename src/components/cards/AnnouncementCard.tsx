import React from 'react';
import { Announcement, DoubtTicket } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { formatDate } from '../../lib/utils';
import { Bell, Pin, MessageSquare, CheckCircle, HelpCircle } from 'lucide-react';

export const AnnouncementCard: React.FC<{ announcement: Announcement }> = ({ announcement }) => {
  return (
    <Card
      variant="paper"
      className={`p-6 border-[#EDE6D8] text-left transition-all ${
        announcement.pinned ? 'border-l-4 border-l-[#C99A3D] bg-gradient-to-r from-[#FFFDF8] to-[#FAF6EE]/50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {announcement.pinned && <Pin className="w-3.5 h-3.5 text-[#C99A3D] rotate-45" />}
          <Badge
            variant={
              announcement.priority === 'Urgent'
                ? 'terracotta'
                : announcement.priority === 'Important'
                ? 'gold'
                : 'forest'
            }
            size="sm"
          >
            {announcement.priority}
          </Badge>
          <span className="text-[11px] text-stone-400 font-medium">Audience: {announcement.audience}</span>
        </div>

        <span className="text-xs text-stone-400">{formatDate(announcement.publishedAt)}</span>
      </div>

      <h4 className="text-base font-serif font-bold text-[#173F35] mt-1 mb-2">{announcement.title}</h4>
      <p className="text-xs text-stone-600 leading-relaxed">{announcement.content}</p>

      <div className="flex items-center justify-between border-t border-[#EDE6D8] pt-3 mt-4 text-[11px] text-stone-500">
        <span>Issued by: <strong className="text-stone-700">{announcement.author}</strong></span>
        <div className="flex items-center gap-1 text-[#2E6B57]">
          <Bell className="w-3 h-3" />
          <span>Official Notice</span>
        </div>
      </div>
    </Card>
  );
};

export const DoubtCard: React.FC<{ doubt: DoubtTicket }> = ({ doubt }) => {
  return (
    <Card variant="paper" className="p-6 border-[#EDE6D8] text-left">
      <div className="flex items-start justify-between gap-3 mb-2">
        <Badge variant="forest" size="sm">
          {doubt.subject}
        </Badge>
        <Badge variant={doubt.status === 'Answered' ? 'sage' : 'terracotta'} size="sm" className="gap-1">
          {doubt.status === 'Answered' ? <CheckCircle className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
          {doubt.status}
        </Badge>
      </div>

      <h4 className="text-base font-bold text-[#173F35] mt-1">{doubt.title}</h4>
      <div className="mt-3 p-3.5 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] text-xs text-stone-700 leading-relaxed">
        <p className="font-semibold text-stone-500 mb-1 text-[10px] uppercase tracking-wider">Student Query:</p>
        "{doubt.question}"
      </div>

      {doubt.answer && (
        <div className="mt-3 p-3.5 rounded-xl bg-[#F0F5F3] border border-[#B8CEC6] text-xs text-[#173F35] leading-relaxed">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-[11px] text-[#2E6B57] flex items-center gap-1">
              <MessageSquare className="w-3 h-3" /> Mentor Response ({doubt.teacherName}):
            </span>
            <span className="text-[10px] text-stone-400">{doubt.answeredAt}</span>
          </div>
          <p>{doubt.answer}</p>
        </div>
      )}

      <div className="flex items-center justify-between text-[11px] text-stone-400 mt-4 pt-3 border-t border-[#EDE6D8]">
        <span>Asked on: {doubt.createdAt}</span>
        <span>Ticket ID: #{doubt.id}</span>
      </div>
    </Card>
  );
};
