import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PHASE_LABEL, PLAN, SESSION_LABEL, sessionEmoji } from '../data/plan'
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

export function Dashboard() {
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
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Yoga 12 semanas</h1>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-600 mb-2">El plan empieza el:</div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <p className="mt-3 text-sm text-slate-500">
            Cuando hoy esté dentro de las 12 semanas, verás aquí la sesión recomendada.
          </p>
        </div>
      </div>
    )
  }

  const weekData = PLAN.find((w) => w.week === idx.week)!
  const day = weekData.days.find((d) => d.dow === idx.dow)!
  const video = videoById(day.videoId)
  const log = get(idx.week, idx.dow)

  return (
    <div className="space-y-5">
      <header>
        <div className="text-xs text-slate-500">{PHASE_LABEL[day.phase]}</div>
        <h1 className="text-2xl font-semibold">
          Hoy · Semana {idx.week} · día {idx.dow}
        </h1>
        <div className="text-sm text-slate-500">{todayISO()}</div>
      </header>

      <section className="rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white p-5 shadow-md">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{level.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs opacity-80">Nivel {level.level} · {level.xp} XP</div>
            <div className="text-lg font-semibold">{level.name}</div>
            {level.nextThreshold && (
              <div className="mt-1 h-1.5 rounded bg-white/20 overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${level.progressToNext * 100}%` }} />
              </div>
            )}
          </div>
          <Link to="/logros" className="text-xs bg-white/20 hover:bg-white/30 rounded-lg px-3 py-2">
            🏅 {unlockedCount}/{totalBadges}
          </Link>
        </div>
        <div className="mt-3 text-sm italic opacity-95">
          "{quote.text}"{quote.author ? <span className="opacity-70"> — {quote.author}</span> : null}
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold mb-2">Hoy</div>
          <ActivityRings
            values={[
              { label: 'Yoga', pct: stats.todaySessionDone ? 1 : 0, color: '#0d9488' },
              { label: 'Dieta', pct: stats.todayDietPct, color: '#fbbf24' },
              { label: 'Peso (7 d)', pct: stats.weekRecentLogged ? 1 : 0, color: '#fb923c' },
            ]}
          />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold mb-3">Estadísticas</div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat value={`🔥 ${stats.currentStreak}`} label="Racha" />
            <Stat value={`${stats.totalSessions}`} label="Sesiones" />
            <Stat value={`${stats.weeksCompleted}/12`} label="Semanas" />
            <Stat value={last ? `${last.kg}` : '—'} label="kg actual" />
            <Stat value={`-${stats.kgLost.toFixed(1)}`} label="kg perdidos" />
            <Stat value={`${progressPct.toFixed(0)}%`} label="al objetivo" />
          </div>
        </div>
      </section>

      <section className="rounded-2xl bg-white shadow-sm p-5 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{sessionEmoji[day.type]}</span>
          <div>
            <div className="text-lg font-semibold">{SESSION_LABEL[day.type]}</div>
            <div className="text-sm text-slate-500">{day.durationMin} min · {weekData.intensity}</div>
          </div>
          <div className="ml-auto">
            <button
              onClick={() => setOpen(true)}
              className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm font-medium"
            >
              Abrir sesión
            </button>
          </div>
        </div>

        {video && <VideoEmbed youtubeId={video.youtubeId} title={video.title} />}

        <div className="text-sm text-slate-600">
          {log?.done ? '✓ Sesión completada hoy' : 'Aún no marcada como hecha'}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="font-semibold mb-2">Esta semana</h2>
        <ul className="text-sm text-slate-700 space-y-1">
          {weekData.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </section>

      {open && (
        <DayModal week={idx.week} dow={idx.dow} onClose={() => setOpen(false)} />
      )}
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-2">
      <div className="text-lg font-semibold text-slate-800">{value}</div>
      <div className="text-[10px] text-slate-500 uppercase">{label}</div>
    </div>
  )
}
