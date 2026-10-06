import React, { useState } from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { siteConfig } from '../../config/site';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, BookOpen } from 'lucide-react';

export const ProgramsSection: React.FC = () => {
  const [selectedBoard, setSelectedBoard] = useState<'All' | 'CBSE' | 'State Board'>('All');

  const filteredPrograms = siteConfig.programs.filter((p) => {
    if (selectedBoard === 'All') return true;
    return p.boards.includes(selectedBoard as any);
  });

  return (
    <section id="programs" className="py-20 md:py-28 bg-[#FFFDF8] border-y border-[#EDE6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Academic Offerings"
          badgeVariant="terracotta"
          title="Structured Programs for Every Grade"
          subtitle="From foundational early learning to rigorous board preparation for High School and Intermediate."
        />

        {/* Board Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {(['All', 'CBSE', 'State Board'] as const).map((board) => (
            <button
              key={board}
              onClick={() => setSelectedBoard(board)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${
                selectedBoard === board
                  ? 'bg-[#173F35] text-white shadow-sm'
                  : 'bg-[#F7F3EA] text-stone-600 hover:bg-[#EAE4D5]'
              }`}
            >
              {board === 'All' ? 'All Boards & Stages' : `${board} Curriculum`}
            </button>
          ))}
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              className={`rounded-3xl p-7 bg-gradient-to-b ${program.color} border ${program.border} shadow-soft hover:shadow-elevated transition-all duration-300 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#B85C45]">
                      {program.grades}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#173F35] mt-0.5">
                      {program.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-1 justify-end">
                    {program.boards.map((b) => (
                      <Badge key={b} variant="forest" size="sm" className="font-bold">
                        {b}
                      </Badge>
                    ))}
                  </div>
                </div>

                <p className="text-xs font-semibold text-[#C99A3D] mb-3">{program.tag}</p>
                <p className="text-xs text-stone-600 leading-relaxed mb-5">{program.description}</p>

                {/* Key Features */}
                <div className="space-y-2 py-4 border-t border-[#173F35]/10">
                  <p className="text-[11px] font-bold text-[#173F35] uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2E6B57]" /> Key Focus Areas:
                  </p>
                  <ul className="space-y-1.5">
                    {program.features.map((feat, fIdx) => (
                      <li key={fIdx} className="text-xs text-stone-700 flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-[#2E6B57] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#173F35]/10 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-medium">Batch size: max 15-20</span>
                <Link to="/admissions">
                  <Button size="sm" variant="primary" iconRight={<ArrowRight className="w-3.5 h-3.5" />}>
                    Enquire
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
