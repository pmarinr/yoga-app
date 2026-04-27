import { POOL, WEEK_TEMPLATE } from '../data/dietPool'
import type { MealSlot } from '../hooks/useMeals'

export const SLOTS: MealSlot[] = ['desayuno', 'mediamanana', 'comida', 'merienda', 'cena']

export interface PlannedMeal {
  text: string
  category: string // categoría nutricional dentro del slot
}

export type WeekPlan = Array<Record<MealSlot, PlannedMeal>>

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function rotate<T>(arr: T[], n: number): T[] {
  const k = ((n % arr.length) + arr.length) % arr.length
  return [...arr.slice(k), ...arr.slice(0, k)]
}

// La plantilla nutricional fija el "qué tipo" de cada comida cada día.
// El seed (semana + regen) decide "qué plato concreto" dentro de cada categoría
// y rota el orden de los días para variar entre semanas.
export function generateWeekPlan(week: number, regenCounter: number): WeekPlan {
  const seedNum = week * 100 + regenCounter * 17
  const rand = mulberry32(seedNum)

  // Rotación de la plantilla por semana → variedad entre semanas sin romper cuotas
  const dayShift = (week - 1 + regenCounter) % 7

  const days: WeekPlan = Array.from({ length: 7 }, () => ({
    desayuno: { text: '', category: '' },
    mediamanana: { text: '', category: '' },
    comida: { text: '', category: '' },
    merienda: { text: '', category: '' },
    cena: { text: '', category: '' },
  }))

  for (const slot of SLOTS) {
    const seq = rotate(WEEK_TEMPLATE[slot], dayShift)
    seq.forEach((cat, dow) => {
      const opts = POOL[slot][cat]
      const idx = Math.floor(rand() * opts.length)
      days[dow][slot] = { text: opts[idx], category: cat }
    })
  }

  return days
}

export function nextInCategory(slot: MealSlot, category: string, current: string): string {
  const opts = POOL[slot][category] ?? []
  if (opts.length === 0) return current
  const i = opts.indexOf(current)
  return opts[(i + 1) % opts.length]
}

// Resumen nutricional: cuántas veces aparece cada categoría a la semana
export interface NutritionSummary {
  pescado: number
  legumbres: number
  pollo_pavo: number
  huevo: number
  vegetariana: number
  fruta_dia: number // días con al menos 1 fruta
}

export function summarize(plan: WeekPlan): NutritionSummary {
  const out: NutritionSummary = {
    pescado: 0,
    legumbres: 0,
    pollo_pavo: 0,
    huevo: 0,
    vegetariana: 0,
    fruta_dia: 0,
  }
  plan.forEach((day) => {
    if (day.comida.category === 'pescado') out.pescado++
    if (day.cena.category === 'pescado') out.pescado++
    if (day.comida.category === 'legumbre') out.legumbres++
    if (day.comida.category === 'pollo') out.pollo_pavo++
    if (day.cena.category === 'pollo_pavo') out.pollo_pavo++
    if (day.cena.category === 'huevo') out.huevo++
    if (day.comida.category === 'cereal_verde') out.vegetariana++
    if (
      day.mediamanana.category === 'fruta_fs' ||
      day.mediamanana.category === 'fruta_lacteo' ||
      day.merienda.category === 'fruta_fs' ||
      day.merienda.category === 'fruta_lacteo'
    ) {
      out.fruta_dia++
    }
  })
  return out
}
