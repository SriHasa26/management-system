import React from 'react';
import { mockClasses, mockBatches, mockSubjects } from '../../data/mockClasses';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { formatCurrency } from '../../lib/utils';
import { Plus, Users, Layers, Boxes, BookOpen } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminClassesPage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Class & Grade Structure</h2>
          <p className="text-xs text-stone-500">
            Define curriculum tiers from Early Learning (LKG) to Intermediate boards.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Class Builder', 'New grade tier creation dialog initialized.')}>
          Add Class Grade
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockClasses.map((cls) => (
          <Card key={cls.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="forest" size="sm" className="font-bold">{cls.category}</Badge>
                <span className="text-xs font-bold text-[#B85C45]">{formatCurrency(cls.monthlyFee)}/mo</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-[#173F35] mb-2">{cls.name}</h4>
              <div className="flex flex-wrap gap-1 mb-4">
                {cls.boards.map((b) => (
                  <Badge key={b} variant="neutral" size="sm">{b}</Badge>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EDE6D8] flex items-center justify-between text-xs text-stone-500">
              <span>{cls.totalStudents} Enrolled Students</span>
              <span className="font-semibold text-stone-800">{cls.batchesCount} Batches</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AdminBatchesPage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Batch Management & Scheduling</h2>
          <p className="text-xs text-stone-500">
            Intimate cohorts capped at 15-20 students with assigned mentor and timing.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Batch Builder', 'New cohort batch creator initialized.')}>
          Create New Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBatches.map((b) => (
          <Card key={b.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8] flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <Badge variant="terracotta" size="sm">{b.board}</Badge>
                <span className="text-xs font-mono font-bold text-[#173F35] bg-[#F7F3EA] px-2 py-0.5 rounded border">
                  {b.timing}
                </span>
              </div>
              <h4 className="text-base font-serif font-bold text-[#173F35] mb-1">{b.name}</h4>
              <p className="text-xs text-stone-600 mb-4">{b.room} • Mentor: {b.teacherName}</p>

              {/* Capacity Progress Bar */}
              <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-500">Enrollment Ratio:</span>
                  <span className="font-bold text-[#173F35]">{b.enrolledCount} / {b.capacity} Seats</span>
                </div>
                <div className="h-1.5 rounded-full bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-[#2E6B57]"
                    style={{ width: `${(b.enrolledCount / b.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-xs text-stone-500">
              <span>{b.capacity - b.enrolledCount} seats available</span>
              <button
                onClick={() => success('Batch Details', `Managing student list for ${b.name}`)}
                className="text-[#B85C45] font-bold hover:underline"
              >
                Manage Roster →
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AdminSubjectsPage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Subject Curriculum Catalog</h2>
          <p className="text-xs text-stone-500">
            Course codes, categories, syllabus modules, and grade mappings.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Subject Creator', 'Subject catalog configuration form ready.')}>
          Add New Subject
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSubjects.map((sub) => (
          <Card key={sub.id} variant="paper" hoverEffect className="p-6 border-[#EDE6D8] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="forest" size="sm">{sub.category}</Badge>
                <span className="font-mono text-xs font-bold text-stone-500">{sub.code}</span>
              </div>
              <h4 className="text-lg font-serif font-bold text-[#173F35] mb-2">{sub.name}</h4>
              <div className="p-3 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] space-y-1 text-xs text-stone-600">
                <span className="text-[10px] font-bold text-stone-400 uppercase block">Grades Applicable:</span>
                <p className="text-[11px] leading-relaxed">{sub.classesApplicable.join(', ')}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-xs text-stone-500">
              <span>Standard Curriculum</span>
              <span className="text-[#2E6B57] font-bold">Active</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
