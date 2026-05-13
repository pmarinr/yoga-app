import { useCallback, useEffect, useRef, useState } from 'react'
import {
  bucketCreate,
  bucketGet,
  bucketSet,
  generatePairingCode,
  isValidCode,
  SUPABASE_KEY,
  SUPABASE_URL,
} from '../lib/supabase'
import { useLocalStorage, notifyLocalStorageChange } from './useLocalStorage'

// Claves locales que sincronizamos
const SYNC_KEYS = [
  'yoga.sessions',
  'yoga.weights',
  'yoga.meals',
  'yoga.startDate',
  'yoga.dietSeeds',
  'yoga.dietOverrides',
  'yoga.dietDone',
  'yoga.badgesSeen',
  'yoga.goals',
] as const

export interface SyncState {
  code: string | null
  lastSyncedAt: string | null // ISO del bucket en servidor
  lastLocalChange: number // epoch ms
}

const DEFAULT: SyncState = { code: null, lastSyncedAt: null, lastLocalChange: 0 }

function readAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  SYNC_KEYS.forEach((k) => {
    const raw = localStorage.getItem(k)
    if (raw !== null) {
      try {
        out[k] = JSON.parse(raw)
      } catch {
        out[k] = raw
      }
    }
  })
  return out
}

function writeAll(data: Record<string, unknown>) {
  SYNC_KEYS.forEach((k) => {
    if (k in data) {
      localStorage.setItem(k, JSON.stringify(data[k]))
      // Notifica a los hooks de la misma pestaña para que reaccionen sin recargar
      notifyLocalStorageChange(k)
    }
  })
}

