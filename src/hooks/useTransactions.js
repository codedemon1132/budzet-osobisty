import { useEffect, useState } from 'react'
import { STORAGE_KEY } from '../constants'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : []
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export function useTransactions() {
  const [transactions, setTransactions] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    } catch {
      // brak dostępu do localStorage – dane zostaną tylko w pamięci
    }
  }, [transactions])

  const addTransaction = (tx) =>
    setTransactions((prev) => [...prev, { ...tx, id: crypto.randomUUID() }])

  const deleteTransaction = (id) =>
    setTransactions((prev) => prev.filter((t) => t.id !== id))

  return { transactions, addTransaction, deleteTransaction }
}
