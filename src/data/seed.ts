import type { AppPersistedState, MuscleGroup, TrainingSlot, Workout, WorkoutExercise } from '../types/domain'
import { createId } from '../utils/id'
import { exercises } from './exercises'

function pickForGroup(group: MuscleGroup, limit: number): WorkoutExercise[] {
  const list = exercises.filter((e) => e.muscleGroup === group).slice(0, limit)
  return list.map((e, order) => ({
    exerciseId: e.id,
    order,
    sets: group === 'abdomen' ? 3 : 4,
    reps: group === 'abdomen' ? '12-20' : '8-12',
  }))
}

function buildPreset(id: string, name: string, group: MuscleGroup, limit: number): Workout {
  const now = new Date().toISOString()
  return {
    id,
    name,
    muscleGroup: group,
    exercises: pickForGroup(group, limit),
    createdAt: now,
    updatedAt: now,
  }
}

const presetFull: Workout = (() => {
  const now = new Date().toISOString()
  const picks = [
    ...exercises.filter((e) => e.muscleGroup === 'peito').slice(0, 2),
    ...exercises.filter((e) => e.muscleGroup === 'costas').slice(0, 2),
    ...exercises.filter((e) => e.muscleGroup === 'perna').slice(0, 2),
    ...exercises.filter((e) => e.muscleGroup === 'ombro').slice(0, 1),
    ...exercises.filter((e) => e.muscleGroup === 'abdomen').slice(0, 1),
  ]
  return {
    id: 'preset-full',
    name: 'Full Body express',
    muscleGroup: 'full',
    exercises: picks.map((e, order) => ({
      exerciseId: e.id,
      order,
      sets: 3,
      reps: '10-12',
    })),
    createdAt: now,
    updatedAt: now,
  }
})()

export const defaultPresets: Workout[] = [
  buildPreset('preset-peito', 'Peito — base forte', 'peito', 7),
  buildPreset('preset-costas', 'Costas — tração', 'costas', 7),
  buildPreset('preset-biceps', 'Bíceps — volume', 'biceps', 6),
  buildPreset('preset-triceps', 'Tríceps — definição', 'triceps', 6),
  buildPreset('preset-ombro', 'Ombro — estabilidade', 'ombro', 6),
  buildPreset('preset-perna', 'Perna — completo', 'perna', 8),
  buildPreset('preset-abdomen', 'Core — controle', 'abdomen', 5),
  presetFull,
]

export const trainingSlots: TrainingSlot[] = ['A', 'B', 'C', 'D']

export function createInitialState(): AppPersistedState {
  const slotToWorkoutId: Record<TrainingSlot, string | null> = {
    A: 'preset-peito',
    B: 'preset-costas',
    C: 'preset-perna',
    D: 'preset-ombro',
  }

  const weekdayToSlot: Partial<Record<number, TrainingSlot | null>> = {
    0: null,
    1: 'A',
    2: 'B',
    3: 'C',
    4: 'D',
    5: 'A',
    6: null,
  }

  return {
    version: 1,
    workouts: [...defaultPresets],
    weekdayToSlot,
    slotToWorkoutId,
    sessions: [],
  }
}

export function duplicateWorkout(source: Workout, name?: string): Workout {
  const now = new Date().toISOString()
  return {
    ...source,
    id: createId(),
    name: name ?? `${source.name} (cópia)`,
    exercises: source.exercises.map((row, order) => ({ ...row, order })),
    createdAt: now,
    updatedAt: now,
  }
}
