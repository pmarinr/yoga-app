import { useRef, useState } from 'react'
import { clearAll, exportBackup, importBackup } from '../lib/backup'
import { useStartDate } from '../hooks/useStartDate'
import { useNotifications } from '../hooks/useNotifications'
import { QrShare } from '../components/QrShare'
import { QrScan } from '../components/QrScan'

export function AjustesPage() {
  const { startDate, setStartDate } = useStartDate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [showShare, setShowShare] = useState(false)
  const [showScan, setShowScan] = useState(false)
  const { config, setConfig, requestPermission, supported, triggersSupported, permission } =
    useNotifications()

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
        <h2 className="font-semibold">Sincronizar entre dispositivos</h2>
        <p className="text-xs text-slate-500">
          Sin servidor: comparte tus datos por código QR escaneando con otro móvil.
        </p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowShare(true)} className="px-3 py-2 rounded-lg bg-teal-600 text-white text-sm">
            📤 Compartir por QR
          </button>
          <button onClick={() => setShowScan(true)} className="px-3 py-2 rounded-lg bg-teal-50 text-teal-700 text-sm border border-teal-200">
            📷 Importar por QR
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
        <h2 className="font-semibold">Recordatorio diario</h2>
        {!supported ? (
          <p className="text-xs text-slate-500">Tu navegador no soporta notificaciones.</p>
        ) : (
          <>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={async (e) => {
                  if (e.target.checked && permission !== 'granted') {
                    const p = await requestPermission()
                    if (p !== 'granted') return
                  }
                  setConfig({ ...config, enabled: e.target.checked })
                }}
                className="w-5 h-5 accent-teal-600"
              />
              <span className="text-sm">Recordarme la sesión cada día</span>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-slate-500 mr-2">Hora</span>
              <input
                type="time"
                value={config.time}
                onChange={(e) => setConfig({ ...config, time: e.target.value })}
                disabled={!config.enabled}
                className="rounded-lg border px-3 py-1.5 text-sm"
              />
            </label>
            <p className="text-[11px] text-slate-400">
              {triggersSupported
                ? '✓ Notificaciones programadas en background (Chrome).'
                : 'Tu navegador no soporta notificaciones programadas. Recibirás recordatorio al abrir la app si pasaste la hora sin marcar.'}
            </p>
          </>
        )}
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
        <h2 className="font-semibold">Copia de seguridad (JSON)</h2>
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

      {showShare && <QrShare onClose={() => setShowShare(false)} />}
      {showScan && <QrScan onClose={() => setShowScan(false)} />}
    </div>
  )
}
