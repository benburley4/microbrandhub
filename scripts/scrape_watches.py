"""
scrape_watches.py
Scrapes Shopify /products.json for all brands and saves watch model data
to scripts/generated_watches.json.

For non-Shopify brands, tries to extract basic product info from OG tags / page title.
Run: python scripts/scrape_watches.py
"""
import sys, json, re, time, urllib.request, hashlib
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

OUT_JSON = Path(__file__).parent / 'generated_watches.json'
BRANDS_SCRIPT = Path(__file__).parent / 'list_brands.py'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'application/json, text/html, */*',
}

# Keywords that indicate a NON-watch product (strap, accessory, merch)
ACCESSORY_KEYWORDS = [
    'strap', 'nato', 'band', 'bracelet', 'mesh', 'nylon', 'leather', 'rubber',
    'silicone', 'suede', 'canvas', 'tool', 'spring bar', 'spring-bar',
    'hat', 'shirt', 't-shirt', 'hoodie', 'cap', 'tee', 'book', 'box',
    'case box', 'gift', 'pin', 'patch', 'sticker', 'pouch', 'bag',
    'cleaning', 'polish', 'cloth', 'winder',
]

# Keywords that strongly suggest a watch product
WATCH_KEYWORDS = [
    'watch', 'timepiece', 'chrono', 'diver', 'pilot', 'field', 'dress',
    'automatic', 'quartz', 'mechanical', 'gmt', 'moonphase', 'tourbillon',
]

# Movement pattern to extract caliber name
MOVEMENT_RE = re.compile(
    r'\b(miyota\s*\d+\w*|eta\s*\d+\w*|nh\d+|sellita\s*sw\d+\w*|sw\d+\w*|'
    r'seiko\s*nh\d+|valjoux\s*\d+|unitas\s*\d+|elabore|top grade|'
    r'tmi\s*\w+|ronda\s*\d+\w*|isa\s*\d+|soprod\s*\w+|'
    r'in-house|manufacture|proprietary|custom caliber)\b',
    re.I
)

# Dial color extraction
DIAL_COLOR_RE = re.compile(
    r'\b(black|white|silver|grey|gray|blue|navy|green|teal|red|burgundy|'
    r'brown|champagne|gold|cream|beige|ivory|yellow|orange|purple|violet|'
    r'pink|turquoise|dial)\b',
    re.I
)

# Case diameter extraction
DIAMETER_RE = re.compile(r'\b(3[0-9]|4[0-5])mm\b', re.I)

# Water resistance
WATER_RE = re.compile(r'\b(\d+)\s*(?:bar|atm|m\b|meters)', re.I)


def make_id(brand_slug: str, handle: str) -> str:
    h = hashlib.md5(f'{brand_slug}:{handle}'.encode()).hexdigest()[:12]
    return f'{brand_slug}-{h}'


def to_brand_slug(name: str) -> str:
    return name.lower().replace(' ', '-').replace('&', 'and').replace('+', 'and').replace('.', '').replace("'", '')


def fetch(url: str, as_json=False):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read()
            charset = r.headers.get_content_charset() or 'utf-8'
            text = raw.decode(charset, errors='replace')
            if as_json:
                return json.loads(text)
            return text
    except Exception:
        return None


def is_watch_product(title: str, product_type: str, tags: list) -> bool:
    title_lower = title.lower()
    type_lower  = (product_type or '').lower()
    tags_lower  = ' '.join(t.lower() for t in (tags or []))
    combined    = f'{title_lower} {type_lower} {tags_lower}'

    # Explicit accessory → skip
    if any(k in combined for k in ACCESSORY_KEYWORDS):
        # Allow if "watch" also appears (e.g. "watch + strap bundle")
        if 'watch' not in combined:
            return False

    # If it explicitly mentions watch → keep
    if any(k in combined for k in WATCH_KEYWORDS):
        return True

    # Default: keep if product_type says watch, else skip ambiguous
    if 'watch' in type_lower:
        return True

    return False


def extract_specs(title: str, body: str) -> dict:
    text = f'{title} {body or ""}'

    movement = None
    m = MOVEMENT_RE.search(text)
    if m:
        movement = m.group(0).strip()

    dial_color = None
    dc = DIAL_COLOR_RE.search(title)
    if dc:
        dial_color = dc.group(0).capitalize()
        if dial_color.lower() == 'dial':
            dial_color = None

    diameter = None
    dm = DIAMETER_RE.search(text)
    if dm:
        try:
            diameter = int(dm.group(1))
        except Exception:
            pass

    water = None
    wm = WATER_RE.search(text)
    if wm:
        try:
            val = int(wm.group(1))
            # Convert atm/m to bar (approx)
            if 'm' in wm.group(0).lower() and 'bar' not in wm.group(0).lower():
                val = val // 10
            water = val
        except Exception:
            pass

    return {
        'movement':            movement,
        'dialColor':           dial_color,
        'caseDiameterMm':      diameter,
        'waterResistanceBar':  water,
    }


