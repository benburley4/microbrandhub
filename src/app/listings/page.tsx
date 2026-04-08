'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { listings, listingBrands, listingConditions, listingLocations } from '@/data/listings'
import Link from 'next/link'
import { Suspense } from 'react'

const conditionColor: Record<string, string> = {
  New:        'text-lume bg-lume/10 border border-lume/30',
  'Like New':  'text-archive bg-storm border border-storm',
  Good:        'text-copper bg-copper/10 border border-copper/30',
  Fair:        'text-silver bg-midnight border border-storm',
}

const selectClass = 'bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-silver focus:outline-none focus:border-lume transition-colors'

function ListingsContent() {
  const searchParams = useSearchParams()
  const initialBrand = searchParams.get('brand') || ''

  const [search, setSearch] = useState(initialBrand)
  const [selectedBrand, setSelectedBrand] = useState(initialBrand)
  const [selectedCondition, setSelectedCondition] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'price-asc' | 'price-desc'>('date')

  const filtered = useMemo(() => {
    return listings
      .filter(l => {
        if (search && !l.title.toLowerCase().includes(search.toLowerCase()) &&
            !l.brand.toLowerCase().includes(search.toLowerCase())) return false
        if (selectedBrand && l.brand !== selectedBrand) return false
        if (selectedCondition && l.condition !== selectedCondition) return false
        if (selectedLocation && l.location !== selectedLocation) return false
        if (maxPrice && l.price > Number(maxPrice)) return false
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'date') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime()
        if (sortBy === 'price-asc') return a.price - b.price
        return b.price - a.price
      })
  }, [search, selectedBrand, selectedCondition, selectedLocation, maxPrice, sortBy])

  function daysAgo(dateStr: string) {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return '1 day ago'
    return `${diff} days ago`
  }

  const hasFilters = search || selectedBrand || selectedCondition || selectedLocation || maxPrice
  const clearFilters = () => { setSearch(''); setSelectedBrand(''); setSelectedCondition(''); setSelectedLocation(''); setMaxPrice('') }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs text-lume tracking-widest uppercase mb-2">Pre-owned Market</p>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-archive mb-2 uppercase leading-tight">
          Listings
        </h1>
        <p className="text-silver">
          Pre-owned microbrand watches sourced from Carousell and other platforms.
          <span className="ml-2 font-mono text-xs text-storm">Updated automatically via microsearch.</span>
        </p>
      </div>

      {/* Filters */}
      <div className="bg-slate border border-storm rounded p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
          />
        </div>
        <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className={selectClass}>
          <option value="">All Brands</option>
          {listingBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={selectedCondition} onChange={e => setSelectedCondition(e.target.value)} className={selectClass}>
          <option value="">Any Condition</option>
          {listingConditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} className={selectClass}>
          <option value="">Any Location</option>
          {listingLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <input
          type="number"
          placeholder="Max price ($)"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-36 bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
        />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as typeof sortBy)} className={selectClass}>
          <option value="date">Sort: Newest</option>
          <option value="price-asc">Sort: Price ↑</option>
          <option value="price-desc">Sort: Price ↓</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-silver hover:text-archive transition-colors whitespace-nowrap">
            Clear ×
          </button>
        )}
      </div>

      <p className="font-mono text-xs text-silver mb-6 tracking-wide">
        {filtered.length} LISTING{filtered.length !== 1 ? 'S' : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-silver">
          <p className="text-4xl mb-3 opacity-30">◎</p>
          <p>No listings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(listing => (
            <a
              key={listing.id}
              href={listing.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card group flex flex-col overflow-hidden"
            >
              {/* Image placeholder — watch icon */}
              <div className="relative aspect-[4/3] bg-slate flex items-center justify-center overflow-hidden group-hover:bg-storm transition-colors">
                <svg className="w-12 h-12 text-storm group-hover:text-silver transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {/* External link hint */}
                <span className="absolute top-3 right-3 font-mono text-xs text-silver/50 group-hover:text-silver transition-colors">↗</span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-sm font-medium text-archive group-hover:text-lume transition-colors leading-snug line-clamp-2 mb-3">
                  {listing.title}
                </h2>

                <div className="flex items-center gap-2 flex-wrap mt-auto">
                  <span className="text-lg font-bold font-display text-archive">
                    {listing.currency === 'USD' ? '$' : listing.currency}{listing.price.toLocaleString()}
                  </span>
                  <span className={`tag text-xs ${conditionColor[listing.condition] ?? 'bg-midnight text-silver border border-storm'}`}>
                    {listing.condition}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 font-mono text-xs text-silver">
                  <span>{listing.platform} · {listing.location}</span>
                  <span>{daysAgo(listing.postedAt)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-12 card p-6 border-l-4 border-l-copper">
        <h3 className="font-semibold text-archive mb-2">How listings work</h3>
        <p className="text-sm text-silver leading-relaxed">
          Listings are automatically sourced from Carousell using a custom scraper. Prices shown are in the seller&apos;s
          listed currency. Always verify condition and price directly with the seller.{' '}
          <strong className="text-archive">MicrobrandHub is not a marketplace and does not facilitate transactions.</strong>
        </p>
        <Link href="/brands" className="inline-block mt-3 text-lume hover:text-archive text-sm transition-colors">
          Browse the brand directory →
        </Link>
      </div>
    </div>
  )
}

export default function ListingsPage() {
  return (
    <Suspense>
      <ListingsContent />
    </Suspense>
  )
}
