import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { type WeightEntry, useWeights } from '../hooks/useWeights'
import { useTheme } from '../hooks/useTheme'
import { forecastTarget } from '../lib/forecast'
import { movingAverage } from '../lib/movingAverage'

interface Props {
  data: WeightEntry[]
}

interface Row {
  t: number
  date: string
  kg: number | null
  trend: number | null
  ma7?: number | null
}

const formatTick = (t: number) =>
  new Date(t).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })

export function WeightChart({ data }: Props) {
  const { isDark } = useTheme()
  const { startKg: START_KG, targetKg: TARGET_KG } = useWeights()
  const grid = isDark ? '#1f2937' : '#e2e8f0'
  const text = isDark ? '#94a3b8' : '#475569'

  if (data.length === 0) {
    return (
      <div className="h-56 grid place-items-center text-sm text-slate-400 dark:text-slate-500 border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl">
        Aún no hay registros. Añade tu primer peso.
      </div>
    )
  }

  const forecast = forecastTarget(data, TARGET_KG)
  const ma = movingAverage(data, 7)
  const maByDate = new Map(ma.map((m) => [m.date, m.ma]))

  const series: Row[] = (forecast
    ? forecast.series
    : data.map((d) => ({
        t: new Date(d.date + 'T00:00:00').getTime(),
        date: d.date,
        kg: d.kg,
        trend: null as number | null,
      }))
  ).map((r) => ({ ...r, ma7: maByDate.get(r.date) ?? null }))

  // Dominio temporal: del primer registro al último punto (real o proyectado)
  const tMin = series[0].t
  const tMax = series[series.length - 1].t

  const yValues = [
    ...data.map((d) => d.kg),
    ...(forecast ? forecast.series.map((s) => s.trend ?? 0) : []),
    TARGET_KG,
    START_KG,
  ]
  const yMin = Math.floor(Math.min(...yValues) - 0.5)
  const yMax = Math.ceil(Math.max(...yValues) + 0.5)

  return (
    <div className="h-72">
      <ResponsiveContainer>
        <LineChart data={series} margin={{ left: -10, right: 16, top: 16, bottom: 0 }}>
          <CartesianGrid stroke={grid} strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="t"
            domain={[tMin, tMax]}
            scale="time"
            tickFormatter={formatTick}
            tick={{ fontSize: 11, fill: text }}
            stroke={grid}
          />
          <YAxis domain={[yMin, yMax]} tick={{ fontSize: 11, fill: text }} stroke={grid} />
          <Tooltip
            contentStyle={{
              background: isDark ? '#1c1c1e' : '#fff',
              border: `1px solid ${grid}`,
              borderRadius: 12,
              color: isDark ? '#e2e8f0' : '#0f172a',
              fontSize: 12,
            }}
            labelFormatter={(t) => formatTick(Number(t))}
            formatter={(value, name) => {
              if (value == null) return ['—', name as string]
              const label = name === 'kg' ? 'Real' : name === 'trend' ? 'Tendencia' : 'Media 7d'
              return [`${value} kg`, label]
            }}
          />
          <ReferenceLine
            y={TARGET_KG}
            stroke="#34C759"
            strokeDasharray="4 4"
            label={{ value: `Meta ${TARGET_KG}`, fontSize: 11, fill: '#34C759', position: 'right' }}
          />
          <ReferenceLine
            y={START_KG}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: `Inicio ${START_KG}`, fontSize: 11, fill: text, position: 'right' }}
          />
          {forecast && (
            <Line
              type="linear"
              dataKey="trend"
              stroke="#AF52DE"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              isAnimationActive={false}
            />
          )}
          <Line
            type="monotone"
            dataKey="ma7"
            stroke="#00C7BE"
            strokeWidth={2}
            dot={false}
            connectNulls
            isAnimationActive={false}
          />
          <Line
            type="monotone"
            dataKey="kg"
            stroke="#0A84FF"
            strokeWidth={2.5}
            dot={{ r: 3.5, fill: '#0A84FF', stroke: '#fff', strokeWidth: 1 }}
            connectNulls={false}
            isAnimationActive
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
