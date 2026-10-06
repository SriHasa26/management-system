import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = Inbox,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-[#FFFDF8] border border-dashed border-[#E6DDCF]", className)}>
      <div className="w-14 h-14 rounded-2xl bg-[#F0F5F3] text-[#2E6B57] flex items-center justify-center mb-4 shadow-sm">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h4 className="text-lg font-serif font-bold text-[#173F35]">{title}</h4>
      <p className="text-sm text-stone-500 max-w-sm mt-1 mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
