import { DOW_LABEL, PLAN } from '../data/plan'
import { useSessions } from '../hooks/useSessions'
import { useLocalStorage } from '../hooks/useLocalStorage'

type DietDone = Record<string, boolean>

export function HeatMap() {
  const { get } = useSessions()
  const [dietDone] = useLocalStorage<DietDone>('yoga.dietDone', {})

  const dietCount = (week: number, dow: number) => {
    let n = 0
    ;['desayuno', 'mediamanana', 'comida', 'merienda', 'cena'].forEach((s) => {
      if (dietDone[`${week}-${dow}-${s}`]) n++
    })
    return n
  }

  const cellStyle = (sessionDone: boolean, dietN: number, isRest: boolean) => {
    if (sessionDone && dietN >= 3)
      return { background: 'linear-gradient(135deg, #FF6E5C, #34C759)' }
    if (sessionDone) return { background: '#FF6E5C' }
    if (dietN >= 3) return { background: '#34C759' }
    if (dietN > 0) return { background: 'rgba(52,199,89,0.35)' }
    if (isRest) return { background: 'rgba(120,120,128,0.10)' }
    return { background: 'rgba(120,120,128,0.18)' }
  }

  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500 mb-1.5 ml-7 uppercase tracking-wider font-semibold">
        {DOW_LABEL.map((d) => (
          <span key={d} className="w-5 text-center">{d}</span>
        ))}
      </div>
      <div className="space-y-1">
        {PLAN.map((w) => (
          <div key={w.week} className="flex items-center gap-1">
            <span className="w-6 text-[10px] text-slate-400 dark:text-slate-500 text-right pr-1 tabular-nums">
              {w.week}
            </span>
            {w.days.map((d) => {
              const sessDone = !!get(d.week, d.dow)?.done
              const dietN = dietCount(d.week, d.dow)
              const rest = d.type === 'descanso'
              return (
                <div
                  key={d.dow}
                  className="w-5 h-5 rounded-md transition-all hover:scale-125"
                  style={cellStyle(sessDone, dietN, rest)}
                  title={`Sem ${w.week} · ${DOW_LABEL[d.dow - 1]}: ${sessDone ? 'sesión ✓' : '—'} · dieta ${dietN}/5`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-slate-500 dark:text-slate-400">
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
