import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const Home = lazy(() => import('@/pages/Home'))
const Features = lazy(() => import('@/pages/Features'))
const FeaturePomodoro = lazy(() => import('@/pages/FeaturePomodoro'))
const FeatureCompanion = lazy(() => import('@/pages/FeatureCompanion'))
const FeatureCommunity = lazy(() => import('@/pages/FeatureCommunity'))
const Showcase = lazy(() => import('@/pages/Showcase'))
const About = lazy(() => import('@/pages/About'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <div className="flex min-h-screen flex-col bg-cream text-charcoal dark:bg-charcoal-900 dark:text-neutral-100">
      <Navbar />
      <ScrollToTop />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-coral border-t-transparent" />
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/features/pomodoro" element={<FeaturePomodoro />} />
              <Route path="/features/companion" element={<FeatureCompanion />} />
              <Route path="/features/community" element={<FeatureCommunity />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
