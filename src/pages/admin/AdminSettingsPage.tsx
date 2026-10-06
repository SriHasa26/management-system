import React, { useState } from 'react';
import { locationConfig } from '../../config/location';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { MapCard } from '../../components/maps/MapCard';
import { useToast } from '../../hooks/useToast';
import { Save, MapPin, Building, ShieldCheck } from 'lucide-react';

import { SupabaseStatusBadge } from '../../components/common/SupabaseStatusBadge';

export const AdminSettingsPage: React.FC = () => {
  const { success } = useToast();
  const [configState, setConfigState] = useState(locationConfig);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    success('Centre Settings Saved', 'Configured physical address, phone, and coordinates saved.');
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Centre Operational Settings</h2>
          <p className="text-xs text-stone-500">
            Configure physical address, Google Maps parameters, phone numbers, and backend database sync.
          </p>
        </div>
        <SupabaseStatusBadge />
      </div>

      <SupabaseStatusBadge showDetails={true} />

      <form onSubmit={handleSave} className="space-y-8">
        <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EDE6D8] pb-3">
            <Building className="w-5 h-5 text-[#2E6B57]" />
            <h3 className="text-base font-serif font-bold text-[#173F35]">Brand & Identity</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Centre Brand Name"
              value={configState.name}
              onChange={(e) => setConfigState({ ...configState, name: e.target.value })}
            />
            <Input
              label="Subtitle"
              value={configState.subtitle}
              onChange={(e) => setConfigState({ ...configState, subtitle: e.target.value })}
            />
            <div className="sm:col-span-2">
              <Input
                label="Official Tagline"
                value={configState.tagline}
                onChange={(e) => setConfigState({ ...configState, tagline: e.target.value })}
              />
            </div>
          </div>
        </Card>

        <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EDE6D8] pb-3">
            <MapPin className="w-5 h-5 text-[#B85C45]" />
            <h3 className="text-base font-serif font-bold text-[#173F35]">Location & Map Integration</h3>
          </div>

          <div className="space-y-4">
            <Input
              label="Formatted Full Address (Display on Website & Footers)"
              value={configState.address.formattedAddress}
              onChange={(e) =>
                setConfigState({
                  ...configState,
                  address: { ...configState.address, formattedAddress: e.target.value },
                })
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="City / Regional Hub"
                value={configState.address.city}
                onChange={(e) =>
                  setConfigState({
                    ...configState,
                    address: { ...configState.address, city: e.target.value },
                  })
                }
              />
              <Input
                label="State / Region"
                value={configState.address.state}
                onChange={(e) =>
                  setConfigState({
                    ...configState,
                    address: { ...configState.address, state: e.target.value },
                  })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Google Maps Direct Link"
                value={configState.googleMapsUrl}
                onChange={(e) => setConfigState({ ...configState, googleMapsUrl: e.target.value })}
                helperText="Used for 'Get Directions' link button"
              />
              <Input
                label="Latitude / Longitude (Coordinates)"
                value={`${configState.coordinates.latitude}, ${configState.coordinates.longitude}`}
                disabled
                helperText="Exact geo-pin configuration"
              />
            </div>
          </div>
        </Card>

        <Card variant="paper" className="p-6 sm:p-8 border-[#EDE6D8] space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EDE6D8] pb-3">
            <ShieldCheck className="w-5 h-5 text-[#C99A3D]" />
            <h3 className="text-base font-serif font-bold text-[#173F35]">Contact & Office Timing</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Phone Number"
              value={configState.contact.phone}
              onChange={(e) =>
                setConfigState({
                  ...configState,
                  contact: { ...configState.contact, phone: e.target.value },
                })
              }
            />
            <Input
              label="Admissions Email"
              value={configState.contact.email}
              onChange={(e) =>
                setConfigState({
                  ...configState,
                  contact: { ...configState.contact, email: e.target.value },
                })
              }
            />
            <div className="sm:col-span-2">
              <Input
                label="Weekday Working Hours"
                value={configState.workingHours.weekdays}
                onChange={(e) =>
                  setConfigState({
                    ...configState,
                    workingHours: { ...configState.workingHours, weekdays: e.target.value },
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#EDE6D8]">
            <Button type="submit" variant="primary" size="lg" icon={<Save className="w-4 h-4" />}>
              Save Centre Configurations
            </Button>
          </div>
        </Card>
      </form>

      {/* Live Map Preview */}
      <div className="space-y-3">
        <h4 className="text-base font-serif font-bold text-[#173F35]">Live Map Component Preview</h4>
        <MapCard />
      </div>
    </div>
  );
};
