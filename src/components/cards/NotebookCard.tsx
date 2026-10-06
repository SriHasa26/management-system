import React from 'react';
import { cn } from '../../lib/utils';
import { Pin } from 'lucide-react';

export interface NotebookCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  tag?: string;
  tagColor?: string;
  className?: string;
}

export const NotebookCard: React.FC<NotebookCardProps> = ({
  title,
  subtitle,
  children,
  tag,
  tagColor = 'bg-[#C99A3D] text-[#173F35]',
  className,
}) => {
  return (
    <div
      className={cn(
        "relative rounded-2xl bg-[#FFFDF8] border border-[#E6DDCF] shadow-card overflow-hidden",
        "before:absolute before:top-0 before:bottom-0 before:left-8 before:w-px before:bg-[#E8C1B7]/60",
        className
      )}
    >
      {/* Red margin stripe on notebook style */}
      <div className="p-6 pl-12">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Pin className="w-3.5 h-3.5 text-[#B85C45] rotate-45" />
              <h4 className="text-base font-serif font-bold text-[#173F35]">{title}</h4>
            </div>
            {subtitle && <p className="text-xs text-stone-500 mt-0.5">{subtitle}</p>}
          </div>

          {tag && (
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wider", tagColor)}>
              {tag}
            </span>
          )}
        </div>

        <div className="text-sm text-stone-700 leading-relaxed font-sans">{children}</div>
      </div>
    </div>
  );
};
