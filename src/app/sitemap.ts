import { MetadataRoute } from 'next'
import { brands } from '@/data/brands'
import { reviews } from '@/data/reviews'

const BASE_URL = 'https://www.microbrandhub.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/brands`,      lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE_URL}/drops`,       lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/listings`,    lastModified: new Date(), changeFrequency: 'daily',   priority: 0.8 },
    { url: `${BASE_URL}/reviews`,     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,       lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/faq`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`,     lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const brandRoutes: MetadataRoute.Sitemap = brands.map(b => ({
    url: `${BASE_URL}/brands/${b.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const reviewRoutes: MetadataRoute.Sitemap = reviews.map(r => ({
    url: `${BASE_URL}/reviews/${r.slug}`,
    lastModified: new Date(r.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...brandRoutes, ...reviewRoutes]
}
