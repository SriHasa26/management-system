import React from 'react';
import { mockSubjects } from '../../data/mockClasses';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Plus } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

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
