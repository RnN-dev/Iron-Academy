import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'ghost' | 'danger' | 'outline'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-900/30',
  ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800/80 hover:text-white',
  danger: 'bg-red-600/90 text-white hover:bg-red-500',
  outline:
    'border border-zinc-700 bg-zinc-900/40 text-zinc-200 hover:border-zinc-500 hover:bg-zinc-800/50',
}

export function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: Variant
}) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
