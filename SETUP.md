# MicrobrandHub — Setup

## Prerequisites

Install [Node.js](https://nodejs.org) (LTS version recommended).

## Running locally

```bash
cd "C:\Users\benbu\OneDrive\AI Projects\Microbrand Watch Website"
npm install
npm run dev
```

Then open http://localhost:3000

## Building for production

```bash
npm run build
npm start
```

## Deploying to Vercel (free)

1. Push this folder to a GitHub repository
2. Go to https://vercel.com and import the repo
3. Vercel auto-detects Next.js — click Deploy

## Project structure

```
src/
  app/
    page.tsx              ← Home page
    brands/
      page.tsx            ← Brand directory (filterable)
      [slug]/page.tsx     ← Individual brand page
    listings/
      page.tsx            ← Pre-owned listings aggregator
    reviews/
      page.tsx            ← Reviews & guides index
      [slug]/page.tsx     ← Individual article
  data/
    brands.ts             ← All 93 microbrand watch brands
    listings.ts           ← Pre-owned listings (from microsearch.py)
    reviews.ts            ← Articles and reviews
  components/
    Header.tsx
    Footer.tsx
```

## Updating listings

The listings in `src/data/listings.ts` are sample data. To connect real Carousell
data from your existing `microsearch.py`:

1. Add a step to `microsearch.py` that exports listings as JSON
2. Write the JSON to `src/data/listings-data.json`
3. Update `src/data/listings.ts` to import from that JSON file

## Adding a new brand

Edit `src/data/brands.ts` and add an entry to the `brands` array.
