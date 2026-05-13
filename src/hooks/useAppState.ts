import { useContext, useMemo } from 'react'
import { AppStateContext } from '../context/appStateContext'
import { todayKey } from '../utils/date'

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState outside provider')
  return ctx
}

export function useTodaySession(workoutId: string | undefined) {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useTodaySession outside provider')
  const { state } = ctx
  return useMemo(() => {
    if (!workoutId) return undefined
    const date = todayKey()
    return state.sessions.find((s) => s.date === date && s.workoutId === workoutId)
  }, [state.sessions, workoutId])
}
