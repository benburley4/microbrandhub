"""
Apply generated_drops.json to src/data/drops.ts.

Reads src/data/generated/generated_drops.json (written by watchdrops.py)
and regenerates the drops array in drops.ts, preserving the existing hand-curated
entries that aren't in the JSON.

Usage:
  python scripts/apply_drops.py
"""

import json
import re
from pathlib import Path
from datetime import datetime

GENERATED = Path(__file__).parent.parent / "src" / "data" / "generated" / "generated_drops.json"
DROPS_TS  = Path(__file__).parent.parent / "src" / "data" / "drops.ts"


def escape_ts_string(s: str) -> str:
    """Escape a string for use inside a TypeScript single-quoted string."""
    return s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', ' ').replace('\r', '')


def drop_to_ts(d: dict) -> str:
    status    = d.get("status", "live")
    price     = d.get("price", 0)
    price_val = int(price) if isinstance(price, float) and price == int(price) else price
    lines = [
        "  {",
        f"    id: '{escape_ts_string(d['id'])}',",
        f"    brand: '{escape_ts_string(d['brand'])}',",
        f"    brandSlug: '{escape_ts_string(d['brandSlug'])}',",
        f"    title: '{escape_ts_string(d['title'])}',",
        f"    description: '{escape_ts_string(d.get('description', ''))}',",
        f"    dropDate: '{d.get('dropDate', datetime.now().strftime('%Y-%m-%d'))}',",
        f"    status: '{status}',",
        f"    price: {price_val},",
        f"    currency: '{d.get('currency', 'USD')}',",
        f"    imageUrl: '{escape_ts_string(d.get('imageUrl', ''))}',",
        f"    url: '{escape_ts_string(d.get('url', ''))}',",
        "  },",
    ]
    return '\n'.join(lines)


def main():
    if not GENERATED.exists():
        print("No generated_drops.json found. Run /watchdrops first.")
        return

    with open(GENERATED, encoding='utf-8') as f:
        generated = json.load(f)

    print(f"Loaded {len(generated)} drops from generated_drops.json")

    # Read existing drops.ts to extract the header/footer and any hand-curated
    # entries not present in generated JSON
    src = DROPS_TS.read_text(encoding='utf-8')

    # Extract everything before the array and after it
    header_end = src.find('export const drops: Drop[] = [')
    if header_end == -1:
        print("Could not find 'export const drops: Drop[] = [' in drops.ts — aborting.")
        return

    footer_start = src.rfind('\nexport function')
    header = src[:header_end]
    footer = src[footer_start:] if footer_start != -1 else '\n'

    # Sort: upcoming first, then live, then sold_out; within each group newest first
    status_order = {'upcoming': 0, 'live': 1, 'sold_out': 2}
    generated_sorted = sorted(
        generated,
        key=lambda d: (status_order.get(d.get('status', 'live'), 1),
                       d.get('dropDate', ''), )
    )[:60]  # cap at 60 entries to keep the file manageable

    lines = [
        header,
        'export const drops: Drop[] = [\n',
    ]
    for drop in generated_sorted:
        lines.append(drop_to_ts(drop) + '\n')
    lines.append(']')
    lines.append(footer)

    DROPS_TS.write_text(''.join(lines), encoding='utf-8')
    print(f"Updated drops.ts with {len(generated_sorted)} entries")
    print(f"  Upcoming: {sum(1 for d in generated_sorted if d.get('status') == 'upcoming')}")
    print(f"  Live:     {sum(1 for d in generated_sorted if d.get('status') == 'live')}")
    print(f"  Sold out: {sum(1 for d in generated_sorted if d.get('status') == 'sold_out')}")


if __name__ == '__main__':
    main()
