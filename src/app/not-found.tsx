import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
      <div className="text-6xl mb-6">⌚</div>
      <h1 className="text-4xl font-bold text-white mb-4">Page not found</h1>
      <p className="text-stone-400 mb-8">This page doesn&apos;t exist or has been moved.</p>
      <div className="flex justify-center gap-3">
        <Link href="/" className="btn-primary">Go Home</Link>
        <Link href="/brands" className="btn-secondary">Browse Brands</Link>
      </div>
    </div>
  )
}
