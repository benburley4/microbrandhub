export interface Review {
  slug: string
  title: string
  brand: string
  brandSlug: string
  excerpt: string
  body: string
  author: string
  publishedAt: string
  readingTime: number
  tags: string[]
  rating?: number  // out of 5
}

export const reviews: Review[] = [
  {
    slug: 'baltic-aquascaphe-review',
    title: 'Baltic Aquascaphe Dual Crown: The Best Value Dive Watch?',
    brand: 'Baltic',
    brandSlug: 'baltic',
    excerpt: 'The Baltic Aquascaphe has taken the microbrand world by storm. We put it through its paces to see if it lives up to the hype.',
    body: `The Baltic Aquascaphe Dual Crown is a watch that punches well above its price point. For under $500, you get a fully lumed dial, a unidirectional rotating bezel, and a robust Miyota 9015 movement — all wrapped in a 39mm case that wears beautifully on smaller wrists.

**Design**

Baltic have done something clever with the Aquascaphe: it is unmistakably a dive watch, but the proportions and finishing give it a versatility that most tool watches lack. The sunburst dials — particularly the blue and black — catch the light in a way that feels far more expensive than the asking price.

The twin crown setup (one for time-setting, one for the screw-down crown) is practical and adds a visual distinction that makes the watch immediately recognisable.

**Movement**

The Miyota 9015 is a workhorse. It beats at 28,800bph, offers a 42-hour power reserve, and is accurate to ±10 seconds per day in our testing. Not in-house, but entirely appropriate for this price point.

**Verdict**

If you are looking for your first serious dive watch — or a versatile everyday piece — the Aquascaphe is hard to beat at this price. It is the watch that put Baltic on the map, and it deserves its reputation.`,
    author: 'Editorial Team',
    publishedAt: '2026-02-20',
    readingTime: 4,
    tags: ['Dive', 'Review', 'Baltic', 'Best Value'],
    rating: 5,
  },
  {
    slug: 'best-microbrand-dive-watches-2026',
    title: 'The Best Microbrand Dive Watches in 2026',
    brand: '',
    brandSlug: '',
    excerpt: 'From Baltic to Halios to Squale — a definitive ranking of the best independent dive watches at every price point.',
    body: `The microbrand dive watch category has never been more competitive. Whether you have $300 or $1,500 to spend, there are independent brands making pieces that rival (and sometimes surpass) the offerings from major Swiss manufacturers.

**Under $300: Phoibos Wave Master**

Phoibos has built a strong following for producing serious spec sheets at entry-level prices. The Wave Master offers 300m water resistance, a sapphire crystal, and a solid SW200 movement for under $250. It is a remarkable package.

**$300–$600: Baltic Aquascaphe or Lorier Neptune**

This is where the market gets genuinely exciting. The Baltic Aquascaphe (reviewed separately) and the Lorier Neptune S3 are neck and neck. The Baltic edges it on dial quality and lume; the Lorier wins on case finishing and its beautiful domed crystal.

**$600–$1,000: Formex Reef or Monta Oceanking**

Formex's Reef is one of the best kept secrets in the dive watch world. The floating case system is genuinely innovative, and the build quality is exceptional. Monta's Oceanking offers more traditional dive watch aesthetics with impeccable finishing.

**$1,000+: Halios Seaforth or Ginault Ocean Rover**

Halios has cult status for good reason. The Seaforth is a masterclass in considered design — nothing is superfluous, everything is exactly right. At this price point, you are paying for that refinement and the exclusivity of limited production runs.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-01',
    readingTime: 6,
    tags: ['Dive', 'Roundup', 'Buying Guide'],
    rating: undefined,
  },
  {
    slug: 'nomos-orion-review',
    title: 'Nomos Orion 33: Bauhaus Perfection in a Small Package',
    brand: 'Nomos',
    brandSlug: 'nomos',
    excerpt: 'The Nomos Orion 33 is a masterpiece of minimalist design. Can the in-house Alpha movement justify the price premium over the competition?',
    body: `Nomos Glashütte is often cited as the entry point to true German watchmaking, and the Orion 33 makes a compelling case for that claim.

**Design**

The dial is a study in Bauhaus restraint. White lacquer, applied indices, slender leaf hands. There is nothing here that does not need to be here — and that discipline is what makes it extraordinary. At 33mm, the Orion wears small by modern standards, but the proportions are perfect: it never feels dainty.

**Movement**

The Alpha manual-wind movement is what elevates the Nomos above its competition. It is produced entirely in Glashütte, decorated with Nomos's distinctive swing system, and a genuine pleasure to wind. The skeletonised rotor (in the automatic models) or the transparent caseback in manual-wind references rewards the owner who appreciates watchmaking craft.

**Value**

At roughly $1,500 new, the Orion is more expensive than most microbrands in this guide. But it offers something genuinely different: an in-house movement from a proper German manufacture. If that matters to you — and it should — the premium is justified.`,
    author: 'Editorial Team',
    publishedAt: '2026-01-15',
    readingTime: 5,
    tags: ['Dress', 'Review', 'Nomos', 'German'],
    rating: 5,
  },
  {
    slug: 'getting-started-microbrand-watches',
    title: 'A Beginner\'s Guide to Microbrand Watches',
    brand: '',
    brandSlug: '',
    excerpt: 'New to the world of independent watch brands? Here is everything you need to know before buying your first microbrand watch.',
    body: `The term "microbrand" describes independent watch companies that typically sell direct to consumers, often in limited quantities, without the retail overhead of major Swiss houses. The result: exceptional watches at prices that major brands cannot match.

**What makes a microbrand?**

There is no formal definition, but microbrands typically share a few characteristics: they are small, independent, and direct-to-consumer. Many use Swiss or Japanese movements from established manufacturers like ETA, Sellita, or Miyota, then invest their budgets in case quality, dial work, and design rather than movement development.

**Where to start**

The entry level — under $300 — is more competitive than ever. Brands like Dan Henry and Phoibos produce watches that would have seemed impossible at these prices a decade ago.

If you can stretch to $300–$600, the choice becomes almost overwhelming: Baltic, Lorier, Nodus, Squale, and many more are all producing genuinely excellent watches.

**What to look for**

Focus on: movement choice (Swiss movements command a premium, Japanese movements offer excellent value), case material and finishing (brushed vs. polished, and how consistently it is executed), and sapphire vs mineral crystals (sapphire is strongly preferred for scratch resistance).

**Community**

The microbrand community is one of the friendliest in horology. r/Watches, r/Watchexchange, and dedicated forums like WatchUSeek are excellent places to learn and get recommendations.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-10',
    readingTime: 7,
    tags: ['Guide', 'Beginner', 'Buying Advice'],
    rating: undefined,
  },
]

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find(r => r.slug === slug)
}

export const allTags = [...new Set(reviews.flatMap(r => r.tags))].sort()
