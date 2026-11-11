import { useCountUp } from '../hooks/useCountUp'
import { formatPLN } from '../utils/format'

function Card({ label, value, variant, icon, delay }) {
  const animated = useCountUp(value)
  return (
    <div className={`card card-${variant}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="card-icon" aria-hidden="true">{icon}</div>
      <div className="card-body">
        <span className="card-label">{label}</span>
        {/* Czytnik ekranu dostaje wartość docelową, a nie klatki animacji. */}
        <span className="card-value" aria-hidden="true">{formatPLN(animated)}</span>
        <span className="sr-only">{formatPLN(value)}</span>
      </div>
    </div>
  )
}

export default function SummaryCards({ income, expense, balance }) {
  return (
    <section className="cards" aria-label="Podsumowanie okresu">
      <Card label="Łączny dochód" value={income} variant="income" icon="↑" delay={0} />
      <Card label="Łączne wydatki" value={expense} variant="expense" icon="↓" delay={80} />
      <Card
        label="Pozostałe saldo"
        value={balance}
        variant={balance < 0 ? 'negative' : 'balance'}
        icon="◎"
        delay={160}
      />
    </section>
  )
}
