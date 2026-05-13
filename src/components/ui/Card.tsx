import type { ReactNode } from 'react'

export function Card({
  children,
  className = '',
  padding = 'p-5',
}: {
  children: ReactNode
  className?: string
  padding?: string
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/70 bg-zinc-900/55 shadow-lg shadow-black/25 backdrop-blur-xl ${padding} ${className}`}
    >
      {children}
    </div>
  )
}
