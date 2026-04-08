import re
from pathlib import Path

text = Path(__file__).parent.parent.joinpath('src/data/brands.ts').read_text(encoding='utf-8')
entries = re.finditer(r'\{[^{}]*?name:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?website:\s*[\'"`]([^\'"`]+)[\'"`][^{}]*?\}', text, re.S)
missing = []
for m in entries:
    name = m.group(1)
    if 'heroImageUrl' not in m.group(0):
        missing.append(name)
print(len(missing), 'missing:')
for n in missing:
    print(' ', n)
