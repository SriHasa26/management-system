import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { publicNavItems } from '../../config/navigation';
import { Button } from '../common/Button';
import { Menu, X, Shield, Users, User, ArrowUpRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const PublicNavbar: React.FC = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 glass-nav shadow-soft'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#173F35] to-[#2E6B57] flex items-center justify-center text-[#F7F3EA] shadow-sm border border-[#C99A3D]/40 transition-transform group-hover:scale-105">
              <GraduationCap className="w-6 h-6 text-[#C99A3D]" />
            </div>
            <div>
              <span className="text-xl font-serif font-black tracking-tight text-[#173F35] block leading-none">
                SRI SAI
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B85C45] block mt-0.5">
                Tuition & Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#FFFDF8]/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#173F35]/10 shadow-sm">
            {publicNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#173F35] text-[#FFFDF8]'
                      : 'text-stone-700 hover:text-[#173F35] hover:bg-[#F7F3EA]'
                  }`}
                >
                  {item.title}
                </Link>
              );
            })}
          </nav>

          {/* Portal Access CTA Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login/student">
              <Button size="sm" variant="outline" className="border-[#173F35]/25 text-[#173F35] hover:bg-[#173F35] hover:text-white" icon={<User className="w-3.5 h-3.5" />}>
                Student
              </Button>
            </Link>

            <Link to="/login/parent">
              <Button size="sm" variant="outline" className="border-[#B85C45]/30 text-[#B85C45] hover:bg-[#B85C45] hover:text-white" icon={<Users className="w-3.5 h-3.5" />}>
                Parent
              </Button>
            </Link>

            <Link to="/login/admin">
              <Button size="sm" variant="primary" icon={<Shield className="w-3.5 h-3.5 text-[#C99A3D]" />}>
                Admin
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <Link to="/login">
              <Button size="sm" variant="accent" className="text-xs px-2.5 py-1">
                Portals
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#FFFDF8] border border-[#E6DDCF] text-[#173F35] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-nav border-b border-[#E6DDCF] overflow-hidden"
          >
            <div className="px-5 pt-3 pb-6 space-y-3">
              <div className="space-y-1 border-b border-stone-200 pb-3">
                {publicNavItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center justify-between py-2 text-sm font-semibold text-stone-800 hover:text-[#173F35]"
                  >
                    <span>{item.title}</span>
                    <ArrowUpRight className="w-4 h-4 text-stone-400" />
                  </Link>
                ))}
              </div>

              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#B85C45]">
                  Select Portal Login
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <Link to="/login/student" className="w-full">
                    <Button size="sm" variant="outline" className="w-full text-xs py-2 px-1">
                      Student
                    </Button>
                  </Link>
                  <Link to="/login/parent" className="w-full">
                    <Button size="sm" variant="outline" className="w-full text-xs py-2 px-1">
                      Parent
                    </Button>
                  </Link>
                  <Link to="/login/admin" className="w-full">
                    <Button size="sm" variant="primary" className="w-full text-xs py-2 px-1">
                      Admin
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
