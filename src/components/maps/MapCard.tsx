import React from 'react';
import { locationConfig } from '../../config/location';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MapPin, Navigation, Clock, Phone, Mail, ExternalLink } from 'lucide-react';

export interface MapCardProps {
  className?: string;
  showDetails?: boolean;
}

export const MapCard: React.FC<MapCardProps> = ({ className, showDetails = true }) => {
  const directionsUrl = locationConfig.googleMapsUrl;

  return (
    <Card variant="paper" className={`overflow-hidden p-0 border-[#EDE6D8] ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Map Embed / Styled Map Viewport */}
        <div className="lg:col-span-7 relative min-h-[340px] bg-[#E8DFCF] overflow-hidden">
          {/* Configurable Map iframe or styled blueprint placeholder */}
          <iframe
            title="SRI SAI Tuition Centre Location Map"
            src={locationConfig.googleMapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: '340px' }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[30%] contrast-[105%]"
          />

          {/* Floating Location Overlay Badge */}
          <div className="absolute top-4 left-4 glass-panel px-4 py-2.5 rounded-xl flex items-center gap-2.5 shadow-soft border border-[#173F35]/20 max-w-[90%]">
            <div className="p-1.5 rounded-lg bg-[#173F35] text-[#C99A3D]">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#173F35]">{locationConfig.name}</p>
              <p className="text-[11px] text-stone-600 truncate">{locationConfig.subtitle}</p>
            </div>
          </div>

          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4"
          >
            <Button size="sm" variant="accent" iconRight={<ExternalLink className="w-3.5 h-3.5" />}>
              Open in Google Maps
            </Button>
          </a>
        </div>

        {/* Location Details Column */}
        {showDetails && (
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-[#FFFDF8]">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#B85C45]">Campus & Centre</span>
                <h3 className="text-2xl font-serif font-bold text-[#173F35] mt-1">
                  {locationConfig.name}
                </h3>
                <p className="text-xs text-[#C99A3D] font-semibold">{locationConfig.subtitle}</p>
              </div>

              {/* Address details */}
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 text-stone-700">
                  <MapPin className="w-4 h-4 text-[#2E6B57] shrink-0 mt-1" />
                  <p className="text-xs leading-relaxed text-stone-600">
                    {locationConfig.address.formattedAddress}
                  </p>
                </div>

                <div className="flex items-start gap-3 text-stone-700">
                  <Clock className="w-4 h-4 text-[#2E6B57] shrink-0 mt-0.5" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-semibold text-[#173F35]">{locationConfig.workingHours.weekdays}</p>
                    <p className="text-stone-500">{locationConfig.workingHours.saturday}</p>
                    <p className="text-stone-500">{locationConfig.workingHours.sunday}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-stone-700">
                  <Phone className="w-4 h-4 text-[#2E6B57] shrink-0" />
                  <span className="text-xs font-medium text-stone-700">{locationConfig.contact.phone}</span>
                </div>

                <div className="flex items-center gap-3 text-stone-700">
                  <Mail className="w-4 h-4 text-[#2E6B57] shrink-0" />
                  <span className="text-xs font-medium text-stone-700">{locationConfig.contact.email}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#EDE6D8] flex items-center justify-between gap-3">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button variant="primary" size="md" className="w-full" icon={<Navigation className="w-4 h-4" />}>
                  Get Directions
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
