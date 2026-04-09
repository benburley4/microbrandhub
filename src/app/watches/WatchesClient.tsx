'use client'

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { WatchModel } from '@/data/watches'

interface Props {
  watches: WatchModel[]
  brandNames: string[]
  dialColors: string[]
  movements: string[]
}

const AVAILABILITY_LABELS: Record<string, string> = {
  available:    'Available',
  sold_out:     'Sold Out',
  pre_order:    'Pre-Order',
  coming_soon:  'Coming Soon',
}

const AVAILABILITY_STYLES: Record<string, string> = {
  available:   'bg-lume/10 text-lume border-lume/30',
  sold_out:    'bg-storm text-silver border-storm',
  pre_order:   'bg-copper/10 text-copper border-copper/30',
  coming_soon: 'bg-gilt/10 text-gilt border-gilt/30',
}

const PRICE_RANGES = [
  { label: 'Under $300',    min: 0,    max: 300 },
  { label: '$300–$600',     min: 300,  max: 600 },
  { label: '$600–$1,000',   min: 600,  max: 1000 },
  { label: '$1,000–$2,000', min: 1000, max: 2000 },
  { label: '$2,000+',       min: 2000, max: Infinity },
]

const DIAMETER_RANGES = [
  { label: 'Under 36mm', min: 0,  max: 36 },
  { label: '36–39mm',    min: 36, max: 40 },
  { label: '40–42mm',    min: 40, max: 43 },
  { label: '43mm+',      min: 43, max: Infinity },
]

