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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Brand Directory</h1>
        <p className="text-stone-400">{brands.length} independent watch brands across {allCountries.length} countries</p>
      </div>

      {/* Filters */}
      <div className="bg-stone-900 border border-stone-800 rounded-xl p-4 mb-6 flex flex-wrap gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value as Category | '')}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Categories</option>
          {allCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Country */}
        <select
          value={selectedCountry}
          onChange={e => setSelectedCountry(e.target.value)}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Countries</option>
          {allCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Price */}
        <select
          value={selectedPrice}
          onChange={e => setSelectedPrice(e.target.value as PriceRange | '')}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="">All Prices</option>
          {allPriceRanges.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as 'name' | 'country')}
          className="bg-stone-800 border border-stone-700 rounded-lg px-3 py-2 text-sm text-stone-300 focus:outline-none focus:border-brand-500"
        >
          <option value="name">Sort: A–Z</option>
          <option value="country">Sort: Country</option>
        </select>

        {hasFilters && (
          <button
            onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCountry(''); setSelectedPrice('') }}
            className="text-sm text-stone-400 hover:text-white transition-colors px-3 py-2"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="text-sm text-stone-500 mb-4">
        Showing {filtered.length} brand{filtered.length !== 1 ? 's' : ''}
        {hasFilters ? ' matching your filters' : ''}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <div className="text-4xl mb-3">🔍</div>
          <p>No brands match your filters.</p>
          <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedCountry(''); setSelectedPrice('') }} className="mt-3 text-brand-400 hover:text-brand-300 text-sm">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(brand => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                    {brand.name}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">{brand.country}</p>
                </div>
                <span className="tag bg-stone-800 text-stone-300 text-xs border border-stone-700 whitespace-nowrap ml-2">
                  {brand.priceRange}
                </span>
              </div>
              <p className="text-sm text-stone-400 line-clamp-2 leading-relaxed mb-3">
                {brand.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {brand.categories.map(cat => (
                  <span key={cat} className="tag bg-stone-800/80 text-stone-400 text-xs">
                    {cat}
                  </span>
                ))}
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
