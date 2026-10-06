import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { motion } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
} from 'lucide-react';
import Threads from '../common/Threads';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
      {/* Dynamic WebGL Threads Background */}
      <div className="absolute inset-0 w-full h-full opacity-40 pointer-events-auto">
        <Threads
          color={[0.79, 0.60, 0.24]}
          amplitude={1.2}
          distance={0}
          enableMouseInteraction
        />
      </div>

      {/* Subtle organic background decoration */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-[#C99A3D]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-[#2E6B57]/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFDF8] border border-[#EDE6D8] shadow-sm">
              <Sparkles className="w-4 h-4 text-[#C99A3D]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#173F35]">
                Admissions Open for Academic Year 2026-27
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-[#173F35] leading-[1.1]">
              Where Curiosity Becomes <span className="text-[#B85C45] italic">Confidence</span>.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed font-normal">
              Personalised learning and focused academic support for students from <strong>LKG to Intermediate</strong>. Strong conceptual fundamentals, small-batch mentoring, and regular diagnostic assessments.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a href="#programs">
                <Button size="lg" variant="primary" iconRight={<ArrowRight className="w-4 h-4" />}>
                  Explore SRI SAI
                </Button>
              </a>

              <Link to="/login/student">
                <Button size="lg" variant="glass" icon={<GraduationCap className="w-4 h-4 text-[#C99A3D]" />}>
                  Student Login
                </Button>
              </Link>
            </div>

            {/* Micro Highlights Pill */}
            <div className="pt-6 border-t border-[#E6DDCF]/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-stone-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B57]" />
                <span className="font-semibold text-[#173F35]">CBSE & State Boards</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B57]" />
                <span className="font-semibold text-[#173F35]">Strict Batch Caps</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2E6B57]" />
                <span className="font-semibold text-[#173F35]">Weekly Diagnostics</span>
              </div>
            </div>
          </motion.div>

          {/* Right Layered Visual Composition (Editorial & Layered Cards) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Primary Anchor Card */}
              <div className="rounded-3xl bg-gradient-to-br from-[#173F35] to-[#235746] p-7 text-[#FFFDF8] shadow-elevated border-2 border-[#C99A3D]/40 text-left relative overflow-hidden">
                <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
                  <BookOpen className="w-56 h-56 text-[#FFFDF8]" />
                </div>

                <div className="flex items-center justify-between mb-6">
                  <Badge variant="gold" size="sm" className="font-bold">
                    Classroom Excellence
                  </Badge>
                  <span className="text-xs text-stone-300 font-mono">EST. ACADEMIC HUB</span>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                  Focused Academic Mentorship
                </h3>
                <p className="text-xs text-stone-200 leading-relaxed mb-6">
                  Structured learning environment prioritizing conceptual clarity over rote memorization across mathematics, sciences, and languages.
                </p>

                {/* Progress bar simulation */}
                <div className="p-3.5 rounded-2xl bg-[#0E2822]/60 border border-[#2E6B57] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-300">Weekly Concept Mastery</span>
                    <span className="text-[#C99A3D] font-bold">96.4%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#173F35] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C99A3D] to-[#B85C45] w-[96%]" />
                  </div>
                </div>
              </div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-4 sm:-right-6 glass-panel p-3.5 rounded-2xl shadow-card flex items-center gap-3 border border-[#173F35]/15 text-left"
              >
                <div className="p-2 rounded-xl bg-[#173F35] text-[#C99A3D]">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#173F35]">Mrs. Telu Dhana Lakshmi</p>
                  <p className="text-[10px] text-stone-500">M.Sc, B.Ed · 10+ Years Faculty</p>
                </div>
              </motion.div>

              {/* Floating Card 2: Regular Assessments */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-6 -left-4 sm:-left-6 glass-panel p-3.5 rounded-2xl shadow-card flex items-center gap-3 border border-[#173F35]/15 text-left"
              >
                <div className="p-2 rounded-xl bg-[#B85C45] text-white">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#173F35]">Regular Assessments</p>
                  <p className="text-[10px] text-stone-500">Weekly & Chapter Metrics</p>
                </div>
              </motion.div>

              {/* Floating Card 3: Personal Attention */}
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -right-6 hidden sm:flex glass-panel p-3 rounded-xl shadow-soft items-center gap-2 border border-[#C99A3D]/40 text-left"
              >
                <ShieldCheck className="w-4 h-4 text-[#2E6B57]" />
                <span className="text-[11px] font-bold text-[#173F35]">Personal Attention</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
