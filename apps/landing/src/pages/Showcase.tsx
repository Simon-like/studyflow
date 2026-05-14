import { Monitor, Smartphone, Tablet } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageLayout, Section } from '@/components/layout/PageLayout'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CapabilityGrid } from '@/components/ui/CapabilityGrid'
import { CTABanner } from '@/components/ui/CTABanner'
import { DotGrid } from '@/components/effects/DotGrid'
import { PRODUCT_URLS, ADMIN_FEATURES } from '@/lib/constants'

const devices = [
  { label: 'Web App', desc: '桌面端沉浸式学习管理', Icon: Monitor, href: PRODUCT_URLS.web },
  { label: 'Mobile App', desc: '随身学习陪伴工具', Icon: Smartphone, href: PRODUCT_URLS.mobile.android },
  { label: 'Admin 后台', desc: '数据驱动运营管理', Icon: Tablet, href: PRODUCT_URLS.admin },
]

export default function Showcase() {
  return (
    <PageLayout>
      <Section className="relative">
        <DotGrid />
        <SectionTitle
          title="跨平台，无缝体验"
          subtitle="Web + Mobile + Admin 三端闭环，同一后端统一驱动"
        />
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-3">
          {devices.map((d, i) => (
            <ScrollReveal key={d.label} delay={i * 0.15}>
              <div className="flex flex-col gap-6">
                <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-cream to-warm shadow-glass dark:from-charcoal-800 dark:to-charcoal-700">
                  <div className="flex flex-col items-center gap-3 text-stone dark:text-neutral-500">
                    <d.Icon size={40} strokeWidth={1} />
                    <span className="text-sm">{d.label} 截图占位</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 text-center">
                  <h3 className="font-display text-lg font-semibold">{d.label}</h3>
                  <p className="text-sm text-stone dark:text-neutral-400">{d.desc}</p>
                  <a
                    href={d.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mx-auto mt-2 w-fit rounded-lg bg-coral/10 px-4 py-1.5 text-sm font-medium text-coral transition-colors hover:bg-coral/20 dark:bg-coral-900/20 dark:text-coral-400"
                  >
                    前往体验 →
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <Section dark className="relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -left-32 top-0 h-[400px] w-[400px] rounded-full bg-coral/[0.08] blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute -right-32 bottom-0 h-[350px] w-[350px] rounded-full bg-[#7C6AE8]/[0.08] blur-[120px]"
          animate={{ x: [0, -50, 0], y: [0, 50, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative flex flex-col gap-12">
          <ScrollReveal className="flex flex-col items-center gap-4 text-center">
            <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">运营后台，数据驱动</h2>
            <p className="max-w-2xl text-lg text-neutral-300">
              企业级管理后台，RBAC 动态权限、实时数据大盘、内容审核、AI 管理一站式运营
            </p>
          </ScrollReveal>

          <ScrollReveal>
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-charcoal-700/50 shadow-lg">
              <div className="flex flex-col items-center gap-3 text-neutral-400">
                <Tablet size={56} strokeWidth={1} />
                <span className="text-sm">Admin Dashboard 截图占位</span>
              </div>
            </div>
          </ScrollReveal>

          <CapabilityGrid items={ADMIN_FEATURES} columns={2} />
        </div>
      </Section>

      <CTABanner />
    </PageLayout>
  )
}
