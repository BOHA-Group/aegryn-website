"""
flipbook_build.py — Full single-pass rebuild of the flipbook.
Run from aegryn-site/ directory.
Steps:
  1. p9/p18: switch bx-col to 2-column layout
  2. Insert continuation pages for 9 overflow pages
  3. Renumber all pages 1..N sequentially
  4. Fix spread folios (multi-folio pages) using old->new mapping
  5. Verify integrity
"""
import re
import subprocess

FLIPBOOK = 'public/magazine/issue-01/aegryn-magazine-issue-01_1.html'

with open(FLIPBOOK) as f:
    html = f.read()

orig_order = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', html)]
assert len(orig_order) == 92, f"Expected 92 base pages, got {len(orig_order)}"
print(f"Base: {len(orig_order)} pages")

# Load original for spread folio reference
orig_html = subprocess.run(
    ['git', 'show', '90924c7:public/magazine/issue-01/aegryn-magazine-issue-01_1.html'],
    capture_output=True, text=True
).stdout
orig_blocks = {}
for b in re.split(r'(?=<div id="p\d+" class="pg">)', orig_html)[1:]:
    mm = re.match(r'<div id="p(\d+)" class="pg">', b)
    if mm:
        orig_blocks[int(mm.group(1))] = b


# ── Helpers ──────────────────────────────────────────────────────────────────

def get_page(h, pnum):
    po = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', h)]
    idx = po.index(pnum)
    start = h.find(f'<div id="p{pnum}" class="pg">')
    end = h.find(f'<div id="p{po[idx+1]}" class="pg">') if idx + 1 < len(po) else len(h)
    return h[start:end]


def rh_of(hp):
    m = re.search(r'<div class="rh">(.*?)</div>', hp)
    return m.group(1) if m else ''


def make_cont(rh, body):
    return (
        '<div id="pNEW" class="pg">'
        '<div class="pg-frame" style="position:relative;width:420px;height:595px;overflow:hidden;'
        "background:#fff;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;\">"
        f'<div class="rh">{rh}</div>\n'
        '<div class="body">\n' + body + '\n</div>'
        '<div class="pn pn-SIDE">0</div>'
        '</div></div>'
    )


def insert_after(h, src, nxt, cont):
    b = f'</div></div></div>\n<div id="p{nxt}" class="pg">'
    if b not in h:
        b = f'</div></div></div><div id="p{nxt}" class="pg">'
    if b not in h:
        print(f"  !! boundary p{src}->p{nxt} NOT FOUND")
        return h
    return h.replace(b, f'</div></div></div>\n{cont}\n<div id="p{nxt}" class="pg">', 1)


def zone_split(hp, zc, mx=520):
    m = re.search(rf'class="{zc}">(.*?)(?=<div class="pn)', hp, re.DOTALL)
    if not m:
        return None, None, []
    zh = m.group(1)
    paras = re.findall(r'(<p[^>]*>.*?</p>)', zh, re.DOTALL)
    tot = 0
    for i, p in enumerate(paras):
        c = len(re.sub(r'<[^>]+>', '', p))
        if tot + c > mx:
            kept = zh
            for op in paras[i:]:
                kept = kept.replace(op, '', 1)
            return zh, kept.rstrip(), paras[i:]
        tot += c
    return zh, zh, []


def bxcol_split(hp, mx=600):
    m = re.search(r'(class="bx-col[^"]*"[^>]*>)(.*?)(</div>)', hp, re.DOTALL)
    if not m:
        return None, None, ''
    inner = m.group(2)
    full = re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', inner)).strip()
    if len(full) <= mx:
        return None, None, ''
    sp = full.rfind('. ', 0, mx)
    sp = sp + 1 if sp >= 0 else mx
    return inner, full[:sp].strip(), full[sp:].strip()


# ── STEP 1: p9/p18 → 2-column layout ────────────────────────────────────────
html = html.replace(
    '<div class="bx-col" style="font-size:9px;line-height:1.65;margin-top:8px">The people',
    '<div class="bx-col" style="font-size:9px;line-height:1.5;margin-top:6px;'
    'column-count:2;column-gap:16px">The people'
)
html = html.replace(
    '<div class="bx-col3" style="font-size:9px;line-height:1.65">This is the quiet',
    '<div class="bx-col3" style="font-size:9px;line-height:1.5;'
    'column-count:2;column-gap:16px">This is the quiet'
)
print("Step 1: p9/p18 2-col ✓")


