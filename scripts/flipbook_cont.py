import re
import subprocess

FLIPBOOK = 'public/magazine/issue-01/aegryn-magazine-issue-01_1.html'

with open(FLIPBOOK) as f:
    html = f.read()

orig_order = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', html)]
print(f"Base: {len(orig_order)} pages, last: p{orig_order[-1]}")
assert len(orig_order) == 92


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


# ── STEP 1: 2-col fixes ─────────────────────────────────────────────────────
html = html.replace(
    '<div class="bx-col" style="font-size:9px;line-height:1.65;margin-top:8px">The people',
    '<div class="bx-col" style="font-size:9px;line-height:1.5;margin-top:6px;column-count:2;column-gap:16px">The people'
)
html = html.replace(
    '<div class="bx-col3" style="font-size:9px;line-height:1.65">This is the quiet',
    '<div class="bx-col3" style="font-size:9px;line-height:1.5;column-count:2;column-gap:16px">This is the quiet'
)
print("p9/p18 2-col applied")

# ── STEP 2: Continuation pages ──────────────────────────────────────────────
# (src, next_in_html, zone_type: 'l'|'r'|'bx')
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
            print(f"p{src} ({zc}): no overflow — skip")
            continue
        html = html.replace(full_z, kept + '\n', 1)
        body = '\n'.join(f'  {p}' for p in over)
        html = insert_after(html, src, nxt, make_cont(rh, body))
        print(f"p{src} ({zc}): {len(over)} paras -> cont before p{nxt}")

    else:  # bx-col
        oi, first, second = bxcol_split(hp)
        if not second:
            print(f"p{src} bx-col: no overflow — skip")
            continue
        html = html.replace(oi, f'\n{first}\n', 1)

        if len(second) > 900:
            sp2 = second.rfind('. ', 0, 850)
            sp2 = sp2 + 1 if sp2 >= 0 else 850
            ov_a = second[:sp2].strip()
            ov_b = second[sp2:].strip()
            # Insert ov_b first (will be second cont page)
            html = insert_after(html, src, nxt, make_cont(rh, f'  <p class="bx">{ov_b}</p>'))
            # Insert ov_a before the pNEW we just inserted
            b2 = '</div></div></div>\n<div id="pNEW" class="pg">'
            if b2 in html:
                cont_a = make_cont(rh, f'  <p class="bx">{ov_a}</p>')
                html = html.replace(b2, f'</div></div></div>\n{cont_a}\n<div id="pNEW" class="pg">', 1)
                print(f"p{src} bx-col -> 2 cont pages")
            else:
                print(f"p{src} bx-col -> 1 cont (b2 not found)")
        else:
            html = insert_after(html, src, nxt, make_cont(rh, f'  <p class="bx">{second}</p>'))
            print(f"p{src} bx-col: {len(second)}c -> cont before p{nxt}")

new_count = html.count('id="pNEW"')
print(f"\nNew pages inserted: {new_count}")

# ── STEP 3: Renumber all pages 1..N ─────────────────────────────────────────
parts = re.split(r'(?=<div id="p(?:NEW|\d+)" class="pg">)', html)
pre = parts[0]
chunks = parts[1:]
print(f"Total chunks to renumber: {len(chunks)}")

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
print(f"Renumbered: 1 -> {total}")
print(f"Key mappings: p47->{old_to_new.get(47)}, p57->{old_to_new.get(57)}, "
      f"p94->{old_to_new.get(94)}, p110->{old_to_new.get(110)}, p120->{old_to_new.get(120)}")

# ── STEP 4: Verify ───────────────────────────────────────────────────────────
all_ids = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', html)]
seq_ok = all_ids == list(range(1, len(all_ids) + 1))
print(f"Sequential IDs 1->{len(all_ids)}: {seq_ok}")

lines = html.split('\n')
plmap = {}
po = []
for i, ln in enumerate(lines, 1):
    mm = re.match(r'<div id="p(\d+)"', ln)
    if mm:
        plmap[int(mm.group(1))] = i
        po.append(int(mm.group(1)))

folio_bad = 0
div_bad = []
for j, pnum in enumerate(po):
    s = plmap[pnum] - 1
    e = plmap[po[j + 1]] - 1 if j + 1 < len(po) else len(lines)
    raw = '\n'.join(lines[s:e])
    for f in re.findall(r'<div class="pn[^"]*">(\d+)</div>', raw):
        if int(f) != pnum:
            folio_bad += 1
    diff = raw.count('<div') - raw.count('</div>')
    if diff != 0 and pnum != po[-1]:
        div_bad.append((pnum, diff))

print(f"Folio mismatches: {folio_bad}")
print(f"Div imbalance pages: {div_bad if div_bad else 'NONE'}")

remote_imgs = [u for u in re.findall(r"url\('(https://[^']+)'\)", html)
               if 'fonts.googleapis' not in u]
print(f"Remote image URLs: {len(remote_imgs)}")

with open(FLIPBOOK, 'w') as f:
    f.write(html)
print("\nDone.")
