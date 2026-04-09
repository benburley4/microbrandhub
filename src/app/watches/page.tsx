import { Suspense } from 'react'
import type { Metadata } from 'next'
import { watches, watchBrands, watchDialColors, watchMovements } from '@/data/watches'
import WatchesClient from './WatchesClient'

export const metadata: Metadata = {
  title: 'Watch Models',
  description: `Browse ${watches.length}+ individual watch models from independent microbrand watchmakers. Filter by brand, price, size, dial colour and availability.`,
}

export default function WatchesPage() {
  const available = watches.filter(w => w.availability === 'available').length
  const brands    = watches.length > 0 ? [...new Set(watches.map(w => w.brandName))].length : 0

  return (
    <div className="bg-midnight min-h-screen">
      {/* Header */}
      <div className="border-b border-storm bg-slate/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-display font-bold text-archive mb-2">Watch Models</h1>
          <p className="text-silver mb-4">
            Every model from every brand — filterable by size, price, colour and availability.
          </p>
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="font-mono text-lume text-xl font-medium">{watches.length.toLocaleString()}</span>
              <span className="font-mono text-xs text-silver tracking-widest uppercase ml-2">Total Models</span>
            </div>
            <div>
              <span className="font-mono text-lume text-xl font-medium">{available.toLocaleString()}</span>
              <span className="font-mono text-xs text-silver tracking-widest uppercase ml-2">Available Now</span>
            </div>
            <div>
              <span className="font-mono text-lume text-xl font-medium">{brands}</span>
              <span className="font-mono text-xs text-silver tracking-widest uppercase ml-2">Brands</span>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-silver font-mono text-xs tracking-widest">LOADING...</div>}>
        <WatchesClient
          watches={watches}
          brandNames={watchBrands}
          dialColors={watchDialColors}
          movements={watchMovements}
        />
      </Suspense>
    </div>
  )
}
