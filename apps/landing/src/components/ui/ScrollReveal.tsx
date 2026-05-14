import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

interface ScrollRevealProps {
  children: ReactNode
  direction?: 'up' | 'left' | 'right' | 'none'
  delay?: number
  className?: string
}

const offsets = {
  up: { y: 32 },
  left: { x: -32 },
  right: { x: 32 },
  none: {},
}

export function ScrollReveal({ children, direction = 'up', delay = 0, className }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offsets[direction] }}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
