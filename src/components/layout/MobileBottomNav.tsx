import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  ClipboardList,
  CalendarCheck,
  User,
  TrendingUp,
  CreditCard,
  Users,
  Menu,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface MobileBottomNavProps {
  role: 'student' | 'parent' | 'admin';
  onOpenDrawer?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ role, onOpenDrawer }) => {
  const getNavItems = () => {
    switch (role) {
      case 'student':
        return [
          { title: 'Home', href: '/student', icon: LayoutDashboard, exact: true },
          { title: 'Materials', href: '/student/materials', icon: BookOpen },
          { title: 'Tests', href: '/student/tests', icon: ClipboardList },
          { title: 'Attendance', href: '/student/attendance', icon: CalendarCheck },
          { title: 'Profile', href: '/student/profile', icon: User },
        ];
      case 'parent':
        return [
          { title: 'Home', href: '/parent', icon: LayoutDashboard, exact: true },
          { title: 'Attendance', href: '/parent/attendance', icon: CalendarCheck },
          { title: 'Performance', href: '/parent/performance', icon: TrendingUp },
          { title: 'Fees', href: '/parent/fees', icon: CreditCard },
          { title: 'Profile', href: '/parent/profile', icon: User },
        ];
      case 'admin':
        return [
          { title: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
          { title: 'Students', href: '/admin/students', icon: Users },
          { title: 'Attendance', href: '/admin/attendance', icon: CalendarCheck },
        ];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 backdrop-blur-lg border-t border-[#EDE6D8] px-2 py-1.5 shadow-elevated">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold transition-colors min-w-[54px]",
                  isActive ? "text-[#173F35]" : "text-stone-400 hover:text-stone-700"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      "p-1 rounded-lg transition-transform",
                      isActive ? "bg-[#173F35] text-[#C99A3D] scale-105 shadow-sm" : "bg-transparent text-current"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="mt-0.5">{item.title}</span>
                </>
              )}
            </NavLink>
          );
        })}

        {/* More/Menu Drawer button for Admin or comprehensive access */}
        {role === 'admin' && onOpenDrawer && (
          <button
            onClick={onOpenDrawer}
            className="flex flex-col items-center justify-center py-1 px-2 rounded-xl text-[10px] font-bold text-stone-400 hover:text-stone-700 min-w-[54px]"
          >
            <div className="p-1 rounded-lg bg-stone-100 text-stone-600">
              <Menu className="w-4 h-4" />
            </div>
            <span className="mt-0.5">More</span>
          </button>
        )}
      </div>
    </nav>
  );
};
