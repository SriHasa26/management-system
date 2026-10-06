import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getStatusBadgeColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'present':
    case 'paid':
    case 'active':
    case 'completed':
    case 'enrolled':
    case 'answered':
    case 'evaluated':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    
    case 'pending':
    case 'submitted':
    case 'in review':
    case 'contacted':
    case 'visit scheduled':
    case 'live':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    
    case 'absent':
    case 'overdue':
    case 'inactive':
    case 'closed':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    
    case 'late':
    case 'partially paid':
      return 'bg-orange-100 text-orange-800 border-orange-300';
    
    default:
      return 'bg-stone-100 text-stone-800 border-stone-300';
  }
}
