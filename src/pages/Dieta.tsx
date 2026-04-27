import { useEffect, useState } from 'react'
import { MEAL_SLOTS, type MealSlot } from '../hooks/useMeals'
import { useDietPlan } from '../hooks/useDietPlan'
import { useStartDate } from '../hooks/useStartDate'
import { DOW_LABEL } from '../data/plan'
import { fireConfetti } from '../components/Confetti'

const LIMIT = ['Bollería', 'Alcohol (máx. 1–2/sem)', 'Refrescos', 'Pan blanco en exceso']

const CAT_LABEL: Record<string, string> = {
  legumbre: '🫘 Legumbre',
  pescado: '🐟 Pescado',
  pollo: '🍗 Ave',
  pollo_pavo: '🍗 Ave',
  cereal_verde: '🥗 Cereal+verdura',
  huevo: '🥚 Huevo',
  verdura_ligera: '🥬 Verdura ligera',
  yogurAvena: 'Lácteo + avena',
  porridge: 'Porridge',
  tostadaSalada: 'Tostada salada',
  huevoTostada: 'Huevo + tostada',
  fruta_fs: 'Fruta + frutos secos',
  fruta_lacteo: 'Fruta + lácteo',
  lacteo_fs: 'Lácteo + frutos secos',
  salado_ligero: 'Salado ligero',
}

export function DietaPage() {
  const { currentDayIndex } = useStartDate()
  const today = currentDayIndex()
  const [week, setWeek] = useState(today?.week ?? 1)
  const {
    plan,
    summary,
    regenerateWeek,
    swapMeal,
    editMeal,
    resetMeal,
    isDone,
    toggleDone,
    dayCompletion,
  } = useDietPlan(week)
  const [editing, setEditing] = useState<string | null>(null)
  const [showLimit, setShowLimit] = useState(false)

  useEffect(() => setEditing(null), [week])

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dieta mediterránea</h1>
          <p className="text-sm text-slate-500">
            Plan semanal equilibrado · personalizable.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm">
            <span className="text-xs text-slate-500 mr-2">Semana</span>
            <select
              value={week}
              onChange={(e) => setWeek(Number(e.target.value))}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => (
                <option key={w} value={w}>
                  {w}
                  {today?.week === w ? ' · actual' : ''}
                </option>
              ))}
            </select>
          </label>
          <button
            onClick={() => {
              if (confirm('¿Generar otra propuesta para esta semana? Mantiene el equilibrio nutricional.')) regenerateWeek()
            }}
            className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-medium"
          >
            🔄 Otra propuesta
          </button>
        </div>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="text-xs text-slate-500 mb-2">Equilibrio nutricional de la semana</div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          <Stat label="Pescado" value={`${summary.pescado}×`} hint="ideal 4–5" ok={summary.pescado >= 4} />
          <Stat label="Legumbres" value={`${summary.legumbres}×`} hint="ideal 3" ok={summary.legumbres >= 3} />
          <Stat label="Ave" value={`${summary.pollo_pavo}×`} hint="2–3 sem" ok={summary.pollo_pavo >= 2 && summary.pollo_pavo <= 3} />
          <Stat label="Huevo cena" value={`${summary.huevo}×`} hint="1–2 sem" ok={summary.huevo >= 1} />
          <Stat label="Vegetariana" value={`${summary.vegetariana}×`} hint="1 sem" ok={summary.vegetariana >= 1} />
          <Stat label="Fruta/día" value={`${summary.fruta_dia}/7`} hint="diaria" ok={summary.fruta_dia >= 7} />
        </div>
      </section>

      <section className="space-y-3">
        {plan.map((day, i) => {
          const dow = i + 1
          const { ok, total } = dayCompletion(dow)
          return (
            <details key={dow} open={dow === today?.dow} className="rounded-2xl bg-white shadow-sm">
              <summary className="cursor-pointer list-none p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-teal-50 text-teal-700 text-xs font-semibold grid place-items-center">
                    {DOW_LABEL[i]}
                  </span>
                  <span className="font-medium">Día {dow}</span>
                  <span className="hidden sm:inline text-xs text-slate-400">
                    {CAT_LABEL[day.comida.category] ?? day.comida.category} ·{' '}
                    {CAT_LABEL[day.cena.category] ?? day.cena.category}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{ok}/{total} ✓</span>
              </summary>
              <div className="px-4 pb-4 space-y-2">
                {MEAL_SLOTS.map((s) => {
                  const slot = s.id as MealSlot
                  const cell = day[slot]
                  const key = `${dow}-${slot}`
                  const checked = isDone(dow, slot)
                  return (
                    <div key={slot} className="rounded-xl border border-slate-100 p-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const before = dayCompletion(dow).ok
                            toggleDone(dow, slot)
                            if (!checked && before === 4) fireConfetti({ particleCount: 60 })
                          }}
                          className="w-5 h-5 mt-0.5 accent-teal-600"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-xs uppercase tracking-wide text-slate-500">{s.label}</div>
                            <span className="text-[10px] text-slate-400">
                              {CAT_LABEL[cell.category] ?? cell.category}
                            </span>
                          </div>
                          {editing === key ? (
                            <input
                              autoFocus
                              type="text"
                              defaultValue={cell.text}
                              onBlur={(e) => {
                                const v = e.target.value.trim()
                                if (v && v !== cell.text) editMeal(dow, slot, v)
                                setEditing(null)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                                if (e.key === 'Escape') setEditing(null)
                              }}
                              className="w-full rounded border px-2 py-1 text-sm mt-0.5"
                            />
                          ) : (
                            <button
                              onClick={() => setEditing(key)}
                              className={`text-left text-sm w-full ${checked ? 'line-through text-slate-400' : 'text-slate-700'}`}
                            >
                              {cell.text}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          {(slot === 'comida' || slot === 'cena') && (
                            <>
                              <a
                                href={`https://www.google.com/search?udm=50&q=${encodeURIComponent('receta ' + cell.text)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                title="Buscar receta en Google AI"
                              >
                                🔍
                              </a>
                              <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ' + cell.text)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs px-2 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100"
                                title="Buscar receta en YouTube"
                              >
                                ▶️
                              </a>
                            </>
                          )}
                          <button
                            onClick={() => swapMeal(dow, slot)}
                            className="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200"
                            title="Otra opción de la misma categoría"
                          >
                            🔄
                          </button>
                          <button
                            onClick={() => resetMeal(dow, slot)}
                            className="text-xs px-2 py-1 rounded text-slate-400 hover:text-slate-600"
                            title="Volver a la sugerencia"
                          >
                            ↺
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </details>
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

      <p className="text-xs text-slate-400 text-center">
        🔍 Google AI · ▶️ YouTube · 🔄 otra opción · ↺ vuelve a la sugerencia · toca el texto para editar.
      </p>
    </div>
  )
}

function Stat({ label, value, hint, ok }: { label: string; value: string; hint: string; ok: boolean }) {
  return (
    <div className={`rounded-lg p-2 ${ok ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-50 text-slate-600'}`}>
      <div className="text-[11px] opacity-70">{label}</div>
      <div className="font-semibold">{value}</div>
      <div className="text-[10px] opacity-60">{hint}</div>
    </div>
  )
}
