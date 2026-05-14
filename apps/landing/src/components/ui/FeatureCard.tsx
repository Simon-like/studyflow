import { Link } from 'react-router-dom'
import { Timer, Bot, Users, type LucideIcon } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

const iconMap: Record<string, LucideIcon> = { Timer, Bot, Users }

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  route: string
  color: 'coral' | 'sage'
  delay?: number
}

export function FeatureCard({ icon, title, description, route, color, delay = 0 }: FeatureCardProps) {
  const Icon = iconMap[icon] ?? Timer
  const colorClasses = color === 'coral'
    ? 'bg-coral-50 text-coral-600 dark:bg-coral-900/20 dark:text-coral-400'
    : 'bg-sage-50 text-sage-600 dark:bg-sage-900/20 dark:text-sage-400'

  return (
    <ScrollReveal delay={delay}>
      <Link
        to={route}
        className="group flex flex-col gap-5 rounded-2xl bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-glass dark:bg-charcoal-800/50 dark:shadow-none dark:hover:bg-charcoal-800/80"
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses}`}>
          <Icon size={24} />
        </div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="text-stone leading-relaxed dark:text-neutral-400">{description}</p>
        <span className="flex items-center gap-1 text-sm font-medium text-coral transition-colors group-hover:text-coral-600 dark:text-coral-400">
          了解更多
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </span>
      </Link>
    </ScrollReveal>
  )
}