def get_best_image(images: list) -> str:
    if not images:
        return ''
    # Prefer images whose src contains watch-like keywords
    for img in images:
        src = img.get('src', '')
        low = src.lower()
        if any(k in low for k in ['watch', 'dial', 'front', 'hero', 'main', 'product']):
            return src
    return images[0].get('src', '')


def get_price(variants: list) -> tuple:
    """Returns (priceUSD float, priceDisplay str)"""
    prices = []
    for v in (variants or []):
        try:
            prices.append(float(v.get('price', 0)))
        except Exception:
            pass
    if not prices:
        return None, None
    prices = [p for p in prices if p > 0]
    if not prices:
        return None, None
    mn, mx = min(prices), max(prices)
    if mn == mx:
        return mn, f'${mn:,.0f}'
    return mn, f'${mn:,.0f}–${mx:,.0f}'


def get_availability(variants: list) -> str:
    available = any(v.get('available', False) for v in (variants or []))
    return 'available' if available else 'sold_out'


def scrape_shopify(brand_name: str, website: str) -> list:
    base = website.rstrip('/')
    data = fetch(f'{base}/products.json?limit=250', as_json=True)
    if not data or 'products' not in data:
        return []

    brand_slug = to_brand_slug(brand_name)
    results = []

    for p in data['products']:
        title        = p.get('title', '').strip()
        product_type = p.get('product_type', '')
        tags         = p.get('tags', [])
        handle       = p.get('handle', '')
        body         = re.sub(r'<[^>]+>', ' ', p.get('body_html', '') or '')

        if not is_watch_product(title, product_type, tags):
            continue

        specs        = extract_specs(title, body)
        image_url    = get_best_image(p.get('images', []))
        price_usd, price_display = get_price(p.get('variants', []))
        availability = get_availability(p.get('variants', []))

        results.append({
            'id':                 make_id(brand_slug, handle),
            'brandSlug':          brand_slug,
            'brandName':          brand_name,
            'name':               title,
            'shopifyHandle':      handle,
            'priceUSD':           price_usd,
            'priceDisplay':       price_display,
            'imageUrl':           image_url,
            'availability':       availability,
            'movement':           specs['movement'],
            'dialColor':          specs['dialColor'],
            'caseDiameterMm':     specs['caseDiameterMm'],
            'waterResistanceBar': specs['waterResistanceBar'],
            'categories':         [],   # filled later by apply_watches.py from brand categories
            'updatedAt':          '',   # filled by apply_watches.py
        })

    return results


def main():
    # Load brand list
    import importlib.util
    spec = importlib.util.spec_from_file_location('list_brands', BRANDS_SCRIPT)
    # Just re-parse brands.ts directly
    brands_ts = Path(__file__).parent.parent / 'src' / 'data' / 'brands.ts'
    text = brands_ts.read_text(encoding='utf-8')
    entries = re.finditer(
        r'name:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?website:\s*[\'"`]([^\'"`]+)[\'"`]',
        text, re.S
    )
    brands = [(m.group(1), m.group(2)) for m in entries if m.group(1) != 'string']

    # Load existing saved data
    saved = {}
    if OUT_JSON.exists():
        try:
            saved = json.loads(OUT_JSON.read_text(encoding='utf-8'))
        except Exception:
            pass

    print(f'Scraping {len(brands)} brands...\n')
    total_new = 0

    for i, (name, website) in enumerate(brands):
        slug = to_brand_slug(name)

        # Skip if already scraped recently (can force re-scrape by deleting the json)
        if slug in saved:
            print(f'[{i+1}/{len(brands)}] {name} — cached ({len(saved[slug])} models)')
            continue

        print(f'[{i+1}/{len(brands)}] {name} ({website})')
        models = scrape_shopify(name, website)

        if models:
            print(f'  → {len(models)} watch models found')
            total_new += len(models)
        else:
            print(f'  → no Shopify data')
            models = []

        saved[slug] = models
        OUT_JSON.write_text(json.dumps(saved, indent=2, ensure_ascii=False), encoding='utf-8')
        time.sleep(1.2)

    print(f'\nDone — {total_new} new models scraped')
    total = sum(len(v) for v in saved.values())
    print(f'Total in JSON: {total} models across {len(saved)} brands')


if __name__ == '__main__':
    main()
