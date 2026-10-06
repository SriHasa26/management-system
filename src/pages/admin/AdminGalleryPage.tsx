import React from 'react';
import { mockGalleryItems } from '../../data/mockTimetable';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdminGalleryPage: React.FC = () => {
  const { success } = useToast();

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#173F35]">Media & Photo Gallery Manager</h2>
          <p className="text-xs text-stone-500">
            Upload and manage classroom photos, science laboratory demonstrations, and celebrations.
          </p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => success('Photo Upload', 'Media uploader opened.')}>
          Upload Media Asset
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGalleryItems.map((item) => (
          <Card key={item.id} variant="paper" className="p-0 border-[#EDE6D8] overflow-hidden">
            <div className="aspect-[4/3] bg-stone-200">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="forest" size="sm">{item.category}</Badge>
                <span className="text-[10px] text-stone-400">{item.date}</span>
              </div>
              <h4 className="text-sm font-bold text-[#173F35] truncate">{item.title}</h4>
              <p className="text-xs text-stone-500 line-clamp-2 mt-1">{item.caption}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
