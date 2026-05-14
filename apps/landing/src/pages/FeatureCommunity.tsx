import { Link } from 'react-router-dom'
import { Users, ArrowLeft } from 'lucide-react'
import { PageLayout, Section } from '@/components/layout/PageLayout'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CapabilityGrid } from '@/components/ui/CapabilityGrid'
import { CTABanner } from '@/components/ui/CTABanner'
import { AuroraBackground } from '@/components/effects/AuroraBackground'

const capabilities = [
  { icon: 'Sparkles', title: '自动打卡', desc: '完成番茄钟后一键生成学习日报' },
  { icon: 'MessageCircle', title: '评论互动', desc: '一级评论 + 二级回复' },
  { icon: 'Heart', title: '点赞动画', desc: '乐观更新 + 心形动画反馈' },
  { icon: 'Bell', title: '通知系统', desc: '获赞、回信通知 + 未读红点' },
]

export default function FeatureCommunity() {
  return (
    <PageLayout>
      <Section className="relative">
        <AuroraBackground />
        <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
          <ScrollReveal direction="left" className="flex-1">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-coral-50 to-cream shadow-glass dark:from-charcoal-800 dark:to-charcoal-700">
              <div className="flex flex-col items-center gap-3 text-stone dark:text-neutral-500">
                <Users size={56} strokeWidth={1} />
                <span className="text-sm">社区动态广场截图占位</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="flex flex-1 flex-col gap-6">
            <div className="w-fit rounded-full bg-coral-50 px-3 py-1 text-xs font-semibold text-coral-600 dark:bg-coral-900/20 dark:text-coral-400">
              社交激励
            </div>
            <h1 className="font-display text-3xl font-bold lg:text-4xl">学习社区</h1>
            <p className="text-lg text-stone leading-relaxed dark:text-neutral-400">
              学习不再孤独。动态广场让你看到同伴的学习足迹，完成番茄钟后自动生成打卡帖，评论点赞互动形成正向激励循环。标签筛选帮你找到志同道合的学习伙伴。
            </p>
            <ul className="flex flex-col gap-3">
              {['动态广场（时间倒序 + 标签筛选）', '自动打卡帖（学习日报一键生成）', '二级评论系统（前 3 条回复展开）', '点赞乐观更新 + 心形动画', '通知系统（获赞/回信 + Profile 未读红点）', '阿里云 OSS 图片上传'].map(t => (
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
          <Link to="/features/companion" className="group flex items-center gap-2 font-semibold text-coral hover:text-coral-600">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            AI 学习助手
          </Link>
          <div />
        </div>
      </Section>

      <CTABanner />
    </PageLayout>
  )
}
