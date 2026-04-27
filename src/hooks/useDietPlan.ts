import { useMemo } from 'react'
import { generateWeekPlan, nextInCategory, summarize, type WeekPlan } from '../lib/dietGenerator'
import type { MealSlot } from './useMeals'
import { useLocalStorage } from './useLocalStorage'

type Seeds = Record<number, number>     // week -> regen counter
type Overrides = Record<string, string> // `${week}-${dow}-${slot}` -> texto custom
type Done = Record<string, boolean>

const k = (week: number, dow: number, slot: MealSlot) => `${week}-${dow}-${slot}`

export function useDietPlan(week: number) {
  const [seeds, setSeeds] = useLocalStorage<Seeds>('yoga.dietSeeds', {})
  const [overrides, setOverrides] = useLocalStorage<Overrides>('yoga.dietOverrides', {})
  const [done, setDone] = useLocalStorage<Done>('yoga.dietDone', {})

  const seed = seeds[week] ?? 0
  const basePlan = useMemo(() => generateWeekPlan(week, seed), [week, seed])

  const plan: WeekPlan = useMemo(
    () =>
      basePlan.map((day, i) => {
        const dow = i + 1
        const out = { ...day }
        ;(Object.keys(day) as MealSlot[]).forEach((s) => {
          const ov = overrides[k(week, dow, s)]
          if (ov) out[s] = { ...out[s], text: ov }
        })
        return out
      }),
    [basePlan, overrides, week],
  )

  const summary = useMemo(() => summarize(basePlan), [basePlan])

  const regenerateWeek = () => setSeeds((p) => ({ ...p, [week]: (p[week] ?? 0) + 1 }))

  // Cambia esa comida por el siguiente plato de la MISMA categoría → mantiene equilibrio
  const swapMeal = (dow: number, slot: MealSlot) => {
    const cell = plan[dow - 1][slot]
    const next = nextInCategory(slot, cell.category, cell.text)
    setOverrides((p) => ({ ...p, [k(week, dow, slot)]: next }))
  }

  const editMeal = (dow: number, slot: MealSlot, text: string) =>
    setOverrides((p) => ({ ...p, [k(week, dow, slot)]: text }))

  const resetMeal = (dow: number, slot: MealSlot) =>
    setOverrides((p) => {
      const { [k(week, dow, slot)]: _drop, ...rest } = p
      void _drop
      return rest
    })

  const isDone = (dow: number, slot: MealSlot) => !!done[k(week, dow, slot)]
  const toggleDone = (dow: number, slot: MealSlot) =>
    setDone((p) => ({ ...p, [k(week, dow, slot)]: !p[k(week, dow, slot)] }))

  const dayCompletion = (dow: number) => {
    const slots: MealSlot[] = ['desayuno', 'mediamanana', 'comida', 'merienda', 'cena']
    return { ok: slots.filter((s) => isDone(dow, s)).length, total: slots.length }
  }

  return {
    plan,
    summary,
    seed,
    regenerateWeek,
    swapMeal,
    editMeal,
    resetMeal,
    isDone,
    toggleDone,
    dayCompletion,
  }
}
