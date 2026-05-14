import { Link } from 'react-router-dom'
import { Timer, Wifi, Lock, BarChart3, ArrowLeft, ArrowRight } from 'lucide-react'
import { PageLayout, Section } from '@/components/layout/PageLayout'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CapabilityGrid } from '@/components/ui/CapabilityGrid'
import { CTABanner } from '@/components/ui/CTABanner'
import { AuroraBackground } from '@/components/effects/AuroraBackground'

const capabilities = [
  { icon: 'Timer', title: '专注计时', desc: '番茄工作法，25 分钟深度聚焦' },
  { icon: 'Lock', title: '锁屏模式', desc: '屏蔽干扰，沉浸式学习体验' },
  { icon: 'Wifi', title: '多端同步', desc: 'WebSocket 实时跨设备状态同步' },
  { icon: 'BarChart3', title: '统计分析', desc: '专注时长、完成率、热力图' },
]

export default function FeaturePomodoro() {
  return (
    <PageLayout>
      <Section className="relative">
        <AuroraBackground />
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <ScrollReveal direction="left" className="flex-1">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-coral-50 to-cream shadow-glass dark:from-charcoal-800 dark:to-charcoal-700">
              <div className="flex flex-col items-center gap-3 text-stone dark:text-neutral-500">
                <Timer size={56} strokeWidth={1} />
                <span className="text-sm">番茄钟运行界面截图占位</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="flex flex-1 flex-col gap-6">
            <div className="w-fit rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-600 dark:bg-coral-900/20 dark:text-coral-400">
              核心功能
            </div>
            <h1 className="font-display text-3xl font-bold lg:text-4xl">番茄钟专注系统</h1>
            <p className="text-lg text-stone leading-relaxed dark:text-neutral-400">
              基于番茄工作法的专注计时系统，搭配锁屏模式和多端实时同步。WebSocket 实时广播番茄钟状态，断连后自动降级为 HTTP 轮询，确保跨设备学习体验无缝衔接。
            </p>
            <ul className="flex flex-col gap-3">
              {['多端 WebSocket 实时同步 + HTTP 降级', '锁屏专注模式，屏蔽一切干扰', '任务关联，番茄完成自动更新任务状态', '放弃原因记录，数据化分析干扰因素', 'Redis 分布式锁解决多端冲突'].map(t => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral" />
                  {t}
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-12">
          <ScrollReveal className="text-center">
            <h2 className="font-display text-2xl font-bold lg:text-3xl">核心能力</h2>
          </ScrollReveal>
          <CapabilityGrid items={capabilities} columns={4} />
        </div>
      </Section>

      <Section>
        <div className="flex items-center justify-between">
          <div />
          <Link to="/features/companion" className="group flex items-center gap-2 font-semibold text-coral hover:text-coral-600">
            AI 学习助手
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Section>

      <CTABanner />
    </PageLayout>
  )
}
