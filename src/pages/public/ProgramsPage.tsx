import React from 'react';
import { ProgramsSection } from '../../components/landing/ProgramsSection';
import { TimelineSection } from '../../components/landing/TimelineSection';
import { EnquirySection } from '../../components/landing/EnquirySection';

export const ProgramsPage: React.FC = () => {
  return (
    <div className="py-6">
      <ProgramsSection />
      <TimelineSection />
      <EnquirySection />
    </div>
  );
};
