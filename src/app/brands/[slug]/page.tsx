import { notFound } from 'next/navigation'
import Link from 'next/link'
import { brands, getBrandBySlug } from '@/data/brands'
import { reviews } from '@/data/reviews'
import { drops } from '@/data/drops'
import { listings } from '@/data/listings'
import { brandSEO } from '@/data/brand_seo'
import { getWatchesByBrand } from '@/data/watches'
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
  const seo = brandSEO[params.slug]
  return {
    title: seo?.seoTitle ?? `${brand.name} — MicrobrandHub`,
    description: seo?.seoDescription ?? brand.description.slice(0, 160),
  }
}

const priceRangeColor: Record<string, string> = {
  'Under $300':     'text-lume bg-lume/10 border-lume/30',
  '$300–$600':      'text-archive bg-storm border-storm',
  '$600–$1,000':    'text-copper bg-copper/10 border-copper/30',
  '$1,000–$2,000':  'text-gilt bg-gilt/10 border-gilt/30',
  '$2,000+':        'text-silver bg-slate border-storm',
}

const dropStatusConfig = {
  live:     { label: 'Live Now',  classes: 'bg-lume/10 text-lume border-lume/30' },
  upcoming: { label: 'Upcoming', classes: 'bg-copper/10 text-copper border-copper/30' },
  sold_out: { label: 'Sold Out', classes: 'bg-storm text-silver border-storm' },
}

