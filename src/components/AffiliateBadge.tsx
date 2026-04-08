'use client'

import { useState } from 'react'

/**
 * Small "Affiliate" label with a hover tooltip.
 * Place near any link that earns a commission.
 */
export default function AffiliateBadge() {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="font-mono text-[9px] tracking-widest uppercase text-silver/50 border border-silver/20 rounded-sm px-1.5 py-0.5 hover:text-silver hover:border-silver/40 transition-colors cursor-help"
        aria-label="Affiliate link disclosure"
      >
        Affiliate
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate border border-storm rounded-sm p-2 text-xs text-silver leading-relaxed z-50 pointer-events-none shadow-elevated"
        >
          Clicking this link may earn MicrobrandHub a small commission at no extra cost to you.
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-storm" />
        </span>
      )}
    </span>
  )
}
