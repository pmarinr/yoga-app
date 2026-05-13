import { useEffect, useRef, useState } from 'react'
import { clearAll, exportBackup, importBackup } from '../lib/backup'
import { useStartDate } from '../hooks/useStartDate'
import { useNotifications } from '../hooks/useNotifications'
import { useTheme } from '../hooks/useTheme'
import { useGoals } from '../hooks/useGoals'
import { QrShare } from '../components/QrShare'
import { QrScan } from '../components/QrScan'
import { Card, SectionTitle } from '../components/Card'
import { SyncCard } from '../components/SyncCard'

const DAY_MS = 86400000

function computeEnd(start: string, weeks: number): string {
  const d = new Date(start + 'T00:00:00')
  d.setDate(d.getDate() + weeks * 7 - 1)
  return d.toISOString().slice(0, 10)
}

function weeksFromEnd(start: string, end: string): number {
  const d0 = new Date(start + 'T00:00:00').getTime()
  const d1 = new Date(end + 'T00:00:00').getTime()
  const days = Math.round((d1 - d0) / DAY_MS) + 1
  return Math.max(1, Math.min(52, Math.ceil(days / 7)))
}

export function AjustesPage() {
  const { startDate, setStartDate } = useStartDate()
  const fileRef = useRef<HTMLInputElement>(null)
  const [showShare, setShowShare] = useState(false)
  const [showScan, setShowScan] = useState(false)
  const { config, setConfig, requestPermission, supported, triggersSupported, permission } =
    useNotifications()
  const { theme, setTheme } = useTheme()
  const { goals, setGoals } = useGoals(startDate)

  // Borrador local del plan (no se aplica hasta pulsar "Actualizar")
  const [draft, setDraft] = useState({
    startKg: goals.startKg,
    targetKg: goals.targetKg,
    weeks: goals.weeks,
    startDate,
  })

  // Re-sincroniza el borrador cuando cambian los persistidos (p.ej. tras importar)
  useEffect(() => {
    setDraft({
      startKg: goals.startKg,
      targetKg: goals.targetKg,
      weeks: goals.weeks,
      startDate,
    })
  }, [goals.startKg, goals.targetKg, goals.weeks, startDate])

  const draftEnd = computeEnd(draft.startDate, draft.weeks)
  const isDirty =
    draft.startKg !== goals.startKg ||
    draft.targetKg !== goals.targetKg ||
    draft.weeks !== goals.weeks ||
    draft.startDate !== startDate

  const apply = () => {
    if (draft.startDate !== startDate) setStartDate(draft.startDate)
    setGoals({ startKg: draft.startKg, targetKg: draft.targetKg, weeks: draft.weeks })
  }

  const discard = () => {
    setDraft({
      startKg: goals.startKg,
      targetKg: goals.targetKg,
      weeks: goals.weeks,
      startDate,
    })
  }

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
        <SectionTitle
          eyebrow="Meta"
          title="Plan y objetivo"
          color="#FF9F0A"
          right={
            isDirty ? (
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-racha/15 text-racha">
                Cambios sin guardar
              </span>
            ) : null
          }
        />
        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Peso inicial (kg)</div>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              value={draft.startKg}
              onChange={(e) => {
                const n = parseFloat(e.target.value.replace(',', '.'))
                if (isFinite(n) && n > 0) setDraft({ ...draft, startKg: n })
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
              value={draft.targetKg}
              onChange={(e) => {
                const n = parseFloat(e.target.value.replace(',', '.'))
                if (isFinite(n) && n > 0) setDraft({ ...draft, targetKg: n })
              }}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
          <label className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fecha de inicio</div>
            <input
              type="date"
              value={draft.startDate}
              onChange={(e) => {
                if (e.target.value) setDraft({ ...draft, startDate: e.target.value })
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
              value={draft.weeks}
              onChange={(e) => {
                const n = Math.max(1, Math.min(52, Math.round(Number(e.target.value) || 1)))
                setDraft({ ...draft, weeks: n })
              }}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
          <label className="text-sm col-span-2">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fecha límite</div>
            <input
              type="date"
              value={draftEnd}
              onChange={(e) => {
                if (!e.target.value) return
                const w = weeksFromEnd(draft.startDate, e.target.value)
                setDraft({ ...draft, weeks: w })
              }}
              className="w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2"
            />
          </label>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Cambiar fecha límite recalcula las semanas y reorganiza las fases (1/3 cada una).
        </p>
        <div className="mt-4 flex items-center gap-2 justify-end">
          {isDirty && (
            <button
              onClick={discard}
              className="px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-sm font-semibold active:scale-95 transition"
            >
              Descartar
            </button>
          )}
          <button
            onClick={apply}
            disabled={!isDirty}
            className={`px-5 py-2 rounded-full text-white text-sm font-semibold active:scale-95 transition ${
              isDirty
                ? 'bg-racha hover:opacity-90 shadow-glow'
                : 'bg-black/[0.1] dark:bg-white/[0.1] text-slate-400 dark:text-slate-500 cursor-not-allowed'
            }`}
          >
            Actualizar
          </button>
        </div>
      </Card>

      <SyncCard onShowQr={() => setShowShare(true)} onScanQr={() => setShowScan(true)} />

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
