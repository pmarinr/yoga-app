interface RingDef {
  label: string
  pct: number
  from: string
  to: string
}

interface Props {
  values: RingDef[]
  size?: number
  showLegend?: boolean
}

export function ActivityRings({ values, size = 200, showLegend = true }: Props) {
  const stroke = 18
  const gap = 6
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex items-center gap-5 flex-wrap sm:flex-nowrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-sm">
        <defs>
          {values.map((v, i) => (
            <linearGradient key={v.label + i} id={`g-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={v.from} />
              <stop offset="100%" stopColor={v.to} />
            </linearGradient>
          ))}
        </defs>
        {values.map((v, i) => {
          const r = (size - stroke) / 2 - i * (stroke + gap)
          if (r <= 0) return null
          const c = 2 * Math.PI * r
          const dash = c * Math.min(1, Math.max(0, v.pct))
          return (
            <g key={v.label} transform={`rotate(-90 ${cx} ${cy})`}>
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={v.from}
                strokeOpacity={0.18}
                strokeWidth={stroke}
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={`url(#g-${i})`}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c}`}
                style={{ transition: 'stroke-dasharray .8s cubic-bezier(.4,.2,.2,1)' }}
              />
            </g>
          )
        })}
      </svg>
      {showLegend && (
        <ul className="space-y-2">
          {values.map((v) => (
            <li key={v.label} className="flex items-center gap-3">
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: `linear-gradient(135deg, ${v.from}, ${v.to})` }}
              />
              <span className="text-sm font-medium">{v.label}</span>
              <span className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                {Math.round(v.pct * 100)}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
