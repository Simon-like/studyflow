import { motion } from 'framer-motion'

export function GlowLine() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 flex justify-center overflow-hidden">
      <motion.div
        className="h-px w-[600px] max-w-full"
        style={{
          background: `linear-gradient(90deg, transparent 0%, rgba(232,168,124,0.6) 30%, rgba(157,181,160,0.6) 70%, transparent 100%)`,
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
