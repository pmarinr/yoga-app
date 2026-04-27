import { useState } from 'react'
import { PHASE_LABEL } from '../data/plan'
import { VIDEOS, type Phase, type Video } from '../data/videos'
import { VideoEmbed } from '../components/VideoEmbed'

const PHASE_COLOR: Record<Phase, string> = {
  1: '#34C759',
  2: '#FF9F0A',
  3: '#FA114F',
}

export function VideosPage() {
  const [active, setActive] = useState<Video | null>(null)

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-yoga">Vídeos</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Tus clases</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Catálogo de Xuan Lan organizado por fase.
        </p>
      </header>

      {([1, 2, 3] as Phase[]).map((p) => (
        <section key={p} className="space-y-3">
          <h2 className="flex items-center gap-2 font-semibold tracking-tight">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: PHASE_COLOR[p] }}
            >
              {PHASE_LABEL[p]}
            </span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VIDEOS.filter((v) => v.phase === p).map((v) => (
              <button
                key={v.id}
                onClick={() => setActive(v)}
                className="group text-left rounded-3xl glass shadow-card border border-white/40 dark:border-white/5 overflow-hidden hover:-translate-y-1 hover:shadow-glow transition"
              >
                <div className="relative">
                  <img
                    src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                    alt={v.title}
                    className="w-full aspect-video object-cover"
                    loading="lazy"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <span className="text-4xl drop-shadow-lg">▶️</span>
                  </span>
                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider text-white"
                    style={{ background: PHASE_COLOR[v.phase] }}
                  >
                    Fase {v.phase}
                  </span>
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-2">{v.title}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 capitalize">
                    {v.tag}
                    {v.durationMin ? ` · ${v.durationMin} min` : ''}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center"
          onClick={() => setActive(null)}
        >
          <div
            className="bg-white dark:bg-[#1c1c1e] rounded-3xl max-w-3xl w-full overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3 flex items-center justify-between">
              <div className="font-medium text-sm">{active.title}</div>
              <button
                onClick={() => setActive(null)}
                className="w-8 h-8 grid place-items-center rounded-full bg-black/[0.05] dark:bg-white/[0.08] hover:bg-black/[0.1] dark:hover:bg-white/[0.12] text-slate-700 dark:text-slate-200"
              >
                ×
              </button>
            </div>
            <VideoEmbed youtubeId={active.youtubeId} title={active.title} />
          </div>
        </div>
      )}
    </div>
  )
}
