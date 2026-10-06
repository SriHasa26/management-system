import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { TopHeader } from '../components/layout/TopHeader';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { parentNavItems } from '../config/navigation';

export const ParentLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F7F3EA] text-[#202522]">
      {/* Desktop Sidebar */}
      <Sidebar
        items={parentNavItems}
        roleTitle="Parent Portal"
        roleBadgeColor="bg-[#B85C45] text-[#FFFDF8]"
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <TopHeader title="Parent Monitoring Portal" subtitle="Child Academic Tracking & Fee Management" />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav role="parent" />
    </div>
  );
};
