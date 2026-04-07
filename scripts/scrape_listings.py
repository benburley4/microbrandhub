"""
Multi-platform listing scraper for MicrobrandHub.

Sources:
  - Reddit r/WatchExchange (JSON API — free, no key)
  - eBay (search page scraping)
  - Chrono24 (search page scraping)

Writes to: src/data/generated/generated_listings.json
Then run:  python scripts/apply_listings.py  to regenerate listings.ts

Usage:
  python scripts/scrape_listings.py
  python scripts/scrape_listings.py --brands "Baltic,Nomos,Traska"  # specific brands only
"""

import argparse
import json
import re
import sys
import time
from datetime import date, datetime, timedelta
from pathlib import Path
from urllib.parse import quote_plus, urljoin, urlparse

# Fix Windows console encoding
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # type: ignore

OUTPUT = Path(__file__).parent.parent / "src" / "data" / "generated" / "generated_listings.json"

# All known microbrands to search for
KNOWN_BRANDS = [
    'Aevig', 'Akrone', 'AnOrdain', 'Aquatico', 'Aragon', 'Astor + Banks',
    'Atelier Wen', 'Autodromo', 'Baltic', 'Beaubleu', 'Bertucci', 'Boldr',
    'Borealis', 'Bravur', 'Brew', 'Briston', 'Christopher Ward', 'Circula',
    'Code41', 'Damasko', 'Dan Henry', 'Dekla', 'Depancel', 'Elliot Brown',
    'Enoksen', 'Eza', 'Farer', 'Fears', 'Formex', 'Furlan Marri', 'Ginault',
    'Gruppo Gamma', 'Halios', 'Hanhart', 'Horage', 'Huckleberry', 'Islander',
    'Isotope', 'Junghans', 'Kopman', 'Kurono Tokyo', 'Laco', 'Lorier',
    'Maen', 'Marathon', 'Marloe', 'Mercer', 'Ming', 'Monta', 'Nivada Grenchen',
    'Nodus', 'Nomos', 'NTH', 'Oris', 'Paulin', 'Phoibos', 'Praesidus',
    'Prometheus', 'RZE', 'San Martin', 'Serica', 'Sinn', 'Squale', 'Steinhart',
    'Stowa', 'Studio Underd0g', 'Temption', 'Tissot', 'Traska', 'Unimatic',
    'Vaer', 'Vario', 'Vertex', 'Vostok', 'Wenger', 'Xeric', 'Yema', 'Zelos', 'Zodiac',
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/122.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}


# ── Helpers ────────────────────────────────────────────────────────────────────

def slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def parse_usd_price(text: str) -> int | None:
    """Extract a USD price from a string. Returns None if unparseable."""
    if not text:
        return None
    # Remove currency symbols and commas, find first number
    cleaned = re.sub(r'[£€][\d,]+', '', text)  # strip non-USD currencies
    m = re.search(r'\$\s*([\d,]+)', cleaned)
    if not m:
        m = re.search(r'([\d,]{3,})', cleaned)
    if not m:
        return None
    try:
        val = int(m.group(1).replace(',', ''))
        if 50 <= val <= 20000:
            return val
    except ValueError:
        pass
    return None


def days_ago_to_date(days: int) -> str:
    return (date.today() - timedelta(days=days)).isoformat()


def is_selling_post(title: str, flair: str = '') -> bool:
    """Return True if a Reddit post looks like a [WTS] (want to sell) listing."""
    t = (title + ' ' + flair).upper()
    return any(tag in t for tag in ['[WTS]', 'WTS ', 'FOR SALE', 'SELLING', '[SOLD]'])


# ── Reddit r/WatchExchange ─────────────────────────────────────────────────────

def scrape_reddit(brand: str) -> list[dict]:
    """Search r/WatchExchange for brand listings via Reddit JSON API."""
    import requests
    results = []
    try:
        url = (
            f"https://www.reddit.com/r/WatchExchange/search.json"
            f"?q={quote_plus(brand)}&sort=new&t=month&limit=10&restrict_sr=on"
        )
        resp = requests.get(url, headers={"User-Agent": "MicrobrandHub/1.0"}, timeout=10)
        if resp.status_code != 200:
            return []
        posts = resp.json().get("data", {}).get("children", [])
        for post in posts:
            p = post.get("data", {})
            title = p.get("title", "")
            if not title:
                continue
            # Only [WTS] posts (for sale), skip [WTB] (want to buy)
            title_upper = title.upper()
            if '[WTB]' in title_upper or 'WANT TO BUY' in title_upper:
                continue
            if not any(tag in title_upper for tag in ['[WTS]', 'WTS', 'FOR SALE', '[SOLD]', 'SELLING']):
                continue

            # Verify the brand is mentioned
            if brand.lower() not in title.lower() and brand.lower() not in p.get("selftext", "").lower():
                continue

            price = parse_usd_price(title + ' ' + p.get("selftext", "")[:300])
            post_url = "https://reddit.com" + p.get("permalink", "")
            created = p.get("created_utc", 0)
            days_old = max(0, int((datetime.now().timestamp() - created) / 86400))
            status = 'sold_out' if '[SOLD]' in title_upper else 'live'

            results.append({
                "id": f"reddit-{p.get('id', slug(title)[:20])}",
                "brand": brand,
                "brandSlug": slug(brand),
                "title": re.sub(r'^\[WTS\]\s*', '', title, flags=re.IGNORECASE).strip()[:120],
                "price": price or 0,
                "currency": "USD",
                "condition": "Good",
                "platform": "Reddit",
                "location": "USA",
                "url": post_url,
                "postedAt": days_ago_to_date(days_old),
                "status": status,
            })
        time.sleep(0.6)
    except Exception as e:
        print(f"  Reddit error ({brand}): {e}", flush=True)
    return results


