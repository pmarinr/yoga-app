interface RingProps {
  values: { label: string; pct: number; color: string; trackColor?: string }[]
  size?: number
}

export function ActivityRings({ values, size = 140 }: RingProps) {
  const stroke = 12
  const gap = 4
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
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
                stroke={v.trackColor ?? '#f1f5f9'}
                strokeWidth={stroke}
              />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={v.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${c}`}
                style={{ transition: 'stroke-dasharray .6s ease' }}
              />
            </g>
          )
        })}
      </svg>
      <ul className="text-xs space-y-1">
        {values.map((v) => (
          <li key={v.label} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />
            <span className="text-slate-600">{v.label}</span>
            <span className="text-slate-400">{Math.round(v.pct * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
