import { useTheme } from '../hooks/useTheme'

const ICON: Record<string, string> = { light: '☀️', dark: '🌙', auto: '🌓' }
const LABEL: Record<string, string> = { light: 'Claro', dark: 'Oscuro', auto: 'Auto' }

export function ThemeToggle({ withLabel = false }: { withLabel?: boolean }) {
  const { theme, cycle } = useTheme()
  return (
    <button
      onClick={cycle}
      className="inline-flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur shadow-soft px-3 py-1.5 text-sm text-slate-700 dark:text-slate-200 hover:scale-105 transition"
      aria-label={`Cambiar tema (actual: ${LABEL[theme]})`}
      title={`Tema: ${LABEL[theme]} — pulsa para cambiar`}
    >
      <span className="text-base leading-none">{ICON[theme]}</span>
      {withLabel && <span>{LABEL[theme]}</span>}
    </button>
  )
}
