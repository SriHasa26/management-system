import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'paper' | 'elevated' | 'glass' | 'emerald' | 'outline' | 'notebook';
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'paper', hoverEffect = false, children, ...props }, ref) => {
    const variantStyles = {
      paper: "bg-[#FFFDF8] border border-[#EDE6D8] shadow-soft",
      elevated: "bg-[#FFFDF8] border border-[#E6DDCF] shadow-elevated",
      glass: "glass-panel border border-[#173F35]/10 shadow-soft",
      emerald: "bg-[#173F35] text-[#FFFDF8] border border-[#2E6B57]/50 shadow-elevated",
      outline: "bg-transparent border border-[#E6DDCF]",
      notebook: "bg-[#FFFDF8] border-l-4 border-l-[#C99A3D] border-y border-r border-[#EDE6D8] shadow-soft",
    };

    const hoverClass = hoverEffect ? "transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated" : "";

    return (
      <div
        ref={ref}
        className={cn("rounded-2xl p-6", variantStyles[variant], hoverClass, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
