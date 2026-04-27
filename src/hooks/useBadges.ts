import { useEffect, useMemo, useState } from 'react'
import { BADGES, type Badge } from '../data/badges'
import { useStats } from './useStats'
import { useLocalStorage } from './useLocalStorage'

export interface BadgeState extends Badge {
  unlocked: boolean
}

export function useBadges() {
  const stats = useStats()
  const [seen, setSeen] = useLocalStorage<string[]>('yoga.badgesSeen', [])
  const [justUnlocked, setJustUnlocked] = useState<Badge[]>([])

  const list: BadgeState[] = useMemo(
    () => BADGES.map((b) => ({ ...b, unlocked: b.predicate(stats) })),
    [stats],
  )

  const unlockedIds = useMemo(() => list.filter((b) => b.unlocked).map((b) => b.id), [list])

  useEffect(() => {
    const fresh = unlockedIds.filter((id) => !seen.includes(id))
    if (fresh.length > 0) {
      const freshBadges = BADGES.filter((b) => fresh.includes(b.id))
      setJustUnlocked(freshBadges)
      setSeen([...seen, ...fresh])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockedIds.join(',')])

  const dismissJustUnlocked = () => setJustUnlocked([])

  return {
    list,
    unlockedCount: unlockedIds.length,
    total: BADGES.length,
    justUnlocked,
    dismissJustUnlocked,
  }
}
