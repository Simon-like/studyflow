import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, Sun, Menu, X, ChevronDown, Timer, Bot, Users } from 'lucide-react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useTheme } from '@/hooks/useTheme'
import { PRODUCT_URLS } from '@/lib/constants'

const featureItems = [
  { label: '番茄钟专注', href: '/features/pomodoro', Icon: Timer },
  { label: 'AI 学习助手', href: '/features/companion', Icon: Bot },
  { label: '学习社区', href: '/features/community', Icon: Users },
]

export function Navbar() {
  const scrolled = useScrollProgress()
  const { theme, toggle } = useTheme()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMobileOpen(false)
    setDropdownOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const isActive = (path: string) => location.pathname === path
  const isFeaturesActive = location.pathname.startsWith('/features')

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-mist/30 bg-cream/80 bg-glass shadow-soft dark:border-charcoal-700/30 dark:bg-neutral-900/80'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-coral text-white font-display font-bold text-sm">
            S
          </div>
          <span className="font-display text-lg font-bold">StudyFlow</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 lg:flex">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-coral ${
              isActive('/') ? 'text-coral' : ''
            }`}
          >
            首页
          </Link>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`flex items-center gap-1 text-sm font-medium transition-colors hover:text-coral ${
                isFeaturesActive ? 'text-coral' : ''
              }`}
            >
              功能
              <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 rounded-xl border border-mist/30 bg-white p-2 shadow-glass dark:border-charcoal-700 dark:bg-charcoal-800">
                {featureItems.map(({ label, href, Icon }) => (
                  <Link
                    key={href}
                    to={href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-cream dark:hover:bg-charcoal-700"
                  >
                    <Icon size={16} className="text-coral" />
                    {label}
                  </Link>
                ))}
                <div className="my-1 border-t border-mist/30 dark:border-charcoal-700" />
                <Link
                  to="/features"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone transition-colors hover:bg-cream dark:text-neutral-400 dark:hover:bg-charcoal-700"
                >
                  功能总览
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/showcase"
            className={`text-sm font-medium transition-colors hover:text-coral ${
              isActive('/showcase') ? 'text-coral' : ''
            }`}
          >
            展示
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-coral ${
              isActive('/about') ? 'text-coral' : ''
            }`}
          >
            关于
          </Link>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-mist/30 dark:hover:bg-charcoal-700"
            aria-label="切换主题"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href={PRODUCT_URLS.web}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-coral px-5 py-2 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-coral-600 hover:shadow-coral"
          >
            立即体验 →
          </a>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-mist/30 dark:hover:bg-charcoal-700" aria-label="切换主题">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-mist/30 dark:hover:bg-charcoal-700" aria-label="菜单">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-mist/30 bg-cream/95 bg-glass px-6 pb-6 pt-4 lg:hidden dark:border-charcoal-700/30 dark:bg-neutral-900/95">
          <div className="flex flex-col gap-1">
            <Link to="/" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-mist/20 dark:hover:bg-charcoal-700">首页</Link>
            <Link to="/features" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-mist/20 dark:hover:bg-charcoal-700">功能总览</Link>
            {featureItems.map(({ label, href, Icon }) => (
              <Link key={href} to={href} className="flex items-center gap-3 rounded-lg px-4 py-3 pl-8 text-sm hover:bg-mist/20 dark:hover:bg-charcoal-700">
                <Icon size={14} className="text-coral" />{label}
              </Link>
            ))}
            <Link to="/showcase" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-mist/20 dark:hover:bg-charcoal-700">展示</Link>
            <Link to="/about" className="rounded-lg px-4 py-3 text-sm font-medium hover:bg-mist/20 dark:hover:bg-charcoal-700">关于</Link>
          </div>
          <a
            href={PRODUCT_URLS.web}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center rounded-xl bg-coral px-5 py-3 text-sm font-semibold text-white"
          >
            立即体验 →
          </a>
        </div>
      )}
    </header>
  )
}
