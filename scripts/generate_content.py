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
import sys
from pathlib import Path
from typing import Optional

# Fix Windows console encoding so Unicode characters in generated text don't crash print()
if sys.stdout.encoding and sys.stdout.encoding.lower() not in ('utf-8', 'utf-8-sig'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')  # type: ignore

try:
    from dotenv import load_dotenv
    load_dotenv(Path(__file__).parent.parent / ".env.local")
except ImportError:
    pass  # dotenv optional — can set DEEPSEEK_API_KEY in environment directly

DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
OLLAMA_URL = "http://localhost:11434/v1/chat/completions"
OLLAMA_MODEL = "phi4:14b"

# Set by --provider argument at runtime
_provider: str = "deepseek"  # default
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
# API helpers
# ---------------------------------------------------------------------------

import requests  # noqa: E402 (imported after env setup)


def call_ollama(prompt: str, temperature: float = 0.7) -> Optional[str]:
    """Call a local Ollama model via its OpenAI-compatible endpoint."""
    response = requests.post(
        OLLAMA_URL,
        headers={"Content-Type": "application/json"},
        json={
            "model": OLLAMA_MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": temperature,
            "max_tokens": 2000,
            "stream": False,
        },
        timeout=120,  # local models can be slower than remote APIs
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


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
            "max_tokens": 2000,
        },
        timeout=30,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


def call_llm(prompt: str, temperature: float = 0.7) -> Optional[str]:
    """Route to the active provider (set via --provider)."""
    if _provider == "ollama":
        return call_ollama(prompt, temperature)
    return call_deepseek(prompt, temperature)


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

REVIEW_PROMPT = """You are a senior watch reviewer for MicrobrandHub, the world's leading publication for independent watch enthusiasts. Your audience is highly knowledgeable, values value-for-money above brand heritage, and can spot a generic spec-sheet regurgitation. They care about the story, the finishing, the wearing experience, and what the community is saying.

Write a comprehensive review of the most iconic watch model from {brand_name} ({country}, {price_range}, specialises in {categories}).

Structure the body using these exact sections (use ## headings):
## The Brand Story & Context
Brief origin of the brand. Does this watch solve a problem the big brands (Seiko, Tissot, Hamilton) ignore?

## Design & Case
Case shape, finishing (brushed vs polished), thickness, lug-to-lug, crown feel. Dial: color, texture, indices (applied or printed?), handset. Address the community dealbreaker checks: is the lug width standard? Is the date wheel color-matched? Is the dial typography cohesive?

## Movement & Specs
Movement name (e.g. Miyota 9015, NH35, Sellita SW200). Real-world accuracy based on typical user reports. Crystal type and AR coating quality.

## Wrist Experience
Strap or bracelet quality: clasp (milled or pressed?), micro-adjust, comfort. How the dimensions feel on an average wrist. Lume brightness and longevity.

## Community Verdict
Synthesise representative praise and complaints as if from Reddit and watch forums (e.g. "The consensus among enthusiasts is..."). Cover customer service reputation and founder engagement.

## Verdict & Alternatives
Who this watch is for. List 2-3 direct competitors in the same price bracket. One punchy final sentence.

Return ONLY valid JSON (no markdown code fences, no explanation, no trailing commas):
{{
  "title": "Brand Model Review: One honest, compelling takeaway headline",
  "excerpt": "2-3 sentence TL;DR including price, key spec, and a Buy if... statement",
  "body": "Full review using the structure above. 800-1000 words. Use \\n\\n between sections. No unescaped double quotes — use single quotes where needed.",
  "rating": 4,
  "tags": ["Review", "{brand_name}"],
  "readingTime": 5,
  "scores": {{
    "design": 8,
    "value": 8,
    "wearability": 8,
    "community": 8,
    "overall": 8
  }}
}}

IMPORTANT: body must be a single JSON string. Use \\n\\n for paragraph breaks. No unescaped double quotes inside any string value."""


def call_gemini(prompt: str) -> Optional[str]:
    """Call Gemini 2.0 Flash with Google Search grounding enabled. Retries on 429."""
    if not GEMINI_API_KEY:
        raise EnvironmentError("GEMINI_API_KEY not set.")
    for attempt in range(4):
        response = requests.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            headers={"Content-Type": "application/json"},
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "maxOutputTokens": 4000,
                    "responseMimeType": "application/json",
                },
            },
            timeout=60,
        )
        if response.status_code == 429:
            wait = 15 * (attempt + 1)
            print(f" (rate limited, waiting {wait}s...)", end="", flush=True)
            time.sleep(wait)
            continue
        response.raise_for_status()
        return response.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
    raise RuntimeError("Gemini rate limit exceeded after retries")


def generate_brand_content(brand: dict) -> dict:
    """Generate rich content for a single brand."""
    prompt = BRAND_PROMPT.format(
        brand_name=brand["name"],
        country=brand["country"],
        categories=", ".join(brand["categories"]),
        price_range=brand["priceRange"],
        website=brand["website"],
    )
    raw = call_llm(prompt)
    return extract_json(raw)


def generate_review(brand: dict) -> dict:
    """Generate a review for a brand's flagship model."""
    prompt = REVIEW_PROMPT.format(
        brand_name=brand["name"],
        country=brand["country"],
        categories=", ".join(brand["categories"]),
        price_range=brand["priceRange"],
    )
    raw = call_gemini(prompt) if _provider == "gemini" else call_llm(prompt)
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
        try:
            existing = json.loads(out_file.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, ValueError):
            existing = {}

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
            out_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding='utf-8')
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
        try:
            existing = json.loads(out_file.read_text(encoding='utf-8'))
        except (json.JSONDecodeError, ValueError):
            existing = {}

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
            out_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False), encoding='utf-8')
            print("done")
        except Exception as e:
            print(f"ERROR: {e}")

        if i < total:
            time.sleep(5)  # Gemini free tier: 15 req/min — 5s gap keeps us safe

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
    parser = argparse.ArgumentParser(description="Generate MicrobrandHub content via DeepSeek, Gemini, or local Ollama")
    parser.add_argument("--mode", choices=["brands", "reviews", "brand", "review"],
                        default="brands", help="What to generate")
    parser.add_argument("--slug", help="Single brand slug (e.g. 'baltic') for --mode brand/review")
    parser.add_argument("--provider", choices=["deepseek", "gemini", "ollama"],
                        default="deepseek", help="LLM provider to use (default: deepseek)")
    parser.add_argument("--ollama-model", default=OLLAMA_MODEL,
                        help=f"Ollama model name (default: {OLLAMA_MODEL})")
    args = parser.parse_args()

    _provider = args.provider
    OLLAMA_MODEL = args.ollama_model

    if args.mode in ("brand", "brands"):
        run_brands(args.slug)
    else:
        run_reviews(args.slug)
