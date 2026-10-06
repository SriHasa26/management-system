import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { adminNavSections } from '../config/navigation';
import { Modal } from '../components/common/Modal';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export const AdminLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F3EA] text-[#202522]">
      {/* Desktop Sidebar */}
      <Sidebar
        sections={adminNavSections}
        roleTitle="Admin Center"
        roleBadgeColor="bg-[#C99A3D] text-[#173F35]"
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopHeader
          title="Administrative Command"
          subtitle="Real-time operations, attendance, admissions, & fees"
          onOpenMobileMenu={() => setMobileDrawerOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="admin" onOpenDrawer={() => setMobileDrawerOpen(true)} />

      {/* Admin Mobile Navigation Full Drawer Modal */}
      <Modal
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        title="Admin Navigation Directory"
        subtitle="Access all 20+ administrative modules"
        maxWidth="lg"
      >
        <div className="space-y-6">
          {adminNavSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-[#B85C45] border-b border-stone-200 pb-1">
                {section.title}
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {section.items.map((item) => (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "p-2.5 rounded-xl text-xs font-medium flex items-center justify-between border transition-colors",
                        isActive
                          ? "bg-[#173F35] text-white border-[#173F35]"
                          : "bg-[#F7F3EA] text-stone-700 border-[#E6DDCF] hover:bg-[#EAE4D5]"
                      )
                    }
                  >
                    <span className="truncate">{item.title}</span>
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#B85C45] text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
