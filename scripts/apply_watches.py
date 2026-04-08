"""
apply_watches.py
Reads scripts/generated_watches.json and writes src/data/watches.ts.
Maps brand categories from brands.ts so each watch inherits its brand's categories.
Run after scrape_watches.py.
"""
import sys, json, re
from pathlib import Path
from datetime import datetime, timezone

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT       = Path(__file__).parent.parent
BRANDS_TS  = ROOT / 'src' / 'data' / 'brands.ts'
WATCHES_TS = ROOT / 'src' / 'data' / 'watches.ts'
IN_JSON    = Path(__file__).parent / 'generated_watches.json'

TODAY = datetime.now(timezone.utc).strftime('%Y-%m-%d')

# Keywords that suggest non-watch — additional filter at apply stage
SKIP_KEYWORDS = [
    'strap', 'nato', 'band', 'bracelet', 'mesh', 'nylon', 'leather band',
    'rubber band', 'hat ', 'shirt', 'hoodie', 'tee ', 'box ', 'gift ',
    'pin ', 'patch', 'sticker', 'pouch', 'cleaning', 'winder', 'key fob',
    'keyring', 'keychain', 'wallet', 'notebook', 'pen ', 'mug ', 'bottle',
    'case back tool', 'spring bar tool',
]


def load_brand_categories():
    """Parse brands.ts and return {slug: [categories]}"""
    text = BRANDS_TS.read_text(encoding='utf-8')
    result = {}
    # Match each brand block
    for m in re.finditer(r'\{[^{}]*?name:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?\}', text, re.S):
        block = m.group(0)
        name_m = re.search(r"name:\s*['\"`]([^'\"`]+)['\"`]", block)
        cats_m = re.search(r"categories:\s*\[([^\]]+)\]", block)
        if not name_m or not cats_m:
            continue
        name = name_m.group(1)
        slug = name.lower().replace(' ', '-').replace('&', 'and').replace('+', 'and').replace('.', '').replace("'", '')
        cats = re.findall(r"['\"`]([^'\"`]+)['\"`]", cats_m.group(1))
        result[slug] = cats
    return result


def escape_ts(s: str) -> str:
    if s is None:
        return ''
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def render_watch(w: dict) -> str:
    def ts_val(v):
        if v is None:
            return 'undefined'
        if isinstance(v, bool):
            return 'true' if v else 'false'
        if isinstance(v, (int, float)):
            return str(v)
        if isinstance(v, list):
            return '[' + ', '.join(f"'{x}'" for x in v) + ']'
        return f"'{escape_ts(str(v))}'"

    lines = [
        f"    id: '{w['id']}',",
        f"    brandSlug: '{w['brandSlug']}',",
        f"    brandName: '{escape_ts(w['brandName'])}',",
        f"    name: `{escape_ts(w['name'])}`,",
    ]
    if w.get('shopifyHandle'):
        lines.append(f"    shopifyHandle: '{w['shopifyHandle']}',")
    if w.get('priceUSD') is not None:
        lines.append(f"    priceUSD: {w['priceUSD']},")
    if w.get('priceDisplay'):
        lines.append(f"    priceDisplay: '{escape_ts(w['priceDisplay'])}',")
    if w.get('caseDiameterMm'):
        lines.append(f"    caseDiameterMm: {w['caseDiameterMm']},")
    if w.get('lugWidthMm'):
        lines.append(f"    lugWidthMm: {w['lugWidthMm']},")
    if w.get('thicknessMm'):
        lines.append(f"    thicknessMm: {w['thicknessMm']},")
    if w.get('caseMaterial'):
        lines.append(f"    caseMaterial: '{escape_ts(w['caseMaterial'])}',")
    if w.get('dialColor'):
        lines.append(f"    dialColor: '{escape_ts(w['dialColor'])}',")
    if w.get('movement'):
        lines.append(f"    movement: '{escape_ts(w['movement'])}',")
    if w.get('powerReserveHours'):
        lines.append(f"    powerReserveHours: {w['powerReserveHours']},")
    if w.get('crystal'):
        lines.append(f"    crystal: '{escape_ts(w['crystal'])}',")
    if w.get('waterResistanceBar'):
        lines.append(f"    waterResistanceBar: {w['waterResistanceBar']},")
    cats = w.get('categories', [])
    lines.append(f"    categories: [{', '.join(repr(c) for c in cats)}],")
    lines.append(f"    imageUrl: '{escape_ts(w.get('imageUrl',''))}',")
    lines.append(f"    availability: '{w.get('availability','available')}',")
    lines.append(f"    updatedAt: '{TODAY}',")

    return '  {\n' + '\n'.join(lines) + '\n  }'


