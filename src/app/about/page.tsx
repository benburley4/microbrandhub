import Link from 'next/link'
import type { Metadata } from 'next'
import { brands } from '@/data/brands'

export const metadata: Metadata = {
  title: 'About MicrobrandHub',
  description: 'MicrobrandHub is the definitive discovery platform for independent and microbrand watches. Learn about our mission and the brands we cover.',
}

const stats = [
  { label: 'Brands catalogued', value: `${brands.length}+` },
  { label: 'Countries covered', value: '20+' },
  { label: 'Price categories', value: '5' },
  { label: 'Watch categories', value: '7' },
]

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="font-mono text-xs text-lume tracking-widest uppercase mb-3">Our Story</p>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-archive mb-4 uppercase leading-tight">
          About MicrobrandHub
        </h1>
        <p className="text-xl text-silver leading-relaxed">
          The definitive discovery platform for independent and microbrand watches.
        </p>
      </div>

      {/* Mission */}
      <div className="card p-8 mb-8 border-l-4 border-l-lume">
        <h2 className="text-2xl font-display font-bold text-archive mb-4">Our Mission</h2>
        <p className="text-silver leading-relaxed mb-4">
          MicrobrandHub exists to help watch enthusiasts discover the world's best independent watch brands — the ones
          that don't have boutiques on Bond Street or Madison Avenue, but make exceptional watches that often rival (and
          sometimes surpass) the output of major Swiss houses.
        </p>
        <p className="text-silver leading-relaxed">
          The microbrand movement has transformed the watch industry over the past decade. Direct-to-consumer selling,
          crowdfunding platforms, and improved access to quality Swiss and Japanese movements have made it possible for
          small independent brands to produce outstanding watches at prices the majors cannot match. Our job is to find
          the best of them and bring them to your attention.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl font-display font-bold text-lume mb-1">{s.value}</div>
            <div className="font-mono text-xs text-silver uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* What we cover */}
      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-display font-bold text-archive mb-6">What We Cover</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            {
              title: 'Brand Directory',
              body: `A curated database of ${brands.length}+ microbrand and independent watch companies, with details on country of origin, price range, speciality, and direct links to each brand's website.`,
            },
            {
              title: 'Limited Drops',
              body: 'We track limited edition releases, Kickstarter campaigns, and special production runs so you never miss a drop from your favourite brand.',
            },
            {
              title: 'Pre-owned Listings',
              body: 'Aggregated pre-owned listings sourced from Carousell and other platforms, filtered to show only microbrand watches. A shortcut to the secondary market.',
            },
            {
              title: 'Reviews & Guides',
              body: 'In-depth reviews, category roundups, and buying guides written for enthusiasts who want real information rather than press releases.',
            },
          ].map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-semibold text-archive mb-2">{title}</h3>
              <p className="text-sm text-silver leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* What we are not */}
      <div className="card p-8 mb-8 border-l-4 border-l-copper">
        <h2 className="text-2xl font-display font-bold text-archive mb-4">What We Are Not</h2>
        <p className="text-silver leading-relaxed mb-4">
          MicrobrandHub is a discovery and information platform — we are not a marketplace and do not facilitate
          transactions. When you click through to a brand's website or a pre-owned listing, you are leaving
          MicrobrandHub and dealing directly with the brand or seller.
        </p>
        <p className="text-silver leading-relaxed">
          We do not accept payment from brands for inclusion in the directory. Every brand in our database is there on
          merit. We may use affiliate links in some articles; when we do, we disclose this clearly.
        </p>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-4">
        <Link href="/brands" className="btn-primary">
          Browse the Directory →
        </Link>
        <Link href="/reviews" className="btn-secondary">
          Read Reviews →
        </Link>
        <Link href="/contact" className="btn-secondary">
          Get in Touch →
        </Link>
      </div>
    </div>
  )
}
