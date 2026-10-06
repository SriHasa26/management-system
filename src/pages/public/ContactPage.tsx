import React from 'react';
import { LocationSection } from '../../components/landing/LocationSection';
import { EnquirySection } from '../../components/landing/EnquirySection';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-6">
      <LocationSection />
      <EnquirySection />
    </div>
  );
};
