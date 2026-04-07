import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Limited Drops',
  description: 'Latest limited edition releases and drops from the microbrand watch world.',
}

export default function DropsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