# ── eBay via DuckDuckGo ────────────────────────────────────────────────────────

def scrape_ebay(brand: str) -> list[dict]:
    """Find eBay listings via DuckDuckGo (avoids JS rendering / bot detection)."""
    results = []
    try:
        from ddgs import DDGS
        query = f'site:ebay.com "{brand}" watch for sale'
        with DDGS() as ddgs:
            hits = list(ddgs.text(query, max_results=6, timelimit="m"))
        for r in hits:
            url   = r.get("href", "")
            title = r.get("title", "")
            body  = r.get("body", "")
            if "ebay.com/itm/" not in url:
                continue
            if brand.lower() not in (title + body).lower():
                continue
            price = parse_usd_price(title + " " + body)
            results.append({
                "id": f"ebay-{slug(title[:30])}-{len(results)}",
                "brand": brand,
                "brandSlug": slug(brand),
                "title": title[:120],
                "price": price or 0,
                "currency": "USD",
                "condition": "Good",
                "platform": "eBay",
                "location": "USA",
                "url": url.split("?")[0],
                "postedAt": date.today().isoformat(),
                "status": "live",
            })
        time.sleep(1.2)
    except Exception as e:
        print(f"  eBay error ({brand}): {e}", flush=True)
    return results


# ── Chrono24 via DuckDuckGo ────────────────────────────────────────────────────

def scrape_chrono24(brand: str) -> list[dict]:
    """Find Chrono24 listings via DuckDuckGo (avoids 403 bot protection)."""
    results = []
    try:
        from ddgs import DDGS
        query = f'site:chrono24.com "{brand}" watch'
        with DDGS() as ddgs:
            hits = list(ddgs.text(query, max_results=5, timelimit="m"))
        for r in hits:
            url   = r.get("href", "")
            title = r.get("title", "")
            body  = r.get("body", "")
            if "chrono24.com" not in url:
                continue
            if brand.lower() not in (title + body).lower():
                continue
            # Skip category/brand index pages — only item pages
            if "/search/" in url or url.rstrip("/").endswith("chrono24.com"):
                continue
            price = parse_usd_price(title + " " + body)
            results.append({
                "id": f"c24-{slug(title[:30])}-{len(results)}",
                "brand": brand,
                "brandSlug": slug(brand),
                "title": title[:120],
                "price": price or 0,
                "currency": "USD",
                "condition": "Good",
                "platform": "Chrono24",
                "location": "International",
                "url": url,
                "postedAt": date.today().isoformat(),
                "status": "live",
            })
        time.sleep(1.2)
    except Exception as e:
        print(f"  Chrono24 error ({brand}): {e}", flush=True)
    return results


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--brands", help="Comma-separated brand names to scrape (default: all)")
    args = parser.parse_args()

    # Install deps if needed
    for pkg, imp in [("requests", "requests"), ("beautifulsoup4", "bs4")]:
        try:
            __import__(imp)
        except ImportError:
            import subprocess
            subprocess.run([sys.executable, "-m", "pip", "install", pkg, "-q"], check=True)

    brands = KNOWN_BRANDS
    if args.brands:
        brands = [b.strip() for b in args.brands.split(",")]

    # Load existing results to avoid overwriting
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    existing = []
    if OUTPUT.exists():
        try:
            with open(OUTPUT, encoding='utf-8') as f:
                existing = json.load(f)
        except (json.JSONDecodeError, ValueError):
            existing = []

    existing_ids = {item["id"] for item in existing}

    print(f"\nScraping listings for {len(brands)} brands across Reddit, eBay, Chrono24...\n")

    all_new = []
    for i, brand in enumerate(brands, 1):
        print(f"[{i:>2}/{len(brands)}] {brand}", end="  ", flush=True)

        new_items = []
        for scraper, name in [
            (scrape_reddit,  "Reddit"),
            (scrape_ebay,    "eBay"),
            (scrape_chrono24, "C24"),
        ]:
            items = scraper(brand)
            fresh = [x for x in items if x["id"] not in existing_ids]
            new_items.extend(fresh)
            existing_ids.update(x["id"] for x in fresh)
            print(f"{name}:{len(fresh)}", end="  ", flush=True)

        all_new.extend(new_items)
        print()

    # Merge: new items first, then existing (keep most recent 500)
    merged = all_new + existing
    # Deduplicate by id (keep first occurrence)
    seen = set()
    deduped = []
    for item in merged:
        if item["id"] not in seen:
            seen.add(item["id"])
            deduped.append(item)

    # Drop very old listings (>60 days) with price=0 (unparseable — likely junk)
    cutoff = (date.today() - timedelta(days=60)).isoformat()
    deduped = [
        x for x in deduped
        if not (x.get("price", 0) == 0 and x.get("postedAt", "9999") < cutoff)
    ]

    # Keep max 500 entries
    deduped = deduped[:500]

    with open(OUTPUT, "w", encoding='utf-8') as f:
        json.dump(deduped, f, indent=2, ensure_ascii=False)

    print(f"\nNew listings found:  {len(all_new)}")
    print(f"Total in JSON:       {len(deduped)}")
    print(f"Saved to:            {OUTPUT}")
    print(f"\nNext step: python scripts/apply_listings.py")


if __name__ == "__main__":
    main()
