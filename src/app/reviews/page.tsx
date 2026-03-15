import Link from 'next/link'
import { reviews, allTags } from '@/data/reviews'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews & Guides',
  description: 'In-depth reviews, buying guides, and editorials on microbrand watches.',
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= rating ? 'text-brand-400' : 'text-stone-600'}`}
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
  const featured = reviews[0]
  const rest = reviews.slice(1)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Reviews & Guides</h1>
        <p className="text-stone-400">In-depth reviews, roundups and buying guides on microbrand watches.</p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allTags.map(tag => (
          <span key={tag} className="tag bg-stone-800 text-stone-400 border border-stone-700 text-xs">
            {tag}
          </span>
        ))}
      </div>

      {/* Featured article */}
      <Link href={`/reviews/${featured.slug}`} className="block card p-6 md:p-8 mb-6 group">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="tag bg-brand-900/40 text-brand-300 border border-brand-800/50 text-xs">Featured</span>
          {featured.tags.slice(0, 2).map(t => (
            <span key={t} className="tag bg-stone-800 text-stone-400 text-xs">{t}</span>
          ))}
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white group-hover:text-brand-300 transition-colors mb-3">
          {featured.title}
        </h2>
        <p className="text-stone-400 leading-relaxed mb-4 max-w-3xl">{featured.excerpt}</p>
        <div className="flex items-center gap-3 text-sm text-stone-500">
          {featured.rating && <StarRating rating={featured.rating} />}
          <span>{featured.author}</span>
          <span>·</span>
          <span>{new Date(featured.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>·</span>
          <span>{featured.readingTime} min read</span>
        </div>
      </Link>

      {/* Article grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {rest.map(review => (
          <Link key={review.slug} href={`/reviews/${review.slug}`} className="card p-5 group flex flex-col">
            <div className="flex flex-wrap gap-1.5 mb-3">
              {review.tags.slice(0, 2).map(t => (
                <span key={t} className="tag bg-stone-800 text-stone-500 text-xs">{t}</span>
              ))}
            </div>
            <h2 className="font-semibold text-white group-hover:text-brand-300 transition-colors leading-snug mb-2">
              {review.title}
            </h2>
            <p className="text-sm text-stone-400 line-clamp-3 leading-relaxed mb-4 flex-1">
              {review.excerpt}
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-auto">
              {review.rating && <StarRating rating={review.rating} />}
              <span>{review.readingTime} min read</span>
              <span>·</span>
              <span>{new Date(review.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
