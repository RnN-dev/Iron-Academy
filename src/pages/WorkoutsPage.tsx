import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Copy, Pencil, Plus, Trash2 } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { WorkoutEditorModal } from '../components/workouts/WorkoutEditorModal'
import { useAppState } from '../hooks/useAppState'
import type { MuscleGroup, Workout } from '../types/domain'
import { MUSCLE_LABELS } from '../types/domain'

const tabs: (MuscleGroup | 'todos')[] = [
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

export function WorkoutsPage() {
  const { state, removeWorkout, duplicateWorkoutById, createBlankWorkout } = useAppState()
  const [tab, setTab] = useState<(typeof tabs)[number]>('todos')
  const [editorWorkout, setEditorWorkout] = useState<Workout | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [newGroup, setNewGroup] = useState<MuscleGroup>('peito')

  const list = useMemo(() => {
    return state.workouts.filter((w) => tab === 'todos' || w.muscleGroup === tab)
  }, [state.workouts, tab])

  const openCreate = () => {
    setNewName('')
    setNewGroup('peito')
    setCreateOpen(true)
  }

  const confirmCreate = () => {
    const name = newName.trim() || 'Novo treino'
    const w = createBlankWorkout(newGroup, name)
    setCreateOpen(false)
    setEditorWorkout(w)
  }

  return (
    <AppShell
      title="Treinos"
      right={
        <Button type="button" className="py-2 text-xs sm:text-sm" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          Novo
        </Button>
      }
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-xl font-semibold text-white sm:text-2xl">Suas fichas</h2>
          <p className="mt-1 text-sm text-zinc-400">
            Crie, edite, duplique ou exclua. Cada treino pode ser ligado aos slots A–D no treino do
            dia.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                tab === t
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/30'
                  : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              {t === 'todos' ? 'Todos' : MUSCLE_LABELS[t]}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((w, i) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.2) }}
            >
              <Card className="group flex h-full flex-col transition hover:border-zinc-700">
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded-lg bg-zinc-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-300">
                    {MUSCLE_LABELS[w.muscleGroup]}
                  </span>
                  <span className="text-xs text-zinc-500">{w.exercises.length} ex.</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-white">{w.name}</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Atualizado em{' '}
                  {new Date(w.updatedAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                  })}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="py-2 text-xs"
                    onClick={() => setEditorWorkout(w)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="py-2 text-xs"
                    onClick={() => duplicateWorkoutById(w.id)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                    Duplicar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="py-2 text-xs text-red-400 hover:bg-red-950/40 hover:text-red-300"
                    onClick={() => {
                      if (confirm('Excluir este treino?')) removeWorkout(w.id)
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Excluir
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {list.length === 0 && (
          <Card className="text-center text-sm text-zinc-500">
            Nenhum treino nessa categoria ainda.
          </Card>
        )}
      </motion.div>

      <WorkoutEditorModal
        open={!!editorWorkout}
        workout={editorWorkout}
        onClose={() => setEditorWorkout(null)}
      />

      {createOpen && (
        <div className="fixed inset-0 z-[55] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-950 p-5 shadow-2xl"
          >
            <h3 className="text-lg font-semibold text-white">Novo treino</h3>
            <label className="mt-4 block text-xs text-zinc-500" htmlFor="nn">
              Nome
            </label>
            <input
              id="nn"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex.: Push pesado"
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
            />
            <label className="mt-3 block text-xs text-zinc-500" htmlFor="ng">
              Grupo principal
            </label>
            <select
              id="ng"
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value as MuscleGroup)}
              className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white"
            >
              {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((g) => (
                <option key={g} value={g}>
                  {MUSCLE_LABELS[g]}
                </option>
              ))}
            </select>
            <div className="mt-5 flex gap-2">
              <Button type="button" variant="ghost" className="flex-1" onClick={() => setCreateOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" className="flex-1" onClick={confirmCreate}>
                Criar
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AppShell>
  )
}
