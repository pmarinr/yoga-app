const DAY_MS = 86400000

export interface DatedKg {
  date: string
  kg: number
}

/**
 * Media móvil de N días: para cada punto, promedia los registros cuya fecha
 * está entre [t - (windowDays-1), t]. Pondera todos los pesos del rango
 * temporal igualmente, no por número de muestras.
 */
export function movingAverage(data: DatedKg[], windowDays = 7): { date: string; ma: number | null }[] {
  if (data.length === 0) return []
  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const ts = sorted.map((d) => new Date(d.date + 'T00:00:00').getTime())

  return sorted.map((d, i) => {
    const tEnd = ts[i]
    const tStart = tEnd - (windowDays - 1) * DAY_MS
    let sum = 0
    let count = 0
    for (let j = 0; j <= i; j++) {
      if (ts[j] >= tStart && ts[j] <= tEnd) {
        sum += sorted[j].kg
        count++
      }
    }
    return {
      date: d.date,
      ma: count > 0 ? +(sum / count).toFixed(2) : null,
    }
  })
}
