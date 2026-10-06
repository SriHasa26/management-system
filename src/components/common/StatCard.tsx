import React from 'react';
import { Card } from './Card';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: LucideIcon;
  iconBg?: string;
  subtext?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  iconBg = 'bg-[#173F35]/10 text-[#173F35]',
  subtext,
  className,
}) => {
  return (
    <Card variant="paper" hoverEffect className={cn("flex flex-col justify-between p-5", className)}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">{title}</span>
        {Icon && (
          <div className={cn("p-2 rounded-xl shrink-0", iconBg)}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-bold font-serif text-[#173F35]">{value}</div>
        
        {(change || subtext) && (
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            {change && (
              <span
                className={cn(
                  "font-semibold px-1.5 py-0.5 rounded-md",
                  changeType === 'positive' && "bg-emerald-100 text-emerald-800",
                  changeType === 'negative' && "bg-rose-100 text-rose-800",
                  changeType === 'neutral' && "bg-stone-100 text-stone-700"
                )}
              >
                {change}
              </span>
            )}
            {subtext && <span className="text-stone-500">{subtext}</span>}
          </div>
        )}
      </div>
    </Card>
  );
};
