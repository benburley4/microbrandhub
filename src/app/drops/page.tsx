'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { drops, type DropStatus } from '@/data/drops'

const statusConfig: Record<DropStatus, { label: string; classes: string }> = {
  live:      { label: 'Live Now',  classes: 'bg-green-900/40 text-green-300 border-green-800/50' },
  upcoming:  { label: 'Upcoming', classes: 'bg-amber-900/40 text-amber-300 border-amber-800/50' },
  sold_out:  { label: 'Sold Out', classes: 'bg-stone-800 text-stone-500 border-stone-700' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

const allBrands = [...new Set(drops.map(d => d.brand))].sort()

function DropCard({ drop }: { drop: (typeof drops)[0] }) {
  const cfg = statusConfig[drop.status]
  return (
    <div className="card overflow-hidden flex flex-col">
      <div className="h-44 bg-stone-800 overflow-hidden">
        <img
          src={drop.imageUrl}
          alt={drop.title}
          className={`w-full h-full object-cover ${drop.status === 'sold_out' ? 'opacity-40 grayscale' : 'opacity-90'}`}
        />
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <Link href={`/brands/${drop.brandSlug}`} className="text-xs text-brand-400 hover:text-brand-300 transition-colors font-medium">
            {drop.brand}
          </Link>
          <span className={`tag border text-xs font-medium ${cfg.classes}`}>
            {cfg.label}
          </span>
        </div>
        <h2 className="font-semibold text-white leading-snug mb-2">{drop.title}</h2>
        <p className="text-sm text-stone-400 leading-relaxed line-clamp-3 mb-4 flex-1">
          {drop.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-white font-bold">{formatPrice(drop.price, drop.currency)}</div>
            <div className="text-xs text-stone-500 mt-0.5">{formatDate(drop.dropDate)}</div>
          </div>
          {drop.status !== 'sold_out' && (
            <a
              href={drop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2"
            >
              View Drop
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DropsPage() {
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<DropStatus | ''>('')

  const filtered = useMemo(() => {
    return drops.filter(d => {
      if (selectedBrand && d.brand !== selectedBrand) return false
      if (selectedStatus && d.status !== selectedStatus) return false
      return true
    })
  }, [selectedBrand, selectedStatus])

  const hasFilters = selectedBrand !== '' || selectedStatus !== ''

  // Sort: live first, then upcoming by date, then sold out by date desc
  const sorted = [...filtered].sort((a, b) => {
    const order: Record<DropStatus, number> = { live: 0, upcoming: 1, sold_out: 2 }
    if (order[a.status] !== order[b.status]) return order[a.status] - order[b.status]
    return new Date(b.dropDate).getTime() - new Date(a.dropDate).getTime()
  })

  const liveDrops     = sorted.filter(d => d.status === 'live')
  const upcomingDrops = sorted.filter(d => d.status === 'upcoming')
  const soldOutDrops  = sorted.filter(d => d.status === 'sold_out')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Limited Drops</h1>
        <p className="text-stone-400">New releases, limited editions, and special runs from the microbrand world.</p>
      </div>

      {/* Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select
          value={selectedBrand}
          onChange={e => setSelectedBrand(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Brands</option>
          {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value as DropStatus | '')}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Statuses</option>
          <option value="live">Live Now</option>
          <option value="upcoming">Upcoming</option>
          <option value="sold_out">Sold Out</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSelectedBrand(''); setSelectedStatus('') }}
            className="text-sm text-stone-400 hover:text-white transition-colors ml-auto"
          >
            Clear filters ×
          </button>
        )}

        <p className="text-sm text-stone-500 ml-auto">
          {filtered.length} drop{filtered.length !== 1 ? 's' : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No drops match your filters.</p>
          <button
            onClick={() => { setSelectedBrand(''); setSelectedStatus('') }}
            className="mt-4 text-brand-400 hover:text-brand-300 text-sm transition-colors"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <>
          {/* Live now */}
          {liveDrops.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg font-semibold text-green-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block" />
                Live Now
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveDrops.map(d => <DropCard key={d.id} drop={d} />)}
              </div>
            </section>
          )}

          {/* Upcoming */}
          {upcomingDrops.length > 0 && (
            <section className="mb-12">
              <h2 className="text-lg font-semibold text-amber-300 uppercase tracking-wider mb-4">Upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingDrops.map(d => <DropCard key={d.id} drop={d} />)}
              </div>
            </section>
          )}

          {/* Sold out */}
          {soldOutDrops.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-stone-500 uppercase tracking-wider mb-4">Sold Out</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {soldOutDrops.map(d => <DropCard key={d.id} drop={d} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
