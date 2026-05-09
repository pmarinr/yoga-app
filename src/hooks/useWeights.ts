import { useLocalStorage } from './useLocalStorage'
import { useGoals } from './useGoals'

export interface WeightEntry {
  date: string // YYYY-MM-DD
  kg: number
}

// Fallbacks (compatibilidad). El valor real viene de `useGoals`.
export const TARGET_KG = 85
export const START_KG = 94

export function useWeights() {
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('yoga.weights', [])
  const { goals } = useGoals()

  const startKg = goals.startKg
  const targetKg = goals.targetKg

  const add = (entry: WeightEntry) => {
    setWeights((prev) => {
      const others = prev.filter((w) => w.date !== entry.date)
      return [...others, entry].sort((a, b) => a.date.localeCompare(b.date))
    })
  }

  const remove = (date: string) =>
    setWeights((prev) => prev.filter((w) => w.date !== date))

  const last = weights[weights.length - 1]
  const lost = last ? +(startKg - last.kg).toFixed(1) : 0
  const totalToLose = Math.max(0.01, startKg - targetKg)
  const progressPct = Math.max(0, Math.min(100, (lost / totalToLose) * 100))

  return { weights, add, remove, setWeights, last, lost, progressPct, startKg, targetKg }
}
