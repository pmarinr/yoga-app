import { useState } from 'react'
import { WeekGrid } from '../components/WeekGrid'
import { DayModal } from '../components/DayModal'
import { HeatMap } from '../components/HeatMap'
import { useStartDate } from '../hooks/useStartDate'
import { PHASE_LABEL } from '../data/plan'
import { usePlan } from '../hooks/usePlan'
import { Card, SectionTitle } from '../components/Card'

const PHASE_GRADIENT: Record<1 | 2 | 3, string> = {
  1: 'from-[#34C759] to-[#00C7BE]',
  2: 'from-[#FFCC00] to-[#FF9500]',
  3: 'from-[#FF3B30] to-[#C70F2E]',
}

export function PlanPage() {
  const [sel, setSel] = useState<{ week: number; dow: number } | null>(null)
  const { currentDayIndex } = useStartDate()
  const today = currentDayIndex()
  const PLAN = usePlan()

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-yoga">Plan</div>
        <h1 className="text-4xl font-semibold tracking-tightest">{PLAN.length} semanas</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Toca un día para ver el vídeo y marcarlo.
        </p>
      </header>

      <section className="grid lg:grid-cols-2 gap-4 lg:items-start">
        <Card>
          <SectionTitle eyebrow="Consistencia" title="Tu mapa de calor" color="#FF6E5C" />
          <HeatMap />
        </Card>

        <Card className="!p-4">
          <WeekGrid onSelect={(w, d) => setSel({ week: w, dow: d })} highlight={today} />
        </Card>
      </section>

      <section className="grid sm:grid-cols-3 gap-3">
        {[1, 2, 3].map((p) => {
          const ws = PLAN.filter((w) => w.phase === p)
          const first = ws[0]
          return (
            <div
              key={p}
              className={`rounded-3xl p-5 text-white shadow-card bg-gradient-to-br ${PHASE_GRADIENT[p as 1 | 2 | 3]}`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-90 font-semibold">
                Fase {p}
              </div>
              <div className="text-xl font-semibold tracking-tight">{PHASE_LABEL[p as 1 | 2 | 3].split('—')[1]?.trim()}</div>
              <div className="text-xs opacity-90 mb-3">
                Semanas {ws[0].week}–{ws[ws.length - 1].week}
              </div>
              <ul className="space-y-1 text-sm opacity-95">
                <li>· {first.frequencyLabel}</li>
                <li>· {first.durationLabel}</li>
                <li>· Intensidad: {first.intensity}</li>
              </ul>
            </div>
          )
        })}
      </section>

      {sel && <DayModal week={sel.week} dow={sel.dow} onClose={() => setSel(null)} />}
    </div>
  )
}
