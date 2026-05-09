import { useRef, useState } from 'react'
import { clearAll, exportBackup, importBackup } from '../lib/backup'
import { useStartDate } from '../hooks/useStartDate'
import { useNotifications } from '../hooks/useNotifications'
import { useTheme } from '../hooks/useTheme'
import { useGoals } from '../hooks/useGoals'
import { QrShare } from '../components/QrShare'
import { QrScan } from '../components/QrScan'
import { Card, SectionTitle } from '../components/Card'

export function AjustesPage() {
  const { startDate, setStartDate } = useStartDate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [showShare, setShowShare] = useState(false)
  const [showScan, setShowScan] = useState(false)
  const { config, setConfig, requestPermission, supported, triggersSupported, permission } =
    useNotifications()
  const { theme, setTheme } = useTheme()
  const { goals, setGoals, endDate, setEndDate, setWeeks } = useGoals(startDate)

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Ajustes</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Personalización</h1>
      </header>

      <Card>
        <SectionTitle eyebrow="Apariencia" title="Tema" color="#AF52DE" />
        <div className="grid grid-cols-3 gap-2">
          {(['light', 'dark', 'auto'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-3 py-3 rounded-2xl text-sm font-semibold transition ${
                theme === t
                  ? 'bg-meta text-white shadow-glow'
                  : 'bg-black/[0.04] dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 hover:bg-black/[0.08] dark:hover:bg-white/[0.10]'
              }`}
            >
              <div className="text-xl mb-1">{t === 'light' ? '☀️' : t === 'dark' ? '🌙' : '🌓'}</div>
              <div>{t === 'light' ? 'Claro' : t === 'dark' ? 'Oscuro' : 'Auto'}</div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Plan" title="Fecha de inicio" color="#FF6E5C" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2 text-sm"
        />
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Determina qué semana se muestra como "hoy".
        </p>
      </Card>

      <Card>
        <SectionTitle eyebrow="Meta" title="Tu objetivo" color="#FF9F0A" />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Peso inicial (kg)</div>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={goals.startKg}
              onChange={(e) => {
                const n = parseFloat(e.target.value.replace(',', '.'))
                if (isFinite(n) && n > 0) setGoals({ ...goals, startKg: n })
              }}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Peso meta (kg)</div>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={goals.targetKg}
              onChange={(e) => {
                const n = parseFloat(e.target.value.replace(',', '.'))
                if (isFinite(n) && n > 0) setGoals({ ...goals, targetKg: n })
              }}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Semanas del plan</div>
            <input
              type="number"
              min={1}
              max={52}
              value={goals.weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fecha límite</div>
            <input
              type="date"
              value={endDate ?? ''}
              onChange={(e) => {
                if (e.target.value) setEndDate(e.target.value, startDate)
              }}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
          Cambiar fecha límite recalcula las semanas y reorganiza las fases (1/3 cada una).
        </p>
      </Card>

      <Card>
        <SectionTitle eyebrow="Sincronizar" title="Entre dispositivos" color="#0A84FF" />
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          Sin servidor: comparte tus datos por código QR.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowShare(true)}
            className="px-4 py-2 rounded-full bg-peso hover:opacity-90 text-white text-sm font-semibold shadow-glow active:scale-95 transition"
          >
            📤 Compartir QR
          </button>
          <button
            onClick={() => setShowScan(true)}
            className="px-4 py-2 rounded-full bg-peso/15 text-peso text-sm font-semibold active:scale-95 transition"
          >
            📷 Importar QR
          </button>
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Recordatorio" title="Notificación diaria" color="#FF9F0A" />
        {!supported ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tu navegador no soporta notificaciones.
          </p>
        ) : (
          <>
            <label className="flex items-center justify-between gap-3 mb-3 py-2">
              <span className="text-sm">Recordarme cada día</span>
              <button
                onClick={async () => {
                  if (!config.enabled && permission !== 'granted') {
                    const p = await requestPermission()
                    if (p !== 'granted') return
                  }
                  setConfig({ ...config, enabled: !config.enabled })
                }}
                className={`relative w-12 h-7 rounded-full transition ${
                  config.enabled ? 'bg-racha' : 'bg-black/[0.1] dark:bg-white/[0.15]'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition ${
                    config.enabled ? 'left-[22px]' : 'left-0.5'
                  }`}
                />
              </button>
            </label>
            <label className="block text-sm">
              <span className="text-xs text-slate-500 dark:text-slate-400 mr-2">Hora</span>
              <input
                type="time"
                value={config.time}
                onChange={(e) => setConfig({ ...config, time: e.target.value })}
                disabled={!config.enabled}
                className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-1.5 text-sm disabled:opacity-50"
              />
            </label>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
              {triggersSupported
                ? '✓ Notificaciones programadas en background (Chrome).'
                : 'Si tu navegador no soporta programadas, recibirás recordatorio al abrir la app.'}
            </p>
          </>
        )}
      </Card>

      <Card>
        <SectionTitle eyebrow="Backup" title="Copia de seguridad" color="#34C759" />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={exportBackup}
            className="px-4 py-2 rounded-full bg-dieta hover:opacity-90 text-white text-sm font-semibold active:scale-95 transition"
          >
            Exportar JSON
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            className="px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-sm font-semibold active:scale-95 transition"
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
      </Card>

      <Card tone="rose">
        <h2 className="font-semibold mb-2">Zona de peligro</h2>
        <button
          onClick={() => {
            if (confirm('¿Borrar todos los datos? Esta acción no se puede deshacer.')) clearAll()
          }}
          className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold active:scale-95 transition"
        >
          Borrar todos los datos
        </button>
      </Card>

      {showShare && <QrShare onClose={() => setShowShare(false)} />}
      {showScan && <QrScan onClose={() => setShowScan(false)} />}
    </div>
  )
}
