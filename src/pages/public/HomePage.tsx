import React from 'react';
import { HeroSection } from '../../components/landing/HeroSection';
import { TrustStrip } from '../../components/landing/TrustStrip';
import { AboutSection } from '../../components/landing/AboutSection';
import { ProgramsSection } from '../../components/landing/ProgramsSection';
import { WhySection } from '../../components/landing/WhySection';
import { TimelineSection } from '../../components/landing/TimelineSection';
import { PerformanceSection } from '../../components/landing/PerformanceSection';
import { TestimonialsSection } from '../../components/landing/TestimonialsSection';
import { GallerySection } from '../../components/landing/GallerySection';
import { EnquirySection } from '../../components/landing/EnquirySection';
import { LocationSection } from '../../components/landing/LocationSection';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <TrustStrip />
      <AboutSection />
      <ProgramsSection />
      <WhySection />
      <TimelineSection />
      <PerformanceSection />
      <TestimonialsSection />
      <GallerySection />
      <EnquirySection />
      <LocationSection />
    </div>
  );
};
