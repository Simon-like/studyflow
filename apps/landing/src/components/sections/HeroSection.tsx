import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import { GradientText } from '@/components/ui/GradientText'
import { AuroraBackground } from '@/components/effects/AuroraBackground'
import { FloatingParticles } from '@/components/effects/FloatingParticles'
import { MouseGlow } from '@/components/effects/MouseGlow'
import { PRODUCT_URLS } from '@/lib/constants'

export function HeroSection() {
  return (
    <section className="relative flex flex-col items-center gap-10 px-6 pb-16 pt-24 lg:px-8 lg:pb-24 lg:pt-32">
      <AuroraBackground />
      <FloatingParticles count={30} />
      <MouseGlow />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <div className="rounded-full border border-coral/20 bg-coral-50/60 px-4 py-1.5 text-sm font-medium text-coral-600 dark:border-coral-800/30 dark:bg-coral-900/20 dark:text-coral-400">
          智能学习陪伴应用
        </div>
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
          让学习<GradientText>流动</GradientText>起来
        </h1>
        <p className="max-w-lg text-lg text-stone dark:text-neutral-400">
          番茄钟任务管理 · AI 智能陪伴 · 学习社区激励
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col gap-4 sm:flex-row"
      >
        <a
          href={PRODUCT_URLS.web}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-coral px-7 py-3 font-semibold text-white shadow-coral transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-lg"
        >
          立即体验 Web 版
          <ArrowRight size={16} />
        </a>
        <a
          href={PRODUCT_URLS.mobile.android}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-mist bg-white px-7 py-3 font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:border-coral/30 hover:shadow-soft dark:border-charcoal-600 dark:bg-charcoal-800 dark:text-neutral-100 dark:hover:border-coral/40"
        >
          <Download size={16} />
          下载移动端
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-5xl"
      >
        <div className="overflow-hidden rounded-2xl border border-mist/30 bg-white/60 p-2 shadow-mockup dark:border-charcoal-700/30 dark:bg-charcoal-800/40">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
              <div className="h-3 w-3 rounded-full bg-green-400/70" />
            </div>
            <div className="mx-auto rounded-md bg-mist/30 px-12 py-1 text-xs text-stone dark:bg-charcoal-700/50 dark:text-neutral-500">
              app.studyflow.app
            </div>
          </div>
          <div className="flex aspect-video items-center justify-center rounded-xl bg-gradient-to-br from-cream to-warm text-stone dark:from-charcoal-800 dark:to-charcoal-700 dark:text-neutral-500">
            <div className="flex flex-col items-center gap-3">
              <div className="text-4xl">📚</div>
              <span className="text-sm">Web Dashboard 截图占位</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
