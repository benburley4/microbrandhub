'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { brands, allCategories, allCountries, allPriceRanges, type Category, type PriceRange } from '@/data/brands'
import { Suspense } from 'react'

/** Read all filter state from URL params. */
function readParams(params: URLSearchParams) {
  const cats = params.get('category') ?? ''
  return {
    search:     params.get('q') ?? '',
    categories: cats ? (cats.split(',') as Category[]) : [] as Category[],
    country:    params.get('country') ?? '',
    price:      (params.get('price') ?? '') as PriceRange | '',
    sort:       (params.get('sort') ?? 'name') as 'name' | 'country',
  }
}

const selectClass = 'bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-silver focus:outline-none focus:border-lume transition-colors'

function BrandsContent() {
  const searchParams = useSearchParams()
  const router      = useRouter()
  const pathname    = usePathname()

  // Derive all filter state directly from URL — single source of truth
  const { search, categories: selectedCategories, country: selectedCountry, price: selectedPrice, sort: sortBy } =
    useMemo(() => readParams(searchParams), [searchParams])

  function toggleCategory(cat: Category) {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter(c => c !== cat)
      : [...selectedCategories, cat]
    setParam({ category: next.join(',') })
  }

  /** Push a filter change to the URL without full navigation. */
  const setParam = useCallback(
    (updates: Record<string, string>) => {
      const next = new URLSearchParams(searchParams.toString())
      for (const [k, v] of Object.entries(updates)) {
        if (v) next.set(k, v)
        else next.delete(k)
      }
      router.replace(`${pathname}?${next.toString()}`, { scroll: false })
    },
    [searchParams, router, pathname],
  )

  const clearFilters = () => router.replace(pathname, { scroll: false })

  // Local search input value — debounced before writing to URL
  const [searchInput, setSearchInput] = useState(search)
  useEffect(() => { setSearchInput(search) }, [search])
  useEffect(() => {
    const id = setTimeout(() => setParam({ q: searchInput }), 300)
    return () => clearTimeout(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return brands
      .filter(b => {
        if (q && !b.name.toLowerCase().includes(q) &&
            !b.country.toLowerCase().includes(q) &&
            !b.description.toLowerCase().includes(q)) return false
        if (selectedCategories.length > 0 && !selectedCategories.some(c => b.categories.includes(c))) return false
        if (selectedCountry && b.country !== selectedCountry) return false
        if (selectedPrice && b.priceRange !== selectedPrice) return false
        return true
      })
      .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : a.country.localeCompare(b.country))
  }, [search, selectedCategories, selectedCountry, selectedPrice, sortBy])

  const hasFilters = search || selectedCategories.length > 0 || selectedCountry || selectedPrice

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="font-mono text-xs text-lume tracking-widest uppercase mb-2">Curated Directory</p>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-archive mb-2 uppercase leading-tight">
          Brand Directory
        </h1>
        <p className="text-silver">{brands.length} independent watch brands across {allCountries.length} countries</p>
      </div>

      {/* Filters */}
      <div className="bg-slate border border-storm rounded p-4 mb-4 space-y-3">
        {/* Row 1: search + country + price + sort */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search brands…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
            />
          </div>
          <select value={selectedCountry} onChange={e => setParam({ country: e.target.value })} className={selectClass}>
            <option value="">All Countries</option>
            {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={selectedPrice} onChange={e => setParam({ price: e.target.value })} className={selectClass}>
            <option value="">All Prices</option>
            {allPriceRanges.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={sortBy} onChange={e => setParam({ sort: e.target.value })} className={selectClass}>
            <option value="name">Sort: A–Z</option>
            <option value="country">Sort: Country</option>
          </select>
          {hasFilters && (
            <button onClick={clearFilters} className="text-sm text-silver hover:text-archive transition-colors px-3 py-2">
              Clear ×
            </button>
          )}
        </div>

        {/* Row 2: multi-select category chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-silver tracking-widest uppercase shrink-0">Category:</span>
          {allCategories.map(cat => {
            const active = selectedCategories.includes(cat as Category)
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat as Category)}
                className={`tag border text-xs transition-colors ${
                  active
                    ? 'bg-lume text-midnight border-lume'
                    : 'bg-midnight text-silver border-storm hover:border-lume hover:text-lume'
                }`}
              >
                {cat}
                {active && ' ✓'}
              </button>
            )
          })}
        </div>
      </div>

      {/* Active filter chips — visual summary + shareable link hint */}
      {hasFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="font-mono text-xs text-silver tracking-wide">Active:</span>
          {selectedCategories.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className="flex items-center gap-1 tag bg-lume/10 text-lume border border-lume/30 text-xs hover:bg-lume/20 transition-colors"
            >
              {cat} ×
            </button>
          ))}
          {selectedCountry && (
            <button
              onClick={() => setParam({ country: '' })}
              className="flex items-center gap-1 tag bg-copper/10 text-copper border border-copper/30 text-xs hover:bg-copper/20 transition-colors"
            >
              {selectedCountry} ×
            </button>
          )}
          {selectedPrice && (
            <button
              onClick={() => setParam({ price: '' })}
              className="flex items-center gap-1 tag bg-gilt/10 text-gilt border border-gilt/30 text-xs hover:bg-gilt/20 transition-colors"
            >
              {selectedPrice} ×
            </button>
          )}
          {search && (
            <button
              onClick={() => { setSearchInput(''); setParam({ q: '' }) }}
              className="flex items-center gap-1 tag bg-storm text-silver border border-storm text-xs hover:text-archive transition-colors"
            >
              "{search}" ×
            </button>
          )}
          <button
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="ml-auto font-mono text-xs text-silver/50 hover:text-silver transition-colors"
            title="Copy filtered URL to clipboard"
          >
            Copy link ↗
          </button>
        </div>
      )}

      <p className="font-mono text-xs text-silver mb-6 tracking-wide">
        {filtered.length} BRAND{filtered.length !== 1 ? 'S' : ''}{hasFilters ? ' MATCHING FILTERS' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-silver">
          <p className="text-4xl mb-3 opacity-30">◎</p>
          <p className="mb-3">No brands match your filters.</p>
          <button onClick={clearFilters} className="text-lume hover:text-archive text-sm transition-colors">
            Clear all filters →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(brand => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="card group overflow-hidden">
              {/* Image — 4:3 ratio */}
              <div className="relative aspect-[4/3] bg-storm overflow-hidden">
                <img
                  src={brand.heroImageUrl ?? `https://placehold.co/600x450/1C1E26/9BA0A8?text=${encodeURIComponent(brand.name)}`}
                  alt={brand.name}
                  loading="lazy"
                  className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                />
                {/* Hover quick-view overlay */}
                <div className="absolute inset-0 bg-midnight/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="font-mono text-xs text-lume tracking-widest uppercase border border-lume px-4 py-2 rounded-sm">
                    View Brand →
                  </span>
                </div>
                {/* Price badge */}
                <span className="absolute top-3 right-3 tag bg-midnight/80 text-silver border border-storm/60 text-xs font-mono tracking-tight normal-case backdrop-blur-sm">
                  {brand.priceRange}
                </span>
              </div>
              {/* Card body */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h2 className="font-semibold text-archive group-hover:text-lume transition-colors">
                      {brand.name}
                    </h2>
                    <p className="font-mono text-xs text-silver mt-0.5">{brand.country}</p>
                  </div>
                </div>
                <p className="text-sm text-silver line-clamp-2 leading-relaxed mb-3">
                  {brand.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {brand.categories.map(cat => (
                    <button
                      key={cat}
                      onClick={e => { e.preventDefault(); toggleCategory(cat as Category) }}
                      className={`tag text-xs border transition-colors ${
                        selectedCategories.includes(cat as Category)
                          ? 'bg-lume text-midnight border-lume'
                          : 'bg-midnight text-silver border-storm hover:border-lume hover:text-lume'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function BrandsPage() {
  return (
    <Suspense>
      <BrandsContent />
    </Suspense>
  )
}
