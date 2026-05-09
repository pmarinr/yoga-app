export const DAY_MS = 86400000

export function weekDateRange(startISO: string, week: number): { start: Date; end: Date; label: string } {
  const start = new Date(startISO + 'T00:00:00')
  start.setDate(start.getDate() + (week - 1) * 7)
  const end = new Date(start)
  end.setDate(end.getDate() + 6)
  const sameMonth = start.getMonth() === end.getMonth()
  const sameYear = start.getFullYear() === end.getFullYear()
  const fmt = (d: Date, withYear = false) =>
    d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', ...(withYear ? { year: '2-digit' } : {}) })
  const label = sameMonth
    ? `${start.getDate()}–${end.getDate()} ${end.toLocaleDateString('es-ES', { month: 'short' })}`
    : sameYear
      ? `${fmt(start)} – ${fmt(end)}`
      : `${fmt(start, true)} – ${fmt(end, true)}`
  return { start, end, label }
}

export function phaseDateRange(
  startISO: string,
  firstWeek: number,
  lastWeek: number,
): { label: string; startISO: string; endISO: string } {
  const a = weekDateRange(startISO, firstWeek)
  const b = weekDateRange(startISO, lastWeek)
  const sameMonth = a.start.getMonth() === b.end.getMonth() && a.start.getFullYear() === b.end.getFullYear()
  const fmt = (d: Date) => d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
  const label = sameMonth
    ? `${a.start.getDate()}–${b.end.getDate()} ${b.end.toLocaleDateString('es-ES', { month: 'short' })}`
    : `${fmt(a.start)} – ${fmt(b.end)}`
  return {
    label,
    startISO: a.start.toISOString().slice(0, 10),
    endISO: b.end.toISOString().slice(0, 10),
  }
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
