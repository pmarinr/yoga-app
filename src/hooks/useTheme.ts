import { useEffect } from 'react'
import { useLocalStorage } from './useLocalStorage'

export type Theme = 'light' | 'dark' | 'auto'

function applyTheme(t: Theme) {
  const root = document.documentElement
  const dark =
    t === 'dark' ||
    (t === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  root.classList.toggle('dark', dark)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', dark ? '#020617' : '#0f766e')
}

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>('yoga.theme', 'auto')

  useEffect(() => {
    applyTheme(theme)
    if (theme !== 'auto') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const fn = () => applyTheme('auto')
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [theme])

  const cycle = () => {
    setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'auto' : 'light'))
  }

  const isDark =
    theme === 'dark' ||
    (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)

  return { theme, setTheme, cycle, isDark }
}
