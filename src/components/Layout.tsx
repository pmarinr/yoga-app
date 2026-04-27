import { Link, NavLink, Outlet } from 'react-router-dom'
import { useBadges } from '../hooks/useBadges'
import { BadgeUnlockToast } from './BadgeUnlockToast'
import { ThemeToggle } from './ThemeToggle'
import { useTheme } from '../hooks/useTheme'

const links = [
  { to: '/', label: 'Hoy', icon: '🏠', color: '#FF6E5C' },
  { to: '/plan', label: 'Plan', icon: '📅', color: '#FF6E5C' },
  { to: '/videos', label: 'Vídeos', icon: '▶️', color: '#FA114F' },
  { to: '/peso', label: 'Peso', icon: '⚖️', color: '#0A84FF' },
  { to: '/dieta', label: 'Dieta', icon: '🥗', color: '#34C759' },
  { to: '/logros', label: 'Logros', icon: '🏅', color: '#AF52DE' },
  { to: '/guia', label: 'Guía', icon: '📖', color: '#5856D6' },
]

export function Layout() {
  const { justUnlocked, dismissJustUnlocked } = useBadges()
  useTheme()

  return (
    <div className="min-h-full pb-28 md:pb-0 md:pl-64">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col glass border-r divider z-30">
        <div className="px-5 py-6 border-b divider">
          <div className="text-xl font-semibold tracking-tightest bg-gradient-to-r from-yoga to-[#FA114F] bg-clip-text text-transparent">
            Yoga 12 sem.
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">94 → 85 kg</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-black/[0.05] dark:bg-white/[0.06] text-slate-900 dark:text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                }`
              }
              style={({ isActive }) => (isActive ? { color: l.color } : undefined)}
            >
              <span className="text-base">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t divider space-y-1">
          <NavLink
            to="/ajustes"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium ${
                isActive
                  ? 'bg-black/[0.05] dark:bg-white/[0.06] text-slate-900 dark:text-white'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
              }`
            }
          >
            <span>⚙️</span>
            <span>Ajustes</span>
          </NavLink>
          <div className="px-2 pt-1">
            <ThemeToggle withLabel />
          </div>
        </div>
      </aside>

      <div className="md:hidden fixed top-3 right-3 z-30 flex gap-2">
        <ThemeToggle />
        <Link
          to="/ajustes"
          className="w-10 h-10 grid place-items-center rounded-full glass shadow-soft text-slate-700 dark:text-slate-200"
          aria-label="Ajustes"
        >
          ⚙️
        </Link>
      </div>

      <main className="px-4 py-6 md:px-8 md:py-10 max-w-5xl mx-auto">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-40 glass border divider rounded-full shadow-card grid grid-cols-7 px-1 py-1.5 pb-[calc(env(safe-area-inset-bottom)+0.375rem)]">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1.5 text-[10px] rounded-full transition ${
                isActive
                  ? 'font-semibold'
                  : 'text-slate-500 dark:text-slate-400'
              }`
            }
            style={({ isActive }) => (isActive ? { color: l.color } : undefined)}
          >
            <span className="text-base leading-none mb-0.5">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <BadgeUnlockToast badges={justUnlocked} onDismiss={dismissJustUnlocked} />
    </div>
  )
}
