import { useState } from 'react'
import { MEAL_SLOTS, useMeals } from '../hooks/useMeals'
import { todayISO } from '../hooks/useStartDate'

const LIMIT = ['Bollería', 'Alcohol (máx. 1–2/sem)', 'Refrescos', 'Pan blanco en exceso']

export function DietaPage() {
  const [date, setDate] = useState(todayISO())
  const [showLimit, setShowLimit] = useState(false)
  const { update, get } = useMeals()
  const day = get(date)

  return (
    <div className="space-y-5">
      <header className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dieta mediterránea</h1>
          <p className="text-sm text-slate-500">Marca y anota cada comida del día.</p>
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </header>

      <section className="space-y-3">
        {MEAL_SLOTS.map((s) => {
          const m = day[s.id] ?? { text: '', checked: false }
          return (
            <div key={s.id} className="rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={m.checked}
                  onChange={(e) => update(date, s.id, { checked: e.target.checked })}
                  className="w-5 h-5 accent-teal-600"
                />
                <div className="flex-1">
                  <div className="font-medium">{s.label}</div>
                  <div className="text-xs text-slate-500">{s.suggestion}</div>
                </div>
              </div>
              <textarea
                value={m.text}
                onChange={(e) => update(date, s.id, { text: e.target.value })}
                rows={1}
                className="mt-2 w-full rounded-lg border border-slate-200 p-2 text-sm"
                placeholder="Anota lo que has comido…"
              />
            </div>
          )
        })}
      </section>

      <section className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
        <button
          onClick={() => setShowLimit((v) => !v)}
          className="w-full flex items-center justify-between text-sm font-medium text-amber-900"
        >
          <span>⚠️ Alimentos a limitar</span>
          <span>{showLimit ? '−' : '+'}</span>
        </button>
        {showLimit && (
          <ul className="mt-2 text-sm text-amber-900 space-y-1">
            {LIMIT.map((l) => (
              <li key={l}>• {l}</li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
