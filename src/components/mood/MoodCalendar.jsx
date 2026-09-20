import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { MOODS, MOOD_COLORS } from '../../lib/constants'

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export function dateKey(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export default function MoodCalendar({ entries, selected, onSelect }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const todayKey = dateKey(now.getFullYear(), now.getMonth(), now.getDate())

  const shift = (delta) => {
    let m = month + delta
    let y = year
    if (m < 0) { m = 11; y-- }
    if (m > 11) { m = 0; y++ }
    setMonth(m)
    setYear(y)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => shift(-1)} aria-label="Bulan sebelumnya" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          <ChevronLeft size={18} />
        </button>
        <div className="font-bold text-slate-800 dark:text-slate-100">
          {MONTHS[month]} {year}
        </div>
        <button onClick={() => shift(1)} aria-label="Bulan berikutnya" className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-[10px] font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500 py-1">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (d === null) return <div key={'e' + i} />
          const key = dateKey(year, month, d)
          const mood = entries[key]
          const isToday = key === todayKey
          const isSelected = key === selected
          const isFuture = new Date(year, month, d) > new Date(now.getFullYear(), now.getMonth(), now.getDate())
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              disabled={isFuture}
              title={isFuture ? 'Mood untuk hari mendatang belum bisa dicatat' : undefined}
              className={cn(
                'aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition border cursor-pointer',
                isFuture && 'opacity-35 cursor-not-allowed',
                isSelected
                  ? 'border-brand bg-brand/10'
                  : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800',
                isToday && !isSelected && 'border-brand/50',
              )}
            >
              <span className={cn('font-medium', isToday ? 'text-brand-deep dark:text-brand font-bold' : 'text-slate-700 dark:text-slate-300')}>
                {d}
              </span>
              {mood !== undefined && mood !== null ? (
                <span className="text-xs leading-none mt-0.5">{MOODS[mood]}</span>
              ) : (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ background: mood !== undefined ? MOOD_COLORS[mood] : 'transparent' }}
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
