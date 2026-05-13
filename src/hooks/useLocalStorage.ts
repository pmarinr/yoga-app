import { useCallback, useEffect, useRef, useState } from 'react'

const EVENT = 'yoga.localstorage-change'

/**
 * Disparar este evento (custom) hace que todos los hooks `useLocalStorage`
 * registrados con esa key relean su valor. Útil cuando una sincronización
 * externa (Supabase) escribe directamente en localStorage y necesitamos
 * que la UI se entere sin recargar.
 */
export function notifyLocalStorageChange(key: string) {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { key } }))
}

export function useLocalStorage<T>(key: string, initial: T) {
  const read = useCallback((): T => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  }, [key, initial])

  const [value, setValue] = useState<T>(read)
  const lastWrittenRef = useRef<string | null>(null)

  // Escribe el valor en localStorage cuando cambia (desde dentro del hook)
  useEffect(() => {
    try {
      const serialized = JSON.stringify(value)
      if (serialized === lastWrittenRef.current) return
      lastWrittenRef.current = serialized
      localStorage.setItem(key, serialized)
    } catch {
      /* ignore quota */
    }
  }, [key, value])

  // Escucha cambios externos (otra pestaña o sync que rellena localStorage)
  useEffect(() => {
    const refresh = (e?: StorageEvent | Event) => {
      if (e && (e as StorageEvent).key && (e as StorageEvent).key !== key) {
        // Storage event de OTRA clave
        return
      }
      if (e && (e as CustomEvent).detail && (e as CustomEvent).detail.key !== key) {
        // Custom event de OTRA clave
        return
      }
      try {
        const raw = localStorage.getItem(key)
        const next = raw ? (JSON.parse(raw) as T) : initial
        const serialized = raw ?? JSON.stringify(initial)
        if (serialized !== lastWrittenRef.current) {
          lastWrittenRef.current = serialized
          setValue(next)
        }
      } catch {
        /* ignore */
      }
    }
    window.addEventListener('storage', refresh)
    window.addEventListener(EVENT, refresh as EventListener)
    return () => {
      window.removeEventListener('storage', refresh)
      window.removeEventListener(EVENT, refresh as EventListener)
    }
  }, [key, initial])

  const reset = useCallback(() => setValue(initial), [initial])

  return [value, setValue, reset] as const
}
