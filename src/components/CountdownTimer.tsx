'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  return {
    days:    Math.floor(diff / 86400000),
    hours:   Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

interface Props {
  dropDate: string
  /** 'full' shows D H M S labels, 'compact' shows D H M only */
  variant?: 'full' | 'compact'
}

export default function CountdownTimer({ dropDate, variant = 'full' }: Props) {
  const [time, setTime] = useState<TimeLeft>(() => calcTimeLeft(dropDate))

  useEffect(() => {
    if (time.expired) return
    const id = setInterval(() => setTime(calcTimeLeft(dropDate)), 1000)
    return () => clearInterval(id)
  }, [dropDate, time.expired])

  if (time.expired) return null

  if (variant === 'compact') {
    return (
      <span className="font-mono text-xs text-copper tracking-wide">
        {time.days > 0 ? `${time.days}d ` : ''}{pad(time.hours)}h {pad(time.minutes)}m
      </span>
    )
  }

  return (
    <div className="flex items-center gap-2 mt-3">
      {[
        { value: time.days,    label: 'D' },
        { value: time.hours,   label: 'H' },
        { value: time.minutes, label: 'M' },
        { value: time.seconds, label: 'S' },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <span className="font-mono text-sm font-medium text-archive bg-midnight border border-storm rounded-sm px-2 py-1 min-w-[2.2rem] text-center tabular-nums">
            {pad(value)}
          </span>
          <span className="font-mono text-[9px] text-silver tracking-widest mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  )
}
