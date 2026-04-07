import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'MicrobrandHub — Every Independent Watch. One Trusted Source.',
    template: '%s | MicrobrandHub',
  },
  description: 'The definitive guide to independent watchmaking. 93+ brands, 20 countries, curated by collectors — accountable to no brand.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
