import re
from pathlib import Path

BRANDS_TS = Path(__file__).parent.parent / 'src' / 'data' / 'brands.ts'
text = BRANDS_TS.read_text(encoding='utf-8')

bad = ['AnOrdain', 'Autodromo', 'Dufrane', 'Farer', 'Laco', 'Oak & Oscar', 'Redwood', 'Tusen\u00f6', 'Vario', 'Wolbrook']

for name in bad:
    pattern = re.compile(r'(\{[^{}]*?name:\s*[\'"`]' + re.escape(name) + r'[\'"`][^{}]*?\})', re.S)
    def fix(m):
        b = m.group(1)
        b = re.sub(r',\s*heroImageUrl:\s*[\'"`][^\'"`]*[\'"`]', '', b)
        return b
    new = pattern.sub(fix, text, count=1)
    if new != text:
        text = new
        print(f'removed heroImageUrl: {name}')

BRANDS_TS.write_text(text, encoding='utf-8')
print('done')
