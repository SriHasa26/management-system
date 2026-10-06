import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { StudentIdCard } from '../../components/cards/StudentIdCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { formatDate } from '../../lib/utils';
import { User, Phone, Mail, MapPin, Calendar, BookOpen, ShieldCheck } from 'lucide-react';

export const StudentProfilePage: React.FC = () => {
  const { currentStudent } = useAuth();

  return (
    <div className="space-y-8 text-left max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-serif font-bold text-[#173F35]">Student Academic Profile</h2>
        <p className="text-xs text-stone-500">
          Official enrollment credentials, batch allocations, and parent guardian details.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5">
          <StudentIdCard student={currentStudent} />
        </div>

        <Card variant="paper" className="md:col-span-7 p-6 sm:p-8 border-[#EDE6D8] space-y-6">
          <div>
            <h4 className="text-base font-serif font-bold text-[#173F35] border-b border-[#EDE6D8] pb-2 mb-4">
              Academic & Registration Details
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block">Full Legal Name:</span>
                <span className="font-bold text-stone-800">{currentStudent.name}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Date of Birth:</span>
                <span className="font-bold text-stone-800">{formatDate(currentStudent.dob)}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Class & Stream:</span>
                <span className="font-bold text-stone-800">{currentStudent.grade}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Board Curriculum:</span>
                <span className="font-bold text-[#B85C45]">{currentStudent.board}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Batch Allocation:</span>
                <span className="font-semibold text-stone-700">{currentStudent.batchName}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Admission Date:</span>
                <span className="font-semibold text-stone-700">{formatDate(currentStudent.admissionDate)}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-base font-serif font-bold text-[#173F35] border-b border-[#EDE6D8] pb-2 mb-4">
              Parent & Guardian Contact Info
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-[#2E6B57]" />
                <div>
                  <span className="text-stone-400">Primary Contact: </span>
                  <strong className="text-stone-800">{currentStudent.parentName}</strong> ({currentStudent.parentRelation})
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#2E6B57]" />
                <div>
                  <span className="text-stone-400">Guardian Phone: </span>
                  <strong className="text-stone-800 font-mono">{currentStudent.parentPhone}</strong>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#2E6B57]" />
                <div>
                  <span className="text-stone-400">Guardian Email: </span>
                  <strong className="text-stone-800 font-mono">{currentStudent.parentEmail}</strong>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#2E6B57] shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-400">Residential Address: </span>
                  <span className="text-stone-700">{currentStudent.address}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
