'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { reviews, allTags } from '@/data/reviews'

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-gilt' : 'text-storm'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ReviewsPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!activeTag) return reviews
    return reviews.filter(r => r.tags.includes(activeTag))
  }, [activeTag])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs text-lume tracking-widest uppercase mb-2">Depth Over Hype</p>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-archive mb-2 uppercase leading-tight">
          Reviews & Guides
        </h1>
        <p className="text-silver">In-depth reviews, roundups and buying guides on microbrand watches.</p>
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveTag(null)}
          className={`tag border text-xs transition-colors ${
            activeTag === null
              ? 'bg-lume text-midnight border-lume'
              : 'bg-midnight text-silver border-storm hover:border-lume hover:text-lume'
          }`}
        >
          All
        </button>
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            className={`tag border text-xs transition-colors ${
              activeTag === tag
                ? 'bg-lume text-midnight border-lume'
                : 'bg-midnight text-silver border-storm hover:border-lume hover:text-lume'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <p className="font-mono text-xs text-silver mb-6 tracking-wide">
        {filtered.length} ARTICLE{filtered.length !== 1 ? 'S' : ''}{activeTag ? ` · "${activeTag}"` : ''}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-silver">
          <p className="text-4xl mb-3 opacity-30">◎</p>
          <p>No articles found for this tag.</p>
          <button onClick={() => setActiveTag(null)} className="mt-4 text-lume hover:text-archive text-sm transition-colors">
            Clear filter →
          </button>
        </div>
      ) : (
        <>
          {/* Featured article */}
          {featured && (
            <Link href={`/reviews/${featured.slug}`} className="block card overflow-hidden mb-6 group">
              {featured.featuredImage && (
                <div className="relative aspect-[16/7] overflow-hidden">
                  <img
                    src={featured.featuredImage}
                    alt={featured.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="tag bg-lume/10 text-lume border border-lume/30 text-xs">Featured</span>
                  {featured.tags.slice(0, 2).map(t => (
                    <span key={t} className="tag bg-midnight text-silver border border-storm text-xs">{t}</span>
                  ))}
                </div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-archive group-hover:text-lume transition-colors mb-3 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-silver leading-relaxed mb-4 max-w-3xl">{featured.excerpt}</p>
                <div className="flex items-center gap-3 font-mono text-xs text-silver">
                  {featured.rating && <StarRating rating={featured.rating} />}
                  <span>{featured.author}</span>
                  <span>·</span>
                  <span>{new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  <span>·</span>
                  <span>{featured.readingTime} min read</span>
                </div>
              </div>
            </Link>
          )}

          {/* Article grid */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rest.map(review => (
                <Link key={review.slug} href={`/reviews/${review.slug}`} className="card overflow-hidden group flex flex-col">
                  <div className="relative aspect-[4/3] bg-storm overflow-hidden">
                    <img
                      src={review.featuredImage ?? `https://placehold.co/600x450/1C1E26/9BA0A8?text=${encodeURIComponent(review.title.slice(0, 20))}`}
                      alt={review.title}
                      loading="lazy"
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {review.tags.slice(0, 2).map(t => (
                        <button
                          key={t}
                          onClick={e => { e.preventDefault(); setActiveTag(t) }}
                          className="tag bg-midnight text-silver text-xs hover:text-lume border border-storm hover:border-lume transition-colors"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <h2 className="font-semibold text-archive group-hover:text-lume transition-colors leading-snug mb-2">
                      {review.title}
                    </h2>
                    <p className="text-sm text-silver line-clamp-3 leading-relaxed mb-4 flex-1">
                      {review.excerpt}
                    </p>
                    <div className="flex items-center gap-2 font-mono text-xs text-silver mt-auto">
                      {review.rating && <StarRating rating={review.rating} />}
                      <span>{review.readingTime} min</span>
                      <span>·</span>
                      <span>{new Date(review.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