export function useSync() {
  const [state, setState] = useLocalStorage<SyncState>('yoga.sync', DEFAULT)
  const [status, setStatus] = useState<'idle' | 'syncing' | 'error' | 'conflict'>('idle')
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<number | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // ---------- ACCIONES PÚBLICAS ----------

  /**
   * Activa sync por primera vez en este dispositivo.
   * Genera un código nuevo, crea el bucket vacío y sube todo el localStorage actual.
   */
  const activate = useCallback(async (): Promise<string> => {
    setStatus('syncing')
    setError(null)
    try {
      let code = generatePairingCode()
      // Intento 1: si por improbable colisión ya existe (1/1M), generamos otro
      // intentamos máx 5 veces
      for (let i = 0; i < 5; i++) {
        const existing = await bucketGet(code)
        if (!existing) break
        code = generatePairingCode()
      }
      await bucketCreate(code)
      const payload = readAll()
      const ts = await bucketSet(code, payload, null)
      setState({ code, lastSyncedAt: ts, lastLocalChange: Date.now() })
      setStatus('idle')
      return code
    } catch (e) {
      setStatus('error')
      setError(String((e as Error)?.message ?? e))
      throw e
    }
  }, [setState])

  /**
   * Conecta este dispositivo a un código ya existente.
   * Resuelve devolviendo lo que hay en el bucket para que la UI pregunte qué hacer.
   */
  const connect = useCallback(async (codeRaw: string): Promise<{
    remotePayload: Record<string, unknown> | null
    remoteUpdatedAt: string | null
    hasLocalData: boolean
  }> => {
    const code = codeRaw.trim().toUpperCase()
    if (!isValidCode(code)) throw new Error('Código inválido (4 caracteres alfanuméricos)')
    setStatus('syncing')
    setError(null)
    try {
      const row = await bucketGet(code)
      // ¿Hay datos locales relevantes?
      const local = readAll()
      const hasLocalData = Object.keys(local).length > 0
      if (!row) {
        // El código no existe → lo creamos con los datos locales (igual que activate)
        await bucketCreate(code)
        const ts = await bucketSet(code, local, null)
        setState({ code, lastSyncedAt: ts, lastLocalChange: Date.now() })
        setStatus('idle')
        return { remotePayload: null, remoteUpdatedAt: null, hasLocalData }
      }
      // Solo memorizamos el código; la fusión la decide la UI
      setState({ code, lastSyncedAt: row.updated_at, lastLocalChange: Date.now() })
      setStatus('idle')
      return { remotePayload: row.payload, remoteUpdatedAt: row.updated_at, hasLocalData }
    } catch (e) {
      setStatus('error')
      setError(String((e as Error)?.message ?? e))
      throw e
    }
  }, [setState])

  /**
   * Aplica el payload del servidor sustituyendo los datos locales.
   * Los hooks se reactualizan vía `notifyLocalStorageChange` sin recargar la página.
   */
  const applyRemote = useCallback(
    (payload: Record<string, unknown>, remoteUpdatedAt?: string) => {
      writeAll(payload)
      setState({
        ...stateRef.current,
        lastSyncedAt: remoteUpdatedAt ?? stateRef.current.lastSyncedAt,
        lastLocalChange: Date.now(),
      })
    },
    [setState],
  )

  /**
   * Sube los datos locales pisando lo que hubiera en el servidor.
   */
  const pushLocal = useCallback(async () => {
    if (!stateRef.current.code) return
    setStatus('syncing')
    try {
      const payload = readAll()
      const ts = await bucketSet(stateRef.current.code, payload, null)
      setState({ ...stateRef.current, lastSyncedAt: ts })
      setStatus('idle')
    } catch (e) {
      setStatus('error')
      setError(String((e as Error)?.message ?? e))
    }
  }, [setState])

  /**
   * Desactiva la sync en este dispositivo (no toca el servidor).
   */
  const disconnect = useCallback(() => {
    setState(DEFAULT)
    setStatus('idle')
    setError(null)
  }, [setState])

  /**
   * Push automático con debounce cuando cambia localStorage en este dispositivo.
   */
  useEffect(() => {
    if (!state.code) return
    const onChange = (e: StorageEvent | Event) => {
      const key = (e as StorageEvent).key
      // Ignora cambios propios del estado de sync para evitar bucles
      if (key === 'yoga.sync') return
      if (key && !SYNC_KEYS.includes(key as (typeof SYNC_KEYS)[number])) return

      if (debounceRef.current) window.clearTimeout(debounceRef.current)
      debounceRef.current = window.setTimeout(async () => {
        try {
          setStatus('syncing')
          const payload = readAll()
          const ts = await bucketSet(stateRef.current.code!, payload, stateRef.current.lastSyncedAt)
          setState({ ...stateRef.current, lastSyncedAt: ts, lastLocalChange: Date.now() })
          setStatus('idle')
        } catch (e) {
          const msg = String((e as Error)?.message ?? e)
          if (msg.includes('conflict')) setStatus('conflict')
          else {
            setStatus('error')
            setError(msg)
          }
        }
      }, 1500)
    }
    // Cambios entre pestañas
    window.addEventListener('storage', onChange)
    // Último push al cerrar la pestaña usando fetch keepalive (sí admite headers,
    // a diferencia de sendBeacon, así que la petición lleva apikey y Authorization).
    const onBeforeUnload = () => {
      if (!stateRef.current.code) return
      try {
        const payload = readAll()
        fetch(`${SUPABASE_URL}/rest/v1/rpc/bucket_set`, {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            p_code: stateRef.current.code,
            p_payload: payload,
            p_expected_updated_at: null,
          }),
          keepalive: true,
        }).catch(() => {
          /* la pestaña ya se está cerrando, no podemos manejar errores */
        })
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => {
      window.removeEventListener('storage', onChange)
      window.removeEventListener('beforeunload', onBeforeUnload)
      if (debounceRef.current) window.clearTimeout(debounceRef.current)
    }
  }, [state.code, setState])

  /**
   * Pull al ganar foco: trae cambios remotos si los hay.
   */
  const pull = useCallback(async () => {
    if (!stateRef.current.code) return null
    setStatus('syncing')
    try {
      const row = await bucketGet(stateRef.current.code)
      setStatus('idle')
      if (!row) return null
      if (
        stateRef.current.lastSyncedAt &&
        row.updated_at <= stateRef.current.lastSyncedAt
      ) {
        return null
      }
      return row
    } catch (e) {
      setStatus('error')
      setError(String((e as Error)?.message ?? e))
      return null
    }
  }, [])

  // Pull puntual: al montar (abrir la app) y al volver al foco si llevaba
  // tiempo fuera. Sin intervalo. Pensado para uso no simultáneo entre dispositivos.
  useEffect(() => {
    if (!state.code) return
    let lastPullAt = 0
    const MIN_INTERVAL_MS = 30_000 // evita repeticiones si el foco "rebota"

    const doPull = async (force = false) => {
      if (!force && Date.now() - lastPullAt < MIN_INTERVAL_MS) return
      lastPullAt = Date.now()
      const row = await pull()
      if (row) applyRemote(row.payload as Record<string, unknown>, row.updated_at)
    }

    // Pull inicial al detectar código en este dispositivo
    doPull(true)

    const onVisibility = () => {
      if (document.visibilityState === 'visible') doPull()
    }
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', () => doPull())

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', () => doPull())
    }
  }, [state.code, pull, applyRemote])

  return {
    code: state.code,
    lastSyncedAt: state.lastSyncedAt,
    status,
    error,
    activate,
    connect,
    applyRemote,
    pushLocal,
    disconnect,
    pull,
  }
}
