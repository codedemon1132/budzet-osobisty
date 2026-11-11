import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { CATEGORY_COLORS, FALLBACK_COLOR } from '../constants'
import { formatPLN } from '../utils/format'

const colorOf = (name) => CATEGORY_COLORS[name] || FALLBACK_COLOR

export default function CategoryChart({ data, total }) {
  return (
    <section className="panel" style={{ animationDelay: '260ms' }} aria-labelledby="chart-heading">
      <h2 id="chart-heading">Wydatki według kategorii</h2>
      {data.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" aria-hidden="true">◔</div>
          <p>Brak wydatków w wybranym okresie.</p>
        </div>
      ) : (
        <div className="chart">
          {/* Wykres jest dekoracyjny dla czytników ekranu — te same dane są w legendzie poniżej. */}
          <div className="chart-canvas" aria-hidden="true">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="62%"
                  outerRadius="92%"
                  paddingAngle={3}
                  cornerRadius={6}
                  stroke="none"
                  animationDuration={900}
                  animationEasing="ease-out"
                >
                  {data.map((d) => <Cell key={d.name} fill={colorOf(d.name)} />)}
                </Pie>
                <Tooltip
                  formatter={(v) => formatPLN(v)}
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--panel)',
                    boxShadow: 'var(--shadow-lg)',
                  }}
                  itemStyle={{ color: 'var(--text)' }}
                  labelStyle={{ color: 'var(--muted)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center">
              <span>Razem</span>
              <strong>{formatPLN(total)}</strong>
            </div>
          </div>
          <ul className="legend" aria-label={`Wydatki razem: ${formatPLN(total)}`}>
            {data.map((d, i) => {
              const pct = total > 0 ? (d.value / total) * 100 : 0
              return (
                <li key={d.name} style={{ animationDelay: `${300 + i * 50}ms` }}>
                  <div className="legend-row">
                    <span className="dot" style={{ background: colorOf(d.name) }} aria-hidden="true" />
                    <span className="legend-name">{d.name}</span>
                    <span className="legend-value">{formatPLN(d.value)}</span>
                    <span className="legend-pct">{Math.round(pct)}%</span>
                  </div>
                  <div className="bar" aria-hidden="true">
                    <div className="bar-fill" style={{ width: `${pct}%`, background: colorOf(d.name) }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </section>
  )
}
