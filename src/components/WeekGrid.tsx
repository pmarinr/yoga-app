import { DOW_LABEL, PLAN, sessionEmoji } from '../data/plan'
import { useSessions } from '../hooks/useSessions'

interface Props {
  onSelect: (week: number, dow: number) => void
  highlight?: { week: number; dow: number } | null
}

const PHASE_DOT: Record<1 | 2 | 3, string> = {
  1: 'bg-emerald-500',
  2: 'bg-amber-500',
  3: 'bg-orange-500',
}

export function WeekGrid({ onSelect, highlight }: Props) {
  const { get } = useSessions()
  return (
    <div className="overflow-x-auto -mx-1 px-1">
      <table className="text-xs md:text-sm border-collapse mx-auto">
        <thead>
          <tr>
            <th className="p-1 text-left text-slate-400 dark:text-slate-500 font-medium text-[10px]">
              SEM
            </th>
            {DOW_LABEL.map((d) => (
              <th
                key={d}
                className="p-1 w-10 text-slate-400 dark:text-slate-500 font-medium text-[10px] uppercase"
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN.map((w) => (
            <tr key={w.week}>
              <td className="p-1 pr-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${PHASE_DOT[w.phase]}`} />
                  {w.week}
                </span>
              </td>
              {w.days.map((d) => {
                const log = get(d.week, d.dow)
                const isToday = highlight && highlight.week === d.week && highlight.dow === d.dow
                const rest = d.type === 'descanso'
                return (
                  <td key={d.dow} className="p-0.5">
                    <button
                      onClick={() => onSelect(d.week, d.dow)}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-2xl flex items-center justify-center transition active:scale-90
                        ${rest
                          ? 'bg-black/[0.04] dark:bg-white/[0.04] text-slate-400 dark:text-slate-500'
                          : 'bg-white dark:bg-[#1c1c1e] border border-black/[0.05] dark:border-white/[0.06] hover:scale-105 hover:shadow-md'}
                        ${log?.done ? '!bg-yoga !text-white !border-transparent shadow-moveGlow' : ''}
                        ${isToday ? 'ring-2 ring-peso ring-offset-2 ring-offset-transparent' : ''}`}
                      title={d.type}
                    >
                      <span>{log?.done ? '✓' : sessionEmoji[d.type]}</span>
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400 justify-center">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Fase 1</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Fase 2</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500 inline-block" /> Fase 3</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yoga inline-block" /> Hecho</span>
      </div>
    </div>
  )
}
