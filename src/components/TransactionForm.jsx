import { useState } from 'react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants'
import { todayISO } from '../utils/format'

// Komunikat błędu pod polem, którego dotyczy; role="alert" — od razu odczytywany przez czytnik ekranu.
function ErrorText({ message }) {
  return (
    <p className="error" id="tx-error" role="alert">
      {message}
    </p>
  )
}

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(todayISO)
  const [error, setError] = useState('')
  const [errorField, setErrorField] = useState(null)
  const [added, setAdded] = useState(false)

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const changeType = (next) => {
    setType(next)
    setCategory((next === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES)[0])
  }

  const fail = (field, message) => {
    setError(message)
    setErrorField(field)
    document.getElementById(`tx-${field}`)?.focus()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const value = Number(amount.replace(/\s/g, '').replace(',', '.'))
    if (!amount.trim() || !Number.isFinite(value) || value <= 0) {
      fail('amount', 'Podaj kwotę większą od zera, np. 49,99.')
      return
    }
    if (!date) {
      fail('date', 'Wybierz datę.')
      return
    }
    onAdd({
      type,
      amount: Math.round(value * 100) / 100,
      category,
      description: description.trim(),
      date,
    })
    setAmount('')
    setDescription('')
    setError('')
    setErrorField(null)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  const fieldProps = (field) =>
    errorField === field ? { 'aria-invalid': true, 'aria-describedby': 'tx-error' } : {}

  return (
    <form className="panel form" onSubmit={handleSubmit} noValidate style={{ animationDelay: '200ms' }} aria-labelledby="form-heading">
      <h2 id="form-heading">Dodaj transakcję</h2>

      <div className={`toggle toggle-${type}`} role="group" aria-label="Rodzaj transakcji">
        <span className="toggle-indicator" aria-hidden="true" />
        <button type="button" className={type === 'expense' ? 'active' : ''} aria-pressed={type === 'expense'} onClick={() => changeType('expense')}>
          Wydatek
        </button>
        <button type="button" className={type === 'income' ? 'active' : ''} aria-pressed={type === 'income'} onClick={() => changeType('income')}>
          Dochód
        </button>
      </div>

      <div className="field">
        <label htmlFor="tx-amount">Kwota (zł)</label>
        <input
          id="tx-amount"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            if (errorField === 'amount') { setError(''); setErrorField(null) }
          }}
          {...fieldProps('amount')}
        />
        {errorField === 'amount' && <ErrorText key={error} message={error} />}
      </div>

      <div className="field">
        <label htmlFor="tx-category">Kategoria</label>
        <select id="tx-category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="field">
        <label htmlFor="tx-description">Opis (opcjonalnie)</label>
        <input
          id="tx-description"
          type="text"
          autoComplete="off"
          placeholder="np. zakupy spożywcze"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="tx-date">Data</label>
        <input
          id="tx-date"
          type="date"
          value={date}
          onChange={(e) => {
            setDate(e.target.value)
            if (errorField === 'date') { setError(''); setErrorField(null) }
          }}
          {...fieldProps('date')}
        />
        {errorField === 'date' && <ErrorText key={error} message={error} />}
      </div>

      <div aria-live="polite" className="sr-only">
        {added ? 'Transakcja została dodana.' : ''}
      </div>

      <button type="submit" className={`primary ${added ? 'success' : ''}`}>
        {added ? '✓ Dodano' : type === 'expense' ? 'Dodaj wydatek' : 'Dodaj dochód'}
      </button>
    </form>
  )
}
