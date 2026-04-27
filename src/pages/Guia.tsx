import { useState } from 'react'

const RES = [
  {
    id: 'calendario',
    title: 'Calendario del plan',
    sub: '12 semanas · vista completa',
    src: `${import.meta.env.BASE_URL}recursos/calendario_plan12_semanas.png`,
  },
  {
    id: 'posturas',
    title: 'Guía de posturas',
    sub: 'Asanas y referencias',
    src: `${import.meta.env.BASE_URL}recursos/guia_posturas.png`,
  },
]

export function GuiaPage() {
  const [zoom, setZoom] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-meta">Guía</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Recursos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Calendario y posturas siempre a mano.
        </p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {RES.map((r) => (
          <button
            key={r.id}
            onClick={() => setZoom(r.src)}
            className="rounded-3xl glass shadow-card border border-white/40 dark:border-white/5 overflow-hidden text-left hover:-translate-y-0.5 hover:shadow-glow transition"
          >
            <img src={r.src} alt={r.title} className="w-full h-auto" loading="lazy" />
            <div className="p-4">
              <div className="font-semibold tracking-tight">{r.title}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{r.sub}</div>
            </div>
          </button>
        ))}
      </section>

      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur flex items-center justify-center p-2"
          onClick={() => setZoom(null)}
        >
          <img
            src={zoom}
            alt="Zoom"
            className="max-h-[95vh] max-w-full object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setZoom(null)}
            className="absolute top-4 right-4 w-10 h-10 grid place-items-center rounded-full bg-white/10 backdrop-blur text-white text-2xl"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
