'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { drops, type DropStatus } from '@/data/drops'
import CountdownTimer from '@/components/CountdownTimer'
import NotifyMeButton from '@/components/NotifyMeButton'
import DropsCalendar from '@/components/DropsCalendar'
import AffiliateBadge from '@/components/AffiliateBadge'
import SponsoredBadge from '@/components/SponsoredBadge'

const statusConfig: Record<DropStatus, { label: string; classes: string }> = {
  live:     { label: 'Live Now',  classes: 'bg-lume/10 text-lume border-lume/30' },
  upcoming: { label: 'Upcoming', classes: 'bg-copper/10 text-copper border-copper/30' },
  sold_out: { label: 'Sold Out', classes: 'bg-storm text-silver border-storm' },
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function formatPrice(price: number, currency: string) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(price)
}

const allBrands = [...new Set(drops.map(d => d.brand))].sort()

const selectClass = 'bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-silver focus:outline-none focus:border-lume transition-colors'

function DropCard({ drop }: { drop: (typeof drops)[0] }) {
  const cfg = statusConfig[drop.status]
  return (
    <div className="card overflow-hidden flex flex-col group">
      {/* Image — 4:3 ratio */}
      <div className="relative aspect-[4/3] bg-storm overflow-hidden">
        <img
          src={drop.imageUrl}
          alt={drop.title}
          loading="lazy"
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${
            drop.status === 'sold_out' ? 'opacity-30 grayscale' : 'opacity-80 group-hover:opacity-95'
          }`}
        />
        {/* Status badge */}
        <span className={`absolute top-3 left-3 tag border text-xs font-medium backdrop-blur-sm ${cfg.classes}`}>
          {cfg.label}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
          <Link
            href={`/brands/${drop.brandSlug}`}
            className="font-mono text-xs text-copper hover:text-archive transition-colors font-medium tracking-wide"
          >
            {drop.brand}
          </Link>
          <span className="font-mono text-xs text-silver">{formatDate(drop.dropDate)}</span>
        </div>
        <h2 className="font-semibold text-archive leading-snug mb-2 group-hover:text-lume transition-colors">
          {drop.title}
        </h2>
        <p className="text-sm text-silver leading-relaxed line-clamp-3 mb-4 flex-1">
          {drop.description}
        </p>
        {/* Countdown + notify for upcoming/live drops */}
        {drop.status === 'upcoming' && (
          <CountdownTimer dropDate={drop.dropDate} />
        )}
        {(drop.status === 'upcoming' || drop.status === 'live') && (
          <NotifyMeButton dropId={drop.id} dropTitle={drop.title} brandName={drop.brand} />
        )}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-archive font-bold font-display">{formatPrice(drop.price, drop.currency)}</span>
            {drop.status !== 'sold_out' && <AffiliateBadge />}
            {drop.sponsored && <SponsoredBadge />}
          </div>
          {drop.status !== 'sold_out' && (
            <a
              href={drop.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-2"
            >
              View Drop →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DropsPage() {
  const [view, setView] = useState<'list' | 'calendar'>('list')
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end gap-4">
        <div className="flex-1">
          <p className="font-mono text-xs text-lume tracking-widest uppercase mb-2">Limited Editions</p>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-archive mb-2 uppercase leading-tight">
            Drops
          </h1>
          <p className="text-silver">New releases, limited editions, and special runs from the microbrand world.</p>
        </div>
        {/* View toggle */}
        <div className="flex gap-1 bg-slate border border-storm rounded-sm p-1 self-start sm:self-end">
          <button
            onClick={() => setView('list')}
            className={`px-4 py-1.5 font-mono text-xs tracking-widest uppercase rounded-sm transition-colors ${view === 'list' ? 'bg-midnight text-archive' : 'text-silver hover:text-archive'}`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-4 py-1.5 font-mono text-xs tracking-widest uppercase rounded-sm transition-colors ${view === 'calendar' ? 'bg-midnight text-archive' : 'text-silver hover:text-archive'}`}
          >
            Calendar
          </button>
        </div>
      </div>

      {/* Calendar view */}
      {view === 'calendar' && (
        <div className="bg-slate border border-storm rounded p-6 mb-8">
          <DropsCalendar drops={drops} />
        </div>
      )}

      {view === 'list' && (
      <>
      {/* Filters */}
      <div className="bg-slate border border-storm rounded p-4 mb-6 flex flex-wrap gap-3 items-center">
        <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className={selectClass}>
          <option value="">All Brands</option>
          {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value as DropStatus | '')} className={selectClass}>
          <option value="">All Statuses</option>
          <option value="live">Live Now</option>
          <option value="upcoming">Upcoming</option>
          <option value="sold_out">Sold Out</option>
        </select>
        {hasFilters && (
          <button
            onClick={() => { setSelectedBrand(''); setSelectedStatus('') }}
            className="text-sm text-silver hover:text-archive transition-colors"
          >
            Clear ×
          </button>
        )}
        <p className="font-mono text-xs text-silver ml-auto tracking-wide">
          {filtered.length} DROP{filtered.length !== 1 ? 'S' : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-silver">
          <p className="text-4xl mb-3 opacity-30">◎</p>
          <p className="mb-3">No drops match your filters.</p>
          <button
            onClick={() => { setSelectedBrand(''); setSelectedStatus('') }}
            className="text-lume hover:text-archive text-sm transition-colors"
          >
            Clear filters →
          </button>
        </div>
      ) : (
        <>
          {liveDrops.length > 0 && (
            <section className="mb-12">
              <h2 className="font-mono text-sm text-lume uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lume animate-pulse inline-block" />
                Live Now
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveDrops.map(d => <DropCard key={d.id} drop={d} />)}
              </div>
            </section>
          )}

          {upcomingDrops.length > 0 && (
            <section className="mb-12">
              <h2 className="font-mono text-sm text-copper uppercase tracking-widest mb-4">Upcoming</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingDrops.map(d => <DropCard key={d.id} drop={d} />)}
              </div>
            </section>
          )}

          {soldOutDrops.length > 0 && (
            <section>
              <h2 className="font-mono text-sm text-storm uppercase tracking-widest mb-4">Sold Out</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {soldOutDrops.map(d => <DropCard key={d.id} drop={d} />)}
              </div>
            </section>
          )}
        </>
      )}
      </> /* end list view */
      )}
    </div>
  )
}
