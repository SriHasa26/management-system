import React from 'react';
import { Student } from '../../types';
import { Badge } from '../common/Badge';
import { QrCode, ShieldCheck, Award } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface StudentIdCardProps {
  student: Student;
  className?: string;
}

export const StudentIdCard: React.FC<StudentIdCardProps> = ({ student, className }) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden border border-[#D9BC80]/40 shadow-card bg-gradient-to-br from-[#FFFDF8] via-[#FDFBF7] to-[#F5EFE3] p-6 text-left",
        "border-l-[6px] border-l-[#C99A3D]",
        className
      )}
    >
      {/* Background seal water-mark */}
      <div className="absolute right-3 top-3 opacity-5 pointer-events-none">
        <Award className="w-36 h-36 text-[#173F35]" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E6DDCF] pb-3 mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#B85C45]">
            Official Student ID
          </span>
          <h4 className="text-lg font-serif font-black text-[#173F35] tracking-tight">SRI SAI</h4>
          <p className="text-[10px] text-stone-500">Tuition & Learning Centre</p>
        </div>
        <Badge variant="gold" size="sm" className="font-bold">
          2026-27
        </Badge>
      </div>

      {/* Main Student Profile row */}
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={student.photoUrl}
            alt={student.name}
            className="w-20 h-20 rounded-xl object-cover border-2 border-[#C99A3D] shadow-sm bg-stone-200"
          />
          <div className="absolute -bottom-2 -right-1 p-1 rounded-full bg-[#173F35] text-[#C99A3D] border border-white">
            <ShieldCheck className="w-3 h-3" />
          </div>
        </div>

        <div className="flex-1 min-w-0 space-y-1">
          <h5 className="text-base font-bold text-[#173F35] truncate">{student.name}</h5>
          
          <div className="inline-block font-mono text-xs font-bold text-[#B85C45] bg-[#FAF2F0] px-2 py-0.5 rounded border border-[#E8C1B7]">
            ID: {student.id}
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[11px] text-stone-600">
            <div>
              <span className="text-stone-400">Class:</span> <span className="font-semibold text-stone-800">{student.grade}</span>
            </div>
            <div>
              <span className="text-stone-400">Board:</span> <span className="font-semibold text-stone-800">{student.board}</span>
            </div>
            <div className="col-span-2 truncate">
              <span className="text-stone-400">Batch:</span> <span className="font-medium text-stone-700">{student.batchName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="flex items-center justify-between border-t border-[#E6DDCF] pt-3 mt-4 text-[11px] text-stone-500">
        <div>
          <span>Roll No: </span>
          <span className="font-bold text-stone-800">{student.rollNumber}</span>
        </div>
        
        <div className="flex items-center gap-1.5 text-stone-600 bg-white/70 px-2 py-1 rounded-md border border-stone-200/80">
          <QrCode className="w-3.5 h-3.5 text-[#173F35]" />
          <span className="text-[10px] font-mono">VERIFIED</span>
        </div>
      </div>
    </div>
  );
};
