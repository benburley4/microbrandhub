'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/brands', label: 'Brands' },
  { href: '/watches', label: 'Models' },
  { href: '/drops', label: 'Drops' },
  { href: '/listings', label: 'Listings' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
]

function WatchIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="14" cy="14" r="11.5" stroke="#B8FF6E" strokeWidth="1.5"/>
      <circle cx="14" cy="14" r="9" stroke="#B8FF6E" strokeWidth="0.5"/>
      <line x1="14" y1="5.5" x2="14" y2="7" stroke="#B8FF6E" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="14" x2="14" y2="8.5" stroke="#E8E4DC" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="14" y1="14" x2="18.5" y2="16.5" stroke="#E8E4DC" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="14" cy="14" r="1" fill="#B8FF6E"/>
    </svg>
  )
}

export default function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-midnight/85 backdrop-blur border-b border-storm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <WatchIcon />
            <span className="font-display font-bold text-lg tracking-tight text-archive group-hover:text-lume transition-colors">
              MicrobrandHub
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-colors relative ${
                  pathname.startsWith(href)
                    ? 'text-lume'
                    : 'text-silver hover:text-archive'
                }`}
              >
                {label}
                {pathname.startsWith(href) && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-lume rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Subscribe CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="#newsletter" className="btn-secondary text-xs py-2 px-4">
              Subscribe
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded text-silver hover:text-archive hover:bg-storm transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden py-3 border-t border-storm flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                onClick={() => setMenuOpen(false)}
                href={href}
                className={`px-4 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors ${
                  pathname.startsWith(href)
                    ? 'text-lume'
                    : 'text-silver hover:text-archive'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
