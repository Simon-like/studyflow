import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'
import { PRODUCT_URLS } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-mist/30 bg-white/50 dark:border-charcoal-700/30 dark:bg-charcoal-900/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral text-white font-display text-xs font-bold">S</div>
            <span className="font-display text-base font-bold">StudyFlow</span>
          </div>
          <p className="text-sm text-stone dark:text-neutral-500">
            © 2026 StudyFlow · 本科毕业设计作品
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <Link to="/features" className="text-stone transition-colors hover:text-coral dark:text-neutral-400">功能</Link>
          <Link to="/showcase" className="text-stone transition-colors hover:text-coral dark:text-neutral-400">展示</Link>
          <Link to="/about" className="text-stone transition-colors hover:text-coral dark:text-neutral-400">关于</Link>
          <a href={PRODUCT_URLS.web} target="_blank" rel="noopener noreferrer" className="text-stone transition-colors hover:text-coral dark:text-neutral-400">Web 应用</a>
          <a href={PRODUCT_URLS.admin} target="_blank" rel="noopener noreferrer" className="text-stone transition-colors hover:text-coral dark:text-neutral-400">管理后台</a>
        </div>

        <a
          href={PRODUCT_URLS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-stone transition-colors hover:text-charcoal dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          <Github size={18} />
          GitHub
        </a>
      </div>
    </footer>
  )
}
