import { useState, type ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function AppShell({
  title,
  children,
  right,
}: {
  title: string
  children: ReactNode
  right?: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Navbar title={title} onMenu={() => setMobileOpen(true)} right={right} />
        <main className="relative flex-1 overflow-x-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.12),transparent)]" />
          <div className="relative mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
