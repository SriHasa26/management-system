import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicNavbar } from '../components/navigation/PublicNavbar';
import { PublicFooter } from '../components/navigation/PublicFooter';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EA] text-[#202522] selection:bg-[#B85C45] selection:text-white">
      <PublicNavbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};
