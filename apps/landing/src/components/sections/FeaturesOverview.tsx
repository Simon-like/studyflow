import { SectionTitle } from '@/components/ui/SectionTitle'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { DotGrid } from '@/components/effects/DotGrid'
import { GlowLine } from '@/components/effects/GlowLine'
import { FEATURES } from '@/lib/constants'

export function FeaturesOverview() {
  return (
    <section className="relative px-6 py-16 lg:px-8 lg:py-24">
      <DotGrid />
      <GlowLine />
      <div className="mx-auto flex max-w-7xl flex-col gap-12">
        <SectionTitle
          title="核心功能"
          subtitle="三大模块协同，构建完整学习闭环"
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard
              key={f.id}
              icon={f.icon}
              title={f.subtitle}
              description={f.description}
              route={f.route}
              color={f.color}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
