import React, { useState } from 'react';
import { mockMaterials } from '../../data/mockMaterials';
import { MaterialCard } from '../../components/cards/MaterialCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, Filter, BookOpen } from 'lucide-react';

export const StudentMaterialsPage: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English'];
  const types = ['All', 'pdf', 'notes', 'video', 'question_paper'];

  const filteredMaterials = mockMaterials.filter((m) => {
    const matchesSubject = selectedSubject === 'All' || m.subject === selectedSubject;
    const matchesType = selectedType === 'All' || m.fileType === selectedType;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Study Materials Repository</h2>
          <p className="text-xs text-stone-500">
            Download verified notes, chapter formulas, video solutions, and previous year board papers.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by topic, chapter, formula..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-[#F7F3EA] border border-[#E6DDCF] focus:outline-none focus:border-[#173F35]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Subject selector */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
          >
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All Subjects' : s}
              </option>
            ))}
          </select>

          {/* Type selector */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#F7F3EA] border border-[#E6DDCF] text-[#173F35] focus:outline-none uppercase"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All File Formats' : t.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Material Grid */}
      {filteredMaterials.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No Study Materials Found"
          description="Try clearing your search query or switching subject filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedSubject('All');
            setSelectedType('All');
            setSearchQuery('');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      )}
    </div>
  );
};
