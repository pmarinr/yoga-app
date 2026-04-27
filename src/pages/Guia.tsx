import { useState } from 'react'

const RES = [
  {
    id: 'calendario',
    title: 'Calendario del plan (12 semanas)',
    src: `${import.meta.env.BASE_URL}recursos/calendario_plan12_semanas.png`,
  },
  {
    id: 'posturas',
    title: 'Guía de posturas',
    src: `${import.meta.env.BASE_URL}recursos/guia_posturas.png`,
  },
]

export function GuiaPage() {
  const [zoom, setZoom] = useState<string | null>(null)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Guía</h1>
        <p className="text-sm text-slate-500">Calendario y posturas del plan, siempre a mano.</p>
      </header>

      <section className="grid sm:grid-cols-2 gap-4">
        {RES.map((r) => (
          <button
            key={r.id}
            onClick={() => setZoom(r.src)}
            className="rounded-2xl bg-white shadow-sm overflow-hidden text-left hover:ring-2 hover:ring-teal-400 transition"
          >
            <img src={r.src} alt={r.title} className="w-full h-auto" loading="lazy" />
            <div className="p-3 flex items-center justify-between">
              <span className="font-medium text-sm">{r.title}</span>
              <span className="text-xs text-slate-500">Toca para ampliar</span>
            </div>
          </button>
        ))}
      </section>

      {zoom && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-2"
          onClick={() => setZoom(null)}
        >
          <img
            src={zoom}
            alt="Zoom"
            className="max-h-[95vh] max-w-full object-contain rounded shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setZoom(null)}
            className="absolute top-3 right-3 text-white text-3xl leading-none"
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
      )}
    </div>
  )
}
