import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type {
  AppPersistedState,
  DaySession,
  MuscleGroup,
  TrainingSlot,
  Workout,
} from '../types/domain'
import { createInitialState, duplicateWorkout } from '../data/seed'
import { exercises } from '../data/exercises'
import { createId } from '../utils/id'
import { addDaysKey, startOfWeekMonday, todayKey } from '../utils/date'
import { AppStateContext, type AppStateValue } from './appStateContext'

const STORAGE_KEY = 'iron-academy-v1'

function loadPersisted(): AppPersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialState()
    const parsed = JSON.parse(raw) as Partial<AppPersistedState>
    if (parsed.version !== 1) return createInitialState()
    const base = createInitialState()
    return {
      ...base,
      ...parsed,
      workouts: Array.isArray(parsed.workouts) ? parsed.workouts : base.workouts,
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      weekdayToSlot:
        parsed.weekdayToSlot && typeof parsed.weekdayToSlot === 'object'
          ? { ...base.weekdayToSlot, ...parsed.weekdayToSlot }
          : base.weekdayToSlot,
      slotToWorkoutId:
        parsed.slotToWorkoutId && typeof parsed.slotToWorkoutId === 'object'
          ? { ...base.slotToWorkoutId, ...parsed.slotToWorkoutId }
          : base.slotToWorkoutId,
    }
  } catch {
    return createInitialState()
  }
}

function savePersisted(state: AppPersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

function computeStreak(sessions: DaySession[]): number {
  const done = new Set(
    sessions.filter((s) => s.finishedAt).map((s) => s.date),
  )
  let check = todayKey()
  if (!done.has(check)) check = addDaysKey(check, -1)
  let streak = 0
  while (done.has(check)) {
    streak++
    check = addDaysKey(check, -1)
  }
  return streak
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppPersistedState>(() => loadPersisted())

  useEffect(() => {
    savePersisted(state)
  }, [state])

  const exerciseMap = useMemo(
    () => new Map(exercises.map((e) => [e.id, e])),
    [],
  )

  const getWorkout = useCallback(
    (id: string | null | undefined) => {
      if (!id) return undefined
      return state.workouts.find((w) => w.id === id)
    },
    [state.workouts],
  )

  const todayWeekday = new Date().getDay()

  const todaySlot = useMemo(() => {
    const s = state.weekdayToSlot[todayWeekday]
    return s === undefined ? null : s
  }, [state.weekdayToSlot, todayWeekday])

  const todayWorkout = useMemo(() => {
    if (!todaySlot) return undefined
    const wid = state.slotToWorkoutId[todaySlot]
    return getWorkout(wid)
  }, [getWorkout, state.slotToWorkoutId, todaySlot])

  const streak = useMemo(() => computeStreak(state.sessions), [state.sessions])

  const weeklyCompleted = useMemo(() => {
    const start = startOfWeekMonday(new Date())
    const end = addDaysKey(start.toISOString().slice(0, 10), 6)
    const set = new Set(
      state.sessions
        .filter((s) => {
          if (!s.finishedAt) return false
          return s.date >= start.toISOString().slice(0, 10) && s.date <= end
        })
        .map((s) => s.date),
    )
    return set.size
  }, [state.sessions])

  const weeklyGoal = 5

  const upsertWorkout = useCallback((w: Workout) => {
    setState((prev) => {
      const idx = prev.workouts.findIndex((x) => x.id === w.id)
      const list = [...prev.workouts]
      if (idx === -1) list.push(w)
      else list[idx] = w
      return { ...prev, workouts: list }
    })
  }, [])

  const removeWorkout = useCallback((id: string) => {
    setState((prev) => {
      const slots = { ...prev.slotToWorkoutId }
      ;(Object.keys(slots) as TrainingSlot[]).forEach((k) => {
        if (slots[k] === id) slots[k] = null
      })
      return {
        ...prev,
        workouts: prev.workouts.filter((w) => w.id !== id),
        slotToWorkoutId: slots,
      }
    })
  }, [])

  const duplicateWorkoutById = useCallback((id: string) => {
    setState((prev) => {
      const src = prev.workouts.find((w) => w.id === id)
      if (!src) return prev
      const copy = duplicateWorkout(src)
      return { ...prev, workouts: [...prev.workouts, copy] }
    })
  }, [])

  const setWeekdaySlot = useCallback((weekday: number, slot: TrainingSlot | null) => {
    setState((prev) => ({
      ...prev,
      weekdayToSlot: { ...prev.weekdayToSlot, [weekday]: slot },
    }))
  }, [])

  const setSlotWorkout = useCallback((slot: TrainingSlot, workoutId: string | null) => {
    setState((prev) => ({
      ...prev,
      slotToWorkoutId: { ...prev.slotToWorkoutId, [slot]: workoutId },
    }))
  }, [])

  const toggleExerciseDone = useCallback((workoutId: string, exerciseIndex: number) => {
    const date = todayKey()
    setState((prev) => {
      const w = prev.workouts.find((x) => x.id === workoutId)
      if (!w) return prev
      const others = prev.sessions.filter(
        (s) => !(s.date === date && s.workoutId === workoutId),
      )
      const current =
        prev.sessions.find((s) => s.date === date && s.workoutId === workoutId) ?? {
          id: createId(),
          date,
          workoutId,
          completedIndices: [] as number[],
        }
      const set = new Set(current.completedIndices)
      if (set.has(exerciseIndex)) set.delete(exerciseIndex)
      else set.add(exerciseIndex)
      const arr = [...set].sort((a, b) => a - b)
      const total = w.exercises.length
      const idxSet = new Set(arr)
      const allDone =
        total > 0 &&
        arr.length === total &&
        Array.from({ length: total }, (_, i) => i).every((i) => idxSet.has(i))
      const next: DaySession = {
        ...current,
        completedIndices: arr,
        finishedAt: allDone ? new Date().toISOString() : undefined,
      }
      return { ...prev, sessions: [...others, next] }
    })
  }, [])

  const resetTodayProgress = useCallback((workoutId: string) => {
    const date = todayKey()
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.filter(
        (s) => !(s.date === date && s.workoutId === workoutId),
      ),
    }))
  }, [])

  const createBlankWorkout = useCallback(
    (group: MuscleGroup, name: string): Workout => {
      const now = new Date().toISOString()
      const w: Workout = {
        id: createId(),
        name,
        muscleGroup: group,
        exercises: [],
        createdAt: now,
        updatedAt: now,
      }
      upsertWorkout(w)
      return w
    },
    [upsertWorkout],
  )

  const value = useMemo<AppStateValue>(
    () => ({
      state,
      exerciseMap,
      getWorkout,
      todayWeekday,
      todaySlot,
      todayWorkout,
      streak,
      weeklyCompleted,
      weeklyGoal,
      upsertWorkout,
      removeWorkout,
      duplicateWorkoutById,
      setWeekdaySlot,
      setSlotWorkout,
      toggleExerciseDone,
      resetTodayProgress,
      createBlankWorkout,
    }),
    [
      createBlankWorkout,
      duplicateWorkoutById,
      exerciseMap,
      getWorkout,
      removeWorkout,
      resetTodayProgress,
      setSlotWorkout,
      setWeekdaySlot,
      state,
      streak,
      todaySlot,
      todayWeekday,
      todayWorkout,
      toggleExerciseDone,
      upsertWorkout,
      weeklyCompleted,
      weeklyGoal,
    ],
  )

  return (
    <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>
  )
}
