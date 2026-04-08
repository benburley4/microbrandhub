import re
from pathlib import Path

BRANDS_TS = Path(__file__).parent.parent / 'src' / 'data' / 'brands.ts'
text = BRANDS_TS.read_text(encoding='utf-8')

pattern = re.compile(r'(\{[^{}]*?name:\s*[\'"`]Autodromo[\'"`][^{}]*?\})', re.S)

def fix(m):
    b = m.group(1)
    b = re.sub(r',\s*heroImageUrl:\s*[\'"`][^\'"`]*[\'"`]', '', b)
    return b

new = pattern.sub(fix, text, count=1)
if new != text:
    BRANDS_TS.write_text(new, encoding='utf-8')
    print('removed Autodromo bad image')
else:
    print('not found')
