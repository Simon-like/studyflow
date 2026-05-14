import type { ReactNode } from 'react'

interface PageLayoutProps {
  children: ReactNode
  className?: string
}

export function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <main className={`pt-20 ${className}`}>
      {children}
    </main>
  )
}

interface SectionProps {
  children: ReactNode
  className?: string
  dark?: boolean
}

export function Section({ children, className = '', dark = false }: SectionProps) {
  return (
    <section
      className={`px-6 py-16 lg:px-8 lg:py-24 ${
        dark ? 'bg-charcoal-800 text-white dark:bg-charcoal-900' : ''
      } ${className}`}
    >
      <div className="mx-auto max-w-7xl">
        {children}
      </div>
    </section>
  )
}
