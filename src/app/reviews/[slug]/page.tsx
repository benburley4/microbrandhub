import { notFound } from 'next/navigation'
import Link from 'next/link'
import { reviews, getReviewBySlug } from '@/data/reviews'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  return reviews.map(r => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const review = getReviewBySlug(params.slug)
  if (!review) return {}
  return { title: review.title, description: review.excerpt }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={`w-4 h-4 ${i <= rating ? 'text-gilt' : 'text-storm'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

function renderBody(body: string) {
  return body.split('\n\n').map((para, i) => {
    const t = para.trim()
    if (t.startsWith('## '))  return <h2 key={i} className="text-2xl font-display font-bold text-archive mt-10 mb-3">{t.slice(3)}</h2>
    if (t.startsWith('### ')) return <h3 key={i} className="text-xl font-display font-bold text-archive mt-8 mb-3">{t.slice(4)}</h3>
    if (t.startsWith('**') && t.endsWith('**') && !t.slice(2, -2).includes('**'))
      return <h3 key={i} className="text-xl font-display font-bold text-archive mt-8 mb-3">{t.slice(2, -2)}</h3>
    const parts = t.split(/(\*\*[^*]+\*\*)/)
    return (
      <p key={i} className="text-silver leading-relaxed mb-4">
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="text-archive font-semibold">{part.slice(2, -2)}</strong>
            : part
        )}
      </p>
    )
  })
}

export default function ReviewPage({ params }: Props) {
  const review = getReviewBySlug(params.slug)
  if (!review) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name: review.title,
    description: review.excerpt,
    datePublished: review.publishedAt,
    author: { '@type': 'Person', name: review.author },
    publisher: { '@type': 'Organization', name: 'MicrobrandHub', url: 'https://www.microbrandhub.com' },
    ...(review.rating && {
      reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    }),
    ...(review.brand && {
      itemReviewed: { '@type': 'Product', name: review.brand, brand: { '@type': 'Brand', name: review.brand } },
    }),
  }

  const related = reviews.filter(r => r.slug !== review.slug).slice(0, 3)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Back */}
      <Link href="/reviews" className="inline-flex items-center gap-1.5 text-sm text-silver hover:text-archive transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Reviews
      </Link>

      {/* Featured image */}
      {review.featuredImage && (
        <div className="rounded overflow-hidden mb-8 border border-storm">
          <img
            src={review.featuredImage}
            alt={review.title}
            loading="lazy"
            className="w-full h-56 sm:h-72 object-cover"
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {review.tags.map(tag => (
          <span key={tag} className="tag bg-midnight text-silver border border-storm text-xs">{tag}</span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-display font-extrabold text-archive leading-tight uppercase mb-4">
        {review.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-silver mb-8 pb-8 border-b border-storm">
        {review.rating && <StarRating rating={review.rating} />}
        <span>{review.author}</span>
        <span>·</span>
        <span>{new Date(review.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <span>·</span>
        <span>{review.readingTime} min read</span>
        {review.brandSlug && (
          <>
            <span>·</span>
            <Link href={`/brands/${review.brandSlug}`} className="text-lume hover:text-archive transition-colors">
              View {review.brand} →
            </Link>
          </>
        )}
      </div>

      {/* Excerpt */}
      <p className="text-lg text-silver leading-relaxed mb-8 font-medium">
        {review.excerpt}
      </p>

      {/* Body */}
      <article>{renderBody(review.body)}</article>

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-16 pt-8 border-t border-storm">
          <h2 className="text-xl font-display font-bold text-archive mb-4">More Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(r => (
              <Link key={r.slug} href={`/reviews/${r.slug}`} className="card p-4 group">
                <div className="text-sm font-medium text-archive group-hover:text-lume transition-colors mb-1 line-clamp-2">{r.title}</div>
                <div className="font-mono text-xs text-silver">{r.readingTime} min read</div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
