import { useBadges } from '../hooks/useBadges'
import { useLevel } from '../hooks/useLevel'

export function LogrosPage() {
  const { list, unlockedCount, total } = useBadges()
  const level = useLevel(unlockedCount)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Logros</h1>
        <p className="text-sm text-slate-500">{unlockedCount}/{total} medallas desbloqueadas</p>
      </header>

      <section className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-5 shadow-md">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{level.emoji}</div>
          <div className="flex-1">
            <div className="text-xs opacity-80">Nivel {level.level}</div>
            <div className="text-xl font-semibold">{level.name}</div>
            <div className="text-xs opacity-80">{level.xp} XP</div>
          </div>
        </div>
        {level.nextThreshold && (
          <div className="mt-3">
            <div className="h-2 rounded bg-white/20 overflow-hidden">
              <div className="h-full bg-white" style={{ width: `${level.progressToNext * 100}%` }} />
            </div>
            <div className="text-[11px] opacity-80 mt-1">
              {level.nextThreshold - level.xp} XP para el siguiente nivel
            </div>
          </div>
        )}
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {list.map((b) => (
          <div
            key={b.id}
            className={`rounded-2xl p-4 shadow-sm text-center ${
              b.unlocked ? 'bg-white' : 'bg-slate-50 opacity-60'
            }`}
          >
            <div className="text-4xl">{b.unlocked ? b.icon : '🔒'}</div>
            <div className="mt-2 text-sm font-medium">{b.title}</div>
            <div className="text-xs text-slate-500 mt-1">{b.desc}</div>
          </div>
        ))}
      </section>
    </div>
  )
}
