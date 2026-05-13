import { createContext } from 'react'
import type {
  AppPersistedState,
  Exercise,
  MuscleGroup,
  TrainingSlot,
  Workout,
} from '../types/domain'

export interface AppStateValue {
  state: AppPersistedState
  exerciseMap: Map<string, Exercise>
  getWorkout: (id: string | null | undefined) => Workout | undefined
  todayWeekday: number
  todaySlot: TrainingSlot | null
  todayWorkout: Workout | undefined
  streak: number
  weeklyCompleted: number
  weeklyGoal: number
  upsertWorkout: (w: Workout) => void
  removeWorkout: (id: string) => void
  duplicateWorkoutById: (id: string) => void
  setWeekdaySlot: (weekday: number, slot: TrainingSlot | null) => void
  setSlotWorkout: (slot: TrainingSlot, workoutId: string | null) => void
  toggleExerciseDone: (workoutId: string, exerciseIndex: number) => void
  resetTodayProgress: (workoutId: string) => void
  createBlankWorkout: (group: MuscleGroup, name: string) => Workout
}

export const AppStateContext = createContext<AppStateValue | null>(null)
