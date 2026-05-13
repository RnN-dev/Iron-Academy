import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Activity,
  BookOpen,
  CalendarDays,
  Flame,
  LayoutList,
  TrendingUp,
} from 'lucide-react'
import { AppShell } from '../components/layout/AppShell'
import { Card } from '../components/ui/Card'
import { useAppState } from '../hooks/useAppState'
import { greetingForDate } from '../data/greetings'
import { exercises } from '../data/exercises'
import { todayKey } from '../utils/date'
import { futureDay } from '../utils/calendar'
import { MUSCLE_LABELS, SLOT_LABELS, WEEKDAY_SHORT, type TrainingSlot } from '../types/domain'

export function DashboardPage() {
  const {
    todayWorkout,
    todaySlot,
    streak,
    weeklyCompleted,
    weeklyGoal,
    state,
    getWorkout,
  } = useAppState()

  const dateKey = todayKey()
  const greeting = greetingForDate(dateKey)
  const weekPct = Math.min(100, Math.round((weeklyCompleted / weeklyGoal) * 100))

  const upcoming = [1, 2, 3, 4].map((offset) => {
    const { weekday, dateLabel } = futureDay(offset)
    const slot = state.weekdayToSlot[weekday]
    const slotLetter = slot === undefined || slot === null ? null : slot
    const wid = slotLetter ? state.slotToWorkoutId[slotLetter] : null
    const w = getWorkout(wid)
    return {
      offset,
      weekday,
      dateLabel,
      slotLetter,
      workout: w,
    }
  })

  const history = [...state.sessions]
    .filter((s) => s.finishedAt)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6)

  const todayExercises = todayWorkout?.exercises.length ?? 0

  return (
    <AppShell title="Dashboard">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        <div>
          <p className="text-sm text-zinc-500">
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })}
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {greeting}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="group hover:border-blue-500/30">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Treino de hoje
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {todayWorkout ? todayWorkout.name : 'Descanso'}
                </p>
                <p className="mt-1 text-sm text-zinc-400">
                  {todaySlot
                    ? `${SLOT_LABELS[todaySlot]} · ${todayExercises} exercícios`
                    : 'Dia livre na agenda'}
                </p>
              </div>
              <CalendarDays className="h-9 w-9 text-blue-500/80 transition-transform group-hover:scale-105" />
            </div>
            <Link
              to="/hoje"
              className="mt-4 inline-flex text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Abrir treino do dia →
            </Link>
          </Card>

          <Card className="group hover:border-red-500/25">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">Streak</p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-white">{streak}</p>
                <p className="mt-1 text-sm text-zinc-400">dias seguidos com treino fechado</p>
              </div>
              <Flame className="h-9 w-9 text-red-500/90" />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Meta semanal
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {weeklyCompleted}/{weeklyGoal} treinos
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${weekPct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
              </div>
              <TrendingUp className="h-9 w-9 shrink-0 text-blue-500/70" />
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Biblioteca
                </p>
                <p className="mt-2 text-3xl font-bold tabular-nums text-white">{exercises.length}</p>
                <p className="mt-1 text-sm text-zinc-400">exercícios catalogados</p>
              </div>
              <BookOpen className="h-9 w-9 text-zinc-500" />
            </div>
            <Link
              to="/exercicios"
              className="mt-4 inline-flex text-sm font-medium text-zinc-300 hover:text-white"
            >
              Explorar →
            </Link>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2" padding="p-0 overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-4">
              <div className="flex items-center gap-2">
                <LayoutList className="h-4 w-4 text-zinc-500" />
                <h3 className="text-sm font-semibold text-white">Próximos treinos</h3>
              </div>
              <Link to="/hoje" className="text-xs font-medium text-blue-400 hover:text-blue-300">
                Ajustar agenda
              </Link>
            </div>
            <ul className="divide-y divide-zinc-800/60">
              {upcoming.map((row) => (
                <li
                  key={row.offset}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 transition-colors hover:bg-zinc-800/30"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {WEEKDAY_SHORT[row.weekday]} · {row.dateLabel}
                    </p>
                    <p className="text-xs text-zinc-500">
                      {row.slotLetter
                        ? SLOT_LABELS[row.slotLetter as TrainingSlot]
                        : 'Sem treino'}{' '}
                      {row.workout ? `· ${row.workout.name}` : ''}
                    </p>
                  </div>
                  {!row.workout && row.slotLetter && (
                    <span className="rounded-lg bg-amber-500/15 px-2 py-1 text-xs text-amber-400">
                      Vincular
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="p-0 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-zinc-800/60 px-5 py-4">
              <Activity className="h-4 w-4 text-zinc-500" />
              <h3 className="text-sm font-semibold text-white">Histórico recente</h3>
            </div>
            {history.length === 0 ? (
              <p className="px-5 py-8 text-sm text-zinc-500">
                Complete um treino no dia para ver o histórico aqui.
              </p>
            ) : (
              <ul className="divide-y divide-zinc-800/60">
                {history.map((s) => {
                  const w = getWorkout(s.workoutId)
                  return (
                    <li key={s.id} className="px-5 py-3">
                      <p className="text-sm font-medium text-zinc-200">
                        {new Date(s.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </p>
                      <p className="text-xs text-zinc-500">{w?.name ?? 'Treino'}</p>
                    </li>
                  )
                })}
              </ul>
            )}
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <h3 className="text-sm font-semibold text-white">Resumo rápido</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Você tem <span className="text-zinc-200">{state.workouts.length}</span> fichas salvas
              e a biblioteca cobre todos os grupos:{' '}
              {Object.entries(MUSCLE_LABELS)
                .map(([, v]) => v)
                .join(', ')}
              .
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/treinos"
                className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-500"
              >
                Gerenciar treinos
              </Link>
              <Link
                to="/exercicios"
                className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-500"
              >
                Ver exercícios
              </Link>
            </div>
          </Card>
          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-zinc-900/40">
            <h3 className="text-sm font-semibold text-white">Dica</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Marque cada exercício no treino do dia para fechar a sessão e alimentar seu streak. A
              agenda liga dias da semana aos treinos A–D.
            </p>
          </Card>
        </div>
      </motion.div>
    </AppShell>
  )
}
