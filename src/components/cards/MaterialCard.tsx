import React from 'react';
import { StudyMaterial } from '../../types';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FileText, Video, Download, Eye, Sparkles, BookOpen } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const MaterialCard: React.FC<{ material: StudyMaterial }> = ({ material }) => {
  const { success } = useToast();

  const getIcon = () => {
    switch (material.fileType) {
      case 'video':
        return <Video className="w-5 h-5 text-[#B85C45]" />;
      case 'question_paper':
        return <BookOpen className="w-5 h-5 text-[#C99A3D]" />;
      default:
        return <FileText className="w-5 h-5 text-[#2E6B57]" />;
    }
  };

  const handleDownload = () => {
    success(`Downloading "${material.title}"`, 'File download simulation initialized');
  };

  return (
    <Card variant="paper" hoverEffect className="flex flex-col justify-between p-5 border-[#EDE6D8] h-full text-left">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#F7F3EA] border border-[#E6DDCF]">{getIcon()}</div>
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              {material.subject}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {material.isImportant && (
              <Badge variant="terracotta" size="sm" className="gap-1">
                <Sparkles className="w-3 h-3" /> High Yield
              </Badge>
            )}
            <Badge variant="neutral" size="sm" className="uppercase font-mono">
              {material.fileType.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        <h4 className="text-base font-bold text-[#173F35] line-clamp-2 leading-snug">{material.title}</h4>
        <p className="text-xs text-[#B85C45] font-semibold mt-1">{material.chapter}</p>
        <p className="text-xs text-stone-600 mt-2 line-clamp-2 leading-relaxed">{material.description}</p>
      </div>

      <div className="pt-4 mt-4 border-t border-[#EDE6D8] flex items-center justify-between">
        <span className="text-[11px] text-stone-400 font-medium">
          {material.fileSize} • Uploaded by {material.uploadedBy.split(' ')[0]}
        </span>

        <div className="flex items-center gap-2">
          {material.fileType === 'video' ? (
            <Button size="sm" variant="secondary" icon={<Eye className="w-3.5 h-3.5" />} onClick={handleDownload}>
              Watch
            </Button>
          ) : (
            <Button size="sm" variant="outline" icon={<Download className="w-3.5 h-3.5" />} onClick={handleDownload}>
              Download
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};
