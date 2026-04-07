"""
Fix brands.ts: replace description: '...' single-quoted strings with template literals.

Single-quoted TS strings break when the description contains apostrophes (brand's, ocean's, etc.).
Template literals (backticks) handle apostrophes, double quotes, and special chars without escaping.

This script:
1. Reads brands.ts line by line
2. Finds lines containing  description: '...'
3. Extracts the full description value (handling the fact that apostrophes break naive parsing)
4. Re-encodes it as a template literal

Strategy for extracting the value despite broken apostrophes:
- We know descriptions always start after  description: '  and end before  ', website:
- But the string may contain unescaped ' so we find the LAST  ', website:  occurrence
- Then strip the leading  description: '  and trailing  '
"""

import re
from pathlib import Path
import json

BRANDS_TS = Path(__file__).parent.parent / "src" / "data" / "brands.ts"
GENERATED = Path(__file__).parent.parent / "src" / "data" / "generated" / "brand_content.json"


def fix_line(line: str, brand_name_to_desc: dict) -> str:
    """Replace description: '...' with description: `...` for a given brand line."""
    # Match  name: 'BrandName'  to identify the brand
    name_match = re.search(r"name:\s*'([^']+)'", line)
    if not name_match:
        name_match = re.search(r'name:\s*"([^"]+)"', line)
    if not name_match:
        return line

    brand_name = name_match.group(1)

    # Find the description field - it starts with  description: '
    # and ends with  ', website:  (note: the ' before , website: is the closing quote)
    desc_marker = "description: '"
    website_marker = "', website:"

    if desc_marker not in line or website_marker not in line:
        return line

    desc_start = line.index(desc_marker) + len(desc_marker)
    # Find the LAST occurrence of ', website: to handle apostrophes in the description
    desc_end = line.rindex(website_marker)

    raw_desc = line[desc_start:desc_end]

    # If we have a clean description from brand_content.json, use that instead
    if brand_name in brand_name_to_desc:
        clean_desc = brand_name_to_desc[brand_name]
        # Escape backticks and ${} in the description for use in template literal
        clean_desc = clean_desc.replace('`', '\\`').replace('${', '\\${')
        new_desc = clean_desc
    else:
        # Clean up the raw description (unescape already-escaped apostrophes, remove mojibake etc.)
        new_desc = raw_desc.replace("\\'", "'").replace('`', '\\`').replace('${', '\\${')

    # Replace the single-quoted description with a template literal
    before = line[:line.index(desc_marker)]
    after = line[desc_end + len(website_marker):]

    return f"{before}description: `{new_desc}`, website:{after}"


def main():
    # Load clean descriptions from brand_content.json if available
    brand_name_to_desc = {}
    if GENERATED.exists():
        content = json.loads(GENERATED.read_text(encoding='utf-8-sig', errors='replace'))
        for brand_name, data in content.items():
            desc = data.get("brand_description", "").replace('\n', ' ').strip()
            if desc:
                brand_name_to_desc[brand_name] = desc
        print(f"Loaded {len(brand_name_to_desc)} clean descriptions from brand_content.json")
    else:
        print("No brand_content.json found — will fix apostrophes from existing descriptions only")

    src = BRANDS_TS.read_text(encoding='utf-8')
    lines = src.split('\n')

    fixed = 0
    result_lines = []
    for line in lines:
        if "description: '" in line and "', website:" in line:
            new_line = fix_line(line, brand_name_to_desc)
            if new_line != line:
                fixed += 1
            result_lines.append(new_line)
        else:
            result_lines.append(line)

    BRANDS_TS.write_text('\n'.join(result_lines), encoding='utf-8')
    print(f"Fixed {fixed} description fields in brands.ts")


if __name__ == '__main__':
    main()
