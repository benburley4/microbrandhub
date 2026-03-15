import { notFound } from 'next/navigation'
import Link from 'next/link'
import { brands, getBrandBySlug } from '@/data/brands'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return brands.map(b => ({ slug: b.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const brand = getBrandBySlug(params.slug)
  if (!brand) return {}
  return {
    title: brand.name,
    description: brand.description,
  }
}

const priceRangeColor: Record<string, string> = {
  'Under $300': 'text-green-400 bg-green-900/30 border-green-800/50',
  '$300–$600': 'text-sky-400 bg-sky-900/30 border-sky-800/50',
  '$600–$1,000': 'text-brand-400 bg-brand-900/30 border-brand-800/50',
  '$1,000–$2,000': 'text-purple-400 bg-purple-900/30 border-purple-800/50',
  '$2,000+': 'text-rose-400 bg-rose-900/30 border-rose-800/50',
}

export default function BrandPage({ params }: Props) {
  const brand = getBrandBySlug(params.slug)
  if (!brand) notFound()

  const related = brands
    .filter(b => b.slug !== brand.slug && b.categories.some(c => brand.categories.includes(c)))
    .slice(0, 3)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back */}
      <Link href="/brands" className="inline-flex items-center gap-1.5 text-sm text-stone-400 hover:text-white transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Brands
      </Link>

      {/* Brand header */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">{brand.name}</h1>
            <p className="text-stone-400">{brand.country}</p>
          </div>
          <span className={`tag border text-sm font-medium px-3 py-1.5 ${priceRangeColor[brand.priceRange] || 'bg-stone-800 text-stone-300 border-stone-700'}`}>
            {brand.priceRange}
          </span>
        </div>

        <p className="text-stone-300 leading-relaxed text-lg mb-6">{brand.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {brand.categories.map(cat => (
            <Link
              key={cat}
              href={`/brands?category=${cat}`}
              className="tag bg-stone-800 text-stone-300 border border-stone-700 hover:border-brand-600 hover:text-brand-300 transition-colors px-3 py-1"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a
            href={brand.website}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Visit Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <Link
            href={`/listings?brand=${encodeURIComponent(brand.name)}`}
            className="btn-secondary"
          >
            Find Pre-owned Listings
          </Link>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Country</div>
          <div className="text-white font-medium">{brand.country}</div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Price Range</div>
          <div className="text-white font-medium">{brand.priceRange}</div>
        </div>
        <div className="bg-stone-900 border border-stone-800 rounded-xl p-4">
          <div className="text-xs text-stone-500 uppercase tracking-wider mb-1">Speciality</div>
          <div className="text-white font-medium">{brand.categories[0]}</div>
        </div>
      </div>

      {/* Related brands */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Similar Brands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(b => (
              <Link key={b.slug} href={`/brands/${b.slug}`} className="card p-4 group">
                <div className="font-medium text-white group-hover:text-brand-300 transition-colors mb-1">
                  {b.name}
                </div>
                <div className="text-xs text-stone-500 mb-2">{b.country} · {b.priceRange}</div>
                <p className="text-xs text-stone-400 line-clamp-2">{b.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
