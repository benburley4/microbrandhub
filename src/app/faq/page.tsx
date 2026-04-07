import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about MicrobrandHub and microbrand watches.',
}

const faqs = [
  {
    category: 'About MicrobrandHub',
    items: [
      {
        q: 'What is MicrobrandHub?',
        a: 'MicrobrandHub is a discovery platform for independent and microbrand watches. We catalogue brands, track limited edition drops, aggregate pre-owned listings, and publish in-depth reviews and guides.',
      },
      {
        q: 'Is MicrobrandHub a shop or marketplace?',
        a: 'No. We are an information and discovery platform. We do not sell watches or facilitate transactions. All links to brand websites and pre-owned listings take you directly to the brand or seller.',
      },
      {
        q: 'Do brands pay to be listed in the directory?',
        a: 'No. Every brand in our directory is there on merit. We do not accept payment for inclusion, and brands cannot pay to improve their position in search results or filters.',
      },
      {
        q: 'Do you use affiliate links?',
        a: 'We may use affiliate links in some articles and brand pages. When we do, we disclose this clearly. Affiliate revenue helps keep the site free to use.',
      },
    ],
  },
  {
    category: 'What is a Microbrand Watch?',
    items: [
      {
        q: 'What exactly is a "microbrand"?',
        a: 'A microbrand is an independent watch company that typically sells direct to consumers, often in limited quantities, without the retail overhead of major Swiss manufacturers. They are usually small teams or even single individuals, and they often use Swiss or Japanese movements from established suppliers.',
      },
      {
        q: 'Are microbrand watches as good as Swiss luxury watches?',
        a: 'In many cases, yes. Microbrands often use the same movements as Swiss brands charging ten times the price (ETA, Sellita, Miyota), and they invest the savings into case quality, dial finishing, and design. The difference is typically heritage and brand prestige, not functional quality.',
      },
      {
        q: 'What movements do microbrand watches use?',
        a: 'The most common are: Miyota 9015 (Japanese, excellent value), Sellita SW200 (Swiss, used in many $500-$1,000 watches), ETA 2824 (Swiss, the industry standard), and NH35 (Seiko, reliable budget option). Some brands like Nomos and Christopher Ward have developed their own in-house movements.',
      },
      {
        q: 'How do I know if a microbrand is reputable?',
        a: 'Look for: clear contact information and a physical address, responsive customer service, genuine reviews on forums like r/Watches or WatchUSeek, and an active community presence. Our directory only includes brands we have verified as legitimate.',
      },
    ],
  },
  {
    category: 'Buying Advice',
    items: [
      {
        q: 'What should I look for when buying my first microbrand watch?',
        a: 'Start with: (1) movement choice — Miyota 9015 or Sellita SW200 are safe bets; (2) crystal — sapphire is strongly preferred; (3) water resistance — 100m minimum for a sports watch; (4) warranty — at least 1 year, ideally 2; (5) community reputation — search the brand on r/Watches before buying.',
      },
      {
        q: 'What is the best microbrand watch under $300?',
        a: 'For dive watches, the Phoibos Eagle Ray or Wave Master offer exceptional specifications. For field watches, the Dan Henry 1970 Field is an excellent choice. For dress watches, entry-level Baltic or Junghans pieces are worth considering.',
      },
      {
        q: 'What is the best microbrand watch between $300-$600?',
        a: 'This is the most competitive segment. The Baltic Aquascaphe and Lorier Neptune S3 are the benchmark dive watches. The Traska Venturer is the best field watch. The Serica 5303 leads the dress watch category.',
      },
      {
        q: 'Should I buy new or pre-owned?',
        a: 'Pre-owned microbrand watches can offer significant savings, especially for limited editions or discontinued references. Our Listings page aggregates pre-owned watches from Carousell and other platforms. Key tip: always verify the watch\'s authenticity and condition before purchasing, and use a payment method with buyer protection.',
      },
    ],
  },
  {
    category: 'Limited Drops',
    items: [
      {
        q: 'How do I find out about new drops?',
        a: 'Our Drops page tracks live and upcoming limited edition releases. For real-time alerts, follow the brands directly on Instagram and sign up for their newsletters — brands typically announce drops to their mailing list first.',
      },
      {
        q: 'Why do some watches sell out so quickly?',
        a: 'Popular microbrands like Halios, Ming, and Unimatic produce watches in very small quantities (50-300 pieces) and sell direct to consumers. Demand consistently outstrips supply, meaning popular pieces sell out within minutes of release.',
      },
      {
        q: 'What is a ballot system?',
        a: 'Some brands (Ming, AnOrdain) use a ballot system for highly limited pieces. Rather than first-come-first-served, buyers register their interest and the brand randomly selects winners from the pool. This prevents bots and speculators from dominating the sale.',
      },
    ],
  },
  {
    category: 'Pre-owned Listings',
    items: [
      {
        q: 'Where do the pre-owned listings come from?',
        a: 'Listings are sourced primarily from Carousell, with additional listings from eBay and other platforms. They are filtered to show only microbrand watches relevant to our directory.',
      },
      {
        q: 'How current are the listings?',
        a: 'Listings are updated automatically on a regular schedule. The "days ago" indicator on each listing shows when it was originally posted by the seller.',
      },
      {
        q: 'Is it safe to buy pre-owned watches online?',
        a: 'Always use platforms with buyer protection (PayPal Goods & Services, eBay Money Back Guarantee). Ask the seller for detailed photos, serial numbers where applicable, and any original documentation. Established microbrand watches rarely have counterfeiting issues, unlike luxury Swiss brands.',
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-stone-400">Everything you need to know about MicrobrandHub and microbrand watches.</p>
      </div>

      <div className="space-y-10">
        {faqs.map(section => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-brand-400 uppercase tracking-wider mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map(item => (
                <div key={item.q} className="bg-stone-900 border border-stone-800 rounded-xl p-6">
                  <h3 className="font-semibold text-white mb-2">{item.q}</h3>
                  <p className="text-stone-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-stone-900 border border-stone-800 rounded-xl p-6">
        <p className="text-stone-400 text-sm">
          Can't find what you're looking for?{' '}
          <Link href="/contact" className="text-brand-400 hover:text-brand-300 transition-colors">
            Get in touch
          </Link>{' '}
          and we'll do our best to help.
        </p>
      </div>
    </div>
  )
}
