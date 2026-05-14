import { ScrollReveal } from './ScrollReveal'

interface SectionTitleProps {
  title: string
  subtitle?: string
  className?: string
}

export function SectionTitle({ title, subtitle, className = '' }: SectionTitleProps) {
  return (
    <ScrollReveal className={`flex flex-col items-center gap-4 text-center ${className}`}>
      <h2 className="font-display text-3xl font-bold lg:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-lg text-stone dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  )
}
