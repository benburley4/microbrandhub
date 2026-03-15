// Listings data type — populated by importing from microsearch.py Excel output
export interface Listing {
  id: string
  brand: string
  title: string
  price: number
  currency: string
  condition: 'New' | 'Like New' | 'Good' | 'Fair'
  platform: 'Carousell' | 'eBay' | 'Other'
  location: string
  url: string
  postedAt: string  // ISO date string
  imageUrl?: string
}

// Sample listings — replace with data imported from your microsearch.py Excel output
export const listings: Listing[] = [
  {
    id: '1',
    brand: 'Baltic',
    title: 'Baltic Aquascaphe Dual Crown – Blue Sunray Dial',
    price: 380,
    currency: 'USD',
    condition: 'Like New',
    platform: 'Carousell',
    location: 'Hong Kong',
    url: 'https://carousell.com',
    postedAt: '2026-03-10',
  },
  {
    id: '2',
    brand: 'Lorier',
    title: 'Lorier Neptune S3 – Matte Black',
    price: 290,
    currency: 'USD',
    condition: 'Good',
    platform: 'Carousell',
    location: 'Hong Kong',
    url: 'https://carousell.com',
    postedAt: '2026-03-08',
  },
  {
    id: '3',
    brand: 'Formex',
    title: 'Formex Essence ThirtyNine – Silver Dial, Leather Strap',
    price: 750,
    currency: 'USD',
    condition: 'Like New',
    platform: 'Carousell',
    location: 'Singapore',
    url: 'https://carousell.com',
    postedAt: '2026-03-05',
  },
  {
    id: '4',
    brand: 'Nomos',
    title: 'Nomos Orion 33 – White Dial, Manual Wind',
    price: 1100,
    currency: 'USD',
    condition: 'Good',
    platform: 'Carousell',
    location: 'Hong Kong',
    url: 'https://carousell.com',
    postedAt: '2026-03-01',
  },
  {
    id: '5',
    brand: 'Squale',
    title: 'Squale 1521 – Black Dial, 50 Atmos',
    price: 420,
    currency: 'USD',
    condition: 'New',
    platform: 'Carousell',
    location: 'Hong Kong',
    url: 'https://carousell.com',
    postedAt: '2026-02-28',
  },
  {
    id: '6',
    brand: 'Yema',
    title: 'Yema Superman Heritage – Blue Dial',
    price: 340,
    currency: 'USD',
    condition: 'Like New',
    platform: 'Carousell',
    location: 'Singapore',
    url: 'https://carousell.com',
    postedAt: '2026-02-25',
  },
]

export const listingBrands = [...new Set(listings.map(l => l.brand))].sort()
export const listingPlatforms = [...new Set(listings.map(l => l.platform))].sort()
export const listingConditions = ['New', 'Like New', 'Good', 'Fair'] as const