export default function BrandPage({ params }: Props) {
  const brand = getBrandBySlug(params.slug)
  if (!brand) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    url: brand.website,
    description: brand.description,
    ...(brand.country && { foundingLocation: { '@type': 'Country', name: brand.country } }),
    ...(brand.founded && { foundingDate: String(brand.founded) }),
  }

  const seo          = brandSEO[brand.slug]
  const related      = brands.filter(b => b.slug !== brand.slug && b.categories.some(c => brand.categories.includes(c))).slice(0, 3)
  const brandReviews  = reviews.filter(r => r.brandSlug === brand.slug)
  const brandDrops    = drops.filter(d => d.brandSlug === brand.slug)
  const brandListings = listings.filter(l => l.brand.toLowerCase() === brand.name.toLowerCase()).slice(0, 4)
  const brandModels   = getWatchesByBrand(brand.slug)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero image */}
      {brand.heroImageUrl && (
        <div className="rounded overflow-hidden mb-8 border border-storm aspect-[16/6]">
          <img
            src={brand.heroImageUrl}
            alt={`${brand.name} watches`}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Back */}
      <Link href="/brands" className="inline-flex items-center gap-1.5 text-sm text-silver hover:text-archive transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Brands
      </Link>

      {/* Brand header */}
      <div className="card p-8 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-4xl font-display font-extrabold text-archive uppercase leading-tight mb-1">{brand.name}</h1>
            <p className="font-mono text-xs text-silver tracking-widest">{brand.country}</p>
          </div>
          <span className={`tag border text-sm font-medium px-3 py-1.5 ${priceRangeColor[brand.priceRange] ?? 'bg-slate text-silver border-storm'}`}>
            {brand.priceRange}
          </span>
        </div>

        <p className="text-silver leading-relaxed text-base mb-6">{brand.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {brand.categories.map(cat => (
            <Link
              key={cat}
              href={`/brands?category=${cat}`}
              className="tag bg-midnight text-silver border border-storm hover:border-lume hover:text-lume transition-colors px-3 py-1 text-xs"
            >
              {cat}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={brand.website} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Visit Website
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <Link href={`/listings?brand=${encodeURIComponent(brand.name)}`} className="btn-secondary">
            Find Pre-owned Listings
          </Link>
        </div>
      </div>

      {/* Key Collection + Why Buy */}
      {seo && (seo.keyCollection || seo.whyBuy?.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {seo.keyCollection && (
            <div className="card p-5">
              <h2 className="font-mono text-xs text-silver uppercase tracking-widest mb-2">Signature Collection</h2>
              <p className="text-sm text-silver leading-relaxed">{seo.keyCollection}</p>
            </div>
          )}
          {seo.whyBuy?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-mono text-xs text-silver uppercase tracking-widest mb-2">Why Buy</h2>
              <ul className="space-y-1">
                {seo.whyBuy.map((point: string, i: number) => (
                  <li key={i} className="text-sm text-silver flex gap-2">
                    <span className="text-lume mt-0.5 shrink-0">✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Country',    value: brand.country },
          { label: 'Price Range', value: brand.priceRange },
          { label: 'Speciality', value: brand.categories[0] },
        ].map(({ label, value }) => (
          <div key={label} className="card p-4">
            <div className="font-mono text-xs text-silver uppercase tracking-widest mb-1">{label}</div>
            <div className="text-archive font-medium">{value}</div>
          </div>
        ))}
      </div>

      {/* Watch Models */}
      {brandModels.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-display font-bold text-archive">Watch Models</h2>
              <p className="font-mono text-xs text-silver tracking-widest mt-0.5">
                {brandModels.filter(m => m.availability === 'available').length} AVAILABLE · {brandModels.length} TOTAL
              </p>
            </div>
            <Link href={`/watches?brand=${encodeURIComponent(brand.name)}`} className="text-lume hover:text-archive text-sm font-semibold transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {brandModels.slice(0, 8).map(model => {
              const availStyle = model.availability === 'available'
                ? 'bg-lume/10 text-lume border-lume/30'
                : model.availability === 'pre_order'
                ? 'bg-copper/10 text-copper border-copper/30'
                : 'bg-storm text-silver border-storm'
              const availLabel = model.availability === 'available' ? 'Available'
                : model.availability === 'pre_order' ? 'Pre-Order'
                : model.availability === 'coming_soon' ? 'Coming Soon'
                : 'Sold Out'
              return (
                <div key={model.id} className="card group flex flex-col">
                  <div className="aspect-[3/4] bg-storm overflow-hidden flex-shrink-0">
                    {model.imageUrl ? (
                      <img
                        src={model.imageUrl}
                        alt={model.name}
                        loading="lazy"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          model.availability === 'sold_out' ? 'opacity-40 grayscale' : 'opacity-80 group-hover:opacity-95'
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
                  <div className="p-2.5 flex flex-col gap-1 flex-1">
                    <p className="text-xs font-semibold text-archive leading-tight line-clamp-2">{model.name}</p>
                    <div className="flex items-center justify-between mt-auto pt-1 gap-1 flex-wrap">
                      {model.priceDisplay && <span className="font-mono text-[10px] text-silver">{model.priceDisplay}</span>}
                      <span className={`tag border text-[9px] px-1.5 py-0.5 ${availStyle}`}>{availLabel}</span>
                    </div>
                    {model.caseDiameterMm && <p className="font-mono text-[10px] text-storm">{model.caseDiameterMm}mm</p>}
                  </div>
                </div>
              )
            })}
          </div>
          {brandModels.length > 8 && (
            <div className="mt-4 text-center">
              <Link href={`/watches?brand=${encodeURIComponent(brand.name)}`} className="btn-secondary text-sm">
                See all {brandModels.length} models →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Reviews */}
      {brandReviews.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-display font-bold text-archive mb-4">Reviews</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandReviews.map(review => (
              <Link key={review.slug} href={`/reviews/${review.slug}`} className="card p-4 group">
                <div className="font-medium text-archive group-hover:text-lume transition-colors mb-1 leading-snug">
                  {review.title}
                </div>
                <div className="font-mono text-xs text-silver mb-2">
                  {review.readingTime} min read · {new Date(review.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                </div>
                <p className="text-xs text-silver line-clamp-2">{review.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Drops */}
      {brandDrops.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-display font-bold text-archive mb-4">Limited Drops</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandDrops.map(drop => {
              const cfg = dropStatusConfig[drop.status]
              return (
                <div key={drop.id} className="card p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="font-medium text-archive leading-snug">{drop.title}</div>
                    <span className={`tag border text-xs font-medium whitespace-nowrap ${cfg.classes}`}>{cfg.label}</span>
                  </div>
                  <p className="text-xs text-silver line-clamp-2 mb-3">{drop.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold font-display text-archive">
                      {new Intl.NumberFormat('en-US', { style: 'currency', currency: drop.currency, maximumFractionDigits: 0 }).format(drop.price)}
                    </span>
                    {drop.status !== 'sold_out' && (
                      <a href={drop.url} target="_blank" rel="noopener noreferrer" className="text-xs text-lume hover:text-archive transition-colors">
                        View Drop →
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Pre-owned Listings */}
      {brandListings.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-archive">Pre-owned Listings</h2>
            <Link href={`/listings?brand=${encodeURIComponent(brand.name)}`} className="text-lume hover:text-archive text-sm transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandListings.map(listing => (
              <a key={listing.id} href={listing.url} target="_blank" rel="noopener noreferrer" className="card p-4 group">
                <div className="font-medium text-archive group-hover:text-lume transition-colors leading-snug mb-1 line-clamp-2">
                  {listing.title}
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-silver mt-1">
                  <span className="font-bold text-archive text-sm">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: listing.currency, maximumFractionDigits: 0 }).format(listing.price)}
                  </span>
                  <span>·</span>
                  <span>{listing.condition}</span>
                  <span>·</span>
                  <span>{listing.platform}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Related brands */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-display font-bold text-archive mb-4">Similar Brands</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(b => (
              <Link key={b.slug} href={`/brands/${b.slug}`} className="card p-4 group">
                <div className="font-medium text-archive group-hover:text-lume transition-colors mb-1">{b.name}</div>
                <div className="font-mono text-xs text-silver mb-2">{b.country} · {b.priceRange}</div>
                <p className="text-xs text-silver line-clamp-2">{b.description}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
