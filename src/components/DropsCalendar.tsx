'use client'

import { useState } from 'react'
import type { Drop } from '@/data/drops'
import CountdownTimer from './CountdownTimer'

const STATUS_DOT: Record<string, string> = {
  live:     'bg-lume',
  upcoming: 'bg-copper',
  sold_out: 'bg-storm',
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAY_NAMES   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

function isoDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

interface Props {
  drops: Drop[]
}

export default function DropsCalendar({ drops }: Props) {
  const today = new Date()
  const [year,  setYear]  = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())        // 0-indexed
  const [selected, setSelected] = useState<string | null>(null) // ISO date string

  // Build a map: ISO date → drops on that day
  const dropsByDate = new Map<string, Drop[]>()
  for (const drop of drops) {
    const key = drop.dropDate.slice(0, 10)
    if (!dropsByDate.has(key)) dropsByDate.set(key, [])
    dropsByDate.get(key)!.push(drop)
  }

  // Calendar grid: days of the selected month
  const firstDay = new Date(year, month, 1)
  // Monday-indexed day of week (0=Mon … 6=Sun)
  const startOffset = (firstDay.getDay() + 6) % 7
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate())

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
    setSelected(null)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
    setSelected(null)
  }

  const selectedDrops = selected ? (dropsByDate.get(selected) ?? []) : []

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-2">
        <button onClick={prevMonth} className="p-2 text-silver hover:text-archive transition-colors" aria-label="Previous month">
          ←
        </button>
        <h3 className="font-display font-bold text-archive text-lg tracking-tight">
          {MONTH_NAMES[month]} {year}
        </h3>
        <button onClick={nextMonth} className="p-2 text-silver hover:text-archive transition-colors" aria-label="Next month">
          →
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map(d => (
          <div key={d} className="font-mono text-[10px] text-silver tracking-widest uppercase text-center py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const iso = isoDate(year, month, day)
          const cellDrops = dropsByDate.get(iso) ?? []
          const isToday   = iso === todayIso
          const isSel     = iso === selected
          return (
            <button
              key={iso}
              onClick={() => setSelected(isSel ? null : iso)}
              className={`relative flex flex-col items-center pt-1.5 pb-1 rounded-sm border transition-colors min-h-[3rem] ${
                isSel
                  ? 'bg-slate border-lume'
                  : isToday
                  ? 'bg-slate border-storm'
                  : 'bg-midnight border-storm hover:border-silver'
              }`}
            >
              <span className={`font-mono text-xs tabular-nums leading-none ${isToday ? 'text-lume font-bold' : 'text-silver'}`}>
                {day}
              </span>
              {/* Status dots */}
              {cellDrops.length > 0 && (
                <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                  {cellDrops.slice(0, 3).map(d => (
                    <span key={d.id} className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[d.status]}`} />
                  ))}
                  {cellDrops.length > 3 && (
                    <span className="font-mono text-[8px] text-silver">+{cellDrops.length - 3}</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2 font-mono text-xs text-silver">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-lume" />Live</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-copper" />Upcoming</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-storm border border-silver/20" />Sold Out</span>
      </div>

      {/* Selected day panel */}
      {selected && selectedDrops.length === 0 && (
        <p className="font-mono text-xs text-silver pt-2">No drops on this date.</p>
      )}
      {selectedDrops.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-storm">
          <p className="font-mono text-xs text-silver tracking-widest uppercase">
            {new Date(selected!).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          {selectedDrops.map(drop => (
            <div key={drop.id} className="card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-xs text-copper mb-0.5">{drop.brand}</p>
                  <p className="font-semibold text-archive text-sm leading-snug">{drop.title}</p>
                  {drop.status === 'upcoming' && (
                    <CountdownTimer dropDate={drop.dropDate} variant="compact" />
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span className="font-display font-bold text-archive text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: drop.currency, maximumFractionDigits: 0 }).format(drop.price)}
                  </span>
                  {drop.status !== 'sold_out' && (
                    <a
                      href={drop.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-lume hover:text-archive transition-colors"
                    >
                      View →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
