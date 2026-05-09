import { useState } from 'react'
import { WeightChart } from '../components/WeightChart'
import { useWeights } from '../hooks/useWeights'
import { todayISO, useStartDate } from '../hooks/useStartDate'
import { useGoals } from '../hooks/useGoals'
import { Card, HeroMetric, SectionTitle } from '../components/Card'
import { forecastTarget, formatEta } from '../lib/forecast'

const DAY_MS = 86400000

export function PesoPage() {
  const { weights, add, remove, last, lost, progressPct, startKg, targetKg } = useWeights()
  const { startDate } = useStartDate()
  const { endDate } = useGoals(startDate)
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

  const forecast = forecastTarget(weights, targetKg)

  // Estimación a la fecha límite
  let projectedAtDeadline: number | null = null
  if (forecast && endDate && weights.length >= 2) {
    const t0 = new Date(weights[0].date + 'T00:00:00').getTime()
    const tEnd = new Date(endDate + 'T00:00:00').getTime()
    const days = (tEnd - t0) / DAY_MS
    projectedAtDeadline = +(forecast.intercept + forecast.slope * days).toFixed(1)
  }

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-peso">Peso</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Tu progreso</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Inicio {startKg} kg · objetivo {targetKg} kg
          {endDate ? ` · meta ${formatEta(endDate)}` : ''}
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
        <SectionTitle
          eyebrow="Tendencia"
          title="Evolución"
          color="#0A84FF"
          right={
            forecast ? (
              <span
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: forecast.kgPerWeek < 0 ? 'rgba(52,199,89,0.15)' : 'rgba(255,159,10,0.15)',
                  color: forecast.kgPerWeek < 0 ? '#34C759' : '#FF9F0A',
                }}
              >
                {forecast.kgPerWeek > 0 ? '+' : ''}
                {forecast.kgPerWeek} kg/sem
              </span>
            ) : null
          }
        />
        <WeightChart data={weights} />
        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <Legend label="Peso real" color="#0A84FF" />
          <Legend label="Media 7 días" color="#00C7BE" />
          <Legend label="Tendencia" color="#AF52DE" dashed />
        </div>
        {forecast && (
          <div className="mt-4 space-y-2">
            <div className="rounded-2xl bg-gradient-to-br from-meta/10 to-peso/10 dark:from-meta/15 dark:to-peso/15 border border-meta/20 dark:border-meta/30 p-3 flex items-center gap-3">
              <div className="text-2xl">🎯</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] uppercase tracking-wider text-meta font-semibold">
                  Estimación al objetivo
                </div>
                {forecast.eta ? (
                  <div className="text-sm">
                    Llegarías a <strong className="font-semibold tabular-nums">{targetKg} kg</strong>{' '}
                    alrededor del{' '}
                    <strong className="font-semibold capitalize">{formatEta(forecast.eta)}</strong>
                    <span className="text-slate-500 dark:text-slate-400"> al ritmo actual.</span>
                  </div>
                ) : forecast.kgPerWeek >= 0 ? (
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    Tu tendencia actual no baja: prueba a aumentar actividad o ajustar la dieta.
                  </div>
                ) : (
                  <div className="text-sm text-slate-700 dark:text-slate-200">
                    Registra más pesos para afinar la estimación.
                  </div>
                )}
              </div>
            </div>

            {endDate && projectedAtDeadline !== null && (
              <DeadlineBanner
                endDate={endDate}
                projected={projectedAtDeadline}
                target={targetKg}
              />
            )}
          </div>
        )}
        {!forecast && weights.length < 2 && (
          <div className="mt-3 text-xs text-slate-500 dark:text-slate-400 text-center">
            Añade al menos 2 registros para ver la línea de tendencia.
          </div>
        )}
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

function Legend({ label, color, dashed }: { label: string; color: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block w-4 h-0.5"
        style={
          dashed
            ? { background: `repeating-linear-gradient(90deg, ${color} 0 4px, transparent 4px 8px)` }
            : { background: color }
        }
      />
      {label}
    </span>
  )
}

function DeadlineBanner({
  endDate,
  projected,
  target,
}: {
  endDate: string
  projected: number
  target: number
}) {
  const meets = projected <= target
  const delta = +(projected - target).toFixed(1)

  return (
    <div
      className={`rounded-2xl p-3 flex items-center gap-3 border ${
        meets
          ? 'bg-gradient-to-br from-dieta/10 to-stand/10 dark:from-dieta/15 dark:to-stand/15 border-dieta/20 dark:border-dieta/30'
          : 'bg-gradient-to-br from-racha/10 to-yoga/10 dark:from-racha/15 dark:to-yoga/15 border-racha/20 dark:border-racha/30'
      }`}
    >
      <div className="text-2xl">{meets ? '🟢' : '⏳'}</div>
      <div className="flex-1 min-w-0">
        <div
          className={`text-[11px] uppercase tracking-wider font-semibold ${meets ? 'text-dieta' : 'text-racha'}`}
        >
          En tu fecha límite ({formatEta(endDate)})
        </div>
        <div className="text-sm">
          {meets ? (
            <>
              Estarías en{' '}
              <strong className="font-semibold tabular-nums">{projected} kg</strong>
              <span className="text-slate-500 dark:text-slate-400">
                {' '}— habrías superado la meta en {Math.abs(delta)} kg.
              </span>
            </>
          ) : (
            <>
              Estarías en{' '}
              <strong className="font-semibold tabular-nums">{projected} kg</strong>
              <span className="text-slate-500 dark:text-slate-400">
                {' '}— te faltarían {delta} kg para la meta.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
