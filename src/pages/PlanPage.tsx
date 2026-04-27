import { useState } from 'react'
import { WeekGrid } from '../components/WeekGrid'
import { DayModal } from '../components/DayModal'
import { useStartDate } from '../hooks/useStartDate'
import { PHASE_LABEL, PLAN } from '../data/plan'

export function PlanPage() {
  const [sel, setSel] = useState<{ week: number; dow: number } | null>(null)
  const { currentDayIndex } = useStartDate()
  const today = currentDayIndex()

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Plan 12 semanas</h1>
        <p className="text-sm text-slate-500">Toca un día para ver el vídeo y marcarlo como hecho.</p>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <WeekGrid onSelect={(w, d) => setSel({ week: w, dow: d })} highlight={today} />
      </section>

      <section className="grid sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((p) => {
          const ws = PLAN.filter((w) => w.phase === p)
          const first = ws[0]
          return (
            <div key={p} className="rounded-2xl bg-white p-4 shadow-sm text-sm">
              <div className="font-semibold">{PHASE_LABEL[p as 1 | 2 | 3]}</div>
              <div className="text-slate-500 text-xs mb-2">
                Semanas {ws[0].week}–{ws[ws.length - 1].week}
              </div>
              <ul className="space-y-1 text-slate-700">
                <li>• {first.frequencyLabel}</li>
                <li>• {first.durationLabel}</li>
                <li>• Intensidad: {first.intensity}</li>
              </ul>
            </div>
          )
        })}
      </section>

      {sel && <DayModal week={sel.week} dow={sel.dow} onClose={() => setSel(null)} />}
    </div>
  )
}
