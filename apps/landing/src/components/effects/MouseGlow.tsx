import { useEffect, useRef, useState } from 'react'

export function MouseGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const container = ref.current?.parentElement
    if (!container) return

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    container.addEventListener('mousemove', onMove)
    container.addEventListener('mouseleave', onLeave)
    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-500"
        style={{
          left: pos.x,
          top: pos.y,
          background: `radial-gradient(circle, rgba(232,168,124,0.08) 0%, transparent 70%)`,
          opacity: visible ? 1 : 0,
        }}
      />
    </div>
  )
}
