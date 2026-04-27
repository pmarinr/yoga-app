import { useLocalStorage } from './useLocalStorage'

export type MealSlot = 'desayuno' | 'mediamanana' | 'comida' | 'merienda' | 'cena'

export const MEAL_SLOTS: { id: MealSlot; label: string; suggestion: string }[] = [
  { id: 'desayuno', label: 'Desayuno', suggestion: 'Yogur natural + avena + fruta + nueces' },
  { id: 'mediamanana', label: 'Media mañana', suggestion: 'Fruta o tostada integral con tomate' },
  { id: 'comida', label: 'Comida', suggestion: 'Ensalada grande + lentejas con verduras + AOVE' },
  { id: 'merienda', label: 'Merienda', suggestion: 'Yogur o puñado de almendras' },
  { id: 'cena', label: 'Cena', suggestion: 'Pescado a la plancha + verduras' },
]

export interface MealLog {
  text: string
  checked: boolean
}

export type DayMeals = Partial<Record<MealSlot, MealLog>>
export type MealsByDate = Record<string, DayMeals>

export function useMeals() {
  const [meals, setMeals] = useLocalStorage<MealsByDate>('yoga.meals', {})

  const update = (date: string, slot: MealSlot, patch: Partial<MealLog>) => {
    setMeals((prev) => {
      const day = prev[date] ?? {}
      const cur = day[slot] ?? { text: '', checked: false }
      return { ...prev, [date]: { ...day, [slot]: { ...cur, ...patch } } }
    })
  }

  const get = (date: string): DayMeals => meals[date] ?? {}

  return { meals, update, get, setMeals }
}
