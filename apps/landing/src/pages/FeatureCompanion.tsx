import { Link } from 'react-router-dom'
import { Bot, ArrowLeft, ArrowRight } from 'lucide-react'
import { PageLayout, Section } from '@/components/layout/PageLayout'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { CapabilityGrid } from '@/components/ui/CapabilityGrid'
import { CTABanner } from '@/components/ui/CTABanner'
import { AuroraBackground } from '@/components/effects/AuroraBackground'

const capabilities = [
  { icon: 'BarChart3', title: '数据查询', desc: 'Agent 工具调用，获取学习画像' },
  { icon: 'ListChecks', title: '任务查询', desc: 'Agent 工具调用，查询任务列表' },
  { icon: 'CalendarDays', title: '计划生成', desc: '结构化 JSON 输出学习计划' },
  { icon: 'Heart', title: '情感陪伴', desc: '7 种情感状态，智能切换表情' },
]

export default function FeatureCompanion() {
  return (
    <PageLayout>
      <Section className="relative">
        <AuroraBackground />
        <div className="flex flex-col gap-12 lg:flex-row-reverse lg:items-center">
          <ScrollReveal direction="right" className="flex-1">
            <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-sage-50 to-cream shadow-glass dark:from-charcoal-800 dark:to-charcoal-700">
              <div className="flex flex-col items-center gap-3 text-stone dark:text-neutral-500">
                <Bot size={56} strokeWidth={1} />
                <span className="text-sm">AI 对话界面截图占位</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" className="flex flex-1 flex-col gap-6">
            <div className="w-fit rounded-full bg-sage-50 px-3 py-1 text-xs font-semibold text-sage-600 dark:bg-sage-900/20 dark:text-sage-400">
              最大差异化
            </div>
            <h1 className="font-display text-3xl font-bold lg:text-4xl">AI 数字人学习助手</h1>
            <p className="text-lg text-stone leading-relaxed dark:text-neutral-400">
              不只是聊天机器人。基于 Agent 工具调用架构，AI 能主动访问你的学习数据、查询任务、分析进度，给出真正个性化的建议和学习计划。SSE 流式输出，打字机效果实时呈现。
            </p>
            <ul className="flex flex-col gap-3">
              {['多轮对话 + SSE 流式输出（首 token < 2s）', 'Agent 4 个系统工具（画像/任务/数据/计划）', '7 种情感状态数字人（Lottie 动画）', '学习计划 AI 生成（结构化 JSON 输出）', '情感关键词自动检测，智能切换表情'].map(t => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sage" />
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
          <Link to="/features/pomodoro" className="group flex items-center gap-2 font-semibold text-coral hover:text-coral-600">
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            番茄钟专注
          </Link>
          <Link to="/features/community" className="group flex items-center gap-2 font-semibold text-coral hover:text-coral-600">
            学习社区
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Section>

      <CTABanner />
    </PageLayout>
  )
}
