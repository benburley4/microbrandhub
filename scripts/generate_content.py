"""
DeepSeek Content Generator for MicrobrandHub
Generates brand descriptions, watch reviews, and SEO metadata via DeepSeek API.

Usage:
  python scripts/generate_content.py --mode brands       # Generate all brand descriptions
  python scripts/generate_content.py --mode reviews      # Generate watch reviews
  python scripts/generate_content.py --mode brand --slug baltic  # Single brand

Requirements:
  pip install requests python-dotenv

Cost estimate: ~$0.01-$0.07 total for all 93 brands + reviews
"""

import os
import json
import time
import argparse
import re
from pathlib import Path
from typing import Optional

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
except ImportError:
    pass  # dotenv optional — can set DEEPSEEK_API_KEY in environment directly

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
OUTPUT_DIR = Path(__file__).parent.parent / "src" / "data" / "generated"

# ---------------------------------------------------------------------------
# Brand data (mirrored from brands.ts so this script is self-contained)
# ---------------------------------------------------------------------------
BRANDS = [
    {"name": "Aevig", "country": "Norway", "priceRange": "$300–$600", "categories": ["Field", "Sport"], "website": "https://aevig.com"},
    {"name": "Akrone", "country": "France", "priceRange": "$300–$600", "categories": ["Sport", "Casual"], "website": "https://akrone.fr"},
    {"name": "AnOrdain", "country": "Scotland", "priceRange": "$1,000–$2,000", "categories": ["Dress"], "website": "https://anordain.com"},
    {"name": "Aquatico", "country": "USA", "priceRange": "$300–$600", "categories": ["Dive"], "website": "https://aquaticowatches.com"},
    {"name": "Aragon", "country": "USA", "priceRange": "Under $300", "categories": ["Dive", "Sport"], "website": "https://aragonwatches.com"},
    {"name": "Astor + Banks", "country": "USA", "priceRange": "$300–$600", "categories": ["Dress", "Casual"], "website": "https://astorandbanks.com"},
    {"name": "Atelier Wen", "country": "China", "priceRange": "$300–$600", "categories": ["Dress", "Casual"], "website": "https://atelierwen.com"},
    {"name": "Autodromo", "country": "USA", "priceRange": "$600–$1,000", "categories": ["Sport", "Casual"], "website": "https://autodromo.com"},
    {"name": "Baltic", "country": "France", "priceRange": "$300–$600", "categories": ["Dress", "Casual", "Dive"], "website": "https://baltic-watches.com"},
    {"name": "Beaubleu", "country": "France", "priceRange": "$600–$1,000", "categories": ["Casual", "Dress"], "website": "https://beaubleu-paris.com"},
    {"name": "Bertucci", "country": "USA", "priceRange": "Under $300", "categories": ["Field", "Tool"], "website": "https://bertucciwatches.com"},
    {"name": "Boldr", "country": "Singapore", "priceRange": "$300–$600", "categories": ["Field", "Sport", "Dive"], "website": "https://boldrsupply.co"},
    {"name": "Borealis", "country": "Portugal", "priceRange": "$300–$600", "categories": ["Dive"], "website": "https://borealiswatch.com"},
    {"name": "Bravur", "country": "Sweden", "priceRange": "$600–$1,000", "categories": ["Dress", "Casual"], "website": "https://bravur.com"},
    {"name": "Brew", "country": "USA", "priceRange": "$300–$600", "categories": ["Casual", "Sport"], "website": "https://brewwatchco.com"},
    {"name": "Briston", "country": "France", "priceRange": "$300–$600", "categories": ["Casual", "Sport"], "website": "https://briston.com"},
    {"name": "Christopher Ward", "country": "UK", "priceRange": "$600–$1,000", "categories": ["Dress", "Dive", "Sport"], "website": "https://christopherward.com"},
    {"name": "Circula", "country": "Germany", "priceRange": "$300–$600", "categories": ["Dress", "Sport"], "website": "https://circula.com"},
    {"name": "Code41", "country": "Switzerland", "priceRange": "$1,000–$2,000", "categories": ["Sport", "Casual"], "website": "https://code41.com"},
    {"name": "Damasko", "country": "Germany", "priceRange": "$1,000–$2,000", "categories": ["Field", "Tool", "Dive"], "website": "https://damasko.de"},
    {"name": "Dan Henry", "country": "USA", "priceRange": "Under $300", "categories": ["Casual", "Dive", "Pilot"], "website": "https://danhenrywatches.com"},
    {"name": "Dekla", "country": "Germany", "priceRange": "$300–$600", "categories": ["Pilot", "Field"], "website": "https://dekla.de"},
    {"name": "Depancel", "country": "France", "priceRange": "$300–$600", "categories": ["Sport", "Casual"], "website": "https://depancel.com"},
    {"name": "Elliot Brown", "country": "UK", "priceRange": "$300–$600", "categories": ["Field", "Sport", "Dive"], "website": "https://elliotbrownwatches.com"},
    {"name": "Enoksen", "country": "UK", "priceRange": "$300–$600", "categories": ["Pilot", "Field"], "website": "https://enoksen.com"},
    {"name": "Eza", "country": "Germany", "priceRange": "$600–$1,000", "categories": ["Dive", "Sport"], "website": "https://eza.watch"},
    {"name": "Farer", "country": "UK", "priceRange": "$600–$1,000", "categories": ["Dive", "Sport", "Pilot"], "website": "https://farer.com"},
    {"name": "Fears", "country": "UK", "priceRange": "$1,000–$2,000", "categories": ["Dress"], "website": "https://fearswatches.com"},
    {"name": "Formex", "country": "Switzerland", "priceRange": "$600–$1,000", "categories": ["Dive", "Sport"], "website": "https://formex.ch"},
    {"name": "Furlan Marri", "country": "Switzerland", "priceRange": "$600–$1,000", "categories": ["Dress", "Casual"], "website": "https://furlan-marri.com"},
    {"name": "Ginault", "country": "USA", "priceRange": "$1,000–$2,000", "categories": ["Dive"], "website": "https://ginault.com"},
    {"name": "Gruppo Gamma", "country": "Canada", "priceRange": "$300–$600", "categories": ["Dive", "Field"], "website": "https://gruppogamma.com"},
    {"name": "Halios", "country": "Canada", "priceRange": "$600–$1,000", "categories": ["Dive", "Sport"], "website": "https://halios.ca"},
    {"name": "H2O", "country": "Denmark", "priceRange": "$300–$600", "categories": ["Dive"], "website": "https://h2owatches.dk"},
    {"name": "Horage", "country": "Switzerland", "priceRange": "$1,000–$2,000", "categories": ["Dress", "Sport"], "website": "https://horage.com"},
    {"name": "Huckleberry", "country": "Australia", "priceRange": "$300–$600", "categories": ["Field", "Casual"], "website": "https://huckleberrywatches.com"},
    {"name": "Islander", "country": "USA", "priceRange": "Under $300", "categories": ["Dive"], "website": "https://islanderwatches.com"},
    {"name": "Isotope", "country": "UK", "priceRange": "$300–$600", "categories": ["Dive", "Sport"], "website": "https://isotopewatches.com"},
    {"name": "Junghans", "country": "Germany", "priceRange": "$300–$600", "categories": ["Dress", "Casual"], "website": "https://junghans.de"},
    {"name": "Kopman", "country": "Denmark", "priceRange": "$300–$600", "categories": ["Dress", "Casual"], "website": "https://kopmanwatches.com"},
    {"name": "Laco", "country": "Germany", "priceRange": "$300–$600", "categories": ["Pilot", "Field"], "website": "https://laco.de"},
    {"name": "Lorier", "country": "USA", "priceRange": "$300–$600", "categories": ["Dive", "Field", "Dress"], "website": "https://lorierwatch.com"},
    {"name": "Marathon", "country": "Canada", "priceRange": "$300–$600", "categories": ["Field", "Tool", "Dive"], "website": "https://marathonwatch.com"},
    {"name": "Marloe", "country": "UK", "priceRange": "$300–$600", "categories": ["Dress", "Field"], "website": "https://marloewatchco.com"},
    {"name": "Mercer", "country": "Switzerland", "priceRange": "$600–$1,000", "categories": ["Dress", "Casual"], "website": "https://mercerwatches.com"},
    {"name": "Monta", "country": "USA", "priceRange": "$600–$1,000", "categories": ["Dress", "Sport", "Dive"], "website": "https://montawatch.com"},
    {"name": "Nomos", "country": "Germany", "priceRange": "$1,000–$2,000", "categories": ["Dress", "Casual"], "website": "https://nomos-glashuette.com"},
    {"name": "NTH", "country": "USA", "priceRange": "$300–$600", "categories": ["Dive"], "website": "https://nthwatches.com"},
    {"name": "Oris", "country": "Switzerland", "priceRange": "$1,000–$2,000", "categories": ["Dive", "Pilot", "Dress"], "website": "https://oris.ch"},
    {"name": "Phoibos", "country": "China", "priceRange": "Under $300", "categories": ["Dive", "Sport"], "website": "https://phoiboswatches.com"},
    {"name": "Praesidus", "country": "USA", "priceRange": "$300–$600", "categories": ["Field", "Tool"], "website": "https://praesidus.com"},
    {"name": "Prometheus", "country": "Singapore", "priceRange": "$300–$600", "categories": ["Dive"], "website": "https://prometheuswatchco.com"},
    {"name": "RZE", "country": "Singapore", "priceRange": "$300–$600", "categories": ["Field", "Sport"], "website": "https://rze-watches.com"},
    {"name": "San Martin", "country": "China", "priceRange": "Under $300", "categories": ["Dive", "Sport"], "website": "https://sanmartinwatch.com"},
    {"name": "Serica", "country": "France", "priceRange": "$600–$1,000", "categories": ["Dress", "Casual"], "website": "https://sericawatches.com"},
    {"name": "Sinn", "country": "Germany", "priceRange": "$1,000–$2,000", "categories": ["Pilot", "Dive", "Tool"], "website": "https://sinn.de"},
    {"name": "Steinhart", "country": "Germany", "priceRange": "$300–$600", "categories": ["Dive", "Pilot"], "website": "https://steinhartwatches.de"},
    {"name": "Stowa", "country": "Germany", "priceRange": "$600–$1,000", "categories": ["Pilot", "Dress"], "website": "https://stowa.de"},
    {"name": "Studio Underd0g", "country": "UK", "priceRange": "$300–$600", "categories": ["Casual", "Sport"], "website": "https://studiounderd0g.com"},
    {"name": "Temption", "country": "Germany", "priceRange": "$600–$1,000", "categories": ["Sport", "Casual"], "website": "https://temption.de"},
    {"name": "Tissot", "country": "Switzerland", "priceRange": "$300–$600", "categories": ["Dress", "Sport", "Pilot"], "website": "https://tissot.ch"},
    {"name": "Traska", "country": "USA", "priceRange": "$300–$600", "categories": ["Field", "Dive", "Casual"], "website": "https://traskawatch.com"},
    {"name": "Vario", "country": "Singapore", "priceRange": "$300–$600", "categories": ["Dress", "Casual"], "website": "https://vario.sg"},
    {"name": "Vertex", "country": "UK", "priceRange": "$1,000–$2,000", "categories": ["Field", "Tool"], "website": "https://vertex-watches.com"},
    {"name": "Vostok", "country": "Russia", "priceRange": "Under $300", "categories": ["Field", "Dive", "Sport"], "website": "https://vostok.ru"},
    {"name": "Wenger", "country": "Switzerland", "priceRange": "$300–$600", "categories": ["Field", "Sport"], "website": "https://wenger.com"},
    {"name": "Xeric", "country": "USA", "priceRange": "$300–$600", "categories": ["Casual", "Sport"], "website": "https://xericwatch.com"},
    {"name": "Yema", "country": "France", "priceRange": "$600–$1,000", "categories": ["Dive", "Sport", "Field"], "website": "https://yema.com"},
    {"name": "Zodiac", "country": "Switzerland", "priceRange": "$600–$1,000", "categories": ["Dive", "Sport", "Casual"], "website": "https://zodiacwatches.com"},
]

