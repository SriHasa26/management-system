import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import { MapCard } from '../maps/MapCard';

export const LocationSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Visit Our Learning Centre"
          badgeVariant="forest"
          title="Centrally Located for Focused Study"
          subtitle="A modern learning space designed with air-conditioned smart classrooms, a dedicated study library, and science demonstration labs."
        />

        <div className="max-w-5xl mx-auto">
          <MapCard />
        </div>
      </div>
    </section>
  );
};
