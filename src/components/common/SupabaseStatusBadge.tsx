import React from 'react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Database, ShieldCheck, AlertCircle } from 'lucide-react';

export const SupabaseStatusBadge: React.FC<{ showDetails?: boolean }> = ({ showDetails = false }) => {
  const isConfigured = isSupabaseConfigured();

  if (!showDetails) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
          isConfigured
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
            : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800'
        }`}
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
          }`}
        />
        <Database className="w-3.5 h-3.5" />
        <span>{isConfigured ? 'Supabase Connected' : 'Demo Mode (Mock Data)'}</span>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border ${
        isConfigured
          ? 'bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/60'
          : 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800/60'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`p-2 rounded-lg ${
            isConfigured
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
          }`}
        >
          {isConfigured ? <ShieldCheck className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              {isConfigured ? 'Supabase Backend Connected' : 'Running in Local Mock / Demo Mode'}
            </h4>
            <span
              className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                isConfigured
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
              }`}
            >
              {isConfigured ? 'LIVE DATABASE' : 'PHASE 2 READY'}
            </span>
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
            {isConfigured
              ? 'Real-time database queries, RLS security policies, and Supabase Auth are active.'
              : 'To activate live Supabase queries and authentication, add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file and execute the supabase/schema.sql in your Supabase SQL editor.'}
          </p>
        </div>
      </div>
    </div>
  );
};