# ---------------------------------------------------------------------------
# DeepSeek API helpers
# ---------------------------------------------------------------------------

import requests  # noqa: E402 (imported after env setup)


def call_deepseek(prompt: str, temperature: float = 0.7) -> Optional[str]:
    """Call DeepSeek chat API and return the response text."""
    if not DEEPSEEK_API_KEY:
        raise EnvironmentError("DEEPSEEK_API_KEY not set. Add it to .env.local or set as environment variable.")

    response = requests.post(
        DEEPSEEK_URL,
        headers={
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "deepseek-chat",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": 800,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


def extract_json(text: str) -> dict:
    """Extract JSON from a response that may have markdown code fences."""
    # Strip ```json ... ``` fences if present
    match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if match:
        text = match.group(1)
    text = text.strip()
    # Try direct parse first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Find outermost {...} block
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return json.loads(text[start:end+1])
        raise


# ---------------------------------------------------------------------------
# Brand content generation
# ---------------------------------------------------------------------------

BRAND_PROMPT = """You are a watch enthusiast and professional copywriter specialising in microbrand watches.
Generate rich content for {brand_name}, a microbrand watch company.

Brand context:
- Country of origin: {country}
- Speciality: {categories}
- Price range: {price_range}
- Website: {website}

Return ONLY valid JSON (no markdown, no explanation) in this exact format:
{{
  "brand_description": "150-200 word overview of the brand's philosophy, heritage, and what makes them distinctive",
  "key_collection": "60-80 word description of their signature watch collection or most popular model",
  "why_buy": ["USP 1", "USP 2", "USP 3", "USP 4"],
  "seo_title": "60-character max SEO title including brand name and watch type",
  "seo_description": "150-155 character meta description for the brand page"
}}"""

REVIEW_PROMPT = """You are a professional watch reviewer writing for MicrobrandHub.com, a site dedicated to independent microbrand watches.
Write an in-depth review of the most popular watch model from {brand_name} ({country}, {price_range}, specialises in {categories}).

Return ONLY valid JSON (no markdown code fences, no explanation, no trailing commas) in this exact format:
{{
  "title": "Review title including brand name and model",
  "excerpt": "2-3 sentence summary of the watch for listing cards",
  "body": "Full review text. Use ## for section headings. Separate sections with two newlines. Include: Overview, Design, Movement, Value, Verdict. Write 350-500 words. Do NOT use any quotes inside this string - use single quotes only if needed.",
  "rating": 4,
  "tags": ["Review", "{brand_name}"],
  "readingTime": 5
}}

IMPORTANT: The body field must be a single JSON string with \\n for newlines. No unescaped double quotes inside strings."""


def generate_brand_content(brand: dict) -> dict:
    """Generate rich content for a single brand."""
    prompt = BRAND_PROMPT.format(
        brand_name=brand["name"],
        country=brand["country"],
        categories=", ".join(brand["categories"]),
        price_range=brand["priceRange"],
        website=brand["website"],
    )
    raw = call_deepseek(prompt)
    return extract_json(raw)


def generate_review(brand: dict) -> dict:
    """Generate a review for a brand's flagship model."""
    prompt = REVIEW_PROMPT.format(
        brand_name=brand["name"],
        country=brand["country"],
        categories=", ".join(brand["categories"]),
        price_range=brand["priceRange"],
    )
    raw = call_deepseek(prompt, temperature=0.8)
    result = extract_json(raw)
    # Inject brand metadata
    slug_val = brand["name"].lower().replace(r"[^a-z0-9]+", "-").strip("-")
    slug_val = re.sub(r"[^a-z0-9]+", "-", slug_val).strip("-")
    result["brand"] = brand["name"]
    result["brandSlug"] = slug_val
    result["author"] = "MicrobrandHub Editorial"
    result["publishedAt"] = "2026-04-07"
    return result


# ---------------------------------------------------------------------------
# Batch runners
# ---------------------------------------------------------------------------

def run_brands(slug_filter: Optional[str] = None):
    """Generate brand content for all (or one) brands."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = OUTPUT_DIR / "brand_content.json"

    # Load existing results so we can resume interrupted runs
    existing: dict = {}
    if out_file.exists():
        existing = json.loads(out_file.read_text())

    targets = BRANDS
    if slug_filter:
        targets = [b for b in BRANDS if b["name"].lower().replace(" ", "-") == slug_filter.lower()]
        if not targets:
            print(f"Brand '{slug_filter}' not found.")
            return

    total = len(targets)
    for i, brand in enumerate(targets, 1):
        key = brand["name"]
        if key in existing and not slug_filter:
            print(f"[{i}/{total}] Skipping {key} (already generated)")
            continue

        print(f"[{i}/{total}] Generating content for {key}...", end=" ", flush=True)
        try:
            content = generate_brand_content(brand)
            existing[key] = content
            out_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False))
            print("done")
        except Exception as e:
            print(f"ERROR: {e}")

        if i < total:
            time.sleep(0.5)  # Respect rate limits

    print(f"\nSaved to {out_file}")
    print_cost_estimate(total, "brands")


def run_reviews(slug_filter: Optional[str] = None):
    """Generate reviews for all (or one) brands."""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    out_file = OUTPUT_DIR / "generated_reviews.json"

    existing: dict = {}
    if out_file.exists():
        existing = json.loads(out_file.read_text())

    targets = BRANDS
    if slug_filter:
        targets = [b for b in BRANDS if b["name"].lower().replace(" ", "-") == slug_filter.lower()]

    total = len(targets)
    for i, brand in enumerate(targets, 1):
        key = brand["name"]
        if key in existing and not slug_filter:
            print(f"[{i}/{total}] Skipping {key} (already generated)")
            continue

        print(f"[{i}/{total}] Generating review for {key}...", end=" ", flush=True)
        try:
            review = generate_review(brand)
            existing[key] = review
            out_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False))
            print("done")
        except Exception as e:
            print(f"ERROR: {e}")

        if i < total:
            time.sleep(0.5)

    print(f"\nSaved to {out_file}")
    print_cost_estimate(total, "reviews")


def print_cost_estimate(count: int, mode: str):
    tokens_per_item = 800 if mode == "reviews" else 400
    total_tokens = count * tokens_per_item
    cost_low = total_tokens * 0.028 / 1_000_000
    cost_high = total_tokens * 0.28 / 1_000_000
    print(f"Estimated cost: ${cost_low:.4f}–${cost_high:.4f} ({total_tokens:,} tokens)")


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate MicrobrandHub content via DeepSeek API")
    parser.add_argument("--mode", choices=["brands", "reviews", "brand", "review"],
                        default="brands", help="What to generate")
    parser.add_argument("--slug", help="Single brand slug (e.g. 'baltic') for --mode brand/review")
    args = parser.parse_args()

    if args.mode in ("brand", "brands"):
        run_brands(args.slug)
    else:
        run_reviews(args.slug)
