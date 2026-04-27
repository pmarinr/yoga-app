import { useLocalStorage } from './useLocalStorage'

export interface SessionLog {
  done: boolean
  notes?: string
}

export type SessionMap = Record<string, SessionLog> // key = `${week}-${dow}`

export function useSessions() {
  const [sessions, setSessions] = useLocalStorage<SessionMap>('yoga.sessions', {})

  const key = (week: number, dow: number) => `${week}-${dow}`

  const toggle = (week: number, dow: number) => {
    setSessions((prev) => {
      const k = key(week, dow)
      const cur = prev[k]
      return { ...prev, [k]: { ...cur, done: !cur?.done } }
    })
  }

  const setNotes = (week: number, dow: number, notes: string) => {
    setSessions((prev) => {
      const k = key(week, dow)
      return { ...prev, [k]: { ...prev[k], done: prev[k]?.done ?? false, notes } }
    })
  }

  const get = (week: number, dow: number): SessionLog | undefined => sessions[key(week, dow)]

  const completedCount = Object.values(sessions).filter((s) => s.done).length

  return { sessions, toggle, setNotes, get, completedCount, setSessions }
}
