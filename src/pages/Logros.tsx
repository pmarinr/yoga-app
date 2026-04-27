import { useBadges } from '../hooks/useBadges'
import { useLevel } from '../hooks/useLevel'
import { Card, SectionTitle } from '../components/Card'

export function LogrosPage() {
  const { list, unlockedCount, total } = useBadges()
  const level = useLevel(unlockedCount)

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-meta">Logros</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Tu camino</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {unlockedCount}/{total} medallas desbloqueadas
        </p>
      </header>

      <Card tone="accent" className="!p-6 !bg-gradient-to-br !from-meta !to-[#5856D6]">
        <div className="flex items-center gap-4">
          <div className="text-6xl drop-shadow">{level.emoji}</div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-wider opacity-80 font-semibold">
              Nivel {level.level}
            </div>
            <div className="text-3xl font-semibold tracking-tightest">{level.name}</div>
            <div className="text-sm opacity-90 tabular-nums">{level.xp} XP</div>
          </div>
        </div>
        {level.nextThreshold && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${level.progressToNext * 100}%` }}
              />
            </div>
            <div className="text-[11px] opacity-80 mt-1.5 tabular-nums">
              {level.nextThreshold - level.xp} XP para el siguiente nivel
            </div>
          </div>
        )}
      </Card>

      <div>
        <SectionTitle eyebrow="Colección" title="Medallas" color="#AF52DE" />
        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {list.map((b) => (
            <div
              key={b.id}
              className={`rounded-3xl p-4 text-center border transition shadow-card ${
                b.unlocked
                  ? 'glass border-white/40 dark:border-white/5 hover:-translate-y-0.5'
                  : 'bg-black/[0.03] dark:bg-white/[0.03] border-black/[0.04] dark:border-white/[0.04] opacity-50'
              }`}
            >
              <div className={`text-5xl ${b.unlocked ? '' : 'grayscale'}`}>
                {b.unlocked ? b.icon : '🔒'}
              </div>
              <div className="mt-2 text-sm font-semibold">{b.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{b.desc}</div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
