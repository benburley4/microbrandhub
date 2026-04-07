"""
Apply generated_reviews.json to src/data/reviews.ts.

Reads src/data/generated/generated_reviews.json (written by generate_content.py --mode reviews)
and appends any new AI-generated reviews to reviews.ts, preserving existing hand-written ones.

Usage:
  python scripts/apply_reviews.py
"""

import json
import re
from datetime import datetime
from pathlib import Path

GENERATED = Path(__file__).parent.parent / "src" / "data" / "generated" / "generated_reviews.json"
REVIEWS_TS = Path(__file__).parent.parent / "src" / "data" / "reviews.ts"


def slug(name: str) -> str:
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')


def esc_backtick(s: str) -> str:
    """Escape a string for use inside a TypeScript template literal."""
    return s.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')


def review_to_ts(brand_name: str, data: dict) -> str:
    title       = data.get("title", f"{brand_name} Watch Review")
    excerpt     = data.get("excerpt", "")
    body        = data.get("body", "")
    rating      = data.get("rating")
    tags        = data.get("tags", [brand_name, "Review"])
    reading_time = data.get("readingTime", 5)
    brand_slug  = data.get("brandSlug") or slug(brand_name)
    author      = data.get("author", "Editorial Team")
    published   = data.get("publishedAt", datetime.now().strftime("%Y-%m-%d"))
    review_slug = slug(title[:60])

    tags_ts = json.dumps(tags, ensure_ascii=False)
    rating_ts = str(rating) if rating is not None else "undefined"
    image_url = f"https://placehold.co/1200x600/1c1917/d97706?text={brand_name.replace(' ', '+')}"

    return f"""  {{
    slug: '{review_slug}',
    title: `{esc_backtick(title)}`,
    brand: '{brand_name}',
    brandSlug: '{brand_slug}',
    excerpt: `{esc_backtick(excerpt)}`,
    body: `{esc_backtick(body)}`,
    author: '{author}',
    publishedAt: '{published}',
    readingTime: {reading_time},
    tags: {tags_ts},
    rating: {rating_ts},
    featuredImage: '{image_url}',
  }},"""


def main():
    if not GENERATED.exists():
        print("No generated_reviews.json found. Run: python scripts/generate_content.py --mode reviews")
        return

    with open(GENERATED, encoding='utf-8') as f:
        generated = json.load(f)

    print(f"Loaded {len(generated)} generated reviews")

    # Read existing reviews.ts
    src = REVIEWS_TS.read_text(encoding='utf-8')

    # Find existing slugs so we don't duplicate
    existing_slugs = set(re.findall(r"slug:\s*'([^']+)'", src))
    print(f"Existing reviews: {len(existing_slugs)}")

    # Find the closing ] of the reviews array
    # The array ends at the last ] before the export functions
    footer_start = src.find('\nexport function getReviewBySlug')
    if footer_start == -1:
        footer_start = src.find('\nexport const allTags')
    if footer_start == -1:
        print("Could not find array closing point in reviews.ts — aborting.")
        return

    # Find the ] that closes the array just before the footer
    array_close = src.rfind(']', 0, footer_start)
    if array_close == -1:
        print("Could not find closing ] for reviews array — aborting.")
        return

    new_entries = []
    skipped = 0
    for brand_name, data in generated.items():
        title = data.get("title", "")
        review_slug = slug(title[:60])
        if review_slug in existing_slugs:
            skipped += 1
            continue
        new_entries.append(review_to_ts(brand_name, data))
        existing_slugs.add(review_slug)

    if not new_entries:
        print(f"No new reviews to add ({skipped} already exist).")
        return

    # Insert new entries before the closing ]
    insertion = '\n' + '\n'.join(new_entries) + '\n'
    new_src = src[:array_close] + insertion + src[array_close:]

    REVIEWS_TS.write_text(new_src, encoding='utf-8')
    print(f"Added {len(new_entries)} new reviews to reviews.ts (skipped {skipped} duplicates)")


if __name__ == '__main__':
    main()
