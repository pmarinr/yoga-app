import { useState } from 'react'
import { WeightChart } from '../components/WeightChart'
import { START_KG, TARGET_KG, useWeights } from '../hooks/useWeights'
import { todayISO } from '../hooks/useStartDate'

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

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Peso</h1>
        <p className="text-sm text-slate-500">
          Inicio {START_KG} kg → objetivo {TARGET_KG} kg.
        </p>
      </header>

      <section className="grid sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500">Último</div>
          <div className="text-2xl font-semibold">{last ? `${last.kg} kg` : '—'}</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500">Perdidos</div>
          <div className="text-2xl font-semibold text-teal-700">−{lost.toFixed(1)} kg</div>
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="text-xs text-slate-500">Progreso</div>
          <div className="text-2xl font-semibold">{progressPct.toFixed(0)}%</div>
          <div className="mt-1 h-2 rounded bg-slate-100 overflow-hidden">
            <div className="h-full bg-teal-500" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <WeightChart data={weights} />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold mb-3">Añadir peso</h2>
        <form onSubmit={submit} className="flex flex-wrap items-end gap-3">
          <label className="text-sm">
            <div className="text-xs text-slate-500 mb-1">Fecha</div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="rounded-lg border px-3 py-2" />
          </label>
          <label className="text-sm">
            <div className="text-xs text-slate-500 mb-1">Peso (kg)</div>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              className="rounded-lg border px-3 py-2 w-28"
              placeholder="93.5"
              required
            />
          </label>
          <button type="submit" className="px-4 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium">
            Guardar
          </button>
        </form>
      </section>

      {weights.length > 0 && (
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold mb-3">Histórico</h2>
          <ul className="divide-y text-sm">
            {[...weights].reverse().map((w) => (
              <li key={w.date} className="flex items-center justify-between py-2">
                <span className="text-slate-600">{w.date}</span>
                <span className="font-medium">{w.kg} kg</span>
                <button onClick={() => remove(w.date)} className="text-xs text-rose-500 hover:underline">
                  borrar
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
