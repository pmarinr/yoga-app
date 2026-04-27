import type { Stats } from '../hooks/useStats'

export interface Badge {
  id: string
  title: string
  desc: string
  icon: string
  predicate: (s: Stats) => boolean
}

export const BADGES: Badge[] = [
  { id: 'first',          title: 'Primer día',           desc: 'Completa tu primera sesión',         icon: '🌱', predicate: (s) => s.totalSessions >= 1 },
  { id: 'streak3',        title: 'Racha de 3',           desc: '3 días seguidos de práctica',        icon: '🔥', predicate: (s) => s.bestStreak >= 3 },
  { id: 'streak7',        title: 'Racha de 7',           desc: 'Una semana sin saltarte un día',     icon: '🔥', predicate: (s) => s.bestStreak >= 7 },
  { id: 'streak21',       title: 'Hábito',               desc: '21 días consecutivos',               icon: '🔥', predicate: (s) => s.bestStreak >= 21 },
  { id: 'sessions10',     title: '10 sesiones',          desc: 'Has completado 10 sesiones',         icon: '🧘', predicate: (s) => s.totalSessions >= 10 },
  { id: 'sessions25',     title: '25 sesiones',          desc: 'Has completado 25 sesiones',         icon: '🧘', predicate: (s) => s.totalSessions >= 25 },
  { id: 'sessions50',     title: '50 sesiones',          desc: 'Has completado 50 sesiones',         icon: '🧘', predicate: (s) => s.totalSessions >= 50 },
  { id: 'week1',          title: 'Primera semana',       desc: '1 semana entera con todas las sesiones', icon: '✅', predicate: (s) => s.weeksCompleted >= 1 },
  { id: 'phase1',         title: 'Fase 1 completa',      desc: 'Semanas 1 a 4 al 100%',              icon: '🥉', predicate: (s) => s.weeksCompleted >= 4 },
  { id: 'phase2',         title: 'Fase 2 completa',      desc: 'Semanas 5 a 8 al 100%',              icon: '🥈', predicate: (s) => s.weeksCompleted >= 8 },
  { id: 'phase3',         title: 'Plan completo',        desc: 'Las 12 semanas marcadas',            icon: '🏆', predicate: (s) => s.weeksCompleted >= 12 },
  { id: 'diet5',          title: 'Día mediterráneo',     desc: 'Las 5 comidas marcadas en un día',   icon: '🥗', predicate: (s) => s.perfectDietDays >= 1 },
  { id: 'dietWeek',       title: 'Semana mediterránea', desc: '7 días con 5/5 comidas',             icon: '🥗', predicate: (s) => s.perfectDietWeeks >= 1 },
  { id: 'weight92',       title: 'Bajo 92 kg',           desc: 'Primer hito de peso',                icon: '⚖️', predicate: (s) => s.currentWeight !== null && s.currentWeight < 92 },
  { id: 'weight90',       title: 'Bajo 90 kg',           desc: 'Cruzas la barrera de los 90',        icon: '⚖️', predicate: (s) => s.currentWeight !== null && s.currentWeight < 90 },
  { id: 'weight87',       title: 'Bajo 87 kg',           desc: '7 kg menos',                         icon: '⚖️', predicate: (s) => s.currentWeight !== null && s.currentWeight < 87 },
  { id: 'weight85',       title: 'Objetivo 85 kg',       desc: 'Has alcanzado tu meta 🎉',           icon: '🎯', predicate: (s) => s.currentWeight !== null && s.currentWeight <= 85 },
]
