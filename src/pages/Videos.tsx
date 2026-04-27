import { useState } from 'react'
import { PHASE_LABEL } from '../data/plan'
import { VIDEOS, type Phase, type Video } from '../data/videos'
import { VideoEmbed } from '../components/VideoEmbed'

export function VideosPage() {
  const [active, setActive] = useState<Video | null>(null)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Vídeos</h1>
        <p className="text-sm text-slate-500">
          Catálogo de Xuan Lan organizado por fase.
        </p>
      </header>

      {([1, 2, 3] as Phase[]).map((p) => (
        <section key={p} className="space-y-2">
          <h2 className="font-semibold">{PHASE_LABEL[p]}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VIDEOS.filter((v) => v.phase === p).map((v) => (
              <button
                key={v.id}
                onClick={() => setActive(v)}
                className="text-left rounded-xl bg-white shadow-sm overflow-hidden hover:ring-2 hover:ring-teal-400 transition"
              >
                <img
                  src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`}
                  alt={v.title}
                  className="w-full aspect-video object-cover"
                  loading="lazy"
                />
                <div className="p-3">
                  <div className="text-sm font-medium line-clamp-2">{v.title}</div>
                  <div className="text-xs text-slate-500 mt-1 capitalize">{v.tag}{v.durationMin ? ` · ${v.durationMin} min` : ''}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center"
          onClick={() => setActive(null)}
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-3 flex items-center justify-between">
              <div className="font-medium text-sm">{active.title}</div>
              <button onClick={() => setActive(null)} className="text-2xl leading-none px-2 text-slate-400">×</button>
            </div>
            <VideoEmbed youtubeId={active.youtubeId} title={active.title} />
          </div>
        </div>
      )}
    </div>
  )
}
