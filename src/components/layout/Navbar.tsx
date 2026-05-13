import { PanelLeft } from 'lucide-react'
import type { ReactNode } from 'react'

export function Navbar({
  onMenu,
  title,
  right,
}: {
  onMenu: () => void
  title: string
  right?: ReactNode
}) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-zinc-800/60 bg-zinc-950/75 px-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="rounded-xl p-2 text-zinc-400 transition-colors hover:bg-zinc-800/80 hover:text-white lg:hidden"
          onClick={onMenu}
          aria-label="Abrir menu"
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <h1 className="truncate text-sm font-semibold text-zinc-100 sm:text-base">{title}</h1>
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </header>
  )
}
