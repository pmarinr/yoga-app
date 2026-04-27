import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PHASE_LABEL, PLAN, SESSION_LABEL, sessionEmoji } from '../data/plan'
import { videoById } from '../data/videos'
import { useSessions } from '../hooks/useSessions'
import { useStartDate, todayISO } from '../hooks/useStartDate'
import { useWeights } from '../hooks/useWeights'
import { DayModal } from '../components/DayModal'
import { VideoEmbed } from '../components/VideoEmbed'

export function Dashboard() {
  const { startDate, setStartDate, currentDayIndex } = useStartDate()
  const idx = currentDayIndex()
  const { get, completedCount } = useSessions()
  const { last, lost, progressPct } = useWeights()
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

      <section className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Sesiones completadas</div>
          <div className="text-3xl font-semibold text-teal-700">{completedCount}</div>
          <Link to="/plan" className="text-xs text-teal-600 hover:underline">Ver plan completo →</Link>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-500">Peso</div>
          {last ? (
            <>
              <div className="text-3xl font-semibold">{last.kg} kg</div>
              <div className="text-xs text-slate-500">−{lost.toFixed(1)} kg · {progressPct.toFixed(0)}% al objetivo</div>
            </>
          ) : (
            <div className="text-slate-400 text-sm">Sin registros</div>
          )}
          <Link to="/peso" className="text-xs text-teal-600 hover:underline">Registrar peso →</Link>
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
