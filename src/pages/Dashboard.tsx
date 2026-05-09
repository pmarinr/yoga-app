import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PHASE_LABEL, SESSION_LABEL, sessionEmoji } from '../data/plan'
import { usePlan } from '../hooks/usePlan'
import { videoById } from '../data/videos'
import { useSessions } from '../hooks/useSessions'
import { useStartDate, todayISO } from '../hooks/useStartDate'
import { useWeights } from '../hooks/useWeights'
import { useStats } from '../hooks/useStats'
import { useLevel } from '../hooks/useLevel'
import { useBadges } from '../hooks/useBadges'
import { quoteOfTheDay } from '../data/quotes'
import { DayModal } from '../components/DayModal'
import { VideoEmbed } from '../components/VideoEmbed'
import { ActivityRings } from '../components/ActivityRings'
import { Card, Pill, SectionTitle, StatTile } from '../components/Card'

export function Dashboard() {
  const PLAN = usePlan()
  const { startDate, setStartDate, currentDayIndex } = useStartDate()
  const idx = currentDayIndex()
  const { get } = useSessions()
  const { last, progressPct } = useWeights()
  const stats = useStats()
  const { unlockedCount, total: totalBadges } = useBadges()
  const level = useLevel(unlockedCount)
  const quote = quoteOfTheDay()
  const [open, setOpen] = useState(false)

  if (!idx) {
    return (
      <div className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tightest">Yoga 12 semanas</h1>
        <Card>
          <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
            El plan empieza el:
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2 text-sm"
          />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Cuando hoy esté dentro de las 12 semanas verás aquí la sesión recomendada.
          </p>
        </Card>
      </div>
    )
  }

  const weekData = PLAN.find((w) => w.week === idx.week)
  if (!weekData) return null
  const day = weekData.days.find((d) => d.dow === idx.dow)
  if (!day) return null
  const video = videoById(day.videoId)
  const log = get(idx.week, idx.dow)

  const dayName = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  const ringValues = [
    { label: 'Yoga', pct: stats.todaySessionDone ? 1 : 0, from: '#FF6E5C', to: '#FF2D55' },
    { label: 'Dieta', pct: stats.todayDietPct, from: '#A6FF31', to: '#34C759' },
    { label: 'Peso', pct: stats.weekRecentLogged ? 1 : 0, from: '#1FD3FF', to: '#0A84FF' },
  ]

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-yoga">
          {PHASE_LABEL[day.phase]}
        </div>
        <h1 className="text-4xl font-semibold tracking-tightest capitalize">{dayName}</h1>
        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span>Semana {idx.week} · día {idx.dow}</span>
          <span className="opacity-40">·</span>
          <span>{todayISO()}</span>
        </div>
      </header>

      <Card>
        <SectionTitle
          eyebrow="Resumen"
          title="Tu actividad de hoy"
          color="#FF6E5C"
          right={
            stats.currentStreak > 0 ? (
              <Pill color="#FF9F0A">🔥 racha {stats.currentStreak}</Pill>
            ) : null
          }
        />
        <div className="flex items-center justify-center sm:justify-start py-2">
          <ActivityRings values={ringValues} size={210} />
        </div>
      </Card>

      <Card tone="accent" className="!p-6">
        <div className="flex items-start gap-4">
          <div className="text-5xl drop-shadow-sm">{level.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider opacity-80">
              Nivel {level.level} · {level.xp} XP
            </div>
            <div className="text-3xl font-semibold tracking-tightest">{level.name}</div>
            {level.nextThreshold && (
              <div className="mt-3 h-2 rounded-full bg-white/25 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-700"
                  style={{ width: `${level.progressToNext * 100}%` }}
                />
              </div>
            )}
          </div>
          <Link
            to="/logros"
            className="text-xs bg-white/20 hover:bg-white/30 active:scale-95 rounded-full px-3 py-1.5 backdrop-blur transition font-medium"
          >
            🏅 {unlockedCount}/{totalBadges}
          </Link>
        </div>
        <div className="mt-4 text-sm leading-relaxed italic opacity-95">
          "{quote.text}"{quote.author ? <span className="opacity-70"> — {quote.author}</span> : null}
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        <StatTile
          label="Sesiones"
          value={`${stats.totalSessions}`}
          color="#FF6E5C"
          icon="🧘"
        />
        <StatTile
          label="Mejor racha"
          value={`${stats.bestStreak}`}
          unit="días"
          color="#FF9F0A"
          icon="🔥"
        />
        <StatTile
          label="Peso actual"
          value={last ? `${last.kg}` : '—'}
          unit={last ? 'kg' : undefined}
          color="#0A84FF"
          icon="⚖️"
        />
        <StatTile
          label="Al objetivo"
          value={`${progressPct.toFixed(0)}%`}
          color="#34C759"
          icon="🎯"
        />
      </section>

      <Card>
        <div className="flex items-center gap-3 mb-3">
          <div className="text-4xl">{sessionEmoji[day.type]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-yoga font-semibold">
              Sesión de hoy
            </div>
            <div className="text-2xl font-semibold tracking-tight">{SESSION_LABEL[day.type]}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {day.durationMin} min · intensidad {weekData.intensity.toLowerCase()}
            </div>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2.5 rounded-full bg-yoga hover:opacity-90 active:scale-95 text-white text-sm font-semibold shadow-moveGlow transition"
          >
            Empezar
          </button>
        </div>

        {video && <VideoEmbed youtubeId={video.youtubeId} title={video.title} />}

        <div
          className={`mt-3 text-sm font-medium ${
            log?.done ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {log?.done ? '✓ Sesión completada hoy' : '○ Aún no marcada'}
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Esta semana" title="Lo que toca" color="#0A84FF" />
        <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
          {weekData.notes.map((n, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="text-peso mt-0.5 text-lg leading-none">•</span>
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </Card>

      {open && <DayModal week={idx.week} dow={idx.dow} onClose={() => setOpen(false)} />}
    </div>
  )
}
