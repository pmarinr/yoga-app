import { useLocalStorage } from './useLocalStorage'

export interface WeightEntry {
  date: string // YYYY-MM-DD
  kg: number
}

export const TARGET_KG = 85
export const START_KG = 94

export function useWeights() {
  const [weights, setWeights] = useLocalStorage<WeightEntry[]>('yoga.weights', [])

  const add = (entry: WeightEntry) => {
    setWeights((prev) => {
      const others = prev.filter((w) => w.date !== entry.date)
      return [...others, entry].sort((a, b) => a.date.localeCompare(b.date))
    })
  }

  const remove = (date: string) =>
    setWeights((prev) => prev.filter((w) => w.date !== date))

  const last = weights[weights.length - 1]
  const lost = last ? +(START_KG - last.kg).toFixed(1) : 0
  const totalToLose = START_KG - TARGET_KG
  const progressPct = Math.max(0, Math.min(100, (lost / totalToLose) * 100))

  return { weights, add, remove, setWeights, last, lost, progressPct }
}
