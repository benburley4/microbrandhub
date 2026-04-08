"""
scrape_brand_images.py
Tries to find a hero product image for each brand in brands.ts.

Strategy (in order):
1. If brand already has a heroImageUrl → skip
2. Try Shopify /products.json endpoint → grab first product's first image
3. Try Open Graph image tag from the brand's homepage
4. If nothing found → leave blank (keeps existing placeholder)

Writes results to scripts/brand_images.json, then patches brands.ts.
"""

import sys
import json
import re
import time
import urllib.request
import urllib.parse
import urllib.error
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

WEBSITE_DIR = Path(__file__).parent.parent
BRANDS_TS   = WEBSITE_DIR / 'src' / 'data' / 'brands.ts'
OUT_JSON    = Path(__file__).parent / 'brand_images.json'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/json,*/*',
}

TIMEOUT = 12


def fetch(url, as_json=False):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
            data = r.read()
            charset = r.headers.get_content_charset() or 'utf-8'
            text = data.decode(charset, errors='replace')
            if as_json:
                return json.loads(text)
            return text
    except Exception:
        return None


def try_shopify(website: str):
    """Hit /products.json and return the first product image URL."""
    base = website.rstrip('/')
    url  = f'{base}/products.json?limit=20&fields=title,images'
    data = fetch(url, as_json=True)
    if not data or 'products' not in data:
        return None
    for product in data['products']:
        images = product.get('images', [])
        if images:
            src = images[0].get('src', '')
            if src and src.startswith('http'):
                src = re.sub(r'_\d+x\d*(\.[a-z]+)$', r'\1', src)
                return src
    return None


def try_og_image(website: str):
    """Parse og:image meta tag from the homepage."""
    html = fetch(website)
    if not html:
        return None
    match = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
    if not match:
        match = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.I)
    if match:
        img = match.group(1).strip()
        if img.startswith('//'):
            img = 'https:' + img
        if img.startswith('http'):
            return img
    return None


def parse_brands_from_ts():
    text = BRANDS_TS.read_text(encoding='utf-8')
    brands = []
    entries = re.finditer(
        r'\{[^{}]*?name:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?website:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?\}',
        text, re.S
    )
    for m in entries:
        name    = m.group(1)
        website = m.group(2)
        snippet = m.group(0)
        hero_match = re.search(r'heroImageUrl:\s*[\'"`]([^\'"`]+)[\'"`]', snippet)
        existing = hero_match.group(1) if hero_match else None
        brands.append({'name': name, 'website': website, 'existing': existing})
    return brands


def patch_brands_ts(results: dict):
    text = BRANDS_TS.read_text(encoding='utf-8')

    for name, img_url in results.items():
        if not img_url:
            continue

        safe_url = img_url.replace("'", "\'")

        brand_block_re = re.compile(
            r'(\{[^{}]*?name:\s*[\'"`]' + re.escape(name) + r'[\'"`][^{}]*?\})',
            re.S
        )

        def replacer(m, url=safe_url):
            block = m.group(1)
            if 'heroImageUrl' in block:
                block = re.sub(
                    r"heroImageUrl:\s*['\"`][^'\"`]*['\"`]",
                    f"heroImageUrl: '{url}'",
                    block
                )
            else:
                block = block.rstrip()
                if block.endswith('}'):
                    block = block[:-1].rstrip().rstrip(',') + f", heroImageUrl: '{url}'" + ' }'
            return block

        new_text = brand_block_re.sub(replacer, text, count=1)
        if new_text != text:
            text = new_text
            print(f"  patched: {name}")
        else:
            print(f"  skip (block not found): {name}")

    BRANDS_TS.write_text(text, encoding='utf-8')


def main():
    brands = parse_brands_from_ts()
    print(f"Found {len(brands)} brands in brands.ts")

    saved = {}
    if OUT_JSON.exists():
        try:
            saved = json.loads(OUT_JSON.read_text(encoding='utf-8'))
        except Exception:
            saved = {}

    results = dict(saved)
    skipped = found = failed = 0

    for i, b in enumerate(brands):
        name    = b['name']
        website = b['website']

        if b['existing'] or results.get(name):
            skipped += 1
            continue

        print(f"[{i+1}/{len(brands)}] {name} ({website})")

        img = try_shopify(website)
        if img:
            print(f"  shopify: {img[:80]}")
            found += 1
        else:
            img = try_og_image(website)
            if img:
                print(f"  og:image: {img[:80]}")
                found += 1
            else:
                print(f"  no image")
                failed += 1

        results[name] = img or ''
        OUT_JSON.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding='utf-8')
        time.sleep(1.5)

    print(f"\nDone — found: {found}, skipped: {skipped}, failed: {failed}")

    print("\nPatching brands.ts...")
    patch_brands_ts({k: v for k, v in results.items() if v})
    print("Done.")


if __name__ == '__main__':
    main()
