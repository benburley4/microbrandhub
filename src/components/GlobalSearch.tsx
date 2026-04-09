'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Fuse from 'fuse.js'
import { brands } from '@/data/brands'
import { drops } from '@/data/drops'
import { reviews } from '@/data/reviews'

// ── Search corpus ──────────────────────────────────────────────────────────

type ResultKind = 'brand' | 'drop' | 'review'

interface SearchItem {
  kind: ResultKind
  title: string
  subtitle: string
  href: string
}

const corpus: SearchItem[] = [
  ...brands.map(b => ({
    kind: 'brand' as const,
    title: b.name,
    subtitle: `${b.country} · ${b.priceRange}`,
    href: `/brands/${b.slug}`,
  })),
  ...drops.map(d => ({
    kind: 'drop' as const,
    title: d.title,
    subtitle: `${d.brand} · ${d.status === 'live' ? 'Live Now' : d.status === 'upcoming' ? 'Upcoming' : 'Sold Out'}`,
    href: `/drops`,
  })),
  ...reviews.map(r => ({
    kind: 'review' as const,
    title: r.title,
    subtitle: `${r.brand} · ${r.readingTime} min read`,
    href: `/reviews/${r.slug}`,
  })),
]

const KIND_LABEL: Record<ResultKind, string> = {
  brand:  'Brand',
  drop:   'Drop',
  review: 'Review',
}

const KIND_COLOR: Record<ResultKind, string> = {
  brand:  'text-lume',
  drop:   'text-copper',
  review: 'text-gilt',
}

// ── Component ──────────────────────────────────────────────────────────────

export default function GlobalSearch() {
  const [open, setOpen]       = useState(false)
  const [query, setQuery]     = useState('')
  const [cursor, setCursor]   = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()

  const fuse = useMemo(
    () => new Fuse(corpus, { keys: ['title', 'subtitle'], threshold: 0.35, minMatchCharLength: 2 }),
    [],
  )

  const results = useMemo(
    () => (query.length >= 2 ? fuse.search(query).slice(0, 8).map(r => r.item) : []),
    [query, fuse],
  )

  // Open with ⌘K / Ctrl+K
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) { setQuery(''); setCursor(0); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  function navigate(href: string) {
    setOpen(false)
    router.push(href)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, results.length - 1)) }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)) }
    if (e.key === 'Enter' && results[cursor]) navigate(results[cursor].href)
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 bg-midnight border border-storm rounded-sm text-silver hover:border-lume hover:text-archive transition-colors group"
        aria-label="Open search"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span className="font-mono text-xs hidden sm:inline tracking-wide">Search</span>
        <kbd className="hidden sm:inline font-mono text-[9px] text-silver/50 border border-storm rounded px-1 group-hover:border-silver/30">⌘K</kbd>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4"
          onClick={() => setOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-midnight/80 backdrop-blur-sm" />

          {/* Panel */}
          <div
            className="relative w-full max-w-xl bg-slate border border-storm rounded shadow-elevated overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-storm">
              <svg className="w-4 h-4 text-silver shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setCursor(0) }}
                onKeyDown={onKeyDown}
                placeholder="Search brands, drops, reviews…"
                className="flex-1 bg-transparent text-archive placeholder-silver text-sm focus:outline-none"
              />
              <kbd
                onClick={() => setOpen(false)}
                className="font-mono text-[9px] text-silver/50 border border-storm rounded px-1.5 py-0.5 cursor-pointer hover:text-silver transition-colors"
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            {results.length > 0 ? (
              <ul className="max-h-80 overflow-y-auto py-2">
                {results.map((item, i) => (
                  <li key={`${item.kind}-${item.href}-${i}`}>
                    <button
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => navigate(item.href)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        cursor === i ? 'bg-storm' : 'hover:bg-midnight'
                      }`}
                    >
                      <span className={`font-mono text-[9px] tracking-widest uppercase w-10 shrink-0 ${KIND_COLOR[item.kind]}`}>
                        {KIND_LABEL[item.kind]}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="text-sm text-archive block truncate">{item.title}</span>
                        <span className="font-mono text-xs text-silver block truncate">{item.subtitle}</span>
                      </span>
                      <svg className={`w-3.5 h-3.5 shrink-0 transition-opacity ${cursor === i ? 'text-lume opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.length >= 2 ? (
              <p className="px-4 py-6 font-mono text-xs text-silver text-center">No results for &quot;{query}&quot;</p>
            ) : (
              <p className="px-4 py-6 font-mono text-xs text-silver/50 text-center">Type to search brands, drops, and reviews…</p>
            )}

            {/* Footer */}
            <div className="border-t border-storm px-4 py-2 flex gap-4 font-mono text-[9px] text-silver/40 tracking-widest uppercase">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>esc close</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
