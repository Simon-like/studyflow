import { Github, Mail } from 'lucide-react'
import { PageLayout, Section } from '@/components/layout/PageLayout'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { TechTag } from '@/components/ui/TechTag'
import { TECH_TAGS, PRODUCT_URLS } from '@/lib/constants'

export default function About() {
  return (
    <PageLayout>
      <Section>
        <SectionTitle
          title="技术架构"
          subtitle="全栈自研，覆盖 Web · Mobile · Admin 三端 + Spring Boot 后端"
        />
      </Section>

      <Section>
        <ScrollReveal>
          <div className="flex flex-col items-center gap-8">
            <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-mist/30 bg-white p-8 shadow-soft dark:border-charcoal-700 dark:bg-charcoal-800/50">
              <div className="flex flex-col items-center gap-6 text-center font-mono text-sm">
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="rounded-lg bg-coral-50 px-3 py-1.5 text-coral-600 dark:bg-coral-900/20 dark:text-coral-400">React 19 (Web)</span>
                  <span className="rounded-lg bg-sage-50 px-3 py-1.5 text-sage-600 dark:bg-sage-900/20 dark:text-sage-400">React Native (Mobile)</span>
                  <span className="rounded-lg bg-coral-50 px-3 py-1.5 text-coral-600 dark:bg-coral-900/20 dark:text-coral-400">React 19 (Admin)</span>
                </div>
                <div className="text-stone dark:text-neutral-500">│</div>
                <span className="rounded-lg bg-charcoal-800 px-4 py-2 text-white dark:bg-charcoal-600">Spring Boot 4.0.6 + Java 21</span>
                <div className="text-stone dark:text-neutral-500">│</div>
                <div className="flex flex-wrap justify-center gap-4">
                  <span className="rounded-lg border border-mist px-3 py-1.5 dark:border-charcoal-600">PostgreSQL 16</span>
                  <span className="rounded-lg border border-mist px-3 py-1.5 dark:border-charcoal-600">Redis 7</span>
                  <span className="rounded-lg border border-mist px-3 py-1.5 dark:border-charcoal-600">WebSocket</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {TECH_TAGS.map(tag => (
                <TechTag key={tag} label={tag} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </Section>

      <Section>
        <div className="grid gap-8 md:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-soft dark:bg-charcoal-800/50">
              <h3 className="font-display text-xl font-bold">学术信息</h3>
              <div className="flex flex-col gap-4 text-sm">
                <div>
                  <span className="text-stone dark:text-neutral-400">论文题目</span>
                  <p className="mt-1 font-medium">《基于 Spring Boot 的智能学习计划系统设计与实现》</p>
                </div>
                <div>
                  <span className="text-stone dark:text-neutral-400">技术创新点</span>
                  <ul className="mt-2 flex flex-col gap-2">
                    {['Agent 工具调用架构（非简单 LLM 对话）', '多端 WebSocket 实时同步 + HTTP 降级', 'RBAC 动态权限系统', 'Monorepo 跨端代码复用'].map(t => (
                      <li key={t} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-coral" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-soft dark:bg-charcoal-800/50">
              <h3 className="font-display text-xl font-bold">联系方式</h3>
              <div className="flex flex-col gap-4">
                <a href={PRODUCT_URLS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-lg p-3 text-sm transition-colors hover:bg-cream dark:hover:bg-charcoal-700">
                  <Github size={20} className="text-charcoal dark:text-neutral-300" />
                  <div>
                    <div className="font-medium">GitHub</div>
                    <div className="text-stone dark:text-neutral-400">查看源代码</div>
                  </div>
                </a>
                <div className="flex items-center gap-3 rounded-lg p-3 text-sm">
                  <Mail size={20} className="text-charcoal dark:text-neutral-300" />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-stone dark:text-neutral-400">hayeksimon189@gmail.com</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </Section>
    </PageLayout>
  )
}
