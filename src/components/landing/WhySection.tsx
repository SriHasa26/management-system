import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { siteConfig } from '../../config/site';
import { Card } from '../common/Card';
import {
  UserCheck,
  Users2,
  ClipboardCheck,
  Lightbulb,
  HelpCircle,
  MessageSquareHeart,
  FileText,
  TrendingUp,
} from 'lucide-react';

const iconResolver: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-6 h-6" />,
  Users2: <Users2 className="w-6 h-6" />,
  ClipboardCheck: <ClipboardCheck className="w-6 h-6" />,
  Lightbulb: <Lightbulb className="w-6 h-6" />,
  HelpCircle: <HelpCircle className="w-6 h-6" />,
  MessageSquareHeart: <MessageSquareHeart className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  TrendingUp: <TrendingUp className="w-6 h-6" />,
};

export const WhySection: React.FC = () => {
  return (
    <section id="why" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why SRI SAI"
          badgeVariant="gold"
          title="Designed for Deep Understanding"
          subtitle="Every element of our learning framework is optimized to turn confusion into genuine subject mastery."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {siteConfig.whyChooseUs.map((item, idx) => (
            <Card
              key={idx}
              variant="paper"
              hoverEffect
              className="p-6 border-[#EDE6D8] flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm ${item.color}`}>
                  {iconResolver[item.icon]}
                </div>
                <h4 className="text-lg font-serif font-bold text-[#173F35] mb-2">{item.title}</h4>
                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between text-[11px] text-stone-400 font-mono">
                <span>PILLAR {String(idx + 1).padStart(2, '0')}</span>
                <span className="text-[#2E6B57] font-bold">SRI SAI STANDARD</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
