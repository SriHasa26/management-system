import React from 'react';
import { mockTimetable } from '../../data/mockTimetable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Plus, Clock } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminTimetablePage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Master Timetable & Slot Allocator</h2>
          <p className="text-xs text-stone-500">
            Room reservations, teacher period limits, and weekly classroom schedules.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Slot Creator', 'New lecture slot builder ready.')}>
          Add Lecture Slot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTimetable.map((slot) => (
          <Card key={slot.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8]">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="terracotta" size="sm">{slot.dayOfWeek}</Badge>
              <span className="text-xs font-mono font-bold text-[#173F35]">{slot.timeSlot}</span>
            </div>
            <h4 className="text-base font-serif font-bold text-[#173F35]">{slot.subject}</h4>
            <p className="text-xs text-stone-600 mt-1">{slot.teacherName} • {slot.room}</p>
            <div className="pt-3 mt-3 border-t border-[#EDE6D8] text-[11px] text-stone-400">
              {slot.className} - {slot.batchName}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
