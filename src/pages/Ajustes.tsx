import { useRef } from 'react'
import { clearAll, exportBackup, importBackup } from '../lib/backup'
import { useStartDate } from '../hooks/useStartDate'

export function AjustesPage() {
  const { startDate, setStartDate } = useStartDate()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-2xl font-semibold">Ajustes</h1>
      </header>

      <section className="rounded-2xl bg-white p-5 shadow-sm space-y-2">
        <h2 className="font-semibold">Fecha de inicio del plan</h2>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />
        <p className="text-xs text-slate-500">
          Determina qué semana y día se muestran como "hoy" en el dashboard.
        </p>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
        <h2 className="font-semibold">Copia de seguridad</h2>
        <p className="text-xs text-slate-500">
          Tus datos se guardan solo en este dispositivo. Exporta un JSON para no perderlos al cambiar de móvil.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportBackup} className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm">
            Exportar JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-2 rounded-lg bg-slate-100 text-sm"
          >
            Importar JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) importBackup(f)
            }}
          />
        </div>
      </section>

      <section className="rounded-2xl bg-rose-50 border border-rose-200 p-5 space-y-2">
        <h2 className="font-semibold text-rose-900">Zona de peligro</h2>
        <button
          onClick={() => {
            if (confirm('¿Borrar todos los datos? Esta acción no se puede deshacer.')) clearAll()
          }}
          className="px-3 py-2 rounded-lg bg-rose-600 text-white text-sm"
        >
          Borrar todos los datos
        </button>
      </section>
    </div>
  )
}
