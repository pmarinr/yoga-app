import { PLAN, PHASE_LABEL, SESSION_LABEL, DOW_LABEL } from '../data/plan'
import { videoById } from '../data/videos'
import { useSessions } from '../hooks/useSessions'
import { VideoEmbed } from './VideoEmbed'
import { fireConfetti } from './Confetti'

interface Props {
  week: number
  dow: number
  onClose: () => void
}

export function DayModal({ week, dow, onClose }: Props) {
  const w = PLAN.find((p) => p.week === week)!
  const day = w.days.find((d) => d.dow === dow)!
  const video = videoById(day.videoId)
  const { get, toggle, setNotes } = useSessions()
  const log = get(week, dow)

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-0 md:p-4">
      <div className="bg-white w-full md:max-w-2xl rounded-t-2xl md:rounded-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 bg-white px-5 py-3 border-b flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500">{PHASE_LABEL[day.phase]}</div>
            <h2 className="font-semibold">
              Semana {week} · {DOW_LABEL[dow - 1]} · {SESSION_LABEL[day.type]}
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none px-2">
            ×
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-sm text-slate-600">
            Duración prevista: <span className="font-medium">{day.durationMin} min</span>
          </div>

          {video ? (
            <>
              <VideoEmbed youtubeId={video.youtubeId} title={video.title} />
              <div className="text-sm font-medium">{video.title}</div>
            </>
          ) : (
            <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
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
              className={`px-4 py-2 rounded-lg font-medium transition-transform active:scale-95 ${
                log?.done ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {log?.done ? '✓ Sesión hecha' : 'Marcar como hecha'}
            </button>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Notas</label>
            <textarea
              value={log?.notes ?? ''}
              onChange={(e) => setNotes(week, dow, e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-slate-200 p-2 text-sm"
              placeholder="Cómo te has sentido, energía, dolores…"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
