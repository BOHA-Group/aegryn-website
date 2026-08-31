"""
flipbook_renumber.py — Fix duplicate page IDs in the flipbook HTML.

ROOT CAUSE: The file contains 130 physical <div id="pN" class="pg..."> blocks
but only 102 unique ID values (25 IDs used twice, plus orphaned high IDs like
p108/p116/p118 left over from a prior TOT_REAL=120 numbering scheme that was
never fully compacted). Since the JS viewer uses querySelector('#pN'), only
the FIRST occurrence of a duplicated ID is ever rendered — the second physical
block with the same ID is silently orphaned and never displayed. This explains
missing/incomplete content reported by the user.

FIX: Renumber all 130 physical blocks sequentially (1..130) in their existing
document order. This preserves 100% of existing content (no deletions), gives
every page a unique visible ID, and keeps the natural reading order intact.
"""
import re

FLIPBOOK = 'public/magazine/issue-01/aegryn-magazine-issue-01_1.html'
with open(FLIPBOOK) as f:
    html = f.read()

raw_parts = re.split(r'(?=<div id="p\d+" class="pg[^"]*">)', html)
preamble = raw_parts[0]
page_parts = [p for p in raw_parts[1:] if re.match(r'<div id="p\d+" class="pg[^"]*">', p)]

TOTAL = len(page_parts)
print(f"Total physical page blocks: {TOTAL}")

new_parts = []
for i, b in enumerate(page_parts):
    new_id = i + 1  # sequential 1..TOTAL
    mm = re.match(r'<div id="p(\d+)" class="(pg[^"]*)">', b)
    old_id = int(mm.group(1))
    cls = mm.group(2)

    # 1. Replace the opening id
    b_new = re.sub(
        r'^<div id="p\d+" class="pg[^"]*">',
        f'<div id="p{new_id}" class="{cls}">',
        b, count=1
    )

    # 2. Replace the trailing folio (skip cover p1 and back cover — no folio)
    is_dark = 'pg-navy' in cls
    side = 'pn-l' if new_id % 2 == 1 else 'pn-r'
    dk = ' pn-dk' if is_dark else ''

    def fix_folio(m):
        return f'class="pn{dk} {side}">{new_id}</div></div></div>'

    b_new2, n_sub = re.subn(
        r'class="pn(?:\s+pn-dk)?\s+pn-[lr]">\d+</div></div></div>\s*$',
        fix_folio,
        b_new
    )
    if n_sub == 0 and old_id not in (1, TOTAL if False else None):
        # Pages without a trailing folio (cover / back cover) — leave untouched
        pass

    new_parts.append(b_new2)

html_new = preamble + ''.join(new_parts)

# ── Update TOT_REAL in JS to match new total ─────────────────────────────────
html_new, n = re.subn(r'var TOT_REAL = \d+;', f'var TOT_REAL = {TOTAL};', html_new)
print(f"TOT_REAL updated: {n} occurrence(s) -> {TOTAL}")

# ── Verify ────────────────────────────────────────────────────────────────────
all_ids = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg[^"]*">', html_new)]
seq_ok = all_ids == list(range(1, TOTAL + 1))
print(f"Sequential 1..{TOTAL}: {seq_ok}")

from collections import Counter
dup_check = Counter(all_ids)
dups = {k: v for k, v in dup_check.items() if v > 1}
print(f"Remaining duplicate IDs: {dups if dups else 'NONE'}")

# div balance check per block
raw_parts2 = re.split(r'(?=<div id="p\d+" class="pg[^"]*">)', html_new)
bad = []
for p in raw_parts2[1:]:
    mm = re.match(r'<div id="p(\d+)" class="pg[^"]*">', p)
    if not mm:
        continue
    pid = int(mm.group(1))
    # Isolate just this block's own div (up to matching close) is hard with regex;
    # instead just check total divs/close-divs balance for the whole doc once at end.
print("(div balance verified globally below)")

remote_imgs = [u for u in re.findall(r"url\('(https://[^']+)'\)", html_new)]
print(f"Remote image URLs in CSS url(): {len(remote_imgs)}")

total_div_open = html_new.count('<div')
total_div_close = html_new.count('</div>')
print(f"Global <div> count: {total_div_open}, </div> count: {total_div_close}, balanced: {total_div_open == total_div_close}")

with open(FLIPBOOK, 'w') as f:
    f.write(html_new)
print("\nSaved.")
