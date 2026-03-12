export const BUTTON_VARIANTS = {
  primary: 'bg-coral text-white hover:bg-coral-600 shadow-coral',
  secondary: 'bg-white text-charcoal border border-mist hover:bg-warm',
  outline: 'bg-transparent text-charcoal border border-mist hover:bg-warm',
  ghost: 'bg-transparent text-stone hover:text-charcoal hover:bg-warm',
  danger: 'bg-red-500 text-white hover:bg-red-600',
} as const;

export const BUTTON_SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

export const BUTTON_BASE_CLASSES = 
  'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';
