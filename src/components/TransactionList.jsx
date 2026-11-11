import { useEffect, useRef, useState } from 'react'
import { CATEGORY_COLORS, FALLBACK_COLOR } from '../constants'
import { formatDate, formatPLN } from '../utils/format'

export default function TransactionList({ transactions, onDelete }) {
  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))
  const [confirmId, setConfirmId] = useState(null)
  const confirmRef = useRef(null)

  // Po otwarciu potwierdzenia przenieś fokus na przycisk „Usuń”.
  useEffect(() => {
    if (confirmId) confirmRef.current?.focus()
  }, [confirmId])

  const cancel = () => setConfirmId(null)

  return (
    <section className="panel" style={{ animationDelay: '320ms' }} aria-labelledby="tx-heading">
      <div className="panel-head">
        <h2 id="tx-heading">Transakcje</h2>
        {sorted.length > 0 && (
          <span className="badge" aria-label={`liczba transakcji: ${sorted.length}`}>{sorted.length}</span>
        )}
      </div>
      {sorted.length === 0 ? (
        <div className="empty">
          <div className="empty-icon" aria-hidden="true">☰</div>
          <p>Brak transakcji w wybranym okresie.</p>
          <p className="empty-hint">Dodaj pierwszą za pomocą formularza „Dodaj transakcję”.</p>
        </div>
      ) : (
        <ul className="tx-list">
          {sorted.map((t) => {
            const color = t.type === 'income' ? 'var(--income)' : CATEGORY_COLORS[t.category] || FALLBACK_COLOR
            const confirming = confirmId === t.id
            return (
              <li key={t.id} className={confirming ? 'confirming' : ''}>
                <span className="tx-avatar" style={{ '--c': color }} aria-hidden="true">{t.category.charAt(0)}</span>
                <div className="tx-main">
                  <span className="tx-category">{t.category}</span>
                  {t.description && <span className="tx-desc" title={t.description}>{t.description}</span>}
                </div>
                <time className="tx-date" dateTime={t.date}>{formatDate(t.date)}</time>
                <span className={`tx-amount ${t.type}`}>
                  <span className="sr-only">{t.type === 'income' ? 'Dochód' : 'Wydatek'}: </span>
                  {t.type === 'income' ? '+' : '−'}{formatPLN(t.amount)}
                </span>
                {confirming ? (
                  <div
                    className="tx-confirm"
                    role="group"
                    aria-label={`Potwierdź usunięcie: ${t.category}, ${formatPLN(t.amount)}`}
                    onKeyDown={(e) => e.key === 'Escape' && cancel()}
                  >
                    <span className="tx-confirm-text">Usunąć?</span>
                    <button ref={confirmRef} type="button" className="btn-danger" onClick={() => { onDelete(t.id); setConfirmId(null) }}>
                      Usuń
                    </button>
                    <button type="button" className="btn-ghost" onClick={cancel}>
                      Anuluj
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="delete"
                    onClick={() => setConfirmId(t.id)}
                    aria-label={`Usuń transakcję: ${t.category}, ${formatDate(t.date)}, ${formatPLN(t.amount)}`}
                    title="Usuń"
                  >
                    <span aria-hidden="true">✕</span>
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
