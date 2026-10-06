import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, ShieldCheck, HeartHandshake } from 'lucide-react';
import { siteConfig } from '../config/site';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#F7F3EA] text-[#202522]">
      {/* Visual Editorial Left Panel */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#173F35] via-[#1B4638] to-[#0E2822] text-[#F7F3EA] p-12 flex-col justify-between relative overflow-hidden border-r-4 border-[#C99A3D]">
        {/* Abstract decorative graphic rings */}
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full border border-[#C99A3D]/20 pointer-events-none" />
        <div className="absolute -right-12 -top-12 w-96 h-96 rounded-full border border-[#C99A3D]/10 pointer-events-none" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 text-stone-300 hover:text-white transition-colors text-xs font-semibold mb-12">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Main Website</span>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2E6B57] flex items-center justify-center text-[#C99A3D] border border-[#C99A3D]/50 shadow-md">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <span className="text-2xl font-serif font-black tracking-tight text-white block">
                {siteConfig.name}
              </span>
              <span className="text-xs uppercase tracking-widest text-[#C99A3D] font-bold block">
                {siteConfig.subtitle}
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-serif font-bold text-white leading-tight mt-6">
            Where Curiosity Becomes Academic Excellence.
          </h2>
          <p className="text-stone-300 text-sm mt-3 leading-relaxed">
            Welcome to the official digital learning portal of SRI SAI. Secure access for students, parents, and faculty mentors.
          </p>
        </div>

        {/* Bottom trust pill */}
        <div className="relative z-10 space-y-3 pt-8 border-t border-[#2E6B57]/50">
          <div className="flex items-center gap-2 text-xs text-[#C99A3D] font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Role-Based Student Portal</span>
          </div>
          <p className="text-[11px] text-stone-400">
            {siteConfig.disclaimer}
          </p>
        </div>
      </div>

      {/* Main Form Content Right Area */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12 md:p-16">
        <div className="flex items-center justify-between lg:hidden mb-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#173F35] flex items-center justify-center text-[#C99A3D]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-serif font-bold text-[#173F35]">SRI SAI</span>
          </Link>
          <Link to="/" className="text-xs font-semibold text-[#B85C45] flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto my-auto py-6">
          <Outlet />
        </div>

        <div className="text-center text-xs text-stone-400 pt-6">
          <p>© {new Date().getFullYear()} SRI SAI Tuition & Learning Centre</p>
        </div>
      </div>
    </div>
  );
};
