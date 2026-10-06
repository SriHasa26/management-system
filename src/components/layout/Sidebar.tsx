import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { NavItem, NavSection } from '../../config/navigation';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  ClipboardList,
  CalendarCheck,
  TrendingUp,
  CreditCard,
  Clock,
  Bell,
  HelpCircle,
  User,
  Users,
  GraduationCap,
  Layers,
  Boxes,
  FolderArchive,
  FileCheck,
  Award,
  Receipt,
  MessageSquare,
  Calendar,
  Inbox,
  FileSpreadsheet,
  BarChart3,
  Image,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../lib/utils';

// Icon Map Resolver
const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  CalendarCheck: <CalendarCheck className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  CreditCard: <CreditCard className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Bell: <Bell className="w-4 h-4" />,
  HelpCircle: <HelpCircle className="w-4 h-4" />,
  User: <User className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  Boxes: <Boxes className="w-4 h-4" />,
  FolderArchive: <FolderArchive className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  Award: <Award className="w-4 h-4" />,
  Receipt: <Receipt className="w-4 h-4" />,
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
  Inbox: <Inbox className="w-4 h-4" />,
  FileSpreadsheet: <FileSpreadsheet className="w-4 h-4" />,
  BarChart3: <BarChart3 className="w-4 h-4" />,
  Image: <Image className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
};

export interface SidebarProps {
  items?: NavItem[];
  sections?: NavSection[];
  roleTitle: string;
  roleBadgeColor?: string;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  sections,
  roleTitle,
  roleBadgeColor = 'bg-[#173F35] text-[#FFFDF8]',
  collapsed,
  onToggleCollapse,
}) => {
  const { logout } = useAuth();

  const renderItem = (item: NavItem) => {
    return (
      <NavLink
        key={item.href}
        to={item.href}
        end={item.exact}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group relative",
            isActive
              ? "bg-[#173F35] text-[#FFFDF8] shadow-sm font-bold"
              : "text-stone-600 hover:bg-[#F0EAE1] hover:text-[#173F35]"
          )
        }
      >
        <span className="shrink-0 text-current">{item.icon ? iconMap[item.icon] : null}</span>
        {!collapsed && <span className="truncate flex-1 text-left">{item.title}</span>}
        {!collapsed && item.badge !== undefined && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#B85C45] text-white font-bold shrink-0">
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col justify-between bg-[#FFFDF8] border-r border-[#EDE6D8] h-screen sticky top-0 transition-all duration-300 z-30 shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div>
        <div className="p-4 border-b border-[#EDE6D8] flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center text-[#C99A3D] font-black shrink-0 border border-[#C99A3D]/40 shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="min-w-0 text-left">
                <span className="text-base font-serif font-black tracking-tight text-[#173F35] block truncate leading-none">
                  SRI SAI
                </span>
                <span className={cn("text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded mt-1 inline-block", roleBadgeColor)}>
                  {roleTitle}
                </span>
              </div>
            )}
          </Link>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-[#F7F3EA] transition-colors"
            aria-label="Toggle sidebar width"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {items && items.map(renderItem)}

          {sections &&
            sections.map((section, idx) => (
              <div key={idx} className="pt-3 first:pt-0">
                {!collapsed && (
                  <p className="px-3.5 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-[#B85C45] text-left">
                    {section.title}
                  </p>
                )}
                <div className="space-y-0.5">{section.items.map(renderItem)}</div>
              </div>
            ))}
        </div>
      </div>

      {/* Footer / Logout */}
      <div className="p-3 border-t border-[#EDE6D8] bg-[#F7F3EA]/60">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-[#B85C45] hover:bg-[#FAF2F0] transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
