import { motion } from 'framer-motion'
import { PRODUCT_URLS } from '@/lib/constants'
import { ScrollReveal } from './ScrollReveal'

export function CTABanner() {
  return (
    <section className="px-6 py-16 lg:px-8 lg:py-24">
      <ScrollReveal>
        <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 overflow-hidden rounded-3xl bg-gradient-to-br from-coral-500 to-sage-500 px-8 py-16 text-center text-white shadow-lg lg:px-16">
          <motion.div
            className="pointer-events-none absolute -left-20 -top-20 h-[300px] w-[300px] rounded-full bg-white/10 blur-[80px]"
            animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="pointer-events-none absolute -bottom-20 -right-20 h-[250px] w-[250px] rounded-full bg-white/10 blur-[80px]"
            animate={{ x: [0, -30, 0], y: [0, -40, 0], scale: [1, 0.85, 1] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
          />
          <h2 className="font-display text-3xl font-bold lg:text-4xl">
            开始你的高效学习之旅
          </h2>
          <p className="max-w-lg text-lg text-white/80">
            番茄钟专注 · AI 智能陪伴 · 社区激励，三位一体助你成长
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <a
              href={PRODUCT_URLS.web}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-white px-8 py-3 font-semibold text-coral-600 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              立即体验 Web 版
            </a>
            <a
              href={PRODUCT_URLS.mobile.android}
              className="rounded-xl border-2 border-white/40 px-8 py-3 font-semibold text-white backdrop-blur transition-all hover:border-white/80 hover:bg-white/10"
            >
              下载移动端 App
            </a>
          </div>
        </div>
      </ScrollReveal>
    </section>
  )
}
