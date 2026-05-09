import { Fragment } from 'react'
import { DOW_LABEL, PHASE_HEX, PHASE_LABEL, sessionEmoji } from '../data/plan'
import type { PlanWeek } from '../data/plan'
import { useSessions } from '../hooks/useSessions'
import { usePlan } from '../hooks/usePlan'
import { useStartDate } from '../hooks/useStartDate'
import { phaseDateRange, weekDateRange } from '../lib/dates'

interface Props {
  onSelect: (week: number, dow: number) => void
  highlight?: { week: number; dow: number } | null
}

export function WeekGrid({ onSelect, highlight }: Props) {
  const { get } = useSessions()
  const PLAN = usePlan()
  const { startDate } = useStartDate()

  // Agrupar por fase manteniendo orden
  const phases = [1, 2, 3].map((p) => {
    const weeks = PLAN.filter((w) => w.phase === p)
    if (weeks.length === 0) return null
    return { phase: p as 1 | 2 | 3, weeks }
  })

  return (
    <div className="space-y-5">
      {phases.map((g) => {
        if (!g) return null
        const range = phaseDateRange(startDate, g.weeks[0].week, g.weeks[g.weeks.length - 1].week)
        return (
          <PhaseBlock
            key={g.phase}
            phase={g.phase}
            weeks={g.weeks}
            phaseRange={range.label}
            startDate={startDate}
            getSession={get}
            highlight={highlight}
            onSelect={onSelect}
          />
        )
      })}
    </div>
  )
}

function PhaseBlock({
  phase,
  weeks,
  phaseRange,
  startDate,
  getSession,
  highlight,
  onSelect,
}: {
  phase: 1 | 2 | 3
  weeks: PlanWeek[]
  phaseRange: string
  startDate: string
  getSession: (week: number, dow: number) => { done: boolean; notes?: string } | undefined
  highlight?: { week: number; dow: number } | null
  onSelect: (w: number, d: number) => void
}) {
  const color = PHASE_HEX[phase]
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-[11px] uppercase tracking-wider font-semibold" style={{ color }}>
            {PHASE_LABEL[phase]}
          </span>
        </div>
        <span className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">{phaseRange}</span>
      </div>

      <div
        className="grid gap-1.5 items-stretch"
        style={{ gridTemplateColumns: 'minmax(60px, auto) repeat(7, minmax(0, 1fr))' }}
      >
        {/* Cabecera de días */}
        <div />
        {DOW_LABEL.map((d) => (
          <div
            key={d}
            className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 text-center font-semibold"
          >
            {d}
          </div>
        ))}

        {/* Filas de semanas */}
        {weeks.map((w) => {
          const range = weekDateRange(startDate, w.week)
          return (
            <Fragment key={w.week}>
              <div className="flex flex-col justify-center pr-1 leading-tight">
                <div className="text-[11px] font-semibold tabular-nums">Sem {w.week}</div>
                <div className="text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                  {range.label}
                </div>
              </div>
              {w.days.map((d) => {
                const log = getSession(d.week, d.dow)
                const isToday = highlight && highlight.week === d.week && highlight.dow === d.dow
                const rest = d.type === 'descanso'
                return (
                  <button
                    key={d.dow}
                    onClick={() => onSelect(d.week, d.dow)}
                    title={d.type}
                    className={`aspect-square min-w-0 rounded-2xl flex items-center justify-center transition active:scale-90 text-sm
                      ${rest
                        ? 'bg-black/[0.04] dark:bg-white/[0.04] text-slate-400 dark:text-slate-500'
                        : 'bg-white dark:bg-[#1c1c1e] border border-black/[0.05] dark:border-white/[0.06] hover:scale-105 hover:shadow-md'}
                      ${log?.done ? '!bg-yoga !text-white !border-transparent shadow-moveGlow' : ''}
                      ${isToday ? 'ring-2 ring-peso ring-offset-2 ring-offset-transparent' : ''}`}
                  >
                    <span>{log?.done ? '✓' : sessionEmoji[d.type]}</span>
                  </button>
                )
              })}
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}
