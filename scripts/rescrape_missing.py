"""
rescrape_missing.py
Re-attempts image scraping for brands that got bad images or no image.
Uses a smarter Shopify query — tries multiple products and picks the one
whose image filename looks most like a watch (not a strap/accessory).
"""
import sys, json, re, time, urllib.request
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

WEBSITE_DIR = Path(__file__).parent.parent
BRANDS_TS   = WEBSITE_DIR / 'src' / 'data' / 'brands.ts'
OUT_JSON    = Path(__file__).parent / 'brand_images.json'

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/json,*/*',
}

# These filename fragments suggest a watch image (not an accessory)
WATCH_HINTS  = ['watch', 'dial', 'case', 'front', 'face', 'hero', 'main', 'product', 'wrist', 'steel', 'titanium', 'bronze', 'black', 'blue', 'green', 'white', 'silver', 'gold']
BAD_HINTS    = ['strap', 'nato', 'nylon', 'hat', 'shirt', 'suede', 'rubber', 'rubber', 'logo', 'thumbnail', 'twill', 'mesh', 'leather', 'bracelet', 'band', 'box']

RETRY_BRANDS = {
    'AnOrdain':    'https://anordain.com',
    'Autodromo':   'https://autodromo.com',
    'Dufrane':     'https://dufranewatches.com',
    'Farer':       'https://farer.com',
    'Laco':        'https://laco.de',
    'Oak & Oscar': 'https://oakandoscar.com',
    'Redwood':     'https://redwoodwatches.com',
    'Tusen\u00f6': 'https://tusenowatches.com',
    'Vario':       'https://vario.sg',
    'Wolbrook':    'https://wolbrook.com',
    # Also retry brands that got nothing
    'Aevig':       'https://aevig.com',
    'Aquatico':    'https://aquaticowatches.com',
    'Bravur':      'https://bravur.com',
    'Brew':        'https://brewwatchco.com',
    'Christopher Ward': 'https://christopherward.com',
    'Damasko':     'https://damasko.de',
    'Halios':      'https://halios.ca',
    'Lorier':      'https://lorierwatch.com',
    'Ming':        'https://ming.watch',
    'Nivada Grenchen': 'https://nivadagrenchen.ch',
    'Serica':      'https://sericawatches.com',
    'Traska':      'https://traskawatch.com',
}

def fetch(url, as_json=False):
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            data = r.read()
            charset = r.headers.get_content_charset() or 'utf-8'
            text = data.decode(charset, errors='replace')
            if as_json:
                return json.loads(text)
            return text
    except Exception:
        return None

def score_image(url: str) -> int:
    low = url.lower()
    if any(b in low for b in BAD_HINTS):
        return -1
    score = 0
    for h in WATCH_HINTS:
        if h in low:
            score += 1
    return score

def try_shopify_smart(website: str):
    base = website.rstrip('/')
    data = fetch(f'{base}/products.json?limit=50&fields=title,images', as_json=True)
    if not data or 'products' not in data:
        return None

    best_url   = None
    best_score = -2

    for product in data['products']:
        title = product.get('title', '').lower()
        # Skip accessory products
        if any(b in title for b in ['strap', 'nato', 'band', 'bracelet', 'hat', 'shirt', 'box', 'tool']):
            continue
        for img in product.get('images', []):
            src = img.get('src', '')
            if not src.startswith('http'):
                continue
            src = re.sub(r'_\d+x\d*(\.[a-z]+)$', r'\1', src)
            s = score_image(src)
            if s > best_score:
                best_score = s
                best_url   = src

    return best_url if best_score >= 0 else None

def try_og(website: str):
    html = fetch(website)
    if not html:
        return None
    m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)["\']', html, re.I)
    if not m:
        m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.I)
    if m:
        img = m.group(1).strip()
        if img.startswith('//'): img = 'https:' + img
        if img.startswith('http') and score_image(img) >= 0:
            return img
    return None

def patch_brands_ts(name: str, img_url: str):
    text = BRANDS_TS.read_text(encoding='utf-8')
    safe = img_url.replace("'", "\\'")
    brand_re = re.compile(r'(\{[^{}]*?name:\s*[\'"`]' + re.escape(name) + r'[\'"`][^{}]*?\})', re.S)

    def replacer(m):
        block = m.group(1)
        if 'heroImageUrl' in block:
            block = re.sub(r"heroImageUrl:\s*['\"`][^'\"`]*['\"`]", f"heroImageUrl: '{safe}'", block)
        else:
            block = block.rstrip()
            if block.endswith('}'):
                block = block[:-1].rstrip().rstrip(',') + f", heroImageUrl: '{safe}'" + ' }'
        return block

    new = brand_re.sub(replacer, text, count=1)
    if new != text:
        BRANDS_TS.write_text(new, encoding='utf-8')
        return True
    return False

def main():
    saved = {}
    if OUT_JSON.exists():
        try:
            saved = json.loads(OUT_JSON.read_text(encoding='utf-8'))
        except Exception:
            pass

    for name, website in RETRY_BRANDS.items():
        print(f'{name} ({website})')
        img = try_shopify_smart(website)
        if img:
            print(f'  shopify: {img[:90]}')
        else:
            img = try_og(website)
            if img:
                print(f'  og:image: {img[:90]}')
            else:
                print(f'  no image')

        if img:
            saved[name] = img
            OUT_JSON.write_text(json.dumps(saved, indent=2, ensure_ascii=False), encoding='utf-8')
            ok = patch_brands_ts(name, img)
            print(f'  patched brands.ts: {ok}')

        time.sleep(1.5)

    print('\nDone.')

if __name__ == '__main__':
    main()
