import { Fragment } from 'react'
import { DOW_LABEL, PHASE_HEX, PHASE_LABEL } from '../data/plan'
import { useSessions } from '../hooks/useSessions'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { usePlan } from '../hooks/usePlan'
import { useStartDate } from '../hooks/useStartDate'
import { phaseDateRange, weekDateRange } from '../lib/dates'

type DietDone = Record<string, boolean>

const SLOTS = ['desayuno', 'mediamanana', 'comida', 'merienda', 'cena']

export function HeatMap() {
  const { get } = useSessions()
  const [dietDone] = useLocalStorage<DietDone>('yoga.dietDone', {})
  const PLAN = usePlan()
  const { startDate } = useStartDate()

  const dietCount = (week: number, dow: number) => {
    let n = 0
    SLOTS.forEach((s) => {
      if (dietDone[`${week}-${dow}-${s}`]) n++
    })
    return n
  }

  const cellStyle = (sessionDone: boolean, dietN: number, isRest: boolean): React.CSSProperties => {
    if (sessionDone && dietN >= 3) return { background: 'linear-gradient(135deg, #FF6E5C, #34C759)' }
    if (sessionDone) return { background: '#FF6E5C' }
    if (dietN >= 3) return { background: '#34C759' }
    if (dietN > 0) return { background: 'rgba(52,199,89,0.35)' }
    if (isRest) return { background: 'rgba(120,120,128,0.10)' }
    return { background: 'rgba(120,120,128,0.18)' }
  }

  const phases = [1, 2, 3].map((p) => {
    const weeks = PLAN.filter((w) => w.phase === p)
    if (weeks.length === 0) return null
    return { phase: p as 1 | 2 | 3, weeks }
  })

  return (
    <div className="space-y-4">
      {phases.map((g) => {
        if (!g) return null
        const range = phaseDateRange(startDate, g.weeks[0].week, g.weeks[g.weeks.length - 1].week)
        const color = PHASE_HEX[g.phase]
        return (
          <div key={g.phase}>
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color }}>
                  {PHASE_LABEL[g.phase]}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">{range.label}</span>
            </div>
            <div
              className="grid gap-1 items-stretch"
              style={{ gridTemplateColumns: 'minmax(56px, auto) repeat(7, minmax(0, 1fr))' }}
            >
              <div />
              {DOW_LABEL.map((d) => (
                <div
                  key={d}
                  className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center font-semibold"
                >
                  {d}
                </div>
              ))}
              {g.weeks.map((w) => {
                const range = weekDateRange(startDate, w.week)
                return (
                  <Fragment key={w.week}>
                    <div className="flex flex-col justify-center pr-1 leading-tight">
                      <div className="text-[10px] font-semibold tabular-nums">{w.week}</div>
                      <div className="text-[9px] text-slate-400 dark:text-slate-500 tabular-nums">
                        {range.label}
                      </div>
                    </div>
                    {w.days.map((d) => {
                      const sessDone = !!get(d.week, d.dow)?.done
                      const dietN = dietCount(d.week, d.dow)
                      const rest = d.type === 'descanso'
                      return (
                        <div
                          key={d.dow}
                          className="aspect-square min-w-0 rounded-md transition-all hover:scale-110"
                          style={cellStyle(sessDone, dietN, rest)}
                          title={`Sem ${w.week} · ${DOW_LABEL[d.dow - 1]} ${range.label}: ${
                            sessDone ? 'sesión ✓' : '—'
                          } · dieta ${dietN}/5`}
                        />
                      )
                    })}
                  </Fragment>
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <Legend label="sesión + dieta" gradient="linear-gradient(135deg, #FF6E5C, #34C759)" />
        <Legend label="sesión" color="#FF6E5C" />
        <Legend label="dieta" color="#34C759" />
        <Legend label="poco" color="rgba(52,199,89,0.35)" />
      </div>
    </div>
  )
}

function Legend({ label, color, gradient }: { label: string; color?: string; gradient?: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-md" style={{ background: gradient ?? color }} />
      {label}
    </span>
  )
}