def main():
    if not IN_JSON.exists():
        print(f'ERROR: {IN_JSON} not found — run scrape_watches.py first')
        return

    raw = json.loads(IN_JSON.read_text(encoding='utf-8'))
    brand_cats = load_brand_categories()

    # Flatten all models from all brands
    all_models = []
    for brand_slug, models in raw.items():
        cats = brand_cats.get(brand_slug, [])
        for m in models:
            # Extra skip filter
            name_lower = m.get('name', '').lower()
            if any(k in name_lower for k in SKIP_KEYWORDS):
                continue
            # Attach brand categories if model has none
            if not m.get('categories'):
                m['categories'] = cats
            m['brandSlug'] = brand_slug
            all_models.append(m)

    # Sort: brand A-Z, then name A-Z
    all_models.sort(key=lambda w: (w['brandName'].lower(), w['name'].lower()))

    # Deduplicate by id
    seen = set()
    deduped = []
    for m in all_models:
        if m['id'] not in seen:
            seen.add(m['id'])
            deduped.append(m)

    print(f'Writing {len(deduped)} watch models to watches.ts...')

    entries = ',\n'.join(render_watch(w) for w in deduped)

    ts = f"""// Auto-generated by scripts/apply_watches.py — do not edit manually
// Last updated: {TODAY}
// Run: python scripts/scrape_watches.py && python scripts/apply_watches.py

export type WatchAvailability = 'available' | 'sold_out' | 'pre_order' | 'coming_soon'
export type WatchCategory = 'Dive' | 'Field' | 'Dress' | 'Pilot' | 'Sport' | 'Casual' | 'Tool'

export interface WatchModel {{
  id: string
  brandSlug: string
  brandName: string
  name: string
  reference?: string
  priceUSD?: number
  priceDisplay?: string
  caseDiameterMm?: number
  lugToLugMm?: number
  lugWidthMm?: number
  thicknessMm?: number
  caseMaterial?: string
  dialColor?: string
  movement?: string
  powerReserveHours?: number
  crystal?: string
  waterResistanceBar?: number
  categories: WatchCategory[]
  imageUrl: string
  availability: WatchAvailability
  shopifyHandle?: string
  updatedAt: string
}}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const watches: WatchModel[] = ([
{entries}
] as any[]) as WatchModel[]

export function getWatchesByBrand(brandSlug: string): WatchModel[] {{
  return watches.filter(w => w.brandSlug === brandSlug)
}}

export function getAvailableWatches(): WatchModel[] {{
  return watches.filter(w => w.availability === 'available')
}}

export const watchBrands = [...new Set(watches.map(w => w.brandName))].sort()

export const watchDialColors = [...new Set(
  watches.map(w => w.dialColor).filter((c): c is string => Boolean(c))
)].sort()

export const watchMovements = [...new Set(
  watches.map(w => w.movement).filter((m): m is string => Boolean(m))
)].sort()
"""

    WATCHES_TS.write_text(ts, encoding='utf-8')
    print(f'Done — {len(deduped)} models written to {WATCHES_TS}')

    # Stats
    available = sum(1 for w in deduped if w['availability'] == 'available')
    sold_out  = sum(1 for w in deduped if w['availability'] == 'sold_out')
    brands_with_data = len(set(w['brandSlug'] for w in deduped))
    print(f'  Available: {available}  Sold out: {sold_out}  Brands with data: {brands_with_data}')


if __name__ == '__main__':
    main()
