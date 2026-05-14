interface TechTagProps {
  label: string
}

export function TechTag({ label }: TechTagProps) {
  return (
    <span className="rounded-full border border-mist/50 bg-white/60 px-4 py-1.5 text-sm font-medium text-charcoal-700 dark:border-charcoal-600 dark:bg-charcoal-800/60 dark:text-neutral-300">
      {label}
    </span>
  )
}
