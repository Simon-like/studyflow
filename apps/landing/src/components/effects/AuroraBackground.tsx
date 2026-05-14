import { motion } from 'framer-motion'

export function AuroraBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-coral/[0.07] blur-[120px] dark:bg-coral/[0.12]"
        animate={{
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-sage/[0.07] blur-[120px] dark:bg-sage/[0.15]"
        animate={{
          x: [0, -60, 50, 0],
          y: [0, 80, -30, 0],
          scale: [1, 0.85, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-1/4 left-1/3 h-[400px] w-[400px] rounded-full bg-coral/[0.04] blur-[100px] dark:bg-[#7C6AE8]/[0.10]"
        animate={{
          x: [0, 50, -70, 0],
          y: [0, -40, 60, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