# ── STEP 2: Insert continuation pages ───────────────────────────────────────
ops = [
    (47,  51,  'l'),
    (56,  57,  'bx'),
    (57,  61,  'r'),
    (63,  65,  'bx'),
    (74,  75,  'r'),
    (88,  89,  'l'),
    (89,  90,  'bx'),
    (94,  95,  'r'),
    (110, 111, 'l'),
]

for src, nxt, zt in ops:
    hp = get_page(html, src)
    rh = rh_of(hp)

    if zt in ('l', 'r'):
        zc = f'ga-text-{zt}'
        full_z, kept, over = zone_split(hp, zc)
        if not over:
            print(f"  p{src} ({zc}): no overflow — skip")
            continue
        html = html.replace(full_z, kept + '\n', 1)
        body = '\n'.join(f'  {p}' for p in over)
        html = insert_after(html, src, nxt, make_cont(rh, body))
        print(f"  p{src} ({zc}): {len(over)}p -> cont ✓")

    else:
        oi, first, second = bxcol_split(hp)
        if not second:
            print(f"  p{src} bx-col: no overflow — skip")
            continue
        html = html.replace(oi, f'\n{first}\n', 1)
        if len(second) > 900:
            sp2 = second.rfind('. ', 0, 850)
            sp2 = sp2 + 1 if sp2 >= 0 else 850
            ov_a, ov_b = second[:sp2].strip(), second[sp2:].strip()
            html = insert_after(html, src, nxt, make_cont(rh, f'  <p class="bx">{ov_b}</p>'))
            b2 = '</div></div></div>\n<div id="pNEW" class="pg">'
            if b2 in html:
                cont_a = make_cont(rh, f'  <p class="bx">{ov_a}</p>')
                html = html.replace(b2, f'</div></div></div>\n{cont_a}\n<div id="pNEW" class="pg">', 1)
                print(f"  p{src} bx-col -> 2 cont ✓")
            else:
                print(f"  p{src} bx-col -> 1 cont (b2 not found)")
        else:
            html = insert_after(html, src, nxt, make_cont(rh, f'  <p class="bx">{second}</p>'))
            print(f"  p{src} bx-col: {len(second)}c -> cont ✓")

new_count = html.count('id="pNEW"')
print(f"Step 2: {new_count} new pages inserted ✓")


# ── STEP 3: Renumber all pages 1..N ─────────────────────────────────────────
parts = re.split(r'(?=<div id="p(?:NEW|\d+)" class="pg">)', html)
pre = parts[0]
chunks = parts[1:]

old_to_new = {}
new_chunks = []
for n, chunk in enumerate(chunks, 1):
    m = re.match(r'<div id="p(NEW|\d+)" class="pg">', chunk)
    if not m:
        new_chunks.append(chunk)
        continue
    oid = m.group(1)
    chunk = chunk.replace(f'<div id="p{oid}" class="pg">', f'<div id="p{n}" class="pg">', 1)
    side = 'l' if n % 2 == 1 else 'r'
    chunk = chunk.replace('pn-SIDE', f'pn-{side}')
    chunk = re.sub(
        r'(<div class="pn(?:[^"]*)">\s*)(?:0|\d+)(\s*</div>)',
        lambda mm, nn=n: mm.group(1) + str(nn) + mm.group(2),
        chunk
    )
    if oid != 'NEW':
        old_to_new[int(oid)] = n
    new_chunks.append(chunk)

html = pre + ''.join(new_chunks)
total = len(new_chunks)
print(f"Step 3: renumbered 1->{total} ✓")
print(f"  p47->{old_to_new.get(47)} p57->{old_to_new.get(57)} "
      f"p94->{old_to_new.get(94)} p110->{old_to_new.get(110)} p120->{old_to_new.get(120)}")


# ── STEP 4: Fix spread folios ────────────────────────────────────────────────
# Some pages contain multiple pn elements (spreads covering N physical pages).
# The renumber set them all to the page ID — restore correct secondary values.

