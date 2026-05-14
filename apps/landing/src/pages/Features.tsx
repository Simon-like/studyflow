import { Link } from 'react-router-dom'
import { Timer, Bot, Users, ArrowRight } from 'lucide-react'
import { PageLayout, Section } from '@/components/layout/PageLayout'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { FEATURES } from '@/lib/constants'

const iconMap = { Timer, Bot, Users }

export default function Features() {
  return (
    <PageLayout>
      <Section>
        <SectionTitle
          title="核心功能"
          subtitle="三大模块协同，构建完整学习闭环"
        />
      </Section>

      {FEATURES.map((feature, index) => {
        const Icon = iconMap[feature.icon as keyof typeof iconMap]
        const reversed = index % 2 === 1

        return (
          <Section key={feature.id}>
            <div className={`flex flex-col gap-12 lg:flex-row lg:items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
              <ScrollReveal direction={reversed ? 'right' : 'left'} className="flex-1">
                <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cream to-warm shadow-glass dark:from-charcoal-800 dark:to-charcoal-700">
                  <div className="flex flex-col items-center gap-3 text-stone dark:text-neutral-500">
                    <Icon size={48} strokeWidth={1} />
                    <span className="text-sm">{feature.subtitle} 截图占位</span>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal direction={reversed ? 'left' : 'right'} className="flex flex-1 flex-col gap-6">
                <div className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                  feature.color === 'coral'
                    ? 'bg-coral-50 text-coral-600 dark:bg-coral-900/20 dark:text-coral-400'
                    : 'bg-sage-50 text-sage-600 dark:bg-sage-900/20 dark:text-sage-400'
                }`}>
                  {feature.title}
                </div>
                <h3 className="font-display text-2xl font-bold lg:text-3xl">{feature.subtitle}</h3>
                <p className="text-stone leading-relaxed dark:text-neutral-400">{feature.description}</p>
                <ul className="flex flex-col gap-3">
                  {feature.highlights.map(h => (
                    <li key={h} className="flex items-start gap-3 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={feature.route}
                  className="group flex w-fit items-center gap-2 font-semibold text-coral transition-colors hover:text-coral-600"
                >
                  查看详情
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </ScrollReveal>
            </div>
          </Section>
        )
      })}
    </PageLayout>
  )
}
