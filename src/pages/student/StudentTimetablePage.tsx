import React, { useState } from 'react';
import { mockTimetable } from '../../data/mockTimetable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Clock, MapPin, User, Calendar } from 'lucide-react';

export const StudentTimetablePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('All');

  const days = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const filteredSlots = selectedDay === 'All'
    ? mockTimetable
    : mockTimetable.filter((t) => t.dayOfWeek === selectedDay);

  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Weekly Class Timetable</h2>
        <p className="text-xs text-stone-500">
          Class 10 CBSE Morning Star Batch • Subject Schedule & Faculty Allocation.
        </p>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedDay === d
                ? 'bg-[#173F35] text-white shadow-sm'
                : 'bg-[#FFFDF8] text-stone-600 border border-[#EDE6D8] hover:bg-[#F7F3EA]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timetable Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSlots.map((slot) => (
          <Card key={slot.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Badge variant="terracotta" size="sm" className="font-bold">
                  {slot.dayOfWeek}
                </Badge>
                <span className="text-xs font-mono font-bold text-[#173F35] bg-[#F7F3EA] px-2 py-0.5 rounded border border-[#E6DDCF]">
                  {slot.timeSlot}
                </span>
              </div>

              <h4 className="text-base font-serif font-bold text-[#173F35] mb-2">{slot.subject}</h4>
              
              <div className="space-y-1.5 text-xs text-stone-600">
                <p className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#2E6B57]" /> {slot.teacherName}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C99A3D]" /> {slot.room}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-[11px] text-stone-400 font-medium">
              <span>{slot.className}</span>
              <span>{slot.batchName}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
