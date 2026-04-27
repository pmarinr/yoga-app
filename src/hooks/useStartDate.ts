import { useLocalStorage } from './useLocalStorage'

export const todayISO = () => new Date().toISOString().slice(0, 10)

export function useStartDate() {
  const [startDate, setStartDate] = useLocalStorage<string>('yoga.startDate', todayISO())

  const currentDayIndex = (): { week: number; dow: number } | null => {
    const start = new Date(startDate + 'T00:00:00')
    const now = new Date(todayISO() + 'T00:00:00')
    const diffDays = Math.floor((now.getTime() - start.getTime()) / 86400000)
    if (diffDays < 0 || diffDays >= 84) return null
    const week = Math.floor(diffDays / 7) + 1
    const dow = (diffDays % 7) + 1
    return { week, dow }
  }

  return { startDate, setStartDate, currentDayIndex }
}
