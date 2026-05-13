import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { exercises } from '../data/exercises'
import type { MuscleGroup } from '../types/domain'
import { MUSCLE_LABELS } from '../types/domain'
import { difficultyLabel } from '../utils/difficulty'

const groups: (MuscleGroup | 'todos')[] = [
  'todos',
  'peito',
  'costas',
  'biceps',
  'triceps',
  'ombro',
  'perna',
  'abdomen',
  'full',
]

export function ExercisesPage() {
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<(typeof groups)[number]>('todos')

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return exercises.filter((e) => {
      if (group !== 'todos' && e.muscleGroup !== group) return false
      if (!needle) return true
      return (
        e.name.toLowerCase().includes(needle) ||
        e.focus.toLowerCase().includes(needle) ||
        e.equipment.toLowerCase().includes(needle)
      )
    })
  }, [group, q])

  return (
    <AppShell title="Biblioteca de exercícios">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Catálogo completo</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Filtre por grupo muscular e busque por nome, equipamento ou foco.
            </p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/60 py-2.5 pl-10 pr-3 text-sm text-white outline-none ring-blue-500/0 transition focus:border-blue-500/50 focus:ring-2"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {groups.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup(g)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                group === g
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {g === 'todos' ? 'Todos' : MUSCLE_LABELS[g]}
            </button>
          ))}
        </div>

        <p className="text-sm text-zinc-500">
          {filtered.length} resultado{filtered.length === 1 ? '' : 's'}
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((ex, i) => (
            <motion.div
              key={ex.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.25) }}
            >
              <Card className="group h-full transition hover:border-zinc-700">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-zinc-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                    {MUSCLE_LABELS[ex.muscleGroup]}
                  </span>
                  <span className="text-[10px] font-medium uppercase text-zinc-500">
                    {difficultyLabel(ex.difficulty)}
                  </span>
                </div>
                <h3 className="mt-3 text-base font-semibold text-white group-hover:text-blue-100">
                  {ex.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{ex.description}</p>
                <dl className="mt-4 space-y-1 text-xs text-zinc-500">
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-zinc-600">Equip.</dt>
                    <dd className="text-zinc-400">{ex.equipment}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-zinc-600">Foco</dt>
                    <dd className="text-zinc-400">{ex.focus}</dd>
                  </div>
                </dl>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AppShell>
  )
}
