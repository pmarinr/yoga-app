import { useLocalStorage } from './useLocalStorage'

export interface Goals {
  startKg: number
  targetKg: number
  weeks: number
}

export const DEFAULT_GOALS: Goals = {
  startKg: 94,
  targetKg: 85,
  weeks: 12,
}

const DAY_MS = 86400000

export function useGoals(startDate?: string) {
  const [goals, setGoals] = useLocalStorage<Goals>('yoga.goals', DEFAULT_GOALS)

  const computeEndDate = (start: string, weeks: number): string => {
    const d = new Date(start + 'T00:00:00')
    d.setDate(d.getDate() + weeks * 7 - 1)
    return d.toISOString().slice(0, 10)
  }

  const endDate = startDate ? computeEndDate(startDate, goals.weeks) : null

  const setEndDate = (newEnd: string, start: string) => {
    const d0 = new Date(start + 'T00:00:00').getTime()
    const d1 = new Date(newEnd + 'T00:00:00').getTime()
    const days = Math.round((d1 - d0) / DAY_MS) + 1
    const weeks = Math.max(1, Math.min(52, Math.ceil(days / 7)))
    setGoals({ ...goals, weeks })
  }

  const setWeeks = (n: number) => {
    setGoals({ ...goals, weeks: Math.max(1, Math.min(52, Math.round(n))) })
  }

  return { goals, setGoals, endDate, setEndDate, setWeeks }
}
