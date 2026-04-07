import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-storm bg-midnight mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="14" cy="14" r="11.5" stroke="#B8FF6E" strokeWidth="1.5"/>
                <circle cx="14" cy="14" r="9" stroke="#B8FF6E" strokeWidth="0.5"/>
                <line x1="14" y1="5.5" x2="14" y2="7" stroke="#B8FF6E" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="14" y1="14" x2="14" y2="8.5" stroke="#E8E4DC" strokeWidth="1.2" strokeLinecap="round"/>
                <line x1="14" y1="14" x2="18.5" y2="16.5" stroke="#E8E4DC" strokeWidth="1" strokeLinecap="round"/>
                <circle cx="14" cy="14" r="1" fill="#B8FF6E"/>
              </svg>
              <span className="font-display font-bold text-archive">MicrobrandHub</span>
            </div>
            <p className="text-silver text-sm leading-relaxed mb-3">
              The definitive guide to independent watchmaking. Curated by collectors — accountable to no brand.
            </p>
            <p className="font-mono text-xs text-storm tracking-wide">0 paid inclusions · always.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-archive uppercase tracking-widest mb-4">Directory</h3>
            <ul className="space-y-2 text-sm text-silver">
              <li><Link href="/brands" className="hover:text-archive hover:text-lume transition-colors">Brand Directory</Link></li>
              <li><Link href="/drops" className="hover:text-archive transition-colors">Limited Drops</Link></li>
              <li><Link href="/listings" className="hover:text-archive transition-colors">Listings</Link></li>
              <li><Link href="/reviews" className="hover:text-archive transition-colors">Reviews</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-archive uppercase tracking-widest mb-4">About</h3>
            <ul className="space-y-2 text-sm text-silver">
              <li><Link href="/about" className="hover:text-archive transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="hover:text-archive transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-archive transition-colors">Contact</Link></li>
              {['Dive', 'Field', 'Dress', 'Pilot'].map(cat => (
                <li key={cat}>
                  <Link href={`/brands?category=${cat}`} className="hover:text-archive transition-colors">
                    {cat} Watches
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-storm flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-mono text-xs text-storm tracking-wide">
            © {new Date().getFullYear()} MicrobrandHub · The Independent Watch Authority
          </p>
          <p className="font-mono text-xs text-storm tracking-wide">
            Every Independent Watch. One Trusted Source.
          </p>
        </div>
      </div>
    </footer>
  )
}
