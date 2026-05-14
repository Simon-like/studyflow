export function DotGrid() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.12]"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
          color: '#9DB5A0',
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, transparent 30%, var(--mask-color, #FDF8F3) 80%)`,
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 50%, transparent 30%, #1a1a1a 80%)`,
        }}
      />
    </div>
  )
}
