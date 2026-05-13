import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, RotateCcw, Sparkles } from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAppState, useTodaySession } from '../hooks/useAppState'
import { MUSCLE_LABELS, SLOT_LABELS, WEEKDAY_SHORT, type TrainingSlot } from '../types/domain'

const slotOptions: (TrainingSlot | '')[] = ['', 'A', 'B', 'C', 'D']

export function TodayPage() {
  const {
    todayWorkout,
    todaySlot,
    state,
    getWorkout,
    setWeekdaySlot,
    setSlotWorkout,
    toggleExerciseDone,
    resetTodayProgress,
    exerciseMap,
  } = useAppState()

  const session = useTodaySession(todayWorkout?.id)
  const total = todayWorkout?.exercises.length ?? 0
  const doneCount = session ? session.completedIndices.length : 0
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0
  const allDone = session?.finishedAt

  const ordered = useMemo(() => {
    if (!todayWorkout) return []
    return [...todayWorkout.exercises].sort((a, b) => a.order - b.order)
  }, [todayWorkout])

  return (
    <AppShell title="Treino do dia">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-300">
              <Sparkles className="h-3.5 w-3.5" />
              Inteligente por dia da semana
            </div>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              {todayWorkout ? todayWorkout.name : 'Dia de descanso'}
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              {todaySlot
                ? `${SLOT_LABELS[todaySlot]} · ${MUSCLE_LABELS[todayWorkout?.muscleGroup ?? 'full']}`
                : 'Nenhum slot definido para hoje na agenda.'}
            </p>
          </div>
          {todayWorkout && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                className="text-xs"
                onClick={() => resetTodayProgress(todayWorkout.id)}
              >
                <RotateCcw className="h-4 w-4" />
                Zerar hoje
              </Button>
            </div>
          )}
        </div>

        {todayWorkout && (
          <Card>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Progresso do treino
                </p>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold tabular-nums text-white">{pct}%</span>
                  <span className="text-sm text-zinc-500">
                    {doneCount}/{total} exercícios
                  </span>
                </div>
              </div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-800 sm:max-w-md">
                <motion.div
                  className={`h-full rounded-full ${
                    allDone
                      ? 'bg-gradient-to-r from-red-500 to-amber-400'
                      : 'bg-gradient-to-r from-blue-600 to-blue-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
              </div>
            </div>
            {allDone && (
              <p className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-200">
                Treino fechado. Ótimo trabalho — isso conta para o streak e para a meta semanal.
              </p>
            )}
          </Card>
        )}

        {todayWorkout ? (
          <ul className="space-y-3">
            {ordered.map((row, idx) => {
              const ex = exerciseMap.get(row.exerciseId)
              const checked = session?.completedIndices.includes(idx) ?? false
              return (
                <motion.li
                  key={`${row.exerciseId}-${idx}`}
                  layout
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 backdrop-blur-sm transition hover:border-zinc-700"
                >
                  <button
                    type="button"
                    onClick={() => toggleExerciseDone(todayWorkout.id, idx)}
                    className="flex w-full items-start gap-4 text-left"
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 transition ${
                        checked
                          ? 'border-blue-500 bg-blue-600 text-white'
                          : 'border-zinc-600 bg-zinc-950 text-transparent hover:border-zinc-500'
                      }`}
                    >
                      <Check className="h-4 w-4" strokeWidth={2.5} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white">{ex?.name ?? 'Exercício'}</p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {row.sets}×{row.reps}
                        {ex?.equipment ? ` · ${ex.equipment}` : ''}
                      </p>
                      {ex?.focus && (
                        <p className="mt-2 text-xs leading-relaxed text-zinc-400">{ex.focus}</p>
                      )}
                    </div>
                  </button>
                </motion.li>
              )
            })}
          </ul>
        ) : (
          <Card className="text-center text-sm text-zinc-400">
            Configure a agenda abaixo para vincular este dia a um slot (A–D) e escolha um treino
            para cada slot.
          </Card>
        )}

        <Card padding="p-0 overflow-hidden">
          <div className="border-b border-zinc-800/60 px-5 py-4">
            <h3 className="text-sm font-semibold text-white">Agenda da semana</h3>
            <p className="mt-1 text-xs text-zinc-500">
              Cada dia aponta para um treino A, B, C ou D. Deixe em branco para descanso.
            </p>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {WEEKDAY_SHORT.map((label, weekday) => {
              const current = state.weekdayToSlot[weekday]
              const value = current === undefined ? '' : current ?? ''
              return (
                <div
                  key={label}
                  className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-medium text-zinc-200">{label}</span>
                  <select
                    value={value}
                    onChange={(e) => {
                      const v = e.target.value
                      setWeekdaySlot(weekday, v === '' ? null : (v as TrainingSlot))
                    }}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 sm:max-w-xs"
                  >
                    {slotOptions.map((opt) => (
                      <option key={String(opt)} value={opt}>
                        {opt === '' ? 'Descanso' : SLOT_LABELS[opt as TrainingSlot]}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </Card>

        <Card padding="p-0 overflow-hidden">
          <div className="border-b border-zinc-800/60 px-5 py-4">
            <h3 className="text-sm font-semibold text-white">Treinos A · B · C · D</h3>
            <p className="mt-1 text-xs text-zinc-500">Escolha qual ficha corresponde a cada letra.</p>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {(['A', 'B', 'C', 'D'] as TrainingSlot[]).map((slot) => {
              const wid = state.slotToWorkoutId[slot]
              return (
                <div
                  key={slot}
                  className="flex flex-col gap-3 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-sm font-semibold text-blue-300">{SLOT_LABELS[slot]}</span>
                  <select
                    value={wid ?? ''}
                    onChange={(e) => {
                      const v = e.target.value
                      setSlotWorkout(slot, v === '' ? null : v)
                    }}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-blue-500/40 sm:max-w-md"
                  >
                    <option value="">Selecionar treino…</option>
                    {state.workouts.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({MUSCLE_LABELS[w.muscleGroup]})
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="border-zinc-800/80 bg-zinc-900/30">
          <h3 className="text-sm font-semibold text-white">Prévia rápida</h3>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400">
            {(['A', 'B', 'C', 'D'] as TrainingSlot[]).map((slot) => {
              const w = getWorkout(state.slotToWorkoutId[slot])
              return (
                <li key={slot}>
                  <span className="text-zinc-500">{SLOT_LABELS[slot]}:</span>{' '}
                  {w ? <span className="text-zinc-200">{w.name}</span> : <span>sem treino</span>}
                </li>
              )
            })}
          </ul>
        </Card>
      </motion.div>
    </AppShell>
  )
}
