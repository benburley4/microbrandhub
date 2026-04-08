import Link from 'next/link'
import { brands, allCategories } from '@/data/brands'
import { getLatestDrops } from '@/data/drops'

const categoryIcons: Record<string, { path: string; label: string }> = {
  Dive: {
    label: 'Dive',
    path: 'M12 3C7 3 3 7 3 12s4 9 9 9 9-4 9-9-4-9-9-9zm0 2a7 7 0 110 14A7 7 0 0112 5zm-1 3v5l4 2.5-.75-1.3L14 13V8h-3z',
  },
  Field: {
    label: 'Field',
    path: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  },
  Dress: {
    label: 'Dress',
    path: 'M12 22c5.52 0 10-4.48 10-10S17.52 2 12 2 2 6.48 2 12s4.48 10 10 10zm0-18c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm.5 3H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  },
  Pilot: {
    label: 'Pilot',
    path: 'M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z',
  },
  Sport: {
    label: 'Sport',
    path: 'M13 2.05v2.02c3.95.49 7 3.85 7 7.93 0 3.21-1.82 6.14-4.72 7.7L13 17v5h5l-1.22-1.22C19.91 19.07 22 15.76 22 12c0-5.18-3.95-9.45-9-9.95zM11 2.05C5.95 2.55 2 6.82 2 12c0 3.76 2.09 7.07 5.22 8.78L6 22h5v-5l-2.28 2.28C7.28 18.13 6 15.19 6 12c0-4.08 3.05-7.44 7-7.93V2.05z',
  },
  Casual: {
    label: 'Casual',
    path: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z',
  },
  Tool: {
    label: 'Tool',
    path: 'M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z',
  },
}

const latestDrops = getLatestDrops(3)

const featuredBrands = ['Baltic', 'Nomos', 'Halios', 'Formex', 'Traska', 'Serica'].map(
  name => brands.find(b => b.name === name)!
).filter(Boolean)

export default function HomePage() {
  return (
    <div className="bg-midnight">

      {/* Hero */}
      <section className="relative overflow-hidden bg-midnight border-b border-storm min-h-[600px] flex items-center">
        {/* Lifestyle background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1800&q=80')` }}
          aria-hidden="true"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-midnight/80" aria-hidden="true" />
        {/* Chapter ring pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 5.8deg, rgba(184,255,110,0.04) 6deg, transparent 6.2deg)`,
            backgroundSize: '400px 400px',
            backgroundPosition: 'center',
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 relative w-full">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-archive leading-none mb-6 uppercase">
              Every Independent Watch.<br />
              <span className="text-lume">One Trusted Source.</span>
            </h1>
            <p className="font-mono text-lume text-sm tracking-widest mb-8">
              {brands.length} BRANDS · 20 COUNTRIES · 7 CATEGORIES · 0 PAID INCLUSIONS
            </p>
            <p className="text-silver text-lg mb-10 leading-relaxed max-w-xl">
              MicrobrandHub is the definitive guide to independent watchmaking — curated by collectors, accountable to no brand.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/brands" className="btn-primary">
                Browse Directory →
              </Link>
              <Link href="/drops" className="btn-primary" style={{ background: 'transparent', border: '1px solid #B8FF6E', color: '#B8FF6E' }}>
                Latest Drops →
              </Link>
              <Link href="/reviews" className="btn-secondary">
                Read Reviews →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats ticker */}
      <section className="border-b border-storm bg-slate/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-6 text-center">
            {[
              { value: String(brands.length), label: 'BRANDS CATALOGUED' },
              { value: '20+', label: 'COUNTRIES' },
              { value: '7', label: 'CATEGORIES' },
              { value: '0', label: 'PAID INCLUSIONS' },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="font-mono text-2xl font-medium text-lume">{value}</span>
                <span className="text-xs font-semibold tracking-widest uppercase text-silver">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter — hero placement */}
      <section className="border-b border-storm bg-slate/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <p className="font-mono text-xs text-lume tracking-widest uppercase mb-1">The Drop List — Weekly</p>
            <h2 className="text-xl md:text-2xl font-display font-bold text-archive leading-tight">
              Never miss a limited edition or new release.
            </h2>
            <p className="text-silver text-sm mt-1">No hype. No paid placements. Straight to your inbox.</p>
          </div>
          <form
            action={`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? 'YOUR_FORM_ID'}`}
            method="POST"
            className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:min-w-[380px]"
          >
            <input type="hidden" name="_subject" value="Newsletter signup" />
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-midnight border border-storm rounded-sm px-4 py-3 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe →
            </button>
          </form>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-heading text-archive mb-1">Browse by Category</h2>
        <p className="text-silver mb-8">Find the right watch for every occasion.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {allCategories.map(cat => (
            <Link
              key={cat}
              href={`/brands?category=${cat}`}
              className="group card p-4 text-center"
            >
              <div className="flex justify-center mb-3">
                <svg className="w-6 h-6 text-silver group-hover:text-lume transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={categoryIcons[cat]?.path ?? 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'} />
                </svg>
              </div>
              <div className="text-xs font-semibold tracking-widest uppercase text-silver group-hover:text-archive transition-colors">{cat}</div>
              <div className="font-mono text-xs text-storm mt-1 group-hover:text-silver transition-colors">
                {brands.filter(b => b.categories.includes(cat as any)).length}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading text-archive mb-1">Featured Brands</h2>
            <p className="text-silver">Editor picks from our brand directory.</p>
          </div>
          <Link href="/brands" className="text-lume hover:text-archive text-sm font-semibold transition-colors tracking-wide">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featuredBrands.map(brand => (
            <Link key={brand.slug} href={`/brands/${brand.slug}`} className="card group">
              <div className="h-36 bg-storm overflow-hidden">
                <img
                  src={brand.heroImageUrl ?? `https://placehold.co/600x200/1C1E26/9BA0A8?text=${encodeURIComponent(brand.name)}`}
                  alt={brand.name}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
                />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-archive group-hover:text-lume transition-colors">
                      {brand.name}
                    </h3>
                    <p className="font-mono text-xs text-silver mt-0.5">{brand.country}</p>
                  </div>
                  <span className="tag bg-storm text-silver border border-storm/60 text-xs font-mono tracking-tight normal-case">
                    {brand.priceRange}
                  </span>
                </div>
                <p className="text-sm text-silver line-clamp-2 leading-relaxed">{brand.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
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
      </section>

      {/* Latest Drops */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-heading text-archive mb-1">Latest Drops</h2>
            <p className="text-silver">Limited editions and new releases from the microbrand world.</p>
          </div>
          <Link href="/drops" className="text-lume hover:text-archive text-sm font-semibold transition-colors tracking-wide">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {latestDrops.map(drop => {
            const statusLabel = drop.status === 'live' ? 'Live Now' : drop.status === 'upcoming' ? 'Upcoming' : 'Sold Out'
            const statusClasses = drop.status === 'live'
              ? 'bg-lume/10 text-lume border-lume/30'
              : drop.status === 'upcoming'
              ? 'bg-copper/10 text-copper border-copper/30'
              : 'bg-storm text-silver border-storm'
            return (
              <Link key={drop.id} href="/drops" className="card group">
                <div className="h-36 bg-storm overflow-hidden">
                  <img
                    src={drop.imageUrl}
                    alt={drop.title}
                    className={`w-full h-full object-cover group-hover:opacity-90 transition-opacity ${drop.status === 'sold_out' ? 'opacity-30 grayscale' : 'opacity-70'}`}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-copper font-medium tracking-wide">{drop.brand}</span>
                    <span className={`tag border text-xs ${statusClasses}`}>{statusLabel}</span>
                  </div>
                  <p className="text-sm font-semibold text-archive group-hover:text-lume transition-colors line-clamp-1">
                    {drop.title}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Editorial CTA panels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-8 border-l-4 border-l-copper">
            <p className="font-mono text-xs text-copper tracking-widest uppercase mb-3">Pre-owned Listings</p>
            <h3 className="text-xl font-display font-bold text-archive mb-2">Find Your Next Watch</h3>
            <p className="text-silver text-sm mb-5 leading-relaxed">
              Browse pre-owned microbrand watches sourced from Carousell, eBay, Reddit, and Chrono24. Updated regularly.
            </p>
            <Link href="/listings" className="btn-primary text-sm">
              Browse Listings →
            </Link>
          </div>
          <div className="card p-8 border-l-4 border-l-gilt">
            <p className="font-mono text-xs text-gilt tracking-widest uppercase mb-3">Reviews & Guides</p>
            <h3 className="text-xl font-display font-bold text-archive mb-2">Depth Over Hype</h3>
            <p className="text-silver text-sm mb-5 leading-relaxed">
              In-depth reviews, buying guides, and editorials. We go further — movement choice, case finishing, community verdict.
            </p>
            <Link href="/reviews" className="btn-secondary text-sm">
              Read Reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="section-heading text-archive mb-1">What Collectors Say</h2>
        <p className="text-silver mb-8">From the community that keeps us honest.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              quote: "The only place I check before buying a new microbrand. The directory is genuinely comprehensive — found three brands I'd never heard of that are now in my collection.",
              name: "James T.",
              detail: "WatchUSeek member, 12 years collecting",
            },
            {
              quote: "Drops page is bookmarked. Got notified about the Baltic Bioceramic before it sold out — wouldn't have known otherwise. This site fills a real gap.",
              name: "Sophie R.",
              detail: "r/Watches contributor",
            },
            {
              quote: "No paid placements means I actually trust what's here. Other sites are just brand PR. MicrobrandHub feels like a real collector's resource.",
              name: "Marcus L.",
              detail: "Independent collector, Germany",
            },
          ].map(({ quote, name, detail }) => (
            <figure key={name} className="card p-6 flex flex-col">
              <svg className="w-6 h-6 text-lume mb-4 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <blockquote className="text-silver text-sm leading-relaxed flex-1 mb-4">"{quote}"</blockquote>
              <figcaption>
                <p className="text-archive text-sm font-semibold">{name}</p>
                <p className="font-mono text-xs text-storm mt-0.5">{detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-slate border border-storm rounded p-8 md:p-12 text-center">
          <p className="font-mono text-xs text-lume tracking-widest uppercase mb-4">Never Miss a Drop</p>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-archive mb-3">
            The Drop List — Weekly
          </h2>
          <p className="text-silver max-w-xl mx-auto mb-8 leading-relaxed">
            New limited editions, brand launches, and hand-picked pre-owned listings — straight to your inbox. No hype. No paid placements.
          </p>
          <form
            action={`https://formspree.io/f/${process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID ?? 'YOUR_FORM_ID'}`}
            method="POST"
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input type="hidden" name="_subject" value="Newsletter signup" />
            <input
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="flex-1 bg-midnight border border-storm rounded-sm px-4 py-3 text-sm text-archive placeholder-silver focus:outline-none focus:border-lume transition-colors"
            />
            <button type="submit" className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="font-mono text-xs text-storm mt-4 tracking-wide">No spam. Unsubscribe any time.</p>
        </div>
      </section>
    </div>
  )
}
