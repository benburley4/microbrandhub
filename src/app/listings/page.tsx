'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { listings, listingBrands, listingConditions, listingLocations } from '@/data/listings'
import Link from 'next/link'
import { Suspense } from 'react'

const conditionColor: Record<string, string> = {
  New: 'text-green-400 bg-green-900/30',
  'Like New': 'text-sky-400 bg-sky-900/30',
  Good: 'text-brand-400 bg-brand-900/30',
  Fair: 'text-stone-400 bg-stone-800',
}

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Pre-owned Listings</h1>
        <p className="text-stone-400">
          Pre-owned microbrand watches sourced from Carousell and other platforms.
          <span className="ml-2 text-stone-500 text-sm">Data updated automatically via microsearch.</span>
        </p>
      </div>

      {/* Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search listings..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <select
          value={selectedBrand}
          onChange={e => setSelectedBrand(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Brands</option>
          {listingBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select
          value={selectedCondition}
          onChange={e => setSelectedCondition(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">Any Condition</option>
          {listingConditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={selectedLocation}
          onChange={e => setSelectedLocation(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">Any Location</option>
          {listingLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        <input
          type="number"
          placeholder="Max price ($)"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-36 bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-500"
        />

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="date">Sort: Newest</option>
          <option value="price-asc">Sort: Price ↑</option>
          <option value="price-desc">Sort: Price ↓</option>
        </select>

        {(search || selectedBrand || selectedCondition || selectedLocation || maxPrice) && (
          <button
            onClick={() => { setSearch(''); setSelectedBrand(''); setSelectedCondition(''); setSelectedLocation(''); setMaxPrice('') }}
            className="text-sm text-stone-400 hover:text-white transition-colors whitespace-nowrap"
          >
            Clear filters ×
          </button>
        )}
      </div>

      <p className="text-sm text-stone-500 mb-4">Showing {filtered.length} listing{filtered.length !== 1 ? 's' : ''}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <div className="text-4xl mb-3">🔍</div>
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
              className="card p-5 group flex flex-col"
            >
              {/* Image placeholder */}
              <div className="w-full h-40 bg-stone-800 rounded-lg mb-4 flex items-center justify-center text-stone-600 group-hover:bg-stone-700/50 transition-colors">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <h2 className="text-sm font-medium text-white group-hover:text-brand-300 transition-colors leading-snug line-clamp-2">
                  {listing.title}
                </h2>
              </div>

              <div className="flex items-center gap-2 flex-wrap mt-auto pt-3">
                <span className="text-lg font-bold text-white">
                  {listing.currency === 'USD' ? '$' : listing.currency}{listing.price.toLocaleString()}
                </span>
                <span className={`tag text-xs ${conditionColor[listing.condition] || 'bg-stone-800 text-stone-400'}`}>
                  {listing.condition}
                </span>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-stone-500">
                <span>{listing.platform} · {listing.location}</span>
                <span>{daysAgo(listing.postedAt)}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* How listings work */}
      <div className="mt-12 bg-stone-900 border border-stone-800 rounded-xl p-6">
        <h3 className="font-semibold text-white mb-2">How listings work</h3>
        <p className="text-sm text-stone-400 leading-relaxed">
          Listings are automatically sourced from Carousell using a custom scraper. Prices shown are in the seller&apos;s listed currency.
          Always verify condition and price directly with the seller. MicrobrandHub is not a marketplace and does not facilitate transactions.
        </p>
        <div className="mt-3">
          <Link href="/brands" className="text-brand-400 hover:text-brand-300 text-sm transition-colors">
            Browse the brand directory →
          </Link>
        </div>
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
