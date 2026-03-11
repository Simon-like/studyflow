export const BADGE_VARIANTS: Record<string, string> = {
  default: 'bg-warm text-stone',
  primary: 'bg-coral/10 text-coral',
  success: 'bg-sage/10 text-sage',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-500',
} as const;

export const BADGE_SIZES = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
} as const;

export const BADGE_BASE_CLASSES = 'inline-flex items-center gap-1 rounded-full font-medium';
