import { formatMonth } from '../utils/format'

export default function MonthPicker({ months, value, onChange }) {
  return (
    <label className="month-picker">
      <span>Okres</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {months.map((m) => (
          <option key={m} value={m}>{formatMonth(m)}</option>
        ))}
        <option value="all">Wszystko</option>
      </select>
    </label>
  )
}
