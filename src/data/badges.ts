import type { Stats } from '../hooks/useStats'

export interface Badge {
  id: string
  title: string
  desc: string
  icon: string
  predicate: (s: Stats) => boolean
}

const weightAt = (s: Stats, pct: number) => s.startKg - pct * (s.startKg - s.targetKg)

export const BADGES: Badge[] = [
  { id: 'first',          title: 'Primer día',           desc: 'Completa tu primera sesión',          icon: '🌱', predicate: (s) => s.totalSessions >= 1 },
  { id: 'streak3',        title: 'Racha de 3',           desc: '3 días seguidos de práctica',         icon: '🔥', predicate: (s) => s.bestStreak >= 3 },
  { id: 'streak7',        title: 'Racha de 7',           desc: 'Una semana sin saltarte un día',      icon: '🔥', predicate: (s) => s.bestStreak >= 7 },
  { id: 'streak21',       title: 'Hábito',               desc: '21 días consecutivos',                icon: '🔥', predicate: (s) => s.bestStreak >= 21 },
  { id: 'sessions10',     title: '10 sesiones',          desc: 'Has completado 10 sesiones',          icon: '🧘', predicate: (s) => s.totalSessions >= 10 },
  { id: 'sessions25',     title: '25 sesiones',          desc: 'Has completado 25 sesiones',          icon: '🧘', predicate: (s) => s.totalSessions >= 25 },
  { id: 'sessions50',     title: '50 sesiones',          desc: 'Has completado 50 sesiones',          icon: '🧘', predicate: (s) => s.totalSessions >= 50 },
  { id: 'week1',          title: 'Primera semana',       desc: 'Una semana entera con todas las sesiones', icon: '✅', predicate: (s) => s.weeksCompleted >= 1 },
  { id: 'phase1',         title: 'Fase 1 completa',      desc: 'Adaptación al 100%',                  icon: '🥉', predicate: (s) => s.weeksCompleted >= Math.max(1, Math.floor(s.totalWeeks / 3)) },
  { id: 'phase2',         title: 'Fase 2 completa',      desc: 'Progresión al 100%',                  icon: '🥈', predicate: (s) => s.weeksCompleted >= Math.max(2, Math.floor((2 * s.totalWeeks) / 3)) },
  { id: 'planComplete',   title: 'Plan completo',        desc: 'Todas las semanas marcadas',          icon: '🏆', predicate: (s) => s.weeksCompleted >= s.totalWeeks },
  { id: 'diet5',          title: 'Día mediterráneo',     desc: 'Las 5 comidas marcadas en un día',    icon: '🥗', predicate: (s) => s.perfectDietDays >= 1 },
  { id: 'dietWeek',       title: 'Semana mediterránea', desc: '7 días con 5/5 comidas',              icon: '🥗', predicate: (s) => s.perfectDietWeeks >= 1 },
  { id: 'weight25',       title: 'Primer cuarto',        desc: '25% del camino al objetivo',          icon: '⚖️', predicate: (s) => s.currentWeight !== null && s.currentWeight <= weightAt(s, 0.25) },
  { id: 'weight50',       title: 'Mitad del camino',     desc: '50% del camino al objetivo',          icon: '⚖️', predicate: (s) => s.currentWeight !== null && s.currentWeight <= weightAt(s, 0.5) },
  { id: 'weight75',       title: 'Casi en meta',         desc: '75% del camino al objetivo',          icon: '⚖️', predicate: (s) => s.currentWeight !== null && s.currentWeight <= weightAt(s, 0.75) },
  { id: 'goal',           title: 'Objetivo alcanzado',   desc: 'Has llegado a tu meta 🎉',            icon: '🎯', predicate: (s) => s.currentWeight !== null && s.currentWeight <= s.targetKg },
]
