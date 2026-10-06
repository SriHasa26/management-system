import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading academic data...",
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 text-center", className)}>
      <div className="w-12 h-12 rounded-full bg-[#173F35]/10 flex items-center justify-center mb-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#173F35]" />
      </div>
      <p className="text-sm font-medium text-stone-600 animate-pulse">{message}</p>
    </div>
  );
};

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Unable to load information",
  message = "A temporary network or data issue occurred. Please check your connection and try again.",
  onRetry,
  className,
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-[#FAF2F0] border border-[#E8C1B7]", className)}>
      <div className="w-12 h-12 rounded-full bg-[#B85C45]/15 text-[#B85C45] flex items-center justify-center mb-3 font-bold text-xl">
        !
      </div>
      <h4 className="text-base font-serif font-bold text-[#60281B]">{title}</h4>
      <p className="text-xs text-[#7E3626] max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold px-3 py-1.5 bg-[#B85C45] text-white rounded-lg hover:bg-[#9E4733] transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
};
