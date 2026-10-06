import React from 'react';
import { siteConfig } from '../../config/site';

export const TrustStrip: React.FC = () => {
  return (
    <section className="bg-[#FFFDF8] border-y border-[#EDE6D8] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#EDE6D8]">
          {siteConfig.trustBadges.map((badge, idx) => (
            <div key={idx} className={`text-center px-4 ${idx > 0 ? 'pt-4 sm:pt-0' : ''}`}>
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#B85C45] block">
                {badge.label}
              </span>
              <p className="text-xl sm:text-2xl font-serif font-bold text-[#173F35] mt-1">
                {badge.value}
              </p>
              <p className="text-xs text-stone-500 mt-0.5">{badge.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
