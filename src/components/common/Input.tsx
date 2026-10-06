import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, icon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#202522] uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl border bg-[#FFFDF8] px-4 py-2.5 text-sm text-[#202522] transition-colors",
              "border-[#E6DDCF] placeholder:text-stone-400",
              "focus:border-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]/15",
              "disabled:bg-stone-100 disabled:cursor-not-allowed",
              icon ? "pl-10" : "",
              error ? "border-[#B85C45] focus:border-[#B85C45] focus:ring-[#B85C45]/20" : "",
              className
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-[#B85C45] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-stone-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { label: string; value: string | number }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold text-[#202522] uppercase tracking-wider">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border bg-[#FFFDF8] px-3.5 py-2.5 text-sm text-[#202522] transition-colors",
            "border-[#E6DDCF] focus:border-[#173F35] focus:outline-none focus:ring-2 focus:ring-[#173F35]/15",
            "disabled:bg-stone-100 disabled:cursor-not-allowed",
            error ? "border-[#B85C45]" : "",
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-[#B85C45] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-stone-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
