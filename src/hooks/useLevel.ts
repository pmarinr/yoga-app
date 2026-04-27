import { useStats } from './useStats'

export interface LevelInfo {
  xp: number
  level: number
  name: string
  emoji: string
  nextThreshold: number | null
  prevThreshold: number
  progressToNext: number // 0..1
}

const TIERS: { name: string; emoji: string; min: number }[] = [
  { name: 'Aprendiz', emoji: '🌱', min: 0 },
  { name: 'Practicante', emoji: '🧘', min: 150 },
  { name: 'Yogui', emoji: '🪷', min: 400 },
  { name: 'Maestro', emoji: '🏔️', min: 800 },
  { name: 'Sensei', emoji: '☯️', min: 1500 },
]

export function useLevel(badgesUnlocked = 0): LevelInfo {
  const s = useStats()
  const xp =
    s.totalSessions * 10 +
    s.perfectDietDays * 5 +
    s.weightLogs * 5 +
    badgesUnlocked * 25 +
    s.currentStreak * 3

  let idx = 0
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].min) {
      idx = i
      break
    }
  }
  const tier = TIERS[idx]
  const next = TIERS[idx + 1]
  const span = next ? next.min - tier.min : 0
  const progressToNext = next ? Math.min(1, Math.max(0, (xp - tier.min) / span)) : 1

  return {
    xp,
    level: idx + 1,
    name: tier.name,
    emoji: tier.emoji,
    nextThreshold: next?.min ?? null,
    prevThreshold: tier.min,
    progressToNext,
  }
}
