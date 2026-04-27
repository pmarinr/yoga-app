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
import { START_KG, TARGET_KG, type WeightEntry } from '../hooks/useWeights'

interface Props {
  data: WeightEntry[]
}

export function WeightChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="h-56 grid place-items-center text-sm text-slate-400 border border-dashed rounded-lg">
        Aún no hay registros. Añade tu primer peso.
      </div>
    )
  }
  return (
    <div className="h-64">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ left: -10, right: 10, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis domain={[Math.min(TARGET_KG - 1, ...data.map((d) => d.kg)), Math.max(START_KG, ...data.map((d) => d.kg))]} tick={{ fontSize: 11 }} />
          <Tooltip />
          <ReferenceLine y={TARGET_KG} stroke="#0d9488" strokeDasharray="4 4" label={{ value: `Objetivo ${TARGET_KG}`, fontSize: 11, fill: '#0d9488' }} />
          <ReferenceLine y={START_KG} stroke="#94a3b8" strokeDasharray="4 4" label={{ value: `Inicio ${START_KG}`, fontSize: 11, fill: '#64748b' }} />
          <Line type="monotone" dataKey="kg" stroke="#0d9488" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
