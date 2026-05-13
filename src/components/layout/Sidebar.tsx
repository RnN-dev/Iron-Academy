import { NavLink } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  Dumbbell,
  LayoutDashboard,
  PanelLeftClose,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/hoje', label: 'Treino do dia', icon: CalendarDays },
  { to: '/treinos', label: 'Treinos', icon: Dumbbell },
  { to: '/exercicios', label: 'Biblioteca', icon: BookOpen },
]

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'bg-zinc-800/90 text-white shadow-inner shadow-black/20'
                : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0 opacity-80" strokeWidth={1.75} />
          {label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean
  setMobileOpen: (v: boolean) => void
}) {
  return (
    <>
      <aside className="hidden w-60 shrink-0 border-r border-zinc-800/60 bg-zinc-950/80 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-zinc-800/60 px-5">
          <span className="text-lg font-semibold tracking-tight text-white">
            Iron <span className="text-blue-500">Academy</span>
          </span>
        </div>
        <NavItems />
        <div className="mt-auto border-t border-zinc-800/60 p-4 text-xs text-zinc-500">
          Treinos inteligentes, no seu ritmo.
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Fechar menu"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 380, damping: 35 }}
              className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col border-r border-zinc-800/60 bg-zinc-950 lg:hidden"
            >
              <div className="flex h-14 items-center justify-between border-b border-zinc-800/60 px-4">
                <span className="text-lg font-semibold text-white">
                  Iron <span className="text-blue-500">Academy</span>
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  aria-label="Fechar"
                >
                  <PanelLeftClose className="h-5 w-5" />
                </button>
              </div>
              <NavItems onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
