import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, icon, iconRight, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5",
      md: "text-sm px-4 py-2.5 gap-2",
      lg: "text-base px-6 py-3.5 gap-2.5 shadow-soft",
    };

    const variantStyles = {
      primary: "bg-[#173F35] text-[#FFFDF8] hover:bg-[#2E6B57] focus:ring-[#173F35] shadow-sm border border-[#173F35]",
      secondary: "bg-[#B85C45] text-[#FFFDF8] hover:bg-[#9E4733] focus:ring-[#B85C45] shadow-sm border border-[#B85C45]",
      accent: "bg-[#C99A3D] text-[#173F35] font-semibold hover:bg-[#D9BC80] focus:ring-[#C99A3D] shadow-sm border border-[#C99A3D]",
      outline: "bg-transparent text-[#173F35] border border-[#173F35]/20 hover:bg-[#173F35]/5 focus:ring-[#173F35]",
      ghost: "bg-transparent text-[#202522] hover:bg-black/5 focus:ring-stone-400",
      glass: "glass-panel text-[#173F35] hover:bg-white/90 border border-[#173F35]/15 focus:ring-[#173F35]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
        {!isLoading && icon}
        <span>{children}</span>
        {!isLoading && iconRight}
      </button>
    );
  }
);

Button.displayName = 'Button';
