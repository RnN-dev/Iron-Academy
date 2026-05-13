export type MuscleGroup =
  | 'peito'
  | 'costas'
  | 'biceps'
  | 'triceps'
  | 'ombro'
  | 'perna'
  | 'abdomen'
  | 'full'

export type TrainingSlot = 'A' | 'B' | 'C' | 'D'

export type Difficulty = 'iniciante' | 'intermediario' | 'avancado'

export interface Exercise {
  id: string
  name: string
  muscleGroup: MuscleGroup
  difficulty: Difficulty
  equipment: string
  description: string
  focus: string
}

export interface WorkoutExercise {
  exerciseId: string
  sets: number
  reps: string
  order: number
}

export interface Workout {
  id: string
  name: string
  muscleGroup: MuscleGroup
  exercises: WorkoutExercise[]
  createdAt: string
  updatedAt: string
}

export interface DaySession {
  id: string
  date: string
  workoutId: string
  completedIndices: number[]
  finishedAt?: string
}

export interface AppPersistedState {
  version: 1
  workouts: Workout[]
  weekdayToSlot: Partial<Record<number, TrainingSlot | null>>
  slotToWorkoutId: Record<TrainingSlot, string | null>
  sessions: DaySession[]
}

export const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  peito: 'Peito',
  costas: 'Costas',
  biceps: 'Bíceps',
  triceps: 'Tríceps',
  ombro: 'Ombro',
  perna: 'Perna',
  abdomen: 'Abdômen',
  full: 'Full Body',
}

export const SLOT_LABELS: Record<TrainingSlot, string> = {
  A: 'Treino A',
  B: 'Treino B',
  C: 'Treino C',
  D: 'Treino D',
}

export const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
