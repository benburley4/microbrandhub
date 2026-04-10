import generatedDrops from '@/data/generated/generated_drops.json'

export type DropStatus = 'upcoming' | 'live' | 'sold_out'

export interface Drop {
  id: string
  brand: string
  brandSlug: string
  title: string
  description: string
  dropDate: string  // ISO date string
  status: DropStatus
  price: number
  currency: string
  imageUrl: string
  url: string
  /** Set to true for paid featured placements — always disclosed via SponsoredBadge */
  sponsored?: boolean
}

export const drops: Drop[] = (generatedDrops as Drop[])
  .sort((a, b) => new Date(b.dropDate).getTime() - new Date(a.dropDate).getTime())

export function getLatestDrops(count = 3): Drop[] {
  return drops.slice(0, count)
}
