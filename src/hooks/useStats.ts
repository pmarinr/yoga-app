import { useMemo } from 'react'
import { PLAN } from '../data/plan'
import { useSessions } from './useSessions'
import { useWeights, START_KG } from './useWeights'
import { useLocalStorage } from './useLocalStorage'
import { useStartDate } from './useStartDate'

interface DietDone {
  [key: string]: boolean // `${week}-${dow}-${slot}`
}

export interface Stats {
  totalSessions: number
  currentStreak: number
  bestStreak: number
  weeksCompleted: number          // semanas con TODAS las sesiones programadas hechas
  perfectDietDays: number         // días con 5/5 comidas marcadas
  perfectDietWeeks: number
  weightLogs: number
  currentWeight: number | null
  kgLost: number
  todaySessionDone: boolean
  todayDietPct: number            // 0..1
  weekRecentLogged: boolean       // peso registrado en últimos 7 días
}

const dayDiff = (a: Date, b: Date) =>
  Math.round((a.getTime() - b.getTime()) / 86400000)

export function useStats(): Stats {
  const { sessions } = useSessions()
  const { weights, last, lost } = useWeights()
  const { startDate, currentDayIndex } = useStartDate()
  const [dietDone] = useLocalStorage<DietDone>('yoga.dietDone', {})

  return useMemo(() => {
    // Sesiones programadas (excluye descansos): map (week-dow) -> tiene programada
    const programmed = new Map<string, boolean>()
    PLAN.forEach((w) =>
      w.days.forEach((d) => {
        if (d.type !== 'descanso') programmed.set(`${d.week}-${d.dow}`, true)
      }),
    )

    // Lista de fechas reales en las que se completó sesión, ordenadas
    const start = new Date(startDate + 'T00:00:00')
    const doneDates: Date[] = []
    Object.entries(sessions).forEach(([key, log]) => {
      if (!log.done) return
      const [w, d] = key.split('-').map(Number)
      const offset = (w - 1) * 7 + (d - 1)
      const date = new Date(start)
      date.setDate(date.getDate() + offset)
      doneDates.push(date)
    })
    doneDates.sort((a, b) => a.getTime() - b.getTime())

    // Mejor streak y streak actual
    let bestStreak = 0
    let cur = 0
    let prev: Date | null = null
    for (const d of doneDates) {
      if (prev && dayDiff(d, prev) === 1) cur++
      else cur = 1
      if (cur > bestStreak) bestStreak = cur
      prev = d
    }

    // Streak actual (terminando hoy o ayer)
    let currentStreak = 0
    if (doneDates.length > 0) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tail = doneDates[doneDates.length - 1]
      tail.setHours(0, 0, 0, 0)
      const gapEnd = dayDiff(today, tail)
      if (gapEnd <= 1) {
        currentStreak = 1
        for (let i = doneDates.length - 2; i >= 0; i--) {
          if (dayDiff(doneDates[i + 1], doneDates[i]) === 1) currentStreak++
          else break
        }
      }
    }

    // Semanas con todas las sesiones programadas hechas
    let weeksCompleted = 0
    PLAN.forEach((w) => {
      const need = w.days.filter((d) => d.type !== 'descanso').map((d) => `${d.week}-${d.dow}`)
      if (need.length > 0 && need.every((k) => sessions[k]?.done)) weeksCompleted++
    })

    // Dieta: días con 5/5 marcados y semanas perfectas
    const perDayCount: Record<string, number> = {} // key `${week}-${dow}` -> count
    Object.entries(dietDone).forEach(([k, v]) => {
      if (!v) return
      const parts = k.split('-')
      const dayKey = `${parts[0]}-${parts[1]}`
      perDayCount[dayKey] = (perDayCount[dayKey] ?? 0) + 1
    })
    const perfectDietDays = Object.values(perDayCount).filter((c) => c >= 5).length
    let perfectDietWeeks = 0
    for (let w = 1; w <= 12; w++) {
      let okDays = 0
      for (let d = 1; d <= 7; d++) if ((perDayCount[`${w}-${d}`] ?? 0) >= 5) okDays++
      if (okDays === 7) perfectDietWeeks++
    }

    // Hoy
    const today = currentDayIndex()
    const todaySessionDone = today ? !!sessions[`${today.week}-${today.dow}`]?.done : false
    let todayDietPct = 0
    if (today) {
      const cnt = perDayCount[`${today.week}-${today.dow}`] ?? 0
      todayDietPct = Math.min(1, cnt / 5)
    }

    // Peso reciente
    let weekRecentLogged = false
    if (last) {
      const lastDate = new Date(last.date + 'T00:00:00')
      const today2 = new Date()
      today2.setHours(0, 0, 0, 0)
      weekRecentLogged = dayDiff(today2, lastDate) <= 7
    }

    return {
      totalSessions: doneDates.length,
      currentStreak,
      bestStreak,
      weeksCompleted,
      perfectDietDays,
      perfectDietWeeks,
      weightLogs: weights.length,
      currentWeight: last?.kg ?? null,
      kgLost: lost,
      todaySessionDone,
      todayDietPct,
      weekRecentLogged,
    }
  }, [sessions, weights, last, lost, startDate, dietDone, currentDayIndex])
}

export { START_KG }
