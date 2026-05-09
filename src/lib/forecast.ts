export interface Forecast {
  slope: number              // kg/día (negativo = pierdes)
  intercept: number          // kg en el día 0 (primera fecha)
  kgPerWeek: number
  eta: string | null         // ISO YYYY-MM-DD donde la línea cruza el objetivo
  series: Array<{ date: string; kg: number | null; trend: number }>
}

const DAY_MS = 86400000

export function forecastTarget(
  data: { date: string; kg: number }[],
  target: number,
): Forecast | null {
  if (data.length < 2) return null

  const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date))
  const t0 = new Date(sorted[0].date + 'T00:00:00').getTime()

  const pts = sorted.map((p) => ({
    x: (new Date(p.date + 'T00:00:00').getTime() - t0) / DAY_MS,
    y: p.kg,
  }))

  // Regresión lineal por mínimos cuadrados
  const n = pts.length
  const sumX = pts.reduce((s, p) => s + p.x, 0)
  const sumY = pts.reduce((s, p) => s + p.y, 0)
  const sumXY = pts.reduce((s, p) => s + p.x * p.y, 0)
  const sumX2 = pts.reduce((s, p) => s + p.x * p.x, 0)
  const denom = n * sumX2 - sumX * sumX
  if (denom === 0) return null
  const slope = (n * sumXY - sumX * sumY) / denom
  const intercept = (sumY - slope * sumX) / n

  // ETA: solo si bajamos
  let eta: string | null = null
  let etaDay: number | null = null
  if (slope < -1e-6) {
    const d = (target - intercept) / slope
    // Aceptar hasta 2 años hacia adelante
    if (d > pts[0].x && d <= pts[pts.length - 1].x + 365 * 2) {
      etaDay = d
      eta = new Date(t0 + d * DAY_MS).toISOString().slice(0, 10)
    }
  }

  // Construir series: puntos reales + extrapolación
  const series: Array<{ date: string; kg: number | null; trend: number }> = []

  // Datos reales
  pts.forEach((p, i) => {
    series.push({
      date: sorted[i].date,
      kg: p.y,
      trend: +(intercept + slope * p.x).toFixed(2),
    })
  })

  const lastReal = pts[pts.length - 1].x
  const projectionEnd = etaDay ?? lastReal + 30

  // Añadir puntos cada 7 días desde el último real hasta el final
  for (let d = lastReal + 7; d < projectionEnd; d += 7) {
    series.push({
      date: new Date(t0 + d * DAY_MS).toISOString().slice(0, 10),
      kg: null,
      trend: +(intercept + slope * d).toFixed(2),
    })
  }
  // Punto final exacto
  if (etaDay !== null) {
    series.push({
      date: eta!,
      kg: null,
      trend: target,
    })
  } else {
    series.push({
      date: new Date(t0 + projectionEnd * DAY_MS).toISOString().slice(0, 10),
      kg: null,
      trend: +(intercept + slope * projectionEnd).toFixed(2),
    })
  }

  return {
    slope,
    intercept,
    kgPerWeek: +(slope * 7).toFixed(2),
    eta,
    series,
  }
}

export function formatEta(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}
