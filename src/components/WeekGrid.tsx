import { DOW_LABEL, PHASE_COLOR, PLAN, sessionEmoji } from '../data/plan'
import { useSessions } from '../hooks/useSessions'

interface Props {
  onSelect: (week: number, dow: number) => void
  highlight?: { week: number; dow: number } | null
}

export function WeekGrid({ onSelect, highlight }: Props) {
  const { get } = useSessions()
  return (
    <div className="overflow-x-auto">
      <table className="text-xs md:text-sm border-collapse">
        <thead>
          <tr>
            <th className="p-1 text-left text-slate-500 font-normal">Sem.</th>
            {DOW_LABEL.map((d) => (
              <th key={d} className="p-1 w-10 text-slate-500 font-normal">
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PLAN.map((w) => (
            <tr key={w.week}>
              <td className={`p-1 pr-2 font-medium ${PHASE_COLOR[w.phase]} rounded-l`}>
                {w.week}
              </td>
              {w.days.map((d) => {
                const log = get(d.week, d.dow)
                const isToday = highlight && highlight.week === d.week && highlight.dow === d.dow
                const rest = d.type === 'descanso'
                return (
                  <td key={d.dow} className="p-0.5">
                    <button
                      onClick={() => onSelect(d.week, d.dow)}
                      className={`w-9 h-9 md:w-10 md:h-10 rounded-md flex items-center justify-center border transition
                        ${rest ? 'bg-slate-100 text-slate-400' : 'bg-white'}
                        ${log?.done ? '!bg-teal-500 !text-white border-teal-600' : 'border-slate-200 hover:border-teal-400'}
                        ${isToday ? 'ring-2 ring-teal-500' : ''}`}
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
      <div className="mt-3 flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-200 inline-block" /> Fase 1</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-300 inline-block" /> Fase 2</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-400 inline-block" /> Fase 3</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal-500 inline-block" /> Hecho</span>
      </div>
    </div>
  )
}
