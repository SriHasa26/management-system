import React from 'react';
import { mockTimetable } from '../../data/mockTimetable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';

export const ParentTimetablePage: React.FC = () => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Class Timetable & Schedule</h2>
        <p className="text-xs text-stone-500">
          Weekly class schedules and educator slot allocations for your child.
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
