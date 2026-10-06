import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { siteConfig } from '../../config/site';
import { locationConfig } from '../../config/location';
import { Card } from '../common/Card';
import {
  BookOpen,
  Users,
  CheckCircle2,
  Award,
  HeartHandshake,
  Sparkles,
  GraduationCap,
  Star,
  Building2,
  Phone,
} from 'lucide-react';

const iconLookup: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen className="w-5 h-5 text-[#2E6B57]" />,
  Users: <Users className="w-5 h-5 text-[#B85C45]" />,
  CheckCircle2: <CheckCircle2 className="w-5 h-5 text-[#C99A3D]" />,
  Award: <Award className="w-5 h-5 text-[#2E6B57]" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5 text-[#B85C45]" />,
  Sparkles: <Sparkles className="w-5 h-5 text-[#C99A3D]" />,
};

export const AboutSection: React.FC = () => {
  const { admin } = locationConfig;

  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Our Philosophy"
          badgeVariant="forest"
          title={siteConfig.philosophyHeadline}
          subtitle="Education that balances rigorous foundational academics with compassionate individual attention."
        />

        {/* Narrative editorial block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-12 text-left">
          <div className="lg:col-span-7 bg-[#FFFDF8] rounded-3xl p-8 sm:p-10 border border-[#EDE6D8] shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#B85C45]">
                The SRI SAI Vision
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#173F35] leading-snug">
                Nurturing inquisitive minds into confident achievers.
              </h3>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {siteConfig.about.story}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EDE6D8] grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#173F35]">100%</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Concept-First Focus</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#B85C45]">1:15</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Max Teacher Ratio</p>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-serif font-bold text-[#C99A3D]">Weekly</span>
                <p className="text-[11px] text-stone-500 mt-0.5">Diagnostic Reviews</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-gradient-to-br from-[#173F35] to-[#235746] rounded-3xl p-8 sm:p-10 text-[#FFFDF8] shadow-card flex flex-col justify-between border-2 border-[#C99A3D]/30">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">
                Our Commitment to Parents
              </span>
              <h4 className="text-xl sm:text-2xl font-serif font-bold text-white leading-snug">
                Complete transparency in your child's growth.
              </h4>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                Parents are our partners. Our dedicated portal provides full visibility into daily attendance, homework submissions, chapter test results, and direct teacher dialogue.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E2822]/80 border border-[#2E6B57] text-xs text-stone-300 italic">
              "When parents and educators collaborate seamlessly, students thrive with absolute confidence."
            </div>
          </div>
        </div>

        {/* Founder/Head Faculty Spotlight */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-[#FAF6EE] to-[#F0E8D8] rounded-3xl border border-[#E6D3AC]/60 shadow-card overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left accent block */}
              <div className="lg:col-span-4 bg-gradient-to-br from-[#173F35] to-[#0E2822] p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  {/* Avatar placeholder with initials */}
                  <div className="w-20 h-20 rounded-2xl bg-[#C99A3D]/20 border-2 border-[#C99A3D]/50 flex items-center justify-center mb-6">
                    <span className="text-2xl font-serif font-bold text-[#C99A3D]">TDL</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C99A3D]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#C99A3D]">Founder & Head Faculty</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-white leading-tight">
                      {admin.name}
                    </h3>
                    <p className="text-sm text-[#C99A3D] font-semibold">{admin.qualifications}</p>
                  </div>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Star className="w-4 h-4 text-[#C99A3D] fill-[#C99A3D]" />
                    <span className="text-xs text-stone-200 font-medium">{admin.experience} Teaching Excellence</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award className="w-4 h-4 text-[#C99A3D]" />
                    <span className="text-xs text-stone-200 font-medium">{admin.awards[0]}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#C99A3D]" />
                    <a href={`tel:${admin.phone.replace(/\s/g, '')}`} className="text-xs text-stone-200 font-medium hover:text-[#C99A3D] transition-colors">
                      {admin.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Right content block */}
              <div className="lg:col-span-8 p-8 sm:p-10 flex flex-col justify-between">
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#B85C45]">Meet Our Educator</span>
                    <h4 className="text-xl sm:text-2xl font-serif font-bold text-[#173F35] mt-2 leading-snug">
                      Mathematics specialist with a passion for transforming how students learn.
                    </h4>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {admin.bio}
                  </p>

                  {/* Institutions */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-3">Previously at</p>
                    <div className="flex flex-wrap gap-2">
                      {admin.previousInstitutions.map((inst, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 bg-white border border-[#EDE6D8] rounded-lg px-3 py-1.5 shadow-sm">
                          <Building2 className="w-3.5 h-3.5 text-[#2E6B57] shrink-0" />
                          <span className="text-xs font-semibold text-stone-700">{inst}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EDE6D8]">
                  <p className="text-[#173F35] font-serif text-base italic font-medium">
                    "Every student has unlimited potential. My role is simply to reveal it."
                  </p>
                  <p className="text-xs text-stone-400 mt-1">— {admin.name}, {admin.qualifications}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {siteConfig.about.pillars.map((pillar, idx) => (
            <Card key={idx} variant="paper" hoverEffect className="p-6 border-[#EDE6D8]">
              <div className="w-10 h-10 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF] flex items-center justify-center mb-4">
                {iconLookup[pillar.icon] || <Sparkles className="w-5 h-5 text-[#2E6B57]" />}
              </div>
              <h4 className="text-base font-serif font-bold text-[#173F35] mb-2">{pillar.title}</h4>
              <p className="text-xs text-stone-600 leading-relaxed">{pillar.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
