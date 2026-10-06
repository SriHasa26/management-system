import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'forest' | 'terracotta' | 'gold' | 'sage' | 'neutral' | 'outline';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'neutral',
  size = 'md',
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-medium rounded-full border";
  
  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] gap-1 leading-none",
    md: "px-2.5 py-1 text-xs gap-1.5",
  };

  const variantStyles = {
    forest: "bg-[#F0F5F3] text-[#173F35] border-[#8FB1A5]/50",
    terracotta: "bg-[#FAF2F0] text-[#B85C45] border-[#E8C1B7]",
    gold: "bg-[#FAF6EE] text-[#A67B2A] border-[#E6D3AC]",
    sage: "bg-[#F4F6F3] text-[#50674C] border-[#CEDBCB]",
    neutral: "bg-[#F5EFE3] text-[#464646] border-[#E6DDCF]",
    outline: "bg-transparent text-[#202522] border-[#C4B9A7]",
  };

  return (
    <span className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};
