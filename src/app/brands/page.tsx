'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { brands, allCategories, allCountries, allPriceRanges, type Category, type PriceRange } from '@/data/brands'
import { Suspense } from 'react'

function BrandsContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category') as Category | null

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>(initialCategory || '')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | ''>('')
  const [sortBy, setSortBy] = useState<'name' | 'country'>('name')

  const filtered = useMemo(() => {
    return brands
      .filter(b => {
        if (search && !b.name.toLowerCase().includes(search.toLowerCase()) &&
            !b.country.toLowerCase().includes(search.toLowerCase()) &&
            !b.description.toLowerCase().includes(search.toLowerCase())) return false
        if (selectedCategory && !b.categories.includes(selectedCategory as Category)) return false
        if (selectedCountry && b.country !== selectedCountry) return false
        if (selectedPrice && b.priceRange !== selectedPrice) return false
        return true
      })
      .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : a.country.localeCompare(b.country))
  }, [search, selectedCategory, selectedCountry, selectedPrice, sortBy])

  const hasFilters = search || selectedCategory || selectedCountry || selectedPrice
  const clearFilters = () => { setSearch(''); setSelectedCategory(''); setSelectedCountry(''); setSelectedPrice('') }

  const selectClass = 'bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-silver focus:outline-none focus:border-lume transition-colors'

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
      <div className="bg-slate border border-storm rounded p-4 mb-6 flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-midnight border border-storm rounded-sm px-3 py-2 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
          />
        </div>
        <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value as Category | '')} className={selectClass}>
          <option value="">All Categories</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className={selectClass}>
          <option value="">All Countries</option>
          {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={selectedPrice} onChange={e => setSelectedPrice(e.target.value as PriceRange | '')} className={selectClass}>
          <option value="">All Prices</option>
          {allPriceRanges.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'name' | 'country')} className={selectClass}>
          <option value="name">Sort: A–Z</option>
          <option value="country">Sort: Country</option>
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="text-sm text-silver hover:text-archive transition-colors px-3 py-2">
            Clear ×
          </button>
        )}
      </div>

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
                    <span key={cat} className="tag bg-midnight text-silver border border-storm text-xs">
                      {cat}
                    </span>
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
