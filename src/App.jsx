import { useMemo, useState } from 'react'
import { useTransactions } from './hooks/useTransactions'
import { useTheme } from './hooks/useTheme'
import { currentMonth } from './utils/format'
import MonthPicker from './components/MonthPicker'
import SummaryCards from './components/SummaryCards'
import TransactionForm from './components/TransactionForm'
import CategoryChart from './components/CategoryChart'
import TransactionList from './components/TransactionList'

export default function App() {
  const { transactions, addTransaction, deleteTransaction } = useTransactions()
  const { theme, toggle } = useTheme()
  const [month, setMonth] = useState(currentMonth)

  const months = useMemo(() => {
    const set = new Set(transactions.map((t) => t.date.slice(0, 7)))
    set.add(currentMonth())
    return [...set].sort().reverse()
  }, [transactions])

  const filtered = useMemo(
    () => (month === 'all' ? transactions : transactions.filter((t) => t.date.startsWith(month))),
    [transactions, month],
  )

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of filtered) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return { income, expense, balance: income - expense }
  }, [filtered])

  const chartData = useMemo(() => {
    const byCategory = {}
    for (const t of filtered) {
      if (t.type !== 'expense') continue
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    }
    return Object.entries(byCategory)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [filtered])

  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo" aria-hidden="true">zł</div>
          <div>
            <h1>Budżet osobisty</h1>
            <p className="subtitle">Kontroluj swoje dochody i wydatki</p>
          </div>
        </div>
        <div className="header-actions">
          <MonthPicker months={months} value={month} onChange={setMonth} />
          <button
            type="button"
            className="icon-btn"
            onClick={toggle}
            aria-label={theme === 'light' ? 'Włącz ciemny motyw' : 'Włącz jasny motyw'}
            title={theme === 'light' ? 'Ciemny motyw' : 'Jasny motyw'}
          >
            <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
          </button>
        </div>
      </header>

      <main>
        <SummaryCards {...totals} />

        <div className="grid">
          <TransactionForm onAdd={addTransaction} />
          <CategoryChart key={month} data={chartData} total={totals.expense} />
        </div>

        <TransactionList transactions={filtered} onDelete={deleteTransaction} />
      </main>
    </div>
  )
}
