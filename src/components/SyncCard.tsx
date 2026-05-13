import { useState } from 'react'
import { Card, SectionTitle } from './Card'
import { useSync } from '../hooks/useSync'

interface Props {
  onShowQr: () => void
  onScanQr: () => void
}

export function SyncCard({ onShowQr, onScanQr }: Props) {
  const {
    code,
    lastSyncedAt,
    status,
    error,
    activate,
    connect,
    applyRemote,
    pushLocal,
    pull,
    disconnect,
  } = useSync()
  const [mode, setMode] = useState<'idle' | 'connecting' | 'merge'>('idle')
  const [codeInput, setCodeInput] = useState('')
  const [pending, setPending] = useState<{
    remotePayload: Record<string, unknown>
    remoteUpdatedAt: string
    code: string
  } | null>(null)
  const [busy, setBusy] = useState(false)

  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString('es-ES', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '—'

  const handleActivate = async () => {
    setBusy(true)
    try {
      await activate()
    } catch (_e) {
      void _e
    } finally {
      setBusy(false)
    }
  }

  const handleConnect = async () => {
    setBusy(true)
    try {
      const res = await connect(codeInput)
      if (res.remotePayload && res.hasLocalData) {
        // Hay datos en ambos lados → preguntamos qué hacer
        setPending({
          remotePayload: res.remotePayload,
          remoteUpdatedAt: res.remoteUpdatedAt!,
          code: codeInput.trim().toUpperCase(),
        })
        setMode('merge')
      } else if (res.remotePayload) {
        // Solo había datos remotos → aplicar directamente
        applyRemote(res.remotePayload)
      } else {
        // No había datos remotos → ya se subieron los locales
        setMode('idle')
      }
    } catch (_e) {
      void _e
    } finally {
      setBusy(false)
    }
  }

  // -------- Render --------

  // 1. Sync activa
  if (code && mode === 'idle') {
    return (
      <Card>
        <SectionTitle
          eyebrow="Sync activa"
          title="Entre dispositivos"
          color="#0A84FF"
          right={
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                status === 'syncing'
                  ? 'bg-amber-100 text-amber-700'
                  : status === 'error'
                    ? 'bg-rose-100 text-rose-700'
                    : status === 'conflict'
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-dieta/15 text-dieta'
              }`}
            >
              {status === 'syncing' ? 'sincronizando…' : status === 'error' ? 'error' : status === 'conflict' ? 'conflicto' : '✓ al día'}
            </span>
          }
        />
        <div className="rounded-2xl bg-gradient-to-br from-peso/10 to-stand/10 dark:from-peso/15 dark:to-stand/15 border border-peso/20 p-4 text-center">
          <div className="text-[11px] uppercase tracking-wider text-peso font-semibold mb-1">
            Tu código de emparejamiento
          </div>
          <div className="text-4xl font-bold tracking-[0.3em] tabular-nums text-peso">{code}</div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2">
            Última sincronización: {fmt(lastSyncedAt)}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
          Para conectar otro dispositivo: instala la app allí, abre Ajustes → Sincronizar →
          "Conectar con código" y escribe el código de arriba.
        </p>
        {error && status === 'error' && (
          <p className="text-xs text-rose-600 dark:text-rose-400 mt-2">{error}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={async () => {
              setBusy(true)
              try {
                const row = await pull()
                if (row) applyRemote(row.payload as Record<string, unknown>, row.updated_at)
              } finally {
                setBusy(false)
              }
            }}
            disabled={busy}
            className="px-3 py-1.5 rounded-full bg-peso/15 text-peso text-xs font-semibold active:scale-95 transition disabled:opacity-50"
          >
            ⬇️ Actualizar
          </button>
          <button
            onClick={pushLocal}
            disabled={busy}
            className="px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-semibold active:scale-95 transition disabled:opacity-50"
          >
            ⬆️ Forzar subida
          </button>
          <button
            onClick={() => {
              if (confirm('¿Desconectar este dispositivo? Los datos del servidor no se borran; podrás volver a conectar con el mismo código.')) disconnect()
            }}
            className="px-3 py-1.5 rounded-full bg-rose-50 dark:bg-rose-500/15 text-rose-600 dark:text-rose-300 text-xs font-semibold active:scale-95 transition"
          >
            Desconectar este dispositivo
          </button>
        </div>
        <details className="mt-3">
          <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
            Sync por QR (offline, sin servidor)
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            <button onClick={onShowQr} className="px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-semibold">
              📤 Compartir QR
            </button>
            <button onClick={onScanQr} className="px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-semibold">
              📷 Escanear QR
            </button>
          </div>
        </details>
      </Card>
    )
  }

  // 2. Conflicto inicial al conectar: el bucket remoto YA tiene datos y aquí también.
  if (mode === 'merge' && pending) {
    return (
      <Card>
        <SectionTitle eyebrow="Conflicto" title="Datos en ambos sitios" color="#FF9F0A" />
        <p className="text-sm text-slate-700 dark:text-slate-200 mb-3">
          El código <strong className="tabular-nums">{pending.code}</strong> ya tiene datos en el
          servidor (última actualización {fmt(pending.remoteUpdatedAt)}) y este dispositivo también
          tiene datos locales. ¿Qué prefieres?
        </p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              applyRemote(pending.remotePayload, pending.remoteUpdatedAt)
            setMode('idle')
            setPending(null)
            }}
            className="px-4 py-3 rounded-2xl bg-peso text-white text-sm font-semibold text-left"
          >
            ⬇️ Traer datos del servidor
            <div className="text-xs opacity-80 font-normal">Sustituye lo que hay en este dispositivo.</div>
          </button>
          <button
            onClick={async () => {
              setBusy(true)
              await pushLocal()
              setBusy(false)
              setMode('idle')
              setPending(null)
            }}
            disabled={busy}
            className="px-4 py-3 rounded-2xl bg-yoga text-white text-sm font-semibold text-left"
          >
            ⬆️ Subir mis datos locales
            <div className="text-xs opacity-80 font-normal">Sobrescribe el servidor con lo de aquí.</div>
          </button>
          <button
            onClick={() => {
              disconnect()
              setMode('idle')
              setPending(null)
            }}
            className="px-4 py-2 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-sm font-semibold"
          >
            Cancelar
          </button>
        </div>
      </Card>
    )
  }

  // 3. Sync desactivada (estado inicial)
  return (
    <Card>
      <SectionTitle eyebrow="Sincronizar" title="Entre dispositivos" color="#0A84FF" />
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
        Sincroniza automáticamente con otros dispositivos a través de un código de 4 caracteres. Sin
        cuenta, sin email; el código es la única llave.
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleActivate}
          disabled={busy}
          className="px-4 py-3 rounded-2xl bg-peso hover:opacity-90 text-white text-sm font-semibold text-left active:scale-95 transition disabled:opacity-50"
        >
          ✨ Generar nuevo código
          <div className="text-xs opacity-80 font-normal">
            Crea un código y sube los datos actuales como punto de partida.
          </div>
        </button>
        <div className="rounded-2xl border border-black/[0.08] dark:border-white/[0.1] p-3">
          <div className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold mb-2">
            Conectar con un código existente
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value.toUpperCase().slice(0, 4))}
              placeholder="ABCD"
              className="flex-1 rounded-xl border border-black/[0.08] dark:border-white/[0.1] dark:bg-[#1c1c1e] px-3 py-2 text-center text-lg tracking-[0.3em] tabular-nums font-bold uppercase"
              maxLength={4}
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              onClick={handleConnect}
              disabled={busy || codeInput.length !== 4}
              className="px-4 py-2 rounded-xl bg-peso text-white text-sm font-semibold active:scale-95 transition disabled:opacity-50"
            >
              Conectar
            </button>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            Caracteres válidos: 2-9, A-Z (sin 0, 1, I, L, O).
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-rose-600 dark:text-rose-400 mt-3">{error}</p>
      )}

      <details className="mt-4">
        <summary className="text-xs text-slate-500 dark:text-slate-400 cursor-pointer">
          Alternativa offline: QR / archivo JSON
        </summary>
        <div className="mt-2 flex flex-wrap gap-2">
          <button onClick={onShowQr} className="px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-semibold">
            📤 Compartir QR
          </button>
          <button onClick={onScanQr} className="px-3 py-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.08] text-xs font-semibold">
            📷 Escanear QR
          </button>
        </div>
      </details>
    </Card>
  )
}
