markdown
# DeepSeek Prompt for Claude Code: Microbrand Hub Website Improvements

**Target website:** https://www.microbrandhub.com  
**Goal:** Rebuild as a high-performance, ultra-low-cost static site using AI team roles (Claude Code for coding, DeepSeek for content generation).

---

## 🎯 PRINCIPAL INSTRUCTOR (You – The User)

**Objective:** Rebuild https://www.microbrandhub.com into a modern, fast, SEO-optimized static website that runs on the absolute lowest possible hosting cost.

**Key Constraints:**
- Hosting cost target: Under **$0.50/month** (or completely free)
- Use **JAMstack** architecture with static site generation
- Content must be generated programmatically via APIs
- The final product must be deployable with one command

---

## 👥 AI TEAM ROLES

### Project Manager
- Orchestrates the workflow between all other AI roles
- Validates outputs against project requirements
- Maintains a `PROJECT_STATUS.md` file tracking progress
- Runs integration checks before final deployment

### Frontend Architect
- Designs the component structure and CSS architecture
- Ensures fully responsive design (mobile-first)
- Implements dark/light theme support
- Optimizes for Core Web Vitals (LCP, INP, CLS)

### Backend/API Integration Specialist
- Configures static site generator (Hugo, Eleventy, or Astro)
- Sets up build pipelines and asset optimization
- Implements API integrations for dynamic data (listings, brand catalog)
- Ensures proper caching and CDN configuration

### SEO & Content Strategist
- Defines information architecture and URL structure
- Implements JSON-LD structured data for watches and brands
- Generates SEO-friendly meta tags and sitemaps
- Plans content categories and internal linking

### DeepSeek Content Generator (Special Role)
- Uses DeepSeek API to generate all written content at scale
- Creates brand descriptions, watch reviews, category pages, and guides
- Optimizes prompts for cost-efficiency (cached prompts, batched generation)
- Targets DeepSeek’s low pricing of ~$0.028-$0.28 per million tokens

---

## 🔧 STAGE 1: TECHNOLOGY AUDIT & PLANNING

