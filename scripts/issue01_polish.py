"""
issue01_polish.py — Issue 01 v1.2 : QA et corrections demandees apres relecture.

Operations, dans l'ordre :
1. Correctifs de contenu (avant suppression de pages, sur le flipbook ET la
   web edition) : fusion des deux entrees Lisbon dupliquees, suppression de
   la photo a retirer (dossier, interview CFO), aeration du texte Guex,
   adoucissement du surlignage des questions d'interview, page subblink en
   navy sans mention "Advertising", correctifs CSS (boites "IA" .cta/
   .stat-card -> style editorial a filet, dates .tbl sur une ligne).
2. Correction de chevauchement texte/photo (.ga-photo-top avec hauteur
   personnalisee : le texte doit demarrer a calc(X% + 28px), pas X%).
3. Suppression des 4 emplacements publicitaires vides restants (p16, 58,
   105, 153) : aucun contenu, "Publicite/Advertising" en tete inutile.
4. Renumerotation complete (comme issue01_enrich.py), report dans toc.ts
   et la web edition (sommaire, renvois "page N", table Who You Will Meet).

Usage : python3 scripts/issue01_polish.py   (depuis aegryn-site/, apres
avoir execute issue01_enrich.py au moins une fois ; agit sur les fichiers
actuels dans private/magazine/issue-01/ et content/magazine/issue-01/toc.ts).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FLIP = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_1.html'
WEB  = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_web.html'
TOC  = ROOT / 'content/magazine/issue-01/toc.ts'

flip = FLIP.read_text()
web  = WEB.read_text()
toc  = TOC.read_text()

# ─────────────────────────────────────────────────────────────────────────────
# 1a. Lisbon : fusionner les deux entrees dupliquees (Life, European Tech Cities)
# ─────────────────────────────────────────────────────────────────────────────
old_lisbon_1 = ('<div style="padding:8px 0;border-bottom:.5px solid #e8e8e8">'
                '<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Lisbon</div>'
                '<p class="bx-sm" style="color:#6a6660">Still the most accessible entry point into a founder community for someone moving to Europe alone. '
                'English-speaking, architecturally beautiful, and cheap enough that a slow month does not become a crisis. '
                'Rents have risen sharply but remain a fraction of London or Zurich.</p></div>')
new_lisbon = ('<div style="padding:8px 0;border-bottom:.5px solid #e8e8e8">'
              '<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Lisbon</div>'
              '<p class="bx-sm" style="color:#6a6660">The most accessible entry point into a founder community for someone moving to Europe alone, '
              'and the clearest policy bet of the group: Web Summit since 2016, a municipal Unicorn Factory since 2021, a D8 residence permit since 2022. '
              'The tax incentives of the first wave are largely gone; the community, the time zone and the flight map remain (see page 21). '
              'Rents have risen sharply but remain a fraction of London or Zurich.</p></div>')
assert flip.count(old_lisbon_1) == 1, 'flip: bloc Lisbon #1 introuvable'
flip = flip.replace(old_lisbon_1, new_lisbon, 1)

old_lisbon_2 = ('<div style="padding:8px 0;border-bottom:.5px solid #e8e8e8">'
                '<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Lisbon</div>'
                '<p class="bx-sm" style="color:#6a6660">Web Summit since 2016, a municipal Unicorn Factory since 2021, a D8 residence permit for remote workers since 2022. '
                'The tax incentives of the first wave are largely gone; the community, the time zone and the flight map remain (see page 21).</p></div>')
assert flip.count(old_lisbon_2) == 1, 'flip: bloc Lisbon #2 introuvable'
flip = flip.replace(old_lisbon_2, '', 1)
flip = flip.replace(
  '<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Zurich and Lausanne</div>'
  '<p class="bx-sm" style="color:#6a6660">No nomad visa, two of the world\'s top engineering schools,',
  '<div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Zurich</div>'
  '<p class="bx-sm" style="color:#6a6660">No nomad visa, two of the world\'s top engineering schools,', 1)

# Web edition : meme fusion
old_w1 = '<p><strong>Lisbon</strong></p><p>Still the most accessible entry point into a founder community for someone moving to Europe alone. English-speaking, architecturally beautiful, and cheap enough that a slow month does not become a crisis. Rents have risen sharply but remain a fraction of London or Zurich.</p>'
new_w  = ('<p><strong>Lisbon</strong></p><p>The most accessible entry point into a founder community for someone moving to Europe alone, and the clearest policy bet of the group: '
          'Web Summit since 2016, a municipal Unicorn Factory since 2021, a D8 residence permit since 2022. The tax incentives of the first wave are largely gone; the community, '
          'the time zone and the flight map remain (see page 21). Rents have risen sharply but remain a fraction of London or Zurich.</p>')
assert web.count(old_w1) == 1, 'web: bloc Lisbon #1 introuvable'
web = web.replace(old_w1, new_w, 1)
old_w2 = '<p><strong>Lisbon</strong></p><p>Web Summit since 2016, a municipal Unicorn Factory since 2021, a D8 residence permit for remote workers since 2022. The tax incentives of the first wave are largely gone; the community, the time zone and the flight map remain (see page 21).</p>'
assert web.count(old_w2) == 1, 'web: bloc Lisbon #2 introuvable'
web = web.replace(old_w2, '', 1)
web = web.replace('<p><strong>Zurich and Lausanne</strong></p><p>No nomad visa,',
                   '<p><strong>Zurich</strong></p><p>No nomad visa,', 1)
print('1a. Lisbon fusionne : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 1b. Retirer la photo (dossier, interview CFO, suite) et fermer la mise en page
# ─────────────────────────────────────────────────────────────────────────────
old_photo_block = ("<div style=\"position:absolute;top:28px;left:0;right:0;height:150px;background-image:url('images/1664575602554-2087b04935a5.jpg');"
                    "background-size:cover;background-position:center 30%;background-color:#EDEAE4\"></div>"
                    "<div class=\"body\" style=\"top:178px\">")
new_body = "<div class=\"body\">"
assert flip.count(old_photo_block) == 1, 'flip: bloc photo CFO introuvable'
flip = flip.replace(old_photo_block, new_body, 1)
print('1b. Photo retiree (interview CFO) : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 1c. Aerer le texte Julien Guex (p. interview, bx-col dc trop dense)
# ─────────────────────────────────────────────────────────────────────────────
n = flip.count('<p class="bx-sm" style="font-size:8.5px;line-height:1.55;font-style:italic;color:#5a5650;margin-bottom:8px">Since 1994,')
assert n == 1, f'flip: standfirst Guex introuvable ({n})'
flip = flip.replace(
  '<p class="bx-sm" style="font-size:8.5px;line-height:1.55;font-style:italic;color:#5a5650;margin-bottom:8px">Since 1994,',
  '<p class="bx-sm" style="font-size:9px;line-height:1.7;font-style:italic;color:#5a5650;margin-bottom:12px">Since 1994,', 1)
n = flip.count('<div class="bx-col dc" style="font-size:8.5px;line-height:1.55;column-gap:16px;margin-bottom:8px">He does not finance ideas.')
assert n == 1, f'flip: bx-col dc Guex introuvable ({n})'
flip = flip.replace(
  '<div class="bx-col dc" style="font-size:8.5px;line-height:1.55;column-gap:16px;margin-bottom:8px">He does not finance ideas.',
  '<div class="bx-col dc" style="font-size:9px;line-height:1.75;column-gap:20px;margin-bottom:10px">He does not finance ideas.', 1)
print('1c. Texte Guex aere : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 1d. Adoucir le surlignage des questions d'interview (dossier CFO) : retirer
#     l'effet "halo" (box-shadow), garder un simple surlignage texte
# ─────────────────────────────────────────────────────────────────────────────
old_mark = '<span style="background:rgba(90,221,164,.35);box-shadow:0 0 0 2px rgba(90,221,164,.35)">'
n = flip.count(old_mark)
assert n >= 1, 'flip: style de surlignage des questions introuvable'
flip = flip.replace(old_mark, '<span style="background:rgba(90,221,164,.3);padding:0 2px">', n)
print(f'1d. Surlignage questions adouci ({n} occurrences) : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 1e. Page subblink : navy (au lieu du noir pur de la charte subblink.com),
#     retrait de la mention "Advertising" en tete
# ─────────────────────────────────────────────────────────────────────────────
n = flip.count("background:#0c0c0c")
assert n >= 1, 'flip: fond subblink introuvable'
flip = flip.replace("background:#0c0c0c", "background:#0A1628")
old_sb_head = ('<div style="position:absolute;top:0;left:0;right:0;height:28px;display:flex;align-items:center;justify-content:center;'
               "font-family:'Plus Jakarta Sans',sans-serif;font-size:6px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;"
               'color:rgba(255,255,255,.3);border-bottom:.5px solid rgba(255,255,255,.08)">'
               '<span style="opacity:.6">Advertising</span><span style="margin:0 5px;opacity:.4">·</span>An Aegryn proprietary asset</div>')
assert flip.count(old_sb_head) == 1, 'flip: bandeau Advertising subblink introuvable'
flip = flip.replace(old_sb_head, '<div class="rh rh-dk"></div>', 1)
web = web.replace('<p><em>Advertising. subblink is a proprietary asset of Aegryn. Text reproduced from subblink.com.</em></p>',
                   '<p><em>An Aegryn proprietary asset. Text reproduced from subblink.com.</em></p>', 1)
print('1e. Page subblink en navy, mention Advertising retiree : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 1f. CSS : retirer le style "boite IA" des encadres (.cta, .stat-card),
#     dates sur une ligne (.tbl .r), flipbook et web edition
# ─────────────────────────────────────────────────────────────────────────────
flip = flip.replace(
  '.stat-card{\n  background:#fff;border:.5px solid #eae6df;padding:12px;text-align:center;\n}',
  '.stat-card{\n  background:none;border:none;border-top:1.5px solid var(--LG);padding:10px 0 0;text-align:left;\n}')
flip = flip.replace(
  '.stat-card-accent{background:rgba(90,221,164,.07);border:.5px solid rgba(26,138,110,.2);}',
  '.stat-card-accent{border-top:1.5px solid var(--G);}')
flip = flip.replace(
  '.cta{border:.5px solid rgba(5,5,5,.12);background:rgba(5,5,5,.02);padding:10px 12px;margin-top:10px;}',
  '.cta{border:none;border-left:2px solid var(--G);background:none;padding:1px 0 1px 14px;margin-top:12px;}')
flip = flip.replace(".tbl td{font-size:10px;padding:7px 0;border-bottom:1px solid var(--LG);color:var(--K);line-height:1.3}",
                     ".tbl td{font-size:10px;padding:7px 0;border-bottom:1px solid var(--LG);color:var(--K);line-height:1.3}\n.tbl td.r,.tbl td:last-child{white-space:nowrap}")
# text-align:center no longer suits .stat-card now left-aligned; remove centered number styles tied to it
flip = flip.replace(".g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:9px}",
                     ".g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px 9px}")

web = web.replace('.cta{background:rgba(90,221,164,.06);border:1px solid rgba(90,221,164,.22);padding:16px 20px;margin:18px 0}',
                   '.cta{background:none;border:none;border-left:2px solid var(--G);padding:2px 0 2px 20px;margin:20px 0}')
web = web.replace('figure.chart{margin:22px 0;padding:18px 18px 12px;background:#FAFAF8;border:1px solid var(--LG)}',
                   'figure.chart{margin:24px 0;padding:14px 0 4px;background:none;border:none;border-top:1px solid var(--LG);border-bottom:1px solid var(--LG)}')
print('1f. CSS "boite IA" / dates : ok')

FLIP.write_text(flip)
WEB.write_text(web)

# ─────────────────────────────────────────────────────────────────────────────
# 2. Chevauchement texte/photo : .ga-photo-top a hauteur personnalisee
#    (le texte doit partir de calc(X% + 28px), pas de X%)
# ─────────────────────────────────────────────────────────────────────────────
flip = FLIP.read_text()
fixed = 0
for pct in ('45%', '40%'):
    old = f'bottom:24px;top:{pct};padding'
    new = f'bottom:24px;top:calc({pct} + 28px);padding'
    c = flip.count(old)
    flip = flip.replace(old, new)
    fixed += c
FLIP.write_text(flip)
print(f'2. Chevauchement texte/photo corrige ({fixed} pages) : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 3. Supprimer les 4 emplacements publicitaires vides restants + renumeroter
# ─────────────────────────────────────────────────────────────────────────────
flip = FLIP.read_text()
blocks = re.split(r'(?=<div id="p\d+" class="pg)', flip)
head, pages = blocks[0], blocks[1:]
tail_idx = pages[-1].rfind('</div></div>') + len('</div></div>')
tail = pages[-1][tail_idx:]
pages[-1] = pages[-1][:tail_idx]

AD_SLOTS = {16, 58, 105, 153}
kept, old_nums = [], []
removed = 0
for b in pages:
    n = int(re.match(r'<div id="p(\d+)"', b).group(1))
    if n in AD_SLOTS:
        assert 'Emplacement' in b, f'p{n} attendu comme emplacement publicitaire vide'
        removed += 1
        continue
    kept.append(b)
    old_nums.append(n)
assert removed == len(AD_SLOTS), f'{removed} pages publicitaires retirees, {len(AD_SLOTS)} attendues'

old2new = {}
out_pages = []
for i, (n, b) in enumerate(zip(old_nums, kept), start=1):
    old2new[n] = i
    b = re.sub(r'^<div id="p\d+"', f'<div id="p{i}"', b, count=1)
    b = re.sub(r'(<div class="pn[^"]*">)\d+(</div>)', lambda m: f'{m.group(1)}{i}{m.group(2)}', b)
    side = 'pn-l' if i % 2 == 0 else 'pn-r'
    b = re.sub(r'class="pn([^"]*?)\s?pn-[lr]', lambda m: f'class="pn{m.group(1)} {side}', b)
    out_pages.append(b)
TOTAL = len(out_pages)
assert TOTAL % 2 == 0, f'total impair : {TOTAL}'

new_flip = head + ''.join(out_pages) + tail
new_flip = re.sub(r'var TOT_REAL = \d+;', f'var TOT_REAL = {TOTAL};', new_flip)
new_flip = re.sub(r'from these <strong>\d+ pages\.</strong>', f'from these <strong>{TOTAL} pages.</strong>', new_flip)

# "Who You Will Meet" : references de pages
def fix_meet(block):
    for old in sorted(old2new, reverse=True):
        block = re.sub(r'(>\s*)' + str(old) + r'(\s*<)', lambda m, o=old: f'{m.group(1)}{old2new[o]}{m.group(2)}', block)
    return block
m = re.search(r'<div id="p\d+" class="pg">(?:(?!<div id="p\d+" class="pg).)*?Who You Will Meet.*?(?=<div id="p\d+" class="pg)', new_flip, flags=re.S)
if m:
    new_flip = new_flip[:m.start()] + fix_meet(m.group(0)) + new_flip[m.end():]

# Renvois textuels "page(s) N" / "pp. N to M" vers des pages existantes
def fix_refs(s):
    def rep(m):
        a = int(m.group(2)); b = m.group(4)
        s2 = f'{m.group(1)}{old2new.get(a, a)}'
        if b:
            s2 += f'{m.group(3)}{old2new.get(int(b), int(b))}'
        return s2
    return re.sub(r'(pages? |pp\. |p\. )(\d{1,3})(?:( and | to )(\d{1,3}))?', rep, s)
pages_split = re.split(r'(?=<div id="p\d+" class="pg)', new_flip)
new_flip = pages_split[0] + ''.join(fix_refs(b) for b in pages_split[1:])

FLIP.write_text(new_flip)
print(f'3. {removed} emplacements publicitaires retires, {TOTAL} pages (renumerote) : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 4. Reporter la renumerotation dans la web edition et toc.ts
# ─────────────────────────────────────────────────────────────────────────────
web = WEB.read_text()
def upd_sb(m):
    old = int(m.group(1))
    return f'<span class="sb-pg">p.{old2new.get(old, old):02d}</span>'
web = re.sub(r'<span class="sb-pg">p\.(\d+)</span>', upd_sb, web)
web = re.sub(r'(<section id="[^"]+" class="art[^>]*>.*?</section>)', lambda m: fix_refs(m.group(1)), web, flags=re.S)
web = re.sub(r'from these <strong>\d+ pages\.</strong>', f'from these <strong>{TOTAL} pages.</strong>', web)
WEB.write_text(web)

toc = TOC.read_text()
toc = re.sub(r'page: (\d+) \}', lambda m: f'page: {old2new.get(int(m.group(1)), int(m.group(1)))} }}', toc)
def recompute_ranges(doc):
    out = []
    for sec in re.finditer(r"(\{ id: '[^']+', label: \"[^\"]+\", pillar: '[^']+', pageRange: ')p\.(\d+)–(\d+)(', articles: \[)(.*?)(\n  \] \},)", doc, flags=re.S):
        pgs = [int(x) for x in re.findall(r'page: (\d+)', sec.group(5))]
        lo, hi = min(pgs), max(pgs)
        out.append((sec.start(2), sec.end(3), f'{lo:02d}–{hi:02d}'))
    for s, e, rep in reversed(out):
        doc = doc[:s] + rep + doc[e:]
    return doc
toc = recompute_ranges(toc)
TOC.write_text(toc)
print('4. toc.ts et sommaire web mis a jour : ok')
print(f'\nTotal pages : {TOTAL} (etait 154, -{154 - TOTAL})')
