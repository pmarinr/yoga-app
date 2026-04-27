import { Link, NavLink, Outlet } from 'react-router-dom'
import { useBadges } from '../hooks/useBadges'
import { BadgeUnlockToast } from './BadgeUnlockToast'

const links = [
  { to: '/', label: 'Hoy', icon: '🏠' },
  { to: '/plan', label: 'Plan', icon: '📅' },
  { to: '/videos', label: 'Vídeos', icon: '▶️' },
  { to: '/peso', label: 'Peso', icon: '⚖️' },
  { to: '/dieta', label: 'Dieta', icon: '🥗' },
  { to: '/logros', label: 'Logros', icon: '🏅' },
  { to: '/guia', label: 'Guía', icon: '📖' },
]

export function Layout() {
  const { justUnlocked, dismissJustUnlocked } = useBadges()
  return (
    <div className="min-h-full pb-20 md:pb-0 md:pl-56">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-56 flex-col border-r border-slate-200 bg-white">
        <div className="px-5 py-6 border-b border-slate-200">
          <div className="text-lg font-semibold text-teal-700">Yoga 12 sem.</div>
          <div className="text-xs text-slate-500">94 → 85 kg</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  isActive
                    ? 'bg-teal-50 text-teal-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <NavLink
          to="/ajustes"
          className={({ isActive }) =>
            `m-3 flex items-center gap-3 px-3 py-2 rounded-lg text-sm border-t pt-4 ${
              isActive ? 'text-teal-700' : 'text-slate-500 hover:bg-slate-50'
            }`
          }
        >
          <span>⚙️</span>
          <span>Ajustes</span>
        </NavLink>
      </aside>

      <Link
        to="/ajustes"
        className="md:hidden fixed top-3 right-3 z-30 w-10 h-10 grid place-items-center rounded-full bg-white shadow text-slate-600"
        aria-label="Ajustes"
      >
        ⚙️
      </Link>

      <main className="px-4 py-5 md:px-8 md:py-8 max-w-5xl mx-auto">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 grid grid-cols-7">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-2 text-[11px] ${
                isActive ? 'text-teal-700' : 'text-slate-500'
              }`
            }
          >
            <span className="text-lg leading-none">{l.icon}</span>
            <span>{l.label}</span>
          </NavLink>
        ))}
      </nav>

      <BadgeUnlockToast badges={justUnlocked} onDismiss={dismissJustUnlocked} />
    </div>
  )
}
