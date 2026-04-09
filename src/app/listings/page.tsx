'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { listings, listingBrands, listingConditions, listingLocations } from '@/data/listings'
import Link from 'next/link'
import { Suspense } from 'react'
import AffiliateBadge from '@/components/AffiliateBadge'

const conditionColor: Record<string, string> = {
  New:         'text-lume bg-lume/10 border border-lume/30',
  'Like New':  'text-archive bg-storm border border-storm',
  Good:        'text-copper bg-copper/10 border border-copper/30',
  Fair:        'text-silver bg-midnight border border-storm',
}

const platformColor: Record<string, string> = {
  Carousell: 'text-lume',
  eBay:      'text-gilt',
  Reddit:    'text-copper',
  Chrono24:  'text-archive',
  Other:     'text-silver',
}

const selectClass = 'bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-silver focus:outline-none focus:border-lume transition-colors'

function readParams(p: URLSearchParams) {
  return {
    search:    p.get('q') ?? '',
    brand:     p.get('brand') ?? '',
    condition: p.get('condition') ?? '',
    location:  p.get('location') ?? '',
    maxPrice:  p.get('maxPrice') ?? '',
    sort:      (p.get('sort') ?? 'date') as 'date' | 'price-asc' | 'price-desc',
  }
}

function ListingsContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const pathname     = usePathname()

  const { search, brand: selectedBrand, condition: selectedCondition, location: selectedLocation, maxPrice, sort: sortBy } =
    useMemo(() => readParams(searchParams), [searchParams])

  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v) next.set(k, v); else next.delete(k)
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  const clearFilters = () => router.replace(pathname, { scroll: false })

  const [searchInput, setSearchInput] = useState(search)
  useEffect(() => { setSearchInput(search) }, [search])
  useEffect(() => {
    const id = setTimeout(() => setParam({ q: searchInput }), 300)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return listings
      .filter(l => {
        if (q && !l.title.toLowerCase().includes(q) && !l.brand.toLowerCase().includes(q)) return false
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

  // GA4 outbound click tracking
  function trackClick(listing: (typeof listings)[0]) {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'listing_click', {
        brand:    listing.brand,
        platform: listing.platform,
        price:    listing.price,
        currency: listing.currency,
      })
    }
  }

  const hasFilters = search || selectedBrand || selectedCondition || selectedLocation || maxPrice

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
      <div className="bg-slate border border-storm rounded p-4 mb-4 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search listings…"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-full bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
          />
        </div>
        <select value={selectedBrand} onChange={e => setParam({ brand: e.target.value })} className={selectClass}>
          <option value="">All Brands</option>
          {listingBrands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={selectedCondition} onChange={e => setParam({ condition: e.target.value })} className={selectClass}>
          <option value="">Any Condition</option>
          {listingConditions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedLocation} onChange={e => setParam({ location: e.target.value })} className={selectClass}>
          <option value="">Any Location</option>
          {listingLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <input
          type="number"
          placeholder="Max price ($)"
          value={maxPrice}
          onChange={e => setParam({ maxPrice: e.target.value })}
          className="w-36 bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
        />
        <select value={sortBy} onChange={e => setParam({ sort: e.target.value })} className={selectClass}>
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

      {/* Active filter chips */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {selectedBrand && (
            <button onClick={() => setParam({ brand: '' })} className="tag bg-lume/10 text-lume border border-lume/30 text-xs hover:bg-lume/20 transition-colors">
              {selectedBrand} ×
            </button>
          )}
          {selectedCondition && (
            <button onClick={() => setParam({ condition: '' })} className="tag bg-copper/10 text-copper border border-copper/30 text-xs hover:bg-copper/20 transition-colors">
              {selectedCondition} ×
            </button>
          )}
          {selectedLocation && (
            <button onClick={() => setParam({ location: '' })} className="tag bg-storm text-silver border border-storm text-xs hover:text-archive transition-colors">
              {selectedLocation} ×
            </button>
          )}
          {maxPrice && (
            <button onClick={() => setParam({ maxPrice: '' })} className="tag bg-gilt/10 text-gilt border border-gilt/30 text-xs hover:bg-gilt/20 transition-colors">
              Max ${maxPrice} ×
            </button>
          )}
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="ml-auto font-mono text-xs text-silver/50 hover:text-silver transition-colors"
          >
            Copy link ↗
          </button>
        </div>
      )}

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
              onClick={() => trackClick(listing)}
              className="card group flex flex-col overflow-hidden"
            >
              {/* Image or placeholder */}
              <div className="relative aspect-[4/3] bg-slate overflow-hidden">
                {listing.imageUrl ? (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center group-hover:bg-storm transition-colors">
                    <svg className="w-12 h-12 text-storm group-hover:text-silver transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
                {/* Platform badge */}
                <span className={`absolute top-3 left-3 font-mono text-[9px] tracking-widest uppercase bg-midnight/80 backdrop-blur-sm border border-storm/60 rounded-sm px-1.5 py-0.5 ${platformColor[listing.platform] ?? 'text-silver'}`}>
                  {listing.platform}
                </span>
                <span className="absolute top-3 right-3 font-mono text-xs text-silver/60 group-hover:text-silver transition-colors">↗</span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2 className="text-sm font-medium text-archive group-hover:text-lume transition-colors leading-snug line-clamp-2 mb-3">
                  {listing.title}
                </h2>

                <div className="flex items-center gap-2 flex-wrap mt-auto">
                  <span className="text-lg font-bold font-display text-archive">
                    {listing.currency === 'USD' ? '$' : listing.currency === 'GBP' ? '£' : listing.currency === 'EUR' ? '€' : listing.currency}{listing.price.toLocaleString()}
                  </span>
                  <span className={`tag text-xs ${conditionColor[listing.condition] ?? 'bg-midnight text-silver border border-storm'}`}>
                    {listing.condition}
                  </span>
                  <AffiliateBadge />
                </div>

                <div className="flex items-center justify-between mt-3 font-mono text-xs text-silver">
                  <span>{listing.location}</span>
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
          Listings are automatically sourced from Carousell and other platforms. Prices are in the seller&apos;s listed
          currency. Always verify condition and price directly with the seller.{' '}
          <strong className="text-archive">MicrobrandHub is not a marketplace and does not facilitate transactions.</strong>
          {' '}Links may earn a small affiliate commission.
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
