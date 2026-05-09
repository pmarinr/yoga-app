import { PHASE_LABEL, SESSION_LABEL, DOW_LABEL } from '../data/plan'
import { videoById } from '../data/videos'
import { useSessions } from '../hooks/useSessions'
import { usePlan } from '../hooks/usePlan'
import { VideoEmbed } from './VideoEmbed'
import { fireConfetti } from './Confetti'

interface Props {
  week: number
  dow: number
  onClose: () => void
}

export function DayModal({ week, dow, onClose }: Props) {
  const PLAN = usePlan()
  const w = PLAN.find((p) => p.week === week)
  if (!w) return null
  const day = w.days.find((d) => d.dow === dow)
  if (!day) return null
  const video = videoById(day.videoId)
  const { get, toggle, setNotes } = useSessions()
  const log = get(week, dow)

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 backdrop-blur-md p-0 md:p-4">
      <div className="bg-white dark:bg-[#1c1c1e] w-full md:max-w-2xl rounded-t-[28px] md:rounded-[28px] max-h-[92vh] overflow-y-auto border-t md:border border-black/[0.04] dark:border-white/[0.06] shadow-2xl">
        <div className="flex justify-center pt-2 md:hidden">
          <span className="w-10 h-1 rounded-full bg-black/[0.15] dark:bg-white/[0.2]" />
        </div>
        <div className="sticky top-0 bg-white/90 dark:bg-[#1c1c1e]/90 backdrop-blur px-5 py-3 border-b divider flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-yoga font-semibold">
              {PHASE_LABEL[day.phase]}
            </div>
            <h2 className="font-semibold tracking-tight">
              Semana {week} · {DOW_LABEL[dow - 1]} · {SESSION_LABEL[day.type]}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 grid place-items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200"
          >
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm text-slate-600 dark:text-slate-300">
            Duración prevista: <span className="font-semibold tabular-nums">{day.durationMin} min</span>
          </div>

          {video ? (
            <>
              <VideoEmbed youtubeId={video.youtubeId} title={video.title} />
              <div className="text-sm font-semibold">{video.title}</div>
            </>
          ) : (
            <div className="rounded-2xl bg-black/[0.04] dark:bg-white/[0.06] p-4 text-sm text-slate-600 dark:text-slate-300">
              Día sin vídeo asignado{day.type === 'descanso' ? ' · descanso o caminar 30–45 min' : ''}.
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const wasDone = log?.done
                toggle(week, dow)
                if (!wasDone) fireConfetti({ particleCount: 80 })
              }}
              className={`px-5 py-3 rounded-full font-semibold text-sm transition-transform active:scale-95 ${
                log?.done
                  ? 'bg-dieta text-white shadow-glow'
                  : 'bg-yoga text-white shadow-moveGlow'
              }`}
            >
              {log?.done ? '✓ Sesión hecha' : 'Marcar como hecha'}
            </button>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 font-semibold">
              Notas
            </label>
            <textarea
              value={log?.notes ?? ''}
              onChange={(e) => setNotes(week, dow, e.target.value)}
              rows={2}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#2c2c2e] p-3 text-sm"
              placeholder="Cómo te has sentido, energía, dolores…"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
