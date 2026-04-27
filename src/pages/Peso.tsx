import { useState } from 'react'
import { WeightChart } from '../components/WeightChart'
import { START_KG, TARGET_KG, useWeights } from '../hooks/useWeights'
import { todayISO } from '../hooks/useStartDate'
import { Card, HeroMetric, SectionTitle } from '../components/Card'

export function PesoPage() {
  const { weights, add, remove, last, lost, progressPct } = useWeights()
  const [date, setDate] = useState(todayISO())
  const [kg, setKg] = useState<string>('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const n = parseFloat(kg.replace(',', '.'))
    if (!isFinite(n) || n <= 0) return
    add({ date, kg: n })
    setKg('')
  }

  const trend =
    weights.length >= 2 ? +(weights[weights.length - 1].kg - weights[weights.length - 2].kg).toFixed(1) : 0

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-peso">Peso</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Tu progreso</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Inicio {START_KG} kg · objetivo {TARGET_KG} kg
        </p>
      </header>

      <Card>
        <div className="grid grid-cols-3 gap-4 items-end">
          <HeroMetric
            label="Actual"
            value={last ? `${last.kg}` : '—'}
            unit={last ? 'kg' : undefined}
            color="#0A84FF"
            hint={last?.date}
          />
          <HeroMetric
            label="Perdidos"
            value={`${lost.toFixed(1)}`}
            unit="kg"
            color="#34C759"
            hint={trend !== 0 ? (trend < 0 ? `▼ ${Math.abs(trend)}` : `▲ ${trend}`) : '—'}
          />
          <HeroMetric
            label="Progreso"
            value={`${progressPct.toFixed(0)}`}
            unit="%"
            color="#AF52DE"
          />
        </div>
        <div className="mt-4 h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #34C759, #1FD3FF, #0A84FF)',
            }}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Tendencia" title="Evolución" color="#0A84FF" />
        <WeightChart data={weights} />
      </Card>

      <Card>
        <SectionTitle eyebrow="Nuevo registro" title="Añadir peso" color="#0A84FF" />
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fecha</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Peso (kg)</div>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2 w-28"
              placeholder="93.5"
              required
            />
          </label>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-peso hover:opacity-90 text-white text-sm font-semibold shadow-glow active:scale-95 transition"
          >
            Guardar
          </button>
        </form>
      </Card>

      {weights.length > 0 && (
        <Card>
          <SectionTitle eyebrow="Histórico" title="Registros" color="#0A84FF" />
          <ul className="divide-y divider text-sm">
            {[...weights].reverse().map((w) => (
              <li key={w.date} className="flex items-center justify-between py-3">
                <span className="text-slate-600 dark:text-slate-400 tabular-nums">{w.date}</span>
                <span className="font-semibold tabular-nums">{w.kg} kg</span>
                <button
                  onClick={() => remove(w.date)}
                  className="text-xs text-rose-500 hover:underline"
                >
                  borrar
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
