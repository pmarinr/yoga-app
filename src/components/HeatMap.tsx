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

  const cellColor = (sessionDone: boolean, dietN: number, isRest: boolean) => {
    if (sessionDone && dietN >= 3) return 'bg-teal-600'
    if (sessionDone) return 'bg-teal-400'
    if (dietN >= 3) return 'bg-amber-300'
    if (dietN > 0) return 'bg-amber-100'
    if (isRest) return 'bg-slate-50'
    return 'bg-slate-100'
  }

  return (
    <div>
      <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 ml-6">
        {DOW_LABEL.map((d) => (
          <span key={d} className="w-5 text-center">{d}</span>
        ))}
      </div>
      <div className="space-y-1">
        {PLAN.map((w) => (
          <div key={w.week} className="flex items-center gap-1">
            <span className="w-5 text-[10px] text-slate-400 text-right pr-1">{w.week}</span>
            {w.days.map((d) => {
              const sessDone = !!get(d.week, d.dow)?.done
              const dietN = dietCount(d.week, d.dow)
              const rest = d.type === 'descanso'
              return (
                <div
                  key={d.dow}
                  className={`w-5 h-5 rounded ${cellColor(sessDone, dietN, rest)}`}
                  title={`Sem ${w.week} · ${DOW_LABEL[d.dow - 1]}: ${sessDone ? 'sesión ✓' : '—'} · dieta ${dietN}/5`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal-600 inline-block" /> sesión + dieta</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal-400 inline-block" /> sesión</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-amber-300 inline-block" /> dieta</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-100 inline-block" /> nada</span>
      </div>
    </div>
  )
}
