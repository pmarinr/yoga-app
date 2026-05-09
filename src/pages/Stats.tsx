import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, HeroMetric, SectionTitle, StatTile } from '../components/Card'
import { useStats } from '../hooks/useStats'
import { useSessions } from '../hooks/useSessions'
import { usePlan } from '../hooks/usePlan'
import { useStartDate } from '../hooks/useStartDate'
import { useWeights } from '../hooks/useWeights'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DOW_LABEL, PHASE_HEX, PHASE_LABEL } from '../data/plan'
import { useTheme } from '../hooks/useTheme'

type DietDone = Record<string, boolean>

const DAY_MS = 86400000

export function StatsPage() {
  const stats = useStats()
  const PLAN = usePlan()
  const { sessions } = useSessions()
  const { startDate, currentDayIndex } = useStartDate()
  const { weights } = useWeights()
  const [dietDone] = useLocalStorage<DietDone>('yoga.dietDone', {})
  const { isDark } = useTheme()

  const today = currentDayIndex(stats.totalWeeks)
  const grid = isDark ? '#1f2937' : '#e2e8f0'
  const text = isDark ? '#94a3b8' : '#475569'

  // === Sesiones por día de la semana ===
  const byDow = useMemo(() => {
    const programmed = [0, 0, 0, 0, 0, 0, 0]
    const done = [0, 0, 0, 0, 0, 0, 0]
    PLAN.forEach((w) =>
      w.days.forEach((d) => {
        if (d.type === 'descanso') return
        programmed[d.dow - 1]++
        if (sessions[`${w.week}-${d.dow}`]?.done) done[d.dow - 1]++
      }),
    )
    return DOW_LABEL.map((label, i) => ({
      label,
      done: done[i],
      programmed: programmed[i],
      pct: programmed[i] > 0 ? Math.round((done[i] / programmed[i]) * 100) : 0,
    }))
  }, [PLAN, sessions])

  // === Cumplimiento por semana (sesiones + dieta) ===
  const byWeek = useMemo(() => {
    return PLAN.map((w) => {
      const programmed = w.days.filter((d) => d.type !== 'descanso')
      const sessionsDone = programmed.filter((d) => sessions[`${w.week}-${d.dow}`]?.done).length
      const sessionPct = programmed.length > 0 ? Math.round((sessionsDone / programmed.length) * 100) : 0

      let dietHits = 0
      for (let dow = 1; dow <= 7; dow++) {
        ;['desayuno', 'mediamanana', 'comida', 'merienda', 'cena'].forEach((s) => {
          if (dietDone[`${w.week}-${dow}-${s}`]) dietHits++
        })
      }
      const dietPct = Math.round((dietHits / 35) * 100)

      // ¿Esta semana ya pasó?
      const isPast = today ? w.week < today.week : false
      const isCurrent = today ? w.week === today.week : false
      return {
        week: w.week,
        phase: w.phase,
        sessionPct,
        dietPct,
        isPast,
        isCurrent,
      }
    })
  }, [PLAN, sessions, dietDone, today])

  // === Correlación dieta ↔ peso por semana ===
  const correlation = useMemo(() => {
    if (weights.length < 2) return []
    const start = new Date(startDate + 'T00:00:00').getTime()
    const sortedW = [...weights].sort((a, b) => a.date.localeCompare(b.date))
    return PLAN.filter((w) => {
      // Solo semanas con datos hasta hoy
      const weekEnd = start + (w.week * 7 - 1) * DAY_MS
      return weekEnd <= Date.now()
    })
      .map((w) => {
        const wStart = start + (w.week - 1) * 7 * DAY_MS
        const wEnd = start + (w.week * 7 - 1) * DAY_MS
        const inWeek = sortedW.filter((wt) => {
          const t = new Date(wt.date + 'T00:00:00').getTime()
          return t >= wStart - DAY_MS && t <= wEnd + DAY_MS
        })
        if (inWeek.length === 0) return null
        const last = inWeek[inWeek.length - 1].kg
        // Buscar el peso anterior a la semana
        const prev = sortedW.filter(
          (wt) => new Date(wt.date + 'T00:00:00').getTime() < wStart,
        )
        const prevKg = prev.length > 0 ? prev[prev.length - 1].kg : sortedW[0].kg
        const delta = +(last - prevKg).toFixed(1)

        const dietRow = byWeek.find((b) => b.week === w.week)!
        return { week: w.week, phase: w.phase, delta, dietPct: dietRow.dietPct, sessionPct: dietRow.sessionPct }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
  }, [PLAN, weights, byWeek, startDate])

  // === Resumen ===
  const programmedToDate = useMemo(() => {
    if (!today) {
      // Plan terminado o no iniciado → contar todo
      return PLAN.reduce((n, w) => n + w.days.filter((d) => d.type !== 'descanso').length, 0)
    }
    let n = 0
    PLAN.forEach((w) =>
      w.days.forEach((d) => {
        if (d.type === 'descanso') return
        if (w.week < today.week || (w.week === today.week && d.dow <= today.dow)) n++
      }),
    )
    return n
  }, [PLAN, today])

  const sessionRate =
    programmedToDate > 0 ? Math.round((stats.totalSessions / programmedToDate) * 100) : 0

  const totalDietSlots = useMemo(() => {
    if (!today) return PLAN.length * 35
    let n = 0
    PLAN.forEach((w) => {
      if (w.week < today.week) n += 35
      else if (w.week === today.week) n += today.dow * 5
    })
    return n
  }, [PLAN, today])

  const dietHitsTotal = Object.values(dietDone).filter(Boolean).length
  const dietRate = totalDietSlots > 0 ? Math.round((dietHitsTotal / totalDietSlots) * 100) : 0

  // Mejor día (mayor % cumplimiento) y día débil
  const bestDay = useMemo(
    () => [...byDow].sort((a, b) => b.pct - a.pct)[0],
    [byDow],
  )
  const worstDay = useMemo(
    () => [...byDow].filter((d) => d.programmed > 0).sort((a, b) => a.pct - b.pct)[0],
    [byDow],
  )

  return (
    <div className="space-y-6">
      <header>
        <div className="text-[11px] font-semibold uppercase tracking-wider text-meta">Estadísticas</div>
        <h1 className="text-4xl font-semibold tracking-tightest">Análisis</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Tu plan visto en números.
        </p>
      </header>

      <Card>
        <SectionTitle eyebrow="Resumen" title="Cumplimiento global" color="#AF52DE" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-end">
          <HeroMetric label="Sesiones" value={`${sessionRate}`} unit="%" color="#FF6E5C" hint={`${stats.totalSessions}/${programmedToDate}`} />
          <HeroMetric label="Dieta" value={`${dietRate}`} unit="%" color="#34C759" hint={`${dietHitsTotal}/${totalDietSlots}`} />
          <HeroMetric label="Semanas" value={`${stats.weeksCompleted}`} unit={`/${stats.totalWeeks}`} color="#0A84FF" />
        </div>
      </Card>

      <section className="grid grid-cols-2 gap-3">
        <StatTile label="Racha actual" value={`${stats.currentStreak}`} unit="días" color="#FF9F0A" icon="🔥" />
        <StatTile label="Mejor racha" value={`${stats.bestStreak}`} unit="días" color="#FF9F0A" icon="🏆" />
        <StatTile
          label="Mejor día"
          value={bestDay && bestDay.pct > 0 ? bestDay.label : '—'}
          unit={bestDay && bestDay.pct > 0 ? `${bestDay.pct}%` : undefined}
          color="#34C759"
          icon="✨"
        />
        <StatTile
          label="Punto débil"
          value={worstDay && worstDay.pct < 100 ? worstDay.label : '—'}
          unit={worstDay && worstDay.pct < 100 ? `${worstDay.pct}%` : undefined}
          color="#FF3B30"
          icon="📉"
        />
      </section>

      <Card>
        <SectionTitle eyebrow="Por día" title="Sesiones por día de la semana" color="#FF6E5C" />
        <div className="h-56 -mx-2">
          <ResponsiveContainer>
            <BarChart data={byDow} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: text }} stroke={grid} />
              <YAxis tick={{ fontSize: 11, fill: text }} stroke={grid} domain={[0, 'dataMax']} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1c1c1e' : '#fff',
                  border: `1px solid ${grid}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value, name, item) => {
                  if (name === 'done') return [`${value} hechas / ${item.payload.programmed}`, 'Sesiones']
                  return [value, name as string]
                }}
              />
              <Bar dataKey="done" fill="#FF6E5C" radius={[8, 8, 0, 0]}>
                {byDow.map((d, i) => (
                  <Cell key={i} fill={d.pct === 100 ? '#34C759' : d.pct >= 50 ? '#FF6E5C' : '#FF9F0A'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <SectionTitle eyebrow="Por semana" title="Cumplimiento semana a semana" color="#0A84FF" />
        <div className="h-64 -mx-2">
          <ResponsiveContainer>
            <BarChart data={byWeek} margin={{ left: -10, right: 8, top: 8, bottom: 0 }}>
              <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: text }} stroke={grid} />
              <YAxis tick={{ fontSize: 11, fill: text }} stroke={grid} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: isDark ? '#1c1c1e' : '#fff',
                  border: `1px solid ${grid}`,
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value, name) => [`${value}%`, name === 'sessionPct' ? 'Sesiones' : 'Dieta']}
                labelFormatter={(w) => `Semana ${w}`}
              />
              <Bar dataKey="sessionPct" fill="#FF6E5C" radius={[6, 6, 0, 0]} />
              <Bar dataKey="dietPct" fill="#34C759" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex gap-3 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FF6E5C]" /> Sesiones</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#34C759]" /> Dieta</span>
        </div>
      </Card>

      {correlation.length > 0 && (
        <Card>
          <SectionTitle eyebrow="Correlación" title="Dieta ↔ peso por semana" color="#34C759" />
          <div className="overflow-x-auto -mx-1">
            <table className="w-full text-sm tabular-nums">
              <thead className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <tr className="border-b divider">
                  <th className="text-left py-2 px-2">Sem.</th>
                  <th className="text-left py-2 px-2">Fase</th>
                  <th className="text-right py-2 px-2">Sesiones</th>
                  <th className="text-right py-2 px-2">Dieta</th>
                  <th className="text-right py-2 px-2">Δ peso</th>
                </tr>
              </thead>
              <tbody>
                {correlation.map((row) => (
                  <tr key={row.week} className="border-b divider">
                    <td className="py-2 px-2 font-semibold">{row.week}</td>
                    <td className="py-2 px-2">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: PHASE_HEX[row.phase] }}
                      >
                        {PHASE_LABEL[row.phase].split('—')[1]?.trim()}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right">{row.sessionPct}%</td>
                    <td className="py-2 px-2 text-right">{row.dietPct}%</td>
                    <td
                      className={`py-2 px-2 text-right font-semibold ${
                        row.delta < 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : row.delta > 0
                            ? 'text-rose-500 dark:text-rose-400'
                            : 'text-slate-400'
                      }`}
                    >
                      {row.delta > 0 ? `+${row.delta}` : row.delta} kg
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3">
            Δ peso = peso al final de la semana − peso justo antes. Verde si has bajado.
          </p>
        </Card>
      )}
    </div>
  )
}
