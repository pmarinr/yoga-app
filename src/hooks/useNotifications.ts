import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'
import { useStats } from './useStats'

interface ReminderConfig {
  enabled: boolean
  time: string // HH:mm
}

const DEFAULT: ReminderConfig = { enabled: false, time: '07:30' }

export function useNotifications() {
  const [config, setConfig] = useLocalStorage<ReminderConfig>('yoga.reminder', DEFAULT)
  const stats = useStats()

  const supported = typeof Notification !== 'undefined'
  const triggersSupported =
    typeof Notification !== 'undefined' &&
    'showTrigger' in Notification.prototype

  const requestPermission = async () => {
    if (!supported) return 'denied'
    return Notification.requestPermission()
  }

  const scheduleNext = async () => {
    if (!supported || !config.enabled || Notification.permission !== 'granted') return
    const reg = await navigator.serviceWorker?.ready
    if (!reg) return

    const [hh, mm] = config.time.split(':').map(Number)
    const target = new Date()
    target.setHours(hh, mm, 0, 0)
    if (target.getTime() <= Date.now()) target.setDate(target.getDate() + 1)

    if (triggersSupported) {
      // @ts-expect-error TimestampTrigger is experimental
      const TimestampTrigger = window.TimestampTrigger
      try {
        await reg.showNotification('Yoga 12 semanas', {
          body: '🧘 Es hora de tu sesión de hoy',
          tag: 'yoga-daily',
          // @ts-expect-error showTrigger experimental
          showTrigger: new TimestampTrigger(target.getTime()),
        })
      } catch {
        /* fallback abajo */
      }
    }
  }

  // Fallback al abrir la app: si la sesión no está hecha y la hora ya pasó hoy, notif inmediata
  useEffect(() => {
    if (!config.enabled || !supported || Notification.permission !== 'granted') return
    const [hh, mm] = config.time.split(':').map(Number)
    const target = new Date()
    target.setHours(hh, mm, 0, 0)
    if (Date.now() < target.getTime()) return
    if (stats.todaySessionDone) return
    const lastNotifKey = 'yoga.notifLast'
    const today = new Date().toISOString().slice(0, 10)
    if (localStorage.getItem(lastNotifKey) === today) return
    try {
      new Notification('Yoga 12 semanas', { body: '🧘 ¿Hacemos la sesión de hoy?' })
      localStorage.setItem(lastNotifKey, today)
    } catch {
      /* ignore */
    }
  }, [config.enabled, config.time, stats.todaySessionDone, supported])

  // Reprogramar siguiente notif al cambiar
  useEffect(() => {
    void scheduleNext()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.enabled, config.time])

  return {
    config,
    setConfig,
    requestPermission,
    supported,
    triggersSupported,
    permission: supported ? Notification.permission : 'unsupported',
  }
}
