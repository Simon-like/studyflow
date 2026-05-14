import * as icons from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

interface Capability {
  icon: string
  title: string
  desc: string
}

interface CapabilityGridProps {
  items: readonly Capability[]
  columns?: 2 | 4
}

export function CapabilityGrid({ items, columns = 4 }: CapabilityGridProps) {
  const gridCols = columns === 2
    ? 'grid-cols-1 sm:grid-cols-2'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'

  return (
    <div className={`grid gap-6 ${gridCols}`}>
      {items.map((item, i) => {
        const Icon = (icons as Record<string, icons.LucideIcon>)[item.icon] ?? icons.Sparkles
        return (
          <ScrollReveal key={item.title} delay={i * 0.1}>
            <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center shadow-soft dark:bg-charcoal-800/50">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-coral-50 text-coral-500 dark:bg-coral-900/20 dark:text-coral-400">
                <Icon size={20} />
              </div>
              <h4 className="font-display font-semibold">{item.title}</h4>
              <p className="text-sm text-stone dark:text-neutral-400">{item.desc}</p>
            </div>
          </ScrollReveal>
        )
      })}
    </div>
  )
}
