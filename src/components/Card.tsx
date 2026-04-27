import type { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  tone?: 'default' | 'accent' | 'amber' | 'rose' | 'plain'
}

const TONES: Record<NonNullable<Props['tone']>, string> = {
  default: 'glass border border-white/40 dark:border-white/5 shadow-card',
  plain: 'bg-white dark:bg-[#1c1c1e] border border-black/[0.04] dark:border-white/[0.06]',
  accent:
    'bg-gradient-to-br from-yoga to-[#FF2D55] text-white border-0 shadow-moveGlow',
  amber:
    'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-500/10 dark:to-amber-700/15 border border-amber-200/60 dark:border-amber-700/30 text-amber-900 dark:text-amber-100',
  rose:
    'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-500/10 dark:to-rose-700/15 border border-rose-200/60 dark:border-rose-700/30 text-rose-900 dark:text-rose-100',
}

export function Card({ children, tone = 'default', className = '', ...rest }: Props) {
  return (
    <div {...rest} className={`rounded-3xl p-5 ${TONES[tone]} ${className}`}>
      {children}
    </div>
  )
}

interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  color?: string
  right?: ReactNode
}

export function SectionTitle({ eyebrow, title, subtitle, color = '#FF6E5C', right }: SectionTitleProps) {
  return (
    <header className="flex items-end justify-between gap-3 mb-3">
      <div>
        {eyebrow && (
          <div
            className="text-[11px] font-semibold uppercase tracking-wider"
            style={{ color }}
          >
            {eyebrow}
          </div>
        )}
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
        )}
      </div>
      {right}
    </header>
  )
}

interface HeroMetricProps {
  value: string
  unit?: string
  label: string
  hint?: string
  color?: string
}

export function HeroMetric({ value, unit, label, hint, color = '#0A84FF' }: HeroMetricProps) {
  return (
    <div>
      <div
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color }}
      >
        {label}
      </div>
      <div className="flex items-baseline gap-1.5">
        <div className="text-5xl font-semibold tracking-tightest">{value}</div>
        {unit && <div className="text-base text-slate-500 dark:text-slate-400">{unit}</div>}
      </div>
      {hint && <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{hint}</div>}
    </div>
  )
}

export function Pill({
  children,
  color = '#0A84FF',
  filled,
}: {
  children: ReactNode
  color?: string
  filled?: boolean
}) {
  if (filled) {
    return (
      <span
        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
        style={{ background: color }}
      >
        {children}
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: `${color}1f`, color }}
    >
      {children}
    </span>
  )
}

export function Segmented<T extends string | number>({
  value,
  options,
  onChange,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex p-1 rounded-2xl bg-black/[0.05] dark:bg-white/[0.06]">
      {options.map((o) => (
        <button
          key={String(o.value)}
          onClick={() => onChange(o.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            o.value === value
              ? 'bg-white dark:bg-[#3a3a3c] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function StatTile({
  label,
  value,
  unit,
  color = '#0A84FF',
  icon,
}: {
  label: string
  value: string
  unit?: string
  color?: string
  icon?: string
}) {
  return (
    <div className="rounded-3xl p-4 glass border border-white/40 dark:border-white/5 shadow-card">
      <div className="flex items-center justify-between">
        <div
          className="text-[11px] font-semibold uppercase tracking-wider"
          style={{ color }}
        >
          {label}
        </div>
        {icon && <div className="text-base opacity-70">{icon}</div>}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <div className="text-3xl font-semibold tracking-tightest">{value}</div>
        {unit && <div className="text-xs text-slate-500 dark:text-slate-400">{unit}</div>}
      </div>
    </div>
  )
}
