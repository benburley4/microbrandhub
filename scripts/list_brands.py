import re, json
from pathlib import Path
text = Path(__file__).parent.parent.joinpath('src/data/brands.ts').read_text(encoding='utf-8')
entries = re.finditer(r'name:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?website:\s*[\'"`]([^\'"`]+)[\'"`]', text, re.S)
brands = [(m.group(1), m.group(2)) for m in entries if m.group(1) != 'string']
print(json.dumps(brands, ensure_ascii=False, indent=2))
