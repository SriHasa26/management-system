import React from 'react';
import { Badge } from './Badge';
import { cn } from '../../lib/utils';

export interface SectionHeadingProps {
  badge?: string;
  badgeVariant?: 'forest' | 'terracotta' | 'gold' | 'sage';
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeVariant = 'forest',
  title,
  subtitle,
  align = 'center',
  className,
}) => {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  };

  return (
    <div className={cn("flex flex-col max-w-3xl mb-12", alignClasses[align], className)}>
      {badge && (
        <Badge variant={badgeVariant} className="mb-3 uppercase tracking-widest text-[11px] font-bold">
          {badge}
        </Badge>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#173F35] tracking-tight leading-[1.15]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-stone-600 text-base md:text-lg mt-3.5 leading-relaxed font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
