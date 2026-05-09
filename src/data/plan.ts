import type { Phase, SessionType } from './videos'

export interface PlanDay {
  week: number // 1..12
  dow: number // 1=lunes .. 7=domingo
  phase: Phase
  type: SessionType
  videoId?: string
  durationMin: number
}

export interface PlanWeek {
  week: number
  phase: Phase
  title: string
  frequencyLabel: string
  durationLabel: string
  intensity: string
  notes: string[]
  days: PlanDay[]
}

const buildWeek = (
  week: number,
  phase: Phase,
  pattern: { type: SessionType; videoId?: string; durationMin: number }[],
): PlanDay[] =>
  pattern.map((p, i) => ({
    week,
    dow: i + 1,
    phase,
    ...p,
  }))

// Fase 1 (semanas 1-4): 4 días/semana, 30-40 min
// L: hatha, M: vinyasa suave, X: descanso, J: hatha (saludo sol), V: vinyasa, S: descanso, D: descanso
const phase1Pattern: { type: SessionType; videoId?: string; durationMin: number }[] = [
  { type: 'hatha', videoId: 'hatha-principiantes', durationMin: 35 },
  { type: 'vinyasa', videoId: 'vinyasa-principiantes', durationMin: 35 },
  { type: 'descanso', durationMin: 0 },
  { type: 'hatha', videoId: 'saludo-sol-principiantes', durationMin: 30 },
  { type: 'vinyasa', videoId: 'vinyasa-principiantes', durationMin: 40 },
  { type: 'descanso', durationMin: 0 },
  { type: 'descanso', durationMin: 0 },
]

// Fase 2 (semanas 5-8): 5 días/semana, 40-50 min
const phase2Pattern: { type: SessionType; videoId?: string; durationMin: number }[] = [
  { type: 'power', videoId: 'fit-vinyasa-calorias', durationMin: 45 },
  { type: 'vinyasa', videoId: 'vinyasa-tonificar-45', durationMin: 45 },
  { type: 'movilidad', videoId: 'core-barco', durationMin: 40 },
  { type: 'power', videoId: 'fit-planchas', durationMin: 45 },
  { type: 'vinyasa', videoId: 'saludo-sol-dinamico', durationMin: 50 },
  { type: 'descanso', durationMin: 0 },
  { type: 'descanso', durationMin: 0 },
]

// Fase 3 (semanas 9-12): 5-6 días/semana, 45-60 min
// 3 intensos + 2 suaves + 1 restaurativo
const phase3Pattern: { type: SessionType; videoId?: string; durationMin: number }[] = [
  { type: 'power', videoId: 'fit-adelgazar', durationMin: 50 },
  { type: 'hatha', videoId: 'yoga-tranquilo', durationMin: 45 },
  { type: 'power', videoId: 'fit-vinyasa-calorias', durationMin: 50 },
  { type: 'movilidad', videoId: 'yoga-tranquilo', durationMin: 45 },
  { type: 'power', videoId: 'fit-planchas', durationMin: 55 },
  { type: 'restaurativo', videoId: 'restaurativo-30', durationMin: 30 },
  { type: 'descanso', durationMin: 0 },
]

export interface PhaseBoundaries {
  phase1End: number
  phase2End: number
  phase3End: number
}

export function phaseBoundariesFor(weeks: number): PhaseBoundaries {
  const w = Math.max(1, Math.round(weeks))
  // Distribución proporcional ⅓-⅓-⅓ con mínimo de 1 semana por fase
  let p1 = Math.max(1, Math.floor(w / 3))
  let p2 = Math.max(p1 + 1, Math.floor((2 * w) / 3))
  if (w === 1) {
    p1 = 1
    p2 = 1
  } else if (w === 2) {
    p1 = 1
    p2 = 1
  }
  if (p2 >= w) p2 = Math.max(p1, w - 1)
  return { phase1End: p1, phase2End: p2, phase3End: w }
}

export function buildPlan(weeks: number): PlanWeek[] {
  const totalWeeks = Math.max(1, Math.min(52, Math.round(weeks)))
  const { phase1End, phase2End } = phaseBoundariesFor(totalWeeks)

  return Array.from({ length: totalWeeks }, (_, i) => {
    const week = i + 1
    const phase: Phase = week <= phase1End ? 1 : week <= phase2End ? 2 : 3
    const pattern = phase === 1 ? phase1Pattern : phase === 2 ? phase2Pattern : phase3Pattern
    const meta =
      phase === 1
        ? {
            title: 'Adaptación',
            frequencyLabel: '4 días/semana',
            durationLabel: '30–40 min',
            intensity: 'Baja–moderada',
            notes: [
              'Calentamiento (5–10 min)',
              'Saludo al sol 3–5 rondas',
              'Posturas clave: Guerrero I y II, Perro boca abajo, Plancha (modificada si hace falta)',
              'Pranayama 5 min',
            ],
          }
        : phase === 2
        ? {
            title: 'Progresión',
            frequencyLabel: '5 días/semana',
            durationLabel: '40–50 min',
            intensity: 'Moderada',
            notes: [
              '6–8 saludos al sol',
              'Posturas mantenidas (30–45 seg)',
              'Trabajo de core: barco, planchas',
            ],
          }
        : {
            title: 'Quema de grasa',
            frequencyLabel: '5–6 días/semana',
            durationLabel: '45–60 min',
            intensity: 'Moderada–alta',
            notes: [
              '3 días intensos (Power/Vinyasa)',
              '2 días suaves (Hatha o movilidad)',
              '1 día restaurativo',
              'Transiciones rápidas y posturas de equilibrio',
            ],
          }

    return {
      week,
      phase,
      ...meta,
      days: buildWeek(week, phase, pattern),
    }
  })
}

// Plan por defecto (12 semanas) — la mayoría de consumidores usan usePlan() para obtener el plan dinámico.
export const PLAN: PlanWeek[] = buildPlan(12)

export const PHASE_COLOR: Record<Phase, string> = {
  1: 'bg-emerald-200',
  2: 'bg-amber-300',
  3: 'bg-rose-500',
}

// Color hex de cada fase (paleta iOS)
export const PHASE_HEX: Record<Phase, string> = {
  1: '#34C759', // verde
  2: '#FFCC00', // amarillo/dorado
  3: '#FF3B30', // rojo intenso
}

export const PHASE_LABEL: Record<Phase, string> = {
  1: 'Fase 1 — Adaptación',
  2: 'Fase 2 — Progresión',
  3: 'Fase 3 — Quema de grasa',
}

export const DOW_LABEL = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

export const SESSION_LABEL: Record<SessionType, string> = {
  hatha: 'Hatha',
  vinyasa: 'Vinyasa',
  power: 'Power',
  restaurativo: 'Restaurativo',
  movilidad: 'Movilidad',
  descanso: 'Descanso',
}

export const sessionEmoji: Record<SessionType, string> = {
  hatha: '🧘',
  vinyasa: '🌬️',
  power: '🔥',
  restaurativo: '🛌',
  movilidad: '🤸',
  descanso: '☕',
}
