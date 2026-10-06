import React from 'react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Calendar, Plus } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminCalendarPage: React.FC = () => {
  const { success } = useToast();

  const events = [
    { title: 'Class 10 Unit Test 2 Begins', date: '05 Oct 2026', type: 'Exam', color: 'terracotta' },
    { title: 'Parent-Teacher Progress Meet', date: '10 Oct 2026', type: 'Meeting', color: 'gold' },
    { title: 'Dussehra Festive Holidays', date: '19 Oct - 24 Oct 2026', type: 'Holiday', color: 'forest' },
    { title: 'Term 1 Blueprint Mock Simulations', date: '02 Nov 2026', type: 'Exam', color: 'terracotta' },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Academic Calendar & Term Milestones</h2>
          <p className="text-xs text-stone-500">
            Centre examinations, vacation schedules, and parent-educator conference dates.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Event Added', 'Calendar event created.')}>
          Add Calendar Event
        </Button>
      </div>

      <div className="space-y-3">
        {events.map((ev, idx) => (
          <Card key={idx} variant="paper" className="p-5 border-[#EDE6D8] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-[#F7F3EA] text-[#173F35]">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-[#173F35]">{ev.title}</h4>
                <p className="text-xs text-stone-500">{ev.date}</p>
              </div>
            </div>
            <Badge variant={ev.color as any} size="sm">
              {ev.type}
            </Badge>
          </Card>
        ))}
      </div>
    </div>
  );
};
