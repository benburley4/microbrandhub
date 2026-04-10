'use client'

import { useState } from 'react'

/**
 * "Sponsored" label with tooltip. Place on drops or listings that are
 * featured placements. Clearly disclosed, never hidden.
 */
export default function SponsoredBadge() {
  const [open, setOpen] = useState(false)

  return (
    <span className="relative inline-flex items-center">
      <button
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="font-mono text-[9px] tracking-widest uppercase text-gilt/70 border border-gilt/30 rounded-sm px-1.5 py-0.5 hover:text-gilt hover:border-gilt/60 transition-colors cursor-help"
        aria-label="Sponsored content disclosure"
      >
        Sponsored
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-slate border border-storm rounded-sm p-2 text-xs text-silver leading-relaxed z-50 pointer-events-none shadow-elevated"
        >
          This is a paid featured placement. MicrobrandHub only accepts sponsorships from brands already in our directory.
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-storm" />
        </span>
      )}
    </span>
  )
}