def gap_new(old_f):
    """Map an old folio (possibly a gap page not in orig_order) to new folio."""
    if old_f in old_to_new:
        return old_to_new[old_f]
    preds = [k for k in sorted(old_to_new) if k < old_f]
    if not preds:
        return old_f
    pred = preds[-1]
    return old_f + (old_to_new[pred] - pred)


# Original spread pages and their folio sequences (from git show analysis)
orig_spreads = {
    13:  [13, 14, 15, 16],
    29:  [29, 30, 31, 32, 33],
    36:  [36, 37],
    47:  [47, 48, 49, 50],
    57:  [57, 58, 59, 60],
    63:  [63, 64],
    75:  [75, 76, 77, 78, 79],
    80:  [80, 81, 82, 83],       # navigation thumbnails
    82:  [82, 83],
    84:  [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99],
    95:  [95, 96, 97, 98],
    99:  [99, 100],
    107: [107, 108],
    115: [115, 116],
    117: [117, 118],
}

cur_parts2 = re.split(r'(?=<div id="p\d+" class="pg">)', html)
pre2 = cur_parts2[0]
cur_blocks2 = cur_parts2[1:]

spread_fixes = 0
for orig_pn, orig_folios in orig_spreads.items():
    new_pn = old_to_new.get(orig_pn)
    if new_pn is None:
        continue
    ob = orig_blocks.get(orig_pn, '')
    if not ob:
        continue
    orig_pns = re.findall(r'(<div class="pn[^"]*">)(\d+)(</div>)', ob)
    if len(orig_pns) <= 1:
        continue  # no secondary folios to fix
    new_folio_seq = [gap_new(int(f)) for _, f, _ in orig_pns]

    idx = new_pn - 1
    if idx < 0 or idx >= len(cur_blocks2):
        continue
    cb = cur_blocks2[idx]
    cur_pns = re.findall(r'(<div class="pn[^"]*">)(\d+)(</div>)', cb)
    if len(cur_pns) != len(orig_pns):
        # Counts differ (e.g. navigation page rebuilt differently) — skip
        continue

    new_cb = cb
    for (pt, cur_f, st), new_f in zip(cur_pns, new_folio_seq):
        old_str = f'{pt}{cur_f}{st}'
        new_str = f'{pt}{new_f}{st}'
        new_cb = new_cb.replace(old_str, new_str, 1)

    if new_cb != cb:
        cur_blocks2[idx] = new_cb
        spread_fixes += 1

html = pre2 + ''.join(cur_blocks2)
print(f"Step 4: {spread_fixes} spread blocks updated ✓")


# ── STEP 5: Verify ───────────────────────────────────────────────────────────
all_ids = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', html)]
seq_ok = all_ids == list(range(1, len(all_ids) + 1))

lines = html.split('\n')
plmap = {}
po = []
for i, ln in enumerate(lines, 1):
    mm = re.match(r'<div id="p(\d+)"', ln)
    if mm:
        plmap[int(mm.group(1))] = i
        po.append(int(mm.group(1)))

known_spread_new = set(old_to_new.get(k) for k in orig_spreads if old_to_new.get(k))
folio_unexpected = 0
div_bad = []
for j, pnum in enumerate(po):
    s = plmap[pnum] - 1
    e = plmap[po[j + 1]] - 1 if j + 1 < len(po) else len(lines)
    raw = '\n'.join(lines[s:e])
    for f in re.findall(r'<div class="pn[^"]*">(\d+)</div>', raw):
        if int(f) != pnum and pnum not in known_spread_new:
            folio_unexpected += 1
    diff = raw.count('<div') - raw.count('</div>')
    if diff != 0 and pnum != po[-1]:
        div_bad.append((pnum, diff))

remote_imgs = [u for u in re.findall(r"url\('(https://[^']+)'\)", html)
               if 'fonts.googleapis' not in u]

print(f"\n{'='*50}")
print(f"Pages:              {len(all_ids)} (sequential: {seq_ok})")
print(f"Unexpected folios:  {folio_unexpected}")
print(f"Div imbalance:      {div_bad if div_bad else 'NONE'}")
print(f"Remote image URLs:  {len(remote_imgs)}")
print(f"{'='*50}")

with open(FLIPBOOK, 'w') as f:
    f.write(html)
print("Saved ✓")
