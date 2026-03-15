import Link from 'next/link'
import { brands, allCategories } from '@/data/brands'

const categoryIcons: Record<string, string> = {
  Dive: '🤿',
  Field: '🏔️',
  Dress: '👔',
  Pilot: '✈️',
  Sport: '🏃',
  Casual: '☕',
  Tool: '🔧',
}

const featuredBrands = ['Baltic', 'Nomos', 'Halios', 'Formex', 'Traska', 'Serica'].map(
  name => brands.find(b => b.name === name)!
).filter(Boolean)

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-brand-400 text-sm font-medium mb-6 bg-brand-900/30 px-3 py-1.5 rounded-full border border-brand-800/50">
              <span>⌚</span> {brands.length} microbrand watches catalogued
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight mb-6">
              Discover the world&apos;s best{' '}
              <span className="text-brand-400">independent</span>{' '}
              watch brands
            </h1>
            <p className="text-lg text-stone-300 mb-8 leading-relaxed">
              Your definitive guide to microbrand watches — from Scandinavian dive watches to Japanese dress pieces. Browse 90+ brands, find pre-owned listings, and read in-depth reviews.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/brands" className="btn-primary">
                Browse All Brands
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/listings" className="btn-secondary">
                View Listings
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-stone-800 bg-stone-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{brands.length}</div>
              <div className="text-sm text-stone-400 mt-0.5">Brands catalogued</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">7</div>
              <div className="text-sm text-stone-400 mt-0.5">Categories</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">20+</div>
              <div className="text-sm text-stone-400 mt-0.5">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-heading text-white mb-2">Browse by Category</h2>
        <p className="text-stone-400 mb-8">Find the right watch for every occasion.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {allCategories.map(cat => (
            <Link
              key={cat}
              href={`/brands?category=${cat}`}
              className="group card p-4 text-center hover:border-brand-700 transition-all duration-200"
            >
              <div className="text-3xl mb-2">{categoryIcons[cat]}</div>
              <div className="text-sm font-medium text-stone-300 group-hover:text-white transition-colors">{cat}</div>
              <div className="text-xs text-stone-500 mt-1">
                {brands.filter(b => b.categories.includes(cat as any)).length} brands
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading text-white mb-1">Featured Brands</h2>
            <p className="text-stone-400">Editor picks from our brand directory.</p>
          </div>
          <Link href="/brands" className="text-brand-400 hover:text-brand-300 text-sm font-medium transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBrands.map(brand => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="card p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">{brand.country}</p>
                </div>
                <span className="tag bg-brand-900/40 text-brand-300 border border-brand-800/50 text-xs">
                  {brand.priceRange}
                </span>
              </div>
              <p className="text-sm text-stone-400 line-clamp-2 leading-relaxed">{brand.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {brand.categories.map(cat => (
                  <span key={cat} className="tag bg-stone-800 text-stone-300 text-xs">
                    {cat}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA sections */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-8 bg-gradient-to-br from-stone-900 to-stone-800">
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="text-xl font-bold text-white mb-2">Pre-owned Listings</h3>
            <p className="text-stone-400 text-sm mb-4 leading-relaxed">
              Browse pre-owned microbrand watches sourced from Carousell and other platforms. Updated regularly.
            </p>
            <Link href="/listings" className="btn-primary text-sm">
              Browse Listings
            </Link>
          </div>
          <div className="card p-8 bg-gradient-to-br from-stone-900 to-stone-800">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="text-xl font-bold text-white mb-2">Reviews & Guides</h3>
            <p className="text-stone-400 text-sm mb-4 leading-relaxed">
              In-depth reviews, buying guides, and editorials on the microbrand watch market.
            </p>
            <Link href="/reviews" className="btn-secondary text-sm">
              Read Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
