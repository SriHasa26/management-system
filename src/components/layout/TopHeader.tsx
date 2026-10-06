import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockStudents } from '../../data/mockStudents';
import { NotificationDropdown } from './NotificationDropdown';
import { Users, Search, Sparkles } from 'lucide-react';

import { SupabaseStatusBadge } from '../common/SupabaseStatusBadge';

export interface TopHeaderProps {
  title?: string;
  subtitle?: string;
  onOpenMobileMenu?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title, subtitle, onOpenMobileMenu }) => {
  const { user, currentStudent, selectedChildId, setSelectedChildId, role } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  // Sibling children for Parent Portal switching demonstration
  const parentChildren = mockStudents.filter((s) => s.id === 'SRI-2026-001' || s.id === 'SRI-2026-005');

  return (
    <header className="sticky top-0 z-20 bg-[#FFFDF8]/90 backdrop-blur-md border-b border-[#EDE6D8] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Page Title or Search */}
      <div className="flex items-center gap-3 min-w-0">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl bg-[#F7F3EA] text-[#173F35] border border-[#E6DDCF]"
            aria-label="Open Navigation"
          >
            <span className="text-xs font-bold font-serif">SRI SAI</span>
          </button>
        )}

        <div className="text-left">
          {title ? (
            <div>
              <h1 className="text-lg font-serif font-bold text-[#173F35] truncate leading-tight">
                {title}
              </h1>
              {subtitle && <p className="text-[11px] text-stone-500 truncate">{subtitle}</p>}
            </div>
          ) : (
            <div className="relative hidden sm:block w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search notes, tests, results..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-[#F7F3EA] border border-[#E6DDCF] focus:outline-none focus:border-[#173F35]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Status Badge, Child Switcher (Parent), Notifications, User Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden sm:block">
          <SupabaseStatusBadge />
        </div>
        {/* If Parent Role: Child Selector Dropdown */}
        {role === 'parent' && (
          <div className="flex items-center gap-1.5 bg-[#FAF2F0] border border-[#E8C1B7] px-2.5 py-1 rounded-xl">
            <Users className="w-3.5 h-3.5 text-[#B85C45]" />
            <span className="text-[11px] font-bold text-[#B85C45] hidden sm:inline">Viewing Child:</span>
            <select
              value={selectedChildId}
              onChange={(e) => setSelectedChildId(e.target.value)}
              aria-label="Select student"
              className="text-xs font-bold bg-transparent text-[#173F35] focus:outline-none cursor-pointer"
            >
              {parentChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.name} ({child.grade})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Notification Bell with Dropdown */}
        <NotificationDropdown />

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-[#EDE6D8]">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-[#C99A3D] bg-[#173F35] text-[#C99A3D] flex items-center justify-center font-bold text-xs">
            {role === 'student' && currentStudent.photoUrl ? (
              <img src={currentStudent.photoUrl} alt={currentStudent.name} className="w-full h-full object-cover" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
          </div>

          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-[#173F35] leading-tight">
              {role === 'student' ? currentStudent.name : user?.name || 'User'}
            </p>
            <p className="text-[10px] text-stone-500 font-mono">
              {role === 'student' ? currentStudent.id : role === 'admin' ? 'M.Sc, B.Ed · Head Faculty' : 'Guardian Account'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
