import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Reviews & Guides',
  description: 'In-depth reviews, buying guides, and editorials on microbrand watches.',
}

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
