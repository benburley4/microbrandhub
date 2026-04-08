"""
scrape_images_ddg.py
Uses DuckDuckGo image search to find watch photos for brands missing heroImageUrl.
Picks the first image result that looks like a watch (not a logo/banner/text graphic).
"""
import sys, json, re, time
from pathlib import Path

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BRANDS_TS = Path(__file__).parent.parent / 'src' / 'data' / 'brands.ts'
OUT_JSON  = Path(__file__).parent / 'brand_images.json'

# Brands still missing images
MISSING = [
    'Aevig', 'Aquatico', 'Aragon', 'Autodromo', 'Bertucci', 'Bravur', 'Brew',
    'Briston', 'Christopher Ward', 'Circula', 'Clemens', 'Damasko', 'Dekla',
    'Dennison', 'Direnzo', 'Enoksen', 'Eza', 'Ginault', 'Hanhart', 'Helm',
    'Hoffman', 'Ikepod', 'Jan Sarnowski', 'Kuoe', 'Kurono Tokyo', 'Laco',
    'Loresum', 'Lorier', 'Ming', 'M\u00fchle Glash\u00fctte', 'Nivada Grenchen',
    'Ophion', 'Orion', 'Pelton', 'Phoibos', 'Pitzmann', 'RZE',
    'Sangin Instruments', 'Squale', 'Straum', 'Wise', 'Zodiac',
]

BAD_HINTS = ['logo', 'banner', 'icon', 'svg', 'png?', 'favicon', 'avatar',
             'strap', 'nato', 'box', 'hat', 'shirt', 'text', 'font', 'gif']
GOOD_EXTS = ('.jpg', '.jpeg', '.webp', '.png')

try:
    from ddgs import DDGS
except ImportError:
    from duckduckgo_search import DDGS


def search_image(brand_name: str):
    query = f'{brand_name} watch product'
    try:
        with DDGS() as ddgs:
            results = list(ddgs.images(query, max_results=20, safesearch='off'))
    except Exception as e:
        print(f'  DDG error: {e}')
        return None

    for r in results:
        url = r.get('image', '')
        if not url or not url.startswith('http'):
            continue
        low = url.lower()
        # Must end with a real image extension
        if not any(low.endswith(ext) or (ext + '?') in low for ext in GOOD_EXTS):
            continue
        # Skip bad patterns
        if any(b in low for b in BAD_HINTS):
            continue
        # Prefer URLs that contain the brand name or 'watch'
        brand_slug = brand_name.lower().replace(' ', '').replace('-', '')
        if 'watch' in low or brand_slug in low:
            return url
    # Fallback: first valid extension result
    for r in results:
        url = r.get('image', '')
        low = url.lower()
        if any(low.endswith(ext) or (ext + '?') in low for ext in GOOD_EXTS):
            if not any(b in low for b in BAD_HINTS):
                return url
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

    found = failed = 0

    for i, name in enumerate(MISSING):
        # Skip if already has a good image
        if saved.get(name):
            print(f'[{i+1}/{len(MISSING)}] {name} — already have image, skipping')
            continue

        print(f'[{i+1}/{len(MISSING)}] {name}')
        img = search_image(name)

        if img:
            print(f'  found: {img[:100]}')
            saved[name] = img
            OUT_JSON.write_text(json.dumps(saved, indent=2, ensure_ascii=False), encoding='utf-8')
            ok = patch_brands_ts(name, img)
            print(f'  patched brands.ts: {ok}')
            found += 1
        else:
            print(f'  no image found')
            failed += 1

        time.sleep(2)

    print(f'\nDone — found: {found}, failed: {failed}')


if __name__ == '__main__':
    main()
