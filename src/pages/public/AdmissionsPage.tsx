import React from 'react';
import { EnquirySection } from '../../components/landing/EnquirySection';
import { TrustStrip } from '../../components/landing/TrustStrip';
import { LocationSection } from '../../components/landing/LocationSection';

export const AdmissionsPage: React.FC = () => {
  return (
    <div className="py-6">
      <EnquirySection />
      <TrustStrip />
      <LocationSection />
    </div>
  );
};