### 1.1 Analyze Current Website
Run Claude Code to analyze the existing site:
```bash
# Claude will execute:
curl -s https://www.microbrandhub.com > current-site.html
# Extract all brand listings, categories, and page structure
Key findings from initial analysis:

The site currently lists 93 microbrand watches across 7 categories from 20+ countries

Main sections include: Browse by Category, Featured Brands, Pre-owned Listings, Reviews & Guides

The site appears to be static HTML with minimal dynamic functionality

No detectable CMS or framework footprints

1.2 Architecture Decision
Choose the following stack for minimal cost:

Component	Selection	Monthly Cost	Rationale
Static Site Generator	Hugo	$0	Fastest builds, minimal dependencies
Hosting	Cloudflare Pages or GitHub Pages	$0	Free tier with global CDN
Asset Storage	Cloudflare CDN (included)	$0	Automatic image optimization
Content Generation	DeepSeek API	~$0.05	Ultra-low token pricing
Forms/Interactivity	Cloudflare Workers (free tier)	$0	100k requests/day free
CI/CD	GitHub Actions	$0	Free for public repos
Alternative ultra-low-cost option: AWS S3 + CloudFront can run under $0.50/month for moderate traffic.

📝 STAGE 2: CONTENT GENERATION WITH DEEPSEEK
2.1 Content Inventory Required
Content Type	Quantity	Estimated Tokens
Brand descriptions	93	50,000
Watch reviews	93	150,000
Category pages (7)	7	10,000
Buying guides	10	30,000
SEO meta tags	200	10,000
Landing page copy	1	5,000
Total		~255,000 tokens
At DeepSeek rates ($0.028-$0.28/million tokens), total content cost: ~$0.01-$0.07

2.2 DeepSeek Prompt Template for Brand Content
markdown
You are a watch enthusiast and professional copywriter. Generate content for [BRAND_NAME], a microbrand watch company.

## Brand Context
- Origin: [COUNTRY]
- Specialty: [WATCH_TYPE]
- Price range: $[MIN]-$[MAX]

## Output Requirements (JSON format)
{
  "brand_description": "150-200 word overview of the brand's philosophy and history",
  "key_collection": "Description of their signature watch collection",
  "why_buy": "3-5 bullet points on unique selling propositions",
  "pros_cons": {
    "pros": ["list of advantages"],
    "cons": ["list of limitations"]
  },
  "seo_title": "60-character optimized title including brand name",
  "seo_description": "155-character meta description"
}
2.3 Cost-Efficient Content Strategy
Claude Code will implement a batch generation script:

python
# generate_content.py
import requests
import json
import time
from typing import List, Dict

DEEPSEEK_API_KEY = os.environ["DEEPSEEK_API_KEY"]
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"

def batch_generate_brands(brand_list: List[Dict], batch_size: int = 10):
    """
    Batch generation reduces API calls and costs.
    DeepSeek costs ~$0.028 per million input tokens.
    """
    results = []
    for i in range(0, len(brand_list), batch_size):
        batch = brand_list[i:i+batch_size]
        prompt = create_batch_prompt(batch)
        response = requests.post(
            DEEPSEEK_URL,
            headers={"Authorization": f"Bearer {DEEPSEEK_API_KEY}"},
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.7
            }
        )
        results.extend(response.json()["choices"][0]["message"]["content"])
        time.sleep(1)  # Respect rate limits
    return results
2.4 Pre-made Content Caching
To maximize cost savings, Claude Code should implement a prompt caching strategy:

Cache common instruction prefixes (reuse across multiple generations)

Batch similar content types together

Use DeepSeek’s cache hit pricing when available

💻 STAGE 3: FRONTEND DEVELOPMENT WITH CLAUDE CODE
3.1 Project Structure
Claude Code will scaffold the following structure:

text
microbrand-hub/
├── config/
│   ├── hugo.toml           # Hugo configuration
│   └── params.json         # Site parameters
├── content/
│   ├── brands/             # 93 brand markdown files
│   ├── reviews/            # Watch reviews
│   ├── guides/             # Buying guides
│   └── listings/           # Pre-owned listings (API data)
├── layouts/
│   ├── _default/           # Base templates
│   ├── brands/             # Brand list and single templates
│   └── partials/           # Reusable components
├── assets/
│   ├── css/                # Tailwind/CSS
│   ├── js/                 # Vanilla JS
│   └── images/             # Optimized brand images
├── static/
│   └── uploads/            # User-generated content
├── data/
│   └── brands.json         # Structured brand data
└── archetypes/
    └── default.md          # Content templates
3.2 Component Architecture
Claude Code will implement these key components:

BrandCard Component:

html
<div class="brand-card group">
  <div class="brand-card__image">
    <img src="{{ .image }}" alt="{{ .name }}" loading="lazy">
  </div>
  <h3 class="brand-card__title">{{ .name }}</h3>
  <p class="brand-card__origin">{{ .origin }}</p>
  <div class="brand-card__stats">
    <span>{{ .watch_count }} watches</span>
    <span>💰 {{ .price_range }}</span>
  </div>
</div>
Filters System (Pure JavaScript - no external dependencies):

javascript
// Zero-cost filtering without React/Vue
class BrandFilter {
  constructor() {
    this.brands = [];
    this.activeFilters = { category: null, origin: null, price: null };
  }
  
  filter() {
    return this.brands.filter(brand => {
      return (!this.activeFilters.category || brand.category === this.activeFilters.category) &&
             (!this.activeFilters.origin || brand.origin === this.activeFilters.origin);
    });
  }
  
  render() { /* Update DOM with filtered results */ }
}
3.3 Performance Budget
Metric	Target	Implementation
First Contentful Paint	<0.8s	Inline critical CSS, preconnect to CDN
Largest Contentful Paint	<2.0s	Optimize hero images, lazy load below fold
Time to Interactive	<1.5s	No blocking JavaScript, defer non-critical
Total page weight	<500KB	Compressed images, minified assets
🔌 STAGE 4: DYNAMIC FEATURES (ZERO-COST APPROACH)
4.1 Pre-owned Listings Integration
The current site sources listings from Carousell and other platforms. Implement a zero-cost approach:

Option A: RSS Feed Integration (Recommended)

javascript
// Cloudflare Worker - Free tier (100k requests/day)
async function fetchListings() {
  const carousellRSS = 'https://www.carousell.com/categories/watches/feed/';
  const response = await fetch(carousellRSS);
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'text/xml');
  
  // Extract and format listings
  const listings = Array.from(xml.querySelectorAll('item')).slice(0, 20);
  return listings.map(item => ({
    title: item.querySelector('title').textContent,
    price: extractPrice(item.querySelector('description').textContent),
    link: item.querySelector('link').textContent,
    image: extractImage(item.querySelector('description').textContent)
  }));
}
Option B: Webhook-based Updates

Set up GitHub Action running hourly

Fetch latest listings and rebuild static pages

Zero compute cost (GitHub Actions free tier)

4.2 Search Functionality
Implement client-side search with no backend costs:

javascript
// Lunr.js or MiniSearch - 100% client-side
import MiniSearch from 'minisearch';

const searcher = new MiniSearch({
  fields: ['name', 'description', 'origin', 'category'],
  storeFields: ['name', 'url', 'image']
});

searcher.addAll(brandsData);

// Search runs entirely in browser - no API costs
document.getElementById('search').addEventListener('input', (e) => {
  const results = searcher.search(e.target.value);
  displayResults(results);
});
4.3 Newsletter Signup (Free Tier)
Use Formspree or Formsubmit.co for form handling:

Free tier: 50-100 submissions/month

No backend required

Email notifications included

🚀 STAGE 5: DEPLOYMENT & CI/CD
5.1 GitHub Actions Workflow
Claude Code will create .github/workflows/deploy.yml:

yaml
name: Deploy to Production
on:
  push:
    branches: [main]
  schedule:
    - cron: '0 */6 * * *'  # Update listings every 6 hours

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v2
        with:
          hugo-version: '0.120.0'
      
      - name: Generate Content with DeepSeek
        run: |
          python scripts/generate_content.py
        env:
          DEEPSEEK_API_KEY: ${{ secrets.DEEPSEEK_API_KEY }}
      
      - name: Fetch Latest Listings
        run: |
          python scripts/fetch_listings.py
      
      - name: Build Static Site
        run: hugo --minify
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: microbrand-hub
          directory: public
5.2 Hosting Comparison (Lowest Cost Options)
Platform	Free Tier Limits	Monthly Cost (within limits)	Setup Complexity
Cloudflare Pages	Unlimited requests, unlimited bandwidth, 500 builds/month	$0	Low
GitHub Pages	Unlimited public repos, 100GB bandwidth/month	$0	Very Low
Netlify	100GB bandwidth/month, 300 build minutes	$0	Low
AWS S3 + CloudFront	5GB storage, 15GB transfer, 20k GET requests	$0.50 (beyond free tier)	High
Vercel	100GB bandwidth/month, 6000 build minutes	$0	Low
Recommendation: Cloudflare Pages offers the most generous free tier with global CDN included.

📊 STAGE 6: SEO & PERFORMANCE OPTIMIZATION
6.1 Structured Data Implementation
Claude Code will inject JSON-LD for every brand and watch:

html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "[Brand Name] [Watch Model]",
  "brand": {
    "@type": "Brand",
    "name": "[Brand Name]"
  },
  "offers": {
    "@type": "Offer",
    "price": "[PRICE]",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[RATING]",
    "reviewCount": "[COUNT]"
  }
}
</script>
6.2 Image Optimization Pipeline
bash
# Claude Code will set up automated image optimization
find assets/images -name "*.jpg" -exec convert {} -quality 85 -resize "800x800>" {} \;
find assets/images -name "*.png" -exec pngquant --quality=65-80 {} --output {} \;

# Generate WebP versions
for file in *.{jpg,png}; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
6.3 Core Web Vitals Targets
Metric	Current (estimated)	Target	Improvement Method
LCP	~2.5s	<1.8s	CDN + optimized hero images
INP	~200ms	<150ms	Remove blocking JS
CLS	~0.15	<0.1	Set image dimensions explicitly
✅ STAGE 7: QUALITY ASSURANCE & VALIDATION
7.1 Automated Tests
Claude Code will implement:

javascript
// tests/performance.test.js
describe('Performance Budget', () => {
  test('Homepage loads under 2 seconds', async () => {
    const response = await fetch('https://microbrandhub.pages.dev');
    const timing = response.headers.get('Server-Timing');
    expect(performanceMetrics.loadTime).toBeLessThan(2000);
  });
  
  test('All images have alt text', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      expect(img.getAttribute('alt')).not.toBeNull();
    });
  });
});
7.2 Lighthouse CI Integration
yaml
# Add to GitHub Actions
- name: Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun --config=lighthouserc.json
Minimum thresholds:

Performance: 90+

Accessibility: 95+

Best Practices: 90+

SEO: 100+

📋 FINAL CHECKLIST FOR CLAUDE CODE
Pre-Deployment Verification
All 93 brand pages generated and accessible

7 category pages populated with correct filtering

Pre-owned listings API integration working

Search functionality tested across browsers

Mobile responsive on iPhone SE, Pixel 5, Galaxy S21

All images optimized and converted to WebP

Sitemap.xml generated and submitted

robots.txt configured properly

Structured data validated with Google Rich Results Test

Cost Tracking
Service	Estimated Monthly Cost
Cloudflare Pages	$0
GitHub Actions	$0
DeepSeek API (content generation, one-time)	$0.07
DeepSeek API (ongoing updates)	$0.01
Domain (if purchased separately)	$1-2
Total Monthly (after setup)	$0-$2
🚨 EXECUTION COMMANDS FOR CLAUDE CODE
bash
# Claude will execute these steps in order:

# Step 1: Scrape existing content
claude run "Extract all brand names and URLs from https://www.microbrandhub.com"

# Step 2: Generate new content via DeepSeek
claude run "Use the DeepSeek API to generate brand descriptions for all 93 brands"

# Step 3: Scaffold Hugo project
claude run "Initialize Hugo project with responsive theme and brand listing templates"

# Step 4: Build and optimize
claude run "Run hugo --minify and optimize all assets"

# Step 5: Deploy
claude run "Deploy to Cloudflare Pages and configure custom domain"
🔄 MAINTENANCE PROTOCOL
Weekly automated tasks (via GitHub Actions cron):

Fetch latest pre-owned listings (update /listings page)

Regenerate sitemap.xml

Check for broken links

Monitor DeepSeek API costs (alert if >$0.50/month)

Monthly tasks:

Review Google Search Console for SEO issues

Update brand count if new microbrands emerge

Refresh featured brands section

📚 REFERENCE MATERIALS FOR CLAUDE CODE
DeepSeek API Documentation
Endpoint: https://api.deepseek.com/v1/chat/completions

Pricing: $0.028 per million input tokens, $0.28 per million output tokens

Context window: 200K tokens (sufficient for entire brand batch generation)

JAMstack Hosting Guides
Cloudflare Pages: https://developers.cloudflare.com/pages/

GitHub Pages: https://pages.github.com/

AWS S3 Static Hosting: ~$0.50/month for moderate traffic

Watch Microbrand Best Practices
Focus on high-quality imagery and detailed specifications

Include direct links to brand websites for purchases

Highlight unique selling points (materials, movements, limited editions)

Showcase user reviews and community feedback

This prompt is ready to be copied and executed in Claude Code. The AI team will automatically coordinate to deliver a fully functional, ultra-low-cost website.

arkdown
# DeepSeek Prompt for Claude Code: Microbrand Hub

**Target:** https://www.microbrandhub.com  
**Goal:** Ultra-low-cost static site (<$0.50/month) using Claude Code + DeepSeek API.

## AI Team Roles
- Project Manager
- Frontend Architect
- Backend/API Specialist
- SEO Strategist
- DeepSeek Content Generator

## Stack
- **Hugo** (static site generator, $0)
- **Cloudflare Pages** (hosting, $0)
- **DeepSeek API** (content, ~$0.07 one-time)
- **GitHub Actions** (CI/CD, $0)

## Content Generation (DeepSeek)
- 93 brand descriptions
- 93 watch reviews
- 7 category pages
- 10 buying guides
- Total ~255K tokens → cost ~$0.01-$0.07

## Key Features
- Client-side search (MiniSearch)
- Pre-owned listings via RSS/Cloudflare Worker
- Newsletter via Formspree (free tier)
- JSON-LD structured data for SEO
- Lighthouse scores: 90+ Performance, 95+ Accessibility

## Deployment
GitHub Action builds and deploys to Cloudflare Pages automatically.

**Full prompt includes code examples, architecture decisions, and cost tracking.**
Then manually add the longer version if needed.