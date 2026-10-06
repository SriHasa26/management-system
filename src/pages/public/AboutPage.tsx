import React from 'react';
import { AboutSection } from '../../components/landing/AboutSection';
import { WhySection } from '../../components/landing/WhySection';
import { TrustStrip } from '../../components/landing/TrustStrip';
import { SectionHeading } from '../../components/common/SectionHeading';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <SectionHeading
          badge="Our Heritage & Vision"
          badgeVariant="forest"
          title="Empowering Student Potential Since Day One"
          subtitle="At SRI SAI Tuition & Learning Centre, we combine traditional discipline with modern pedagogical clarity."
        />
      </div>

      <TrustStrip />
      <AboutSection />
      <WhySection />
    </div>
  );
};