export default function WatchesClient({ watches, brandNames, dialColors }: Props) {
  const searchParams = useSearchParams()
  const [search,        setSearch]        = useState('')
  const [brand,         setBrand]         = useState(() => searchParams.get('brand') ?? '')

  // Sync brand filter from URL param on mount
  useEffect(() => {
    const b = searchParams.get('brand')
    if (b) setBrand(b)
  }, [searchParams])
  const [availability,  setAvailability]  = useState('')
  const [priceRange,    setPriceRange]    = useState('')
  const [diameterRange, setDiameterRange] = useState('')
  const [dialColor,     setDialColor]     = useState('')
  const [sort,          setSort]          = useState('brand')

  const filtered = useMemo(() => {
    let list = [...watches]

    if (search) {
      const q = search.toLowerCase()
      list = list.filter(w =>
        w.name.toLowerCase().includes(q) ||
        w.brandName.toLowerCase().includes(q) ||
        (w.movement || '').toLowerCase().includes(q)
      )
    }
    if (brand)        list = list.filter(w => w.brandName === brand)
    if (availability) list = list.filter(w => w.availability === availability)
    if (dialColor)    list = list.filter(w => w.dialColor?.toLowerCase() === dialColor.toLowerCase())

    if (priceRange) {
      const r = PRICE_RANGES.find(p => p.label === priceRange)
      if (r) list = list.filter(w => w.priceUSD != null && w.priceUSD >= r.min && w.priceUSD < r.max)
    }
    if (diameterRange) {
      const r = DIAMETER_RANGES.find(d => d.label === diameterRange)
      if (r) list = list.filter(w => w.caseDiameterMm != null && w.caseDiameterMm >= r.min && w.caseDiameterMm < r.max)
    }

    list.sort((a, b) => {
      if (sort === 'brand')       return a.brandName.localeCompare(b.brandName) || a.name.localeCompare(b.name)
      if (sort === 'price-asc')   return (a.priceUSD ?? 99999) - (b.priceUSD ?? 99999)
      if (sort === 'price-desc')  return (b.priceUSD ?? 0) - (a.priceUSD ?? 0)
      if (sort === 'name')        return a.name.localeCompare(b.name)
      return 0
    })

    return list
  }, [watches, search, brand, availability, priceRange, diameterRange, dialColor, sort])

  const activeFilters = [brand, availability, priceRange, diameterRange, dialColor].filter(Boolean).length

  function clearAll() {
    setSearch(''); setBrand(''); setAvailability(''); setPriceRange('')
    setDiameterRange(''); setDialColor('')
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="sticky top-16 z-40 bg-midnight/95 backdrop-blur border-b border-storm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-2 items-center">
            {/* Search */}
            <input
              type="text"
              placeholder="Search models..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors w-48"
            />

            {/* Brand */}
            <select value={brand} onChange={e => setBrand(e.target.value)}
              className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive focus:outline-none focus:border-lume transition-colors">
              <option value="">All Brands</option>
              {brandNames.map(b => <option key={b} value={b}>{b}</option>)}
            </select>

            {/* Availability */}
            <select value={availability} onChange={e => setAvailability(e.target.value)}
              className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive focus:outline-none focus:border-lume transition-colors">
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="sold_out">Sold Out</option>
              <option value="pre_order">Pre-Order</option>
            </select>

            {/* Price */}
            <select value={priceRange} onChange={e => setPriceRange(e.target.value)}
              className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive focus:outline-none focus:border-lume transition-colors">
              <option value="">All Prices</option>
              {PRICE_RANGES.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
            </select>

            {/* Diameter */}
            <select value={diameterRange} onChange={e => setDiameterRange(e.target.value)}
              className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive focus:outline-none focus:border-lume transition-colors">
              <option value="">All Sizes</option>
              {DIAMETER_RANGES.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
            </select>

            {/* Dial colour */}
            {dialColors.length > 0 && (
              <select value={dialColor} onChange={e => setDialColor(e.target.value)}
                className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive focus:outline-none focus:border-lume transition-colors">
                <option value="">All Colours</option>
                {dialColors.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            {/* Sort */}
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-slate border border-storm rounded-sm px-3 py-2 text-sm text-archive focus:outline-none focus:border-lume transition-colors ml-auto">
              <option value="brand">Sort: Brand A–Z</option>
              <option value="name">Sort: Name A–Z</option>
              <option value="price-asc">Sort: Price ↑</option>
              <option value="price-desc">Sort: Price ↓</option>
            </select>

            {activeFilters > 0 && (
              <button onClick={clearAll}
                className="text-xs font-semibold text-silver hover:text-lume transition-colors tracking-widest uppercase">
                Clear ({activeFilters})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <p className="font-mono text-xs text-silver tracking-widest">
          {filtered.length.toLocaleString()} MODELS
          {activeFilters > 0 && <span className="text-copper"> · FILTERED</span>}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-silver font-mono text-sm tracking-widest">NO MODELS MATCH YOUR FILTERS</p>
            <button onClick={clearAll} className="btn-secondary mt-6 text-sm">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filtered.map(watch => (
              <Link
                key={watch.id}
                href={`/brands/${watch.brandSlug}`}
                className="card group flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[3/4] bg-storm overflow-hidden flex-shrink-0">
                  {watch.imageUrl ? (
                    <img
                      src={watch.imageUrl}
                      alt={watch.name}
                      loading="lazy"
                      className={`w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-90 ${
                        watch.availability === 'sold_out' ? 'opacity-40 grayscale' : 'opacity-80'
                      }`}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-storm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <circle cx="12" cy="12" r="9" strokeWidth={1.5}/>
                        <path strokeLinecap="round" d="M12 7v5l3 2" strokeWidth={1.5}/>
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 flex flex-col gap-1 flex-1">
                  <p className="font-mono text-[10px] text-copper tracking-widest uppercase truncate">
                    {watch.brandName}
                  </p>
                  <p className="text-xs font-semibold text-archive leading-tight line-clamp-2 group-hover:text-lume transition-colors">
                    {watch.name}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-1 gap-1 flex-wrap">
                    {watch.priceDisplay && (
                      <span className="font-mono text-[10px] text-silver">{watch.priceDisplay}</span>
                    )}
                    <span className={`tag border text-[9px] px-1.5 py-0.5 ${AVAILABILITY_STYLES[watch.availability] ?? ''}`}>
                      {AVAILABILITY_LABELS[watch.availability] ?? watch.availability}
                    </span>
                  </div>
                  {watch.caseDiameterMm && (
                    <p className="font-mono text-[10px] text-storm">{watch.caseDiameterMm}mm</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
