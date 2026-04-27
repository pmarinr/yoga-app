import { useEffect, useState } from 'react'
import { MEAL_SLOTS, type MealSlot } from '../hooks/useMeals'
import { useDietPlan } from '../hooks/useDietPlan'
import { useStartDate } from '../hooks/useStartDate'
import { DOW_LABEL } from '../data/plan'
import { fireConfetti } from '../components/Confetti'
import { Card, SectionTitle } from '../components/Card'

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
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-dieta">Dieta</div>
          <h1 className="text-4xl font-semibold tracking-tightest">Mediterránea</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Plan semanal equilibrado · personalizable.
          </p>
        </div>
        <button
          onClick={() => {
            if (
              confirm('¿Generar otra propuesta para esta semana? Mantiene el equilibrio nutricional.')
            )
              regenerateWeek()
          }}
          className="px-4 py-2 rounded-full bg-dieta hover:opacity-90 text-white text-xs font-semibold shadow-glow active:scale-95 transition"
        >
          🔄 Otra propuesta
        </button>
      </header>

      <Card>
        <SectionTitle eyebrow="Semana" title={`Semana ${week}`} color="#34C759" />
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="inline-flex gap-2 pb-1">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((w) => {
              const active = week === w
              const isToday = today?.week === w
              return (
                <button
                  key={w}
                  onClick={() => setWeek(w)}
                  className={`min-w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-xs font-semibold transition relative active:scale-95 ${
                    active
                      ? 'bg-dieta text-white shadow-glow'
                      : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-200 hover:bg-black/[0.08] dark:hover:bg-white/[0.10]'
                  }`}
                >
                  <span className="text-[9px] uppercase opacity-70">SEM</span>
                  <span>{w}</span>
                  {isToday && !active && (
                    <span className="absolute bottom-1 w-1 h-1 rounded-full bg-dieta" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Equilibrio" title="Esta semana" color="#34C759" />
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
          <Stat label="Pescado" value={`${summary.pescado}×`} hint="ideal 4–5" ok={summary.pescado >= 4} />
          <Stat label="Legumbres" value={`${summary.legumbres}×`} hint="ideal 3" ok={summary.legumbres >= 3} />
          <Stat label="Ave" value={`${summary.pollo_pavo}×`} hint="2–3" ok={summary.pollo_pavo >= 2 && summary.pollo_pavo <= 3} />
          <Stat label="Huevo" value={`${summary.huevo}×`} hint="1–2" ok={summary.huevo >= 1} />
          <Stat label="Veg" value={`${summary.vegetariana}×`} hint="1" ok={summary.vegetariana >= 1} />
          <Stat label="Fruta" value={`${summary.fruta_dia}/7`} hint="diaria" ok={summary.fruta_dia >= 7} />
        </div>
      </Card>

      <section className="space-y-3">
        {plan.map((day, i) => {
          const dow = i + 1
          const { ok, total } = dayCompletion(dow)
          const isToday = dow === today?.dow
          return (
            <details
              key={dow}
              open={isToday}
              className={`rounded-3xl p-0 overflow-hidden border shadow-card transition ${
                isToday
                  ? 'bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-500/[0.08] dark:to-emerald-500/[0.04] border-emerald-300/50 dark:border-emerald-500/20'
                  : 'glass border-white/40 dark:border-white/5'
              }`}
            >
              <summary className="cursor-pointer p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-9 h-9 rounded-2xl text-white text-xs font-bold grid place-items-center shadow ${
                      isToday ? 'bg-gradient-to-br from-dieta to-emerald-600' : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}
                  >
                    {DOW_LABEL[i]}
                  </span>
                  <div>
                    <div className="font-semibold tracking-tight">Día {dow}{isToday ? ' · hoy' : ''}</div>
                    <div className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400">
                      {CAT_LABEL[day.comida.category] ?? day.comida.category} ·{' '}
                      {CAT_LABEL[day.cena.category] ?? day.cena.category}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {ok === total ? (
                    <span className="text-xs font-semibold text-white bg-dieta px-2.5 py-0.5 rounded-full">
                      ✓ completo
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {ok}/{total}
                    </span>
                  )}
                </div>
              </summary>
              <div className="px-4 pb-4 space-y-2">
                {MEAL_SLOTS.map((s) => {
                  const slot = s.id as MealSlot
                  const cell = day[slot]
                  const key = `${dow}-${slot}`
                  const checked = isDone(dow, slot)
                  return (
                    <div
                      key={slot}
                      className="rounded-2xl bg-white/80 dark:bg-white/[0.04] p-3 border border-black/[0.04] dark:border-white/[0.04]"
                    >
                      <div className="flex items-start gap-3">
                        <button
                          onClick={() => {
                            const before = dayCompletion(dow).ok
                            toggleDone(dow, slot)
                            if (!checked && before === 4) fireConfetti({ particleCount: 60 })
                          }}
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition shrink-0 mt-0.5 ${
                            checked
                              ? 'bg-dieta border-dieta text-white'
                              : 'border-slate-300 dark:border-slate-600 hover:border-dieta'
                          }`}
                        >
                          {checked && <span className="text-xs">✓</span>}
                        </button>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                              {s.label}
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500">
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
                              className="w-full rounded-xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-2 py-1 text-sm mt-0.5"
                            />
                          ) : (
                            <button
                              onClick={() => setEditing(key)}
                              className={`text-left text-sm w-full ${
                                checked
                                  ? 'line-through text-slate-400 dark:text-slate-500'
                                  : 'text-slate-700 dark:text-slate-200'
                              }`}
                            >
                              {cell.text}
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 shrink-0">
                          {(slot === 'comida' || slot === 'cena') && (
                            <>
                              <a
                                href={`https://www.google.com/search?udm=50&q=${encodeURIComponent('receta ' + cell.text)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-full grid place-items-center text-xs bg-dieta/10 text-dieta hover:bg-dieta/20"
                                title="Receta en Google AI"
                              >
                                🔍
                              </a>
                              <a
                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent('receta ' + cell.text)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-7 h-7 rounded-full grid place-items-center text-xs bg-yoga/10 text-yoga hover:bg-yoga/20"
                                title="Receta en YouTube"
                              >
                                ▶️
                              </a>
                            </>
                          )}
                          <button
                            onClick={() => swapMeal(dow, slot)}
                            className="w-7 h-7 rounded-full grid place-items-center text-xs bg-black/[0.05] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.10]"
                            title="Otra opción de la misma categoría"
                          >
                            🔄
                          </button>
                          <button
                            onClick={() => resetMeal(dow, slot)}
                            className="w-7 h-7 rounded-full grid place-items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
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

      <Card tone="amber">
        <button
          onClick={() => setShowLimit((v) => !v)}
          className="w-full flex items-center justify-between text-sm font-semibold"
        >
          <span>⚠️ Alimentos a limitar</span>
          <span>{showLimit ? '−' : '+'}</span>
        </button>
        {showLimit && (
          <ul className="mt-2 text-sm space-y-1">
            {LIMIT.map((l) => (
              <li key={l}>• {l}</li>
            ))}
          </ul>
        )}
      </Card>

      <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
        🔍 Google AI · ▶️ YouTube · 🔄 cambiar · ↺ restaurar · toca el plato para editar
      </p>
    </div>
  )
}

function Stat({ label, value, hint, ok }: { label: string; value: string; hint: string; ok: boolean }) {
  return (
    <div
      className={`rounded-2xl p-2.5 ${
        ok
          ? 'bg-dieta/10 text-dieta dark:bg-dieta/15'
          : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-600 dark:text-slate-300'
      }`}
    >
      <div className="text-[10px] uppercase tracking-wider opacity-70 font-semibold">{label}</div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
      <div className="text-[10px] opacity-60">{hint}</div>
    </div>
  )
}
