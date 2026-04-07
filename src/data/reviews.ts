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
  // TODO: replace placehold.co URLs with real photography
  featuredImage?: string
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
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Baltic+Aquascaphe',
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
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Best+Dive+Watches+2026',
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
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Nomos+Orion+33',
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
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Microbrand+Guide',
  },
  {
    slug: 'lorier-neptune-s3-review',
    title: 'Lorier Neptune S3: New York Soul in a 38mm Case',
    brand: 'Lorier',
    brandSlug: 'lorier',
    excerpt: 'The Neptune S3 refines an already beloved formula with an upgraded movement and a dome crystal that belongs on a watch twice the price.',
    body: `Lorier has quietly become one of the most respected names in the $300–$600 dive watch segment, and the Neptune S3 is the clearest expression yet of what the New York brand does best.

## Design

At 38mm, the Neptune wears like a vintage piece from the 1960s — the proportions are deliberate, almost provocative in an era of 42mm dive watches. The domed acrylic crystal adds to the retro charm, catching light at angles that a flat sapphire never could. Dial printing is crisp and the applied indices are well-centred, with generous lume plots that glow deep green in the dark.

## Movement

The S3 ships with the Miyota 9015, an upgrade over the NH35 in earlier models. You gain a higher beat rate (28,800bph vs 21,600bph), a smoother sweep, and better accuracy straight from the box. Lorier rates it to ±10 seconds per day; our test sample ran at +3 spd consistently over two weeks.

## Lume

BGW9 Super-LumiNova on the dial and hands. The glow is bright and long-lasting — not quite Borealis levels, but comfortably above average for the price. The bezel pip is also lumed, a detail many brands skip.

## Value

At around $350, the Neptune S3 competes directly with the Baltic Aquascaphe. It is a close call: the Baltic has a slight edge in dial variety; the Lorier wins on the dome crystal and case finishing. Both are exceptional at the price.

## Verdict

The Neptune S3 is one of the best buys in independent watchmaking. If you want a vintage-spirit dive watch that wears comfortably and looks brilliant, this belongs at the top of your shortlist.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-15',
    readingTime: 5,
    tags: ['Dive', 'Review', 'Lorier', 'Best Value'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Lorier+Neptune+S3',
  },
  {
    slug: 'traska-venturer-review',
    title: 'Traska Venturer: The Field Watch That Does Everything',
    brand: 'Traska',
    brandSlug: 'traska',
    excerpt: 'San Francisco\'s Traska turns out a field watch with dive-watch durability and dress-watch finishing. The Venturer is quietly one of the best all-rounders in the game.',
    body: `The Traska Venturer occupies a rare niche: a field watch with 200m water resistance, a screw-down crown, and finishing that would embarrass watches at twice the price.

## Design

The 39mm case is slightly cushion-shaped, with a combination of brushed and polished surfaces that Traska executes with unusual consistency. The dial is clean — hour markers, hands, and a date window at 3 o'clock. Nothing unnecessary. Available in matte black, warm grey, and a striking forest green that has become the brand's signature.

## Movement

A Miyota 9015 sits inside, regulated and tested by Traska before shipping. The brand's customer service reputation is excellent, and they back every watch with a two-year warranty that they actually honour — a rarity in the microbrand world.

## Lume

Full BGW9 LumiNova application on dial and hands. In our testing it was one of the brighter applications in this price range, with a warm blue-green glow that fades slowly over several hours.

## Value

At $550, the Venturer is not cheap for a field watch. But the finishing quality, the 200m rating, and the combination of field watch versatility with dive watch durability make it genuinely hard to find a better buy in this category.

## Verdict

If you want one watch that can do everything — from office to ocean to outdoor adventure — the Venturer is one of the most convincing answers in the microbrand space.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-22',
    readingTime: 5,
    tags: ['Field', 'Dive', 'Review', 'Traska'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Traska+Venturer',
  },
  {
    slug: 'phoibos-eagle-ray-review',
    title: 'Phoibos Eagle Ray: Sub-$250 and Embarrassingly Good',
    brand: 'Phoibos',
    brandSlug: 'phoibos',
    excerpt: 'At under $250, the Phoibos Eagle Ray offers 300m water resistance, a sapphire crystal, and a solid automatic movement. We investigate whether the corners have been cut.',
    body: `Phoibos has built a reputation for offering specifications that major brands charge three times as much for. The Eagle Ray is their most accomplished dive watch, and its spec sheet reads like a joke.

## Design

The Eagle Ray is a 45mm beast — not for small wrists. The case is substantial but wears closer to 43mm on the wrist thanks to short lugs. The unidirectional bezel is smooth and precise, and the dial is available in blue, black, and a striking red that channels the spirit of vintage 1970s dive watches.

## Movement

The Seagull SH21 automatic is a Chinese-made movement that has improved substantially in recent years. It beats at 28,800bph, hacks, and hand-winds — ticking all the boxes. Accuracy in our testing was ±8 seconds per day, which is perfectly respectable.

## Lume

BGW9 LumiNova, generously applied. The lume plots are large and the glow is strong. At this price, the lume application is impressive and genuinely functional for diving.

## Value

For under $250, nothing comes close to matching the Eagle Ray's specification. A sapphire crystal alone typically costs $50–$100 to replace in the field, and Phoibos includes it from the factory. If you want to try the dive watch genre without spending real money, this is the obvious starting point.

## Verdict

The Eagle Ray will surprise anyone coming from fashion watch brands. It is a real dive watch at a price that makes entry into the hobby completely accessible.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-28',
    readingTime: 4,
    tags: ['Dive', 'Review', 'Phoibos', 'Budget'],
    rating: 4,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Phoibos+Eagle+Ray',
  },
  {
    slug: 'monta-noble-review',
    title: 'Monta Noble: Swiss-Made Excellence at an Independent Price',
    brand: 'Monta',
    brandSlug: 'monta',
    excerpt: 'The Monta Noble combines a Swiss ETA movement, double-domed sapphire, and finishing that punches well into the $1,500+ bracket — for under $900.',
    body: `Monta has positioned itself at the top of the accessible Swiss-made segment, and the Noble is the watch that justifies that ambition.

## Design

The Noble is a 39mm sport watch that wears closer to a dress watch — slim, elegant, with a lacquered dial and applied hour markers. The case finishing is a combination of polished and brushed surfaces, executed to a standard that prompted our reviewer to reach for a loupe. Under magnification, the transitions are clean and consistent.

## Movement

The ETA 2824-2 powers the Noble. It is not exciting, but it is reliable, well-supported, and beats at 28,800bph. Crucially, it is Swiss-made — a detail that still matters to many buyers and that justifies part of the Noble's premium over Japanese-movement competitors.

## Lume

Super-LumiNova BGW9. The application is clean and even, with no pooling at the edges of the plots. The glow is strong at activation and holds well over several hours.

## Value

At approximately $850, the Noble is not cheap. But it compares favourably with Christopher Ward at a similar price, and the finishing quality arguably exceeds that of some Swiss brands charging considerably more.

## Verdict

If Swiss-made matters to you and you are shopping in the $600–$1,000 bracket, the Noble belongs at the top of your shortlist. It is one of the most polished watches (literally and figuratively) that this price range has to offer.`,
    author: 'Editorial Team',
    publishedAt: '2026-04-01',
    readingTime: 5,
    tags: ['Sport', 'Dress', 'Review', 'Monta', 'Swiss'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Monta+Noble',
  },
  {
    slug: 'halios-seaforth-review',
    title: 'Halios Seaforth: The Dive Watch for People Who Have Seen Everything',
    brand: 'Halios',
    brandSlug: 'halios',
    excerpt: 'Jason Lim\'s Canadian brand has achieved cult status for good reason. The Seaforth is what happens when a watchmaker obsesses over every detail for years before releasing a product.',
    body: `Halios watches are difficult to buy. They sell out quickly, often before most people have heard they were released. The Seaforth is the reason the brand has the following it does.

## Design

The Seaforth is 38.5mm with a 47.5mm lug-to-lug — compact dimensions that wear beautifully on a wide range of wrist sizes. The dial is refined to the point of minimalism: circular hour track, broad leaf hands, and lume plots that are large enough to be functional without cluttering the clean dial. The double-domed sapphire crystal curves away from the dial in a way that adds depth and a vintage quality that is hard to quantify but immediately apparent.

## Movement

An ETA 2824-2 in early references, moving to a Sellita SW200 in more recent production. Both are Swiss automatic movements that offer reliable performance. The movement is not the point of the Seaforth — the point is everything around it.

## Lume

BGW9 full lume on dial and hands. The application is exceptional — perfectly even, with sharp edges on every plot. Under UV it glows a vivid blue-green, and the charge holds for hours.

## Value

The Seaforth retails for approximately $750–$800 when available. On the secondary market it frequently sells for more. That premium reflects the combination of build quality, considered design, and the scarcity that comes from Halios's limited production runs.

## Verdict

The Seaforth is not for everyone — it is too small for some wrists, too understated for others. But for the buyer who appreciates considered design and exceptional execution, it is one of the best dive watches ever made at any price.`,
    author: 'Editorial Team',
    publishedAt: '2026-04-05',
    readingTime: 6,
    tags: ['Dive', 'Review', 'Halios', 'Cult'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Halios+Seaforth',
  },
  {
    slug: 'formex-essence-review',
    title: 'Formex Essence: The Watch Engineers Would Design',
    brand: 'Formex',
    brandSlug: 'formex',
    excerpt: 'The Formex Essence features a patented floating case suspension system that absorbs shocks and self-levels. It is also one of the best-looking watches under $1,000.',
    body: `Swiss brand Formex approaches watch design from an engineering perspective, and the result is a watch that feels genuinely innovative rather than derivative.

## Design

The Essence is a 39mm three-hand watch with a clean, sports-oriented dial. What makes it unusual is the floating case system: the case is mounted on a suspension system that allows it to move slightly relative to the lugs, absorbing shocks and self-levelling on the wrist. It sounds gimmicky until you wear it — the comfort improvement over a conventional case is real and immediately noticeable.

## Movement

The Essence uses the Sellita SW200-1, a Swiss automatic beating at 28,800bph with a 38-hour power reserve. Formex regulates every movement in-house before shipping, and accuracy claims of ±4 seconds per day are consistently met in practice.

## Lume

Luminova on all indices and hands. The application is neat and functional. Not the brightest application we have tested, but adequate for all practical purposes.

## Value

At around $700, the Essence offers Swiss manufacture, genuine innovation in the case engineering, and exceptional build quality. The floating case alone justifies the modest premium over similarly-priced competitors.

## Verdict

The Formex Essence is a watch for buyers who want something different — not different for its own sake, but different in a way that improves the wearing experience. It is one of the most technically interesting watches in the microbrand space.`,
    author: 'Editorial Team',
    publishedAt: '2026-04-06',
    readingTime: 5,
    tags: ['Sport', 'Review', 'Formex', 'Swiss', 'Innovation'],
    rating: 4,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Formex+Essence',
  },
  {
    slug: 'christopher-ward-c63-review',
    title: 'Christopher Ward C63 Sealander: British Value at Its Best',
    brand: 'Christopher Ward',
    brandSlug: 'christopher-ward',
    excerpt: 'CW\'s C63 Sealander packs an in-house Calibre SH21 into a beautifully proportioned 40mm case — all for under £800. It may be the best value Swiss-movement watch on the market.',
    body: `Christopher Ward has spent two decades quietly becoming one of Britain's most credible watch brands. The C63 Sealander is its most compelling argument yet.

## Design

The Sealander is 40mm with a 47mm lug-to-lug — compact enough to avoid the "oversized dive watch" cliché while still reading clearly on the wrist. Available in navy blue, racing green, and a classic black, each dial option is well-executed with clean printing and generous lume plots. The integrated jubilee bracelet is a highlight: it's comfortable from the box and finished to a level that surprises given the price.

## Movement

The real talking point is the in-house Calibre SH21 — a movement designed and assembled at CW's Maidenhead facility. It beats at 28,800bph, offers a 60-hour power reserve, and comes rated to ±2 seconds per day. In our testing, our sample ran at +1 spd consistently. That's co-axial territory.

## Build Quality

Sapphire crystal with anti-reflective coating, 150m water resistance, and a screw-down crown. The finishing is consistent across brushed and polished surfaces. For the price, it's genuinely impressive.

## Value

At roughly £750–800, the Sealander is not cheap. But compared with Swiss brands charging £1,500+ for equivalent movements and build quality, it represents exceptional value. CW's direct-to-consumer model cuts out the retail markup.

## Verdict

The C63 Sealander is a landmark watch. In-house movement, excellent finishing, and British design sensibility at an accessible price. One of the strongest value propositions in independent watchmaking.`,
    author: 'Editorial Team',
    publishedAt: '2026-02-10',
    readingTime: 5,
    tags: ['Sport', 'Dive', 'Review', 'Christopher Ward', 'British', 'In-House'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Christopher+Ward+C63',
  },
  {
    slug: 'best-microbrand-field-watches-2026',
    title: 'The Best Microbrand Field Watches in 2026',
    brand: '',
    brandSlug: '',
    excerpt: 'From Traska to Marathon to Damasko — a definitive ranking of the best independent field watches at every price point.',
    body: `The field watch category has seen a renaissance in recent years, driven by microbrands that understand what the genre demands: legibility, durability, and versatility.

## Under $300: Dan Henry 1970 Field

Dan Henry's vintage-inspired field watch packs 1960s military aesthetics into an affordable package. The matte dial with luminous numerals is immediately legible, and the NH35 movement is reliable and serviceable. An exceptional entry point.

## $300–$600: Traska Venturer

Already reviewed in depth, the Venturer remains our top pick in this segment. The combination of 200m water resistance, Miyota 9015, and exceptional finishing at this price point is unmatched.

## $300–$600 (Runner Up): Boldr Journey

The Singapore brand's Journey offers a more organic, adventure-focused aesthetic than the Venturer. Its curved lugs and textured dial give it character, and the Sellita SW200 movement is well-regulated out of the box.

## $600–$1,000: Marathon GSAR

Marathon supplies field watches to NATO and other military organisations, and the GSAR shows why. Swiss ETA movement, tritium lume tubes that never need charging, and a case that could survive a war zone. The ultimate tool watch.

## $1,000+: Damasko DA46

Damasko's hardened steel case is genuinely unique — it resists scratching to a degree that feels almost supernatural. The movement is a regulated ETA 7750. Not pretty, but indestructible.

## Verdict

For most buyers, the Traska Venturer remains the benchmark in the field watch category. Those who prioritise toughness above all else should look seriously at Marathon or Damasko.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-05',
    readingTime: 6,
    tags: ['Field', 'Roundup', 'Buying Guide'],
    rating: undefined,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Best+Field+Watches+2026',
  },
  {
    slug: 'serica-5303-review',
    title: 'Serica 5303: The French Dress Watch That Punches at Twice the Price',
    brand: 'Serica',
    brandSlug: 'serica',
    excerpt: 'The Serica 5303 is a study in quiet confidence — lacquered dials, a slim profile, and finishing that invites comparison with brands charging £2,000 more.',
    body: `Paris-based Serica has built a devoted following for watches that look and feel more expensive than they are. The 5303 is the brand's most refined expression of that philosophy.

## Design

The 5303 is 38mm in diameter and just 10.5mm thick — slim enough to disappear under a shirt cuff. The lacquered dial comes in ivory, champagne, and midnight blue, each with applied indices and elegant leaf hands. There's a sunburst finishing beneath the indices that catches the light in a way photographs can't capture.

## Movement

A Sellita SW200-1 powers the 5303. It's Swiss, reliable, and ticks at 28,800bph — appropriate for a watch at this price. Serica has regulated each movement to ±5 seconds per day, and our test sample performed to that standard consistently.

## Finishing

This is where Serica earns its reputation. The case has polished bevels, brushed flanks, and chamfered lugs that all meet cleanly. For a watch under £800, the attention to detail is exceptional.

## Value

At roughly £650–750, the 5303 competes with the Nomos Club and lower-end Junghans pieces. It holds its own confidently, and the lacquered dial quality arguably surpasses both.

## Verdict

The Serica 5303 is one of the best dressed watches at under £800. If you want French elegance without Swiss manufacture pricing, it belongs at the top of your shortlist.`,
    author: 'Editorial Team',
    publishedAt: '2026-01-28',
    readingTime: 4,
    tags: ['Dress', 'Review', 'Serica', 'French'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Serica+5303',
  },
  {
    slug: 'best-microbrand-pilot-watches-2026',
    title: 'The Best Microbrand Pilot Watches in 2026',
    brand: '',
    brandSlug: '',
    excerpt: 'Aviation-inspired watches from Laco, Dekla, and Sinn — the best microbrands in the pilot watch segment, ranked by price.',
    body: `Pilot watches demand a specific set of qualities: maximum legibility, high contrast dials, large crown for gloved operation, and accuracy. These brands deliver all of it.

## Under $300: Enoksen E01 Flight

Enoksen's E01 is a clean, legible pilot watch with a slim profile and Miyota movement. The white-on-black dial prints are sharp and the arabic numerals are generously sized. For entry-level pilot watches, it's hard to fault.

## $300–$600: Laco Augsburg

Germany's Laco has been making pilot watches since 1925, and the Augsburg carries that heritage with confidence. The Type A dial (hours in arabic numerals, minutes as dots) and the oversized crown are proper Flieger details. Swiss movement, German heritage.

## $300–$600 (Runner Up): Dekla DK45

Dekla revives Glashütte's pilot watchmaking tradition with Baltic-inspired dial layouts. The DK45 has an unusual vertically integrated subsidiary seconds dial that feels genuinely distinctive without being gimmicky.

## $600–$1,000: Stowa Flieger Original

The Stowa Flieger is possibly the most historically authentic pilot watch available from any brand. Based on WWII German Luftwaffe specifications, the original dial layout and oversized crown are perfectly executed. Swiss ETA movement, German design rigour.

## $1,000+: Sinn 756

Sinn's 756 is an instrument. Tegimented steel, argon-filled case to prevent fogging, and a Sellita movement rated to −10°C to +60°C. The dial is a masterclass in functional design. Not a fashion watch — a tool.

## Verdict

For those entering the pilot watch category, the Laco Augsburg offers the best combination of heritage and value. Enthusiasts who want the real thing should save for a Sinn.`,
    author: 'Editorial Team',
    publishedAt: '2026-02-15',
    readingTime: 6,
    tags: ['Pilot', 'Roundup', 'Buying Guide', 'German'],
    rating: undefined,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Best+Pilot+Watches+2026',
  },
  {
    slug: 'boldr-journey-automatic-review',
    title: 'Boldr Journey Automatic: Adventure Spec, City Soul',
    brand: 'Boldr',
    brandSlug: 'boldr',
    excerpt: 'Singapore\'s Boldr makes watches built for the outdoors, but the Journey Automatic is surprisingly versatile — equally at home in the office as on the trail.',
    body: `Boldr is a Singapore-based brand with an outdoor-adventure focus, but the Journey Automatic is more refined than its rugged positioning might suggest.

## Design

The Journey is 40mm with an organic, curved case that traces the shape of the wrist. The dial is textured — a matte finish with raised applied indices — giving it a warmth and depth that flat dials lack. Available in earth tones: sand, forest green, and slate grey. All are understated enough for everyday wear.

## Movement

A Sellita SW200-1, well-regulated by Boldr before shipping. In our testing, the watch ran at +4 seconds per day — well within spec. The caseback is see-through, and the movement presentation is clean.

## Water Resistance

Rated to 200m — meaningfully overbuilt for a field watch and sufficient for recreational diving. The screw-down crown adds to the rugged credentials.

## Value

At around $480–520, the Journey is priced fairly for what it offers. Comparable Swiss-movement watches from European brands typically cost 30–40% more.

## Verdict

The Boldr Journey Automatic is a quietly excellent field watch with genuine outdoor credentials and everyday versatility. If your life takes you from city to countryside, it's one of the best companions you can find at this price.`,
    author: 'Editorial Team',
    publishedAt: '2026-02-05',
    readingTime: 4,
    tags: ['Field', 'Sport', 'Review', 'Boldr'],
    rating: 4,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Boldr+Journey+Automatic',
  },
  {
    slug: 'microbrand-watch-movements-guide',
    title: 'Watch Movements Explained: From NH35 to In-House',
    brand: '',
    brandSlug: '',
    excerpt: 'Not sure what movement to look for in your next microbrand purchase? This guide breaks down every major movement from Miyota to Sellita to ETA — and explains what you\'re actually paying for.',
    body: `When buying a microbrand watch, the movement question comes up constantly. Here's everything you need to know.

## Japanese Movements

**Miyota 9015** — The most popular movement in the sub-$600 segment. Made by Citizen's movement division, it beats at 28,800bph, hacks, and hand-winds. Accurate to ±10 seconds per day. Used by Baltic, Lorier, Traska, Nodus, and dozens more. An excellent choice.

**NH35 (Seiko)** — Seiko's workhorse automatic. Lower beat rate (21,600bph), slightly less smooth sweep, but extremely reliable and cheap to service. Found in most sub-$300 watches. Perfectly adequate.

**Seagull (Chinese)** — Used primarily by Chinese microbrands like Phoibos. Quality has improved substantially. The SH21 in particular is a solid movement at the price.

## Swiss Movements

**Sellita SW200-1** — The Swiss alternative to the ETA 2824. Beats at 28,800bph, hacks, hand-winds. Used by Formex, Serica, Boldr, and others in the $500-$800 range. Equivalent to ETA in every meaningful way.

**ETA 2824-2** — The original workhorse Swiss automatic. Reliable, well-supported, widely serviced. Found in Halios, early Monta, and countless others.

**ETA 7750** — A Swiss automatic chronograph movement. Robust and well-regarded. Found in higher-end microbrand chronographs.

## In-House Movements

**Nomos Alpha/Epsilon** — Produced entirely in Glashütte. The Alpha manual-wind is beautiful to operate and a genuine piece of watchmaking craft.

**Christopher Ward Calibre SH21** — CW's own movement, offering 60-hour power reserve and ±2 seconds per day accuracy at a remarkable price point.

## What Should You Buy?

- **Budget ($150-$300):** NH35 or Miyota 8215. Reliable, serviceable, proven.
- **Mid-range ($300-$600):** Miyota 9015. Upgrade over NH35 at a modest cost premium.
- **Upper mid-range ($600-$1,000):** Sellita SW200 or ETA 2824. Swiss quality, long service intervals.
- **Premium ($1,000+):** In-house or top-tier Swiss. Worth it if the movement matters to you.

The honest truth: all of the above will run reliably for decades with proper servicing. The movement choice matters less than the brand's customer service and warranty support.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-18',
    readingTime: 8,
    tags: ['Guide', 'Movements', 'Buying Advice', 'Technical'],
    rating: undefined,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Watch+Movements+Guide',
  },
  {
    slug: 'nodus-trieste-ii-review',
    title: 'Nodus Trieste II: The Dive Watch for the Detail-Obsessed',
    brand: 'Nodus',
    brandSlug: 'nodus',
    excerpt: 'Canadian brand Nodus has gained a cult following for its obsessive attention to finishing detail. The Trieste II is their most accomplished watch yet.',
    body: `Nodus is a Canadian microbrand with a reputation for dial and finishing quality that far exceeds expectations at the price. The Trieste II is the proof of that reputation.

## Design

The Trieste II is 40mm with a 47.5mm lug-to-lug. The dial is where Nodus earns its following: sunburst finish, applied indices with neat lume fills, and a printed chapter ring that is razor-sharp. Available in black, blue, and a distinctive burgundy that stands out in the crowded dive watch market.

## The Bezel

The 120-click unidirectional bezel is one of the best in this price range. The clicks are firm and evenly spaced, with no backplay. The ceramic insert is scratch-resistant and the printing is clean. This is a detail that cheaper dive watches consistently get wrong; Nodus has nailed it.

## Movement

NH35 movement, regulated by Nodus before shipping. Our sample ran at +6 seconds per day — respectable for an NH35. The movement beats at 21,600bph, which some buyers notice as a slightly choppy sweep compared to higher-frequency movements.

## Value

At $430, the Trieste II is strong value for the finishing quality on offer. The bezel alone is worth the premium over similarly priced alternatives.

## Verdict

If finishing quality is your primary criterion for a dive watch at this price, the Trieste II deserves serious consideration. Nodus delivers a level of refinement that should cost considerably more.`,
    author: 'Editorial Team',
    publishedAt: '2026-01-20',
    readingTime: 4,
    tags: ['Dive', 'Review', 'Nodus', 'Canadian'],
    rating: 4,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Nodus+Trieste+II',
  },
  {
    slug: 'watch-strap-guide-2026',
    title: 'The Complete Microbrand Watch Strap Guide',
    brand: '',
    brandSlug: '',
    excerpt: 'The right strap transforms a watch. This guide covers every strap material — from FKM rubber to horween leather — and which microbrands use them best.',
    body: `One of the greatest advantages of the microbrand world is strap variety. Here's how to navigate it.

## Rubber & FKM

FKM (Fluorocarbon rubber) is the premium rubber strap material — it resists sweat, sunscreen, and salt water far better than silicone. Christopher Ward, Traska, and Formex all offer excellent FKM straps. For a dive or sports watch, FKM is the best everyday choice.

## Leather

Full-grain leather is ideal for dress watches. Look for brands using Horween (USA), Serapian (Italy), or French calfskin leather. Serica offers excellent French calfskin straps from the factory. For casual wear, vintage-look rally straps from brands like Baltic add character.

## Mesh / Milanese

Stainless steel mesh straps work particularly well with vintage-inspired watches. Baltic's mesh bracelet on the HMS is often cited as the best factory mesh strap in the microbrand segment.

## NATO & Fabric

NATO straps are indestructible and easy to swap. The James Brand and Studio Underd0g both offer excellent proprietary fabric straps with their watches. Great for casual and outdoor watches.

## Bracelet

Full metal bracelets are difficult to do well at microbrand prices. Halios, Christopher Ward, and Monta are consistently cited as having the best factory bracelets under $1,000. Lorier's integrated bracelet on the Neptune is a recent addition that's earned praise.

## Strap Changing Tips

- Use a proper spring bar tool — never a knife
- For integrated straps, use the brand's own tools if provided
- Replace spring bars every 2-3 years if you swap straps regularly
- Check lug width before ordering third-party straps

## Best Value Third-Party Strap Brands

Strapcode, Eulit, and Crown & Buckle all offer excellent straps at sensible prices for microbrand watches.`,
    author: 'Editorial Team',
    publishedAt: '2026-03-25',
    readingTime: 7,
    tags: ['Guide', 'Straps', 'Accessories'],
    rating: undefined,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=Watch+Strap+Guide',
  },
  {
    slug: 'anordain-model-2-review',
    title: 'AnOrdain Model 2: Scottish Enamel Artistry in a 38mm Case',
    brand: 'AnOrdain',
    brandSlug: 'anordain',
    excerpt: 'Glasgow\'s AnOrdain is one of the few brands making enamel dials entirely in-house. The Model 2 is a masterpiece of craft — and its price reflects it.',
    body: `AnOrdain is not a typical microbrand. The Glasgow-based studio hand-makes every enamel dial in its workshop, a process that places it firmly in the realm of artisan watchmaking.

## The Dial

The Model 2's enamel dial is made using the champlevé or fumé enamel technique — a process that involves firing multiple layers of glass powder at 800°C to create depth and colour. No two dials are identical. The results range from deep teal to smoke grey depending on lighting conditions. It is, frankly, extraordinary.

## Design

The case is 38mm, proportioned conservatively, with a clean cream or grey dial and gold-applied baton indices. The watch doesn't shout — it rewards close inspection. On the wrist, it reads as a restrained dress watch until the light catches the dial in a certain way.

## Movement

A Sellita SW200-1 — appropriate, reliable, and well-serviced. The movement is not the point of the AnOrdain; the dial is.

## Value

At £1,250–1,500, the AnOrdain is not cheap. But consider what's included: a hand-made enamel dial that would cost more than the watch price to replicate from a specialist dial maker. In that context, it's remarkable value for handcraft.

## Verdict

The AnOrdain Model 2 is for buyers who want something genuinely unique. If a watch as a wearable art piece appeals to you more than spec sheets, nothing in this price range comes close.`,
    author: 'Editorial Team',
    publishedAt: '2026-02-25',
    readingTime: 5,
    tags: ['Dress', 'Review', 'AnOrdain', 'Scottish', 'Artisan'],
    rating: 5,
    featuredImage: 'https://placehold.co/1200x600/1c1917/d97706?text=AnOrdain+Model+2',
  },
]

export function getReviewBySlug(slug: string): Review | undefined {
  return reviews.find(r => r.slug === slug)
}

export const allTags = [...new Set(reviews.flatMap(r => r.tags))].sort()
