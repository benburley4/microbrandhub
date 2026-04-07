import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-stone-800 bg-stone-950 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-brand-400">⌚</span>
              <span className="font-bold text-white">MicrobrandHub</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Your guide to the world&apos;s best independent watch brands. Discover, compare and find deals.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Explore</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/brands" className="hover:text-white transition-colors">Brand Directory</Link></li>
              <li><Link href="/drops" className="hover:text-white transition-colors">Limited Drops</Link></li>
              <li><Link href="/listings" className="hover:text-white transition-colors">Listings</Link></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Browse by Category</h3>
            <ul className="space-y-2 text-sm text-stone-400">
              {['Dive', 'Field', 'Dress', 'Pilot', 'Sport'].map(cat => (
                <li key={cat}>
                  <Link href={`/brands?category=${cat}`} className="hover:text-white transition-colors">
                    {cat} Watches
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-stone-800 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} MicrobrandHub. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
