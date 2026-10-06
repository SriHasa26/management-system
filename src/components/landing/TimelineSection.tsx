import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { siteConfig } from '../../config/site';
import { motion } from 'framer-motion';

export const TimelineSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-[#FFFDF8] via-[#F7F3EA] to-[#FFFDF8] border-y border-[#EDE6D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Learning Methodology"
          badgeVariant="forest"
          title="The 6-Stage SRI SAI Growth Cycle"
          subtitle="A methodical framework converting textbook concepts into permanent retention and exam poise."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {siteConfig.learningJourney.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative p-7 rounded-3xl bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-serif font-black text-[#C99A3D]/40">
                  {step.step}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B85C45] bg-[#FAF2F0] px-2.5 py-1 rounded-full">
                  Stage {idx + 1}
                </span>
              </div>

              <h4 className="text-xl font-serif font-bold text-[#173F35] mb-1">{step.title}</h4>
              <p className="text-xs font-bold text-[#C99A3D] mb-3">{step.subtitle}</p>
              <p className="text-xs text-stone-600 leading-relaxed">{step.description}</p>

              <div className="mt-6 pt-4 border-t border-[#EDE6D8] flex items-center justify-between text-[11px] text-stone-400">
                <span>Phase Outcome</span>
                <span className="text-[#2E6B57] font-semibold">Verified Mastery</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
