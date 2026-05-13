import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Trash2, X } from 'lucide-react'
import type { MuscleGroup, Workout, WorkoutExercise } from '../../types/domain'
import { MUSCLE_LABELS } from '../../types/domain'
import { exercises } from '../../data/exercises'
import { Button } from '../ui/Button'
import { useAppState } from '../../hooks/useAppState'
import { difficultyLabel } from '../../utils/difficulty'

type Props = {
  open: boolean
  onClose: () => void
  workout: Workout | null
}

function cloneWorkout(w: Workout): Workout {
  return {
    ...w,
    exercises: w.exercises.map((r) => ({ ...r })),
  }
}

function WorkoutEditorBody({
  workout,
  onClose,
}: {
  workout: Workout
  onClose: () => void
}) {
  const { upsertWorkout, exerciseMap } = useAppState()
  const [draft, setDraft] = useState(() => cloneWorkout(workout))
  const [picker, setPicker] = useState(false)
  const fieldId = `we-${workout.id}`

  const addable = useMemo(() => {
    return exercises.filter((e) => {
      if (draft.muscleGroup === 'full') return true
      return e.muscleGroup === draft.muscleGroup || e.muscleGroup === 'full'
    })
  }, [draft.muscleGroup])

  const save = () => {
    const now = new Date().toISOString()
    const rows = draft.exercises.map((row, order) => ({ ...row, order }))
    upsertWorkout({ ...draft, exercises: rows, updatedAt: now })
    onClose()
  }

  const removeRow = (index: number) => {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises
        .filter((_, i) => i !== index)
        .map((r, i) => ({ ...r, order: i })),
    }))
  }

  const updateRow = (index: number, patch: Partial<WorkoutExercise>) => {
    setDraft((d) => ({
      ...d,
      exercises: d.exercises.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    }))
  }

  const addExercise = (exerciseId: string) => {
    setDraft((d) => {
      const next: WorkoutExercise = {
        exerciseId,
        sets: 3,
        reps: '10-12',
        order: d.exercises.length,
      }
      return { ...d, exercises: [...d.exercises, next] }
    })
    setPicker(false)
  }

  return (
    <>
      <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
        <h2 className="text-lg font-semibold text-white">Editar treino</h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto px-5 py-4">
        <div>
          <label className="text-xs font-medium text-zinc-500" htmlFor={`${fieldId}-name`}>
            Nome
          </label>
          <input
            id={`${fieldId}-name`}
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-500" htmlFor={`${fieldId}-group`}>
            Grupo principal
          </label>
          <select
            id={`${fieldId}-group`}
            value={draft.muscleGroup}
            onChange={(e) =>
              setDraft({ ...draft, muscleGroup: e.target.value as MuscleGroup })
            }
            className="mt-1 w-full rounded-xl border border-zinc-800 bg-zinc-900/60 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/50"
          >
            {(Object.keys(MUSCLE_LABELS) as MuscleGroup[]).map((g) => (
              <option key={g} value={g}>
                {MUSCLE_LABELS[g]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between pt-2">
          <h3 className="text-sm font-semibold text-zinc-200">Exercícios</h3>
          <Button
            type="button"
            variant="outline"
            className="py-2 text-xs"
            onClick={() => setPicker(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {draft.exercises.length === 0 ? (
          <p className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 px-4 py-6 text-center text-sm text-zinc-500">
            Nenhum exercício ainda. Use Adicionar para montar a ficha.
          </p>
        ) : (
          <ul className="space-y-3">
            {draft.exercises.map((row, idx) => {
              const ex = exerciseMap.get(row.exerciseId)
              return (
                <li
                  key={`${row.exerciseId}-${idx}`}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-white">{ex?.name ?? '—'}</p>
                    <button
                      type="button"
                      onClick={() => removeRow(idx)}
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-red-950/50 hover:text-red-400"
                      aria-label="Remover"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] uppercase text-zinc-600">Séries</label>
                      <input
                        type="number"
                        min={1}
                        value={row.sets}
                        onChange={(e) =>
                          updateRow(idx, { sets: Number(e.target.value) || 1 })
                        }
                        className="mt-0.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                      />
                    </div>
                    <div className="flex-[2]">
                      <label className="text-[10px] uppercase text-zinc-600">Reps</label>
                      <input
                        value={row.reps}
                        onChange={(e) => updateRow(idx, { reps: e.target.value })}
                        className="mt-0.5 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-sm text-white"
                      />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {picker && (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-3">
            <p className="text-xs font-medium text-zinc-400">Escolha um exercício</p>
            <div className="mt-2 max-h-48 space-y-1 overflow-y-auto pr-1">
              {addable.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => addExercise(ex.id)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                >
                  <span>{ex.name}</span>
                  <span className="text-[10px] text-zinc-500">
                    {difficultyLabel(ex.difficulty)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 border-t border-zinc-800 p-4">
        <Button type="button" variant="ghost" className="flex-1" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="button" className="flex-1" onClick={save}>
          Salvar
        </Button>
      </div>
    </>
  )
}

export function WorkoutEditorModal({ open, onClose, workout }: Props) {
  return (
    <AnimatePresence>
      {open && workout && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            aria-label="Fechar"
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:rounded-3xl"
          >
            <WorkoutEditorBody key={workout.id} workout={workout} onClose={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
