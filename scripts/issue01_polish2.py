"""
issue01_polish2.py — Issue 01 v1.3 : harmonisation du format des questions
de l'interview Julien Guex (p.96-98) sur celui de l'interview CFO (p.32-33).

Flipbook : <p class="iq" style="font-size:8.8px;line-height:1.35">Q</p>
devient le format p.32 : texte petit en gras (9.4px/700) avec surlignage
vert (stabilo) rgba(90,221,164,.3). La classe .iq est conservee : elle porte
break-after:avoid (la question reste avec sa reponse en colonne).

Web edition : <p><strong>Q?</strong></p> devient <p class="dq"><mark>Q?</mark></p>,
le format deja utilise par l'interview CFO (CSS .dq mark existante).

Usage : python3 scripts/issue01_polish2.py   (depuis aegryn-site/, apres
issue01_polish.py ; agit sur les fichiers actuels, une seule fois).
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FLIP = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_1.html'
WEB  = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_web.html'

flip = FLIP.read_text()
web  = WEB.read_text()

# ─────────────────────────────────────────────────────────────────────────────
# 1. Flipbook : p.96-98, questions au format stabilo vert + gras de la p.32
# ─────────────────────────────────────────────────────────────────────────────
parts = re.split(r'(?=<div id="p\d+"[^>]*>)', flip)
changed = 0
for i, b in enumerate(parts):
    m = re.match(r'<div id="p(\d+)"', b)
    if not m or int(m.group(1)) not in (96, 97, 98):
        continue
    def rep(mm):
        global changed
        changed += 1
        return ('<p class="iq" style="font-size:9.4px;font-weight:700;line-height:1.45;'
                'color:#050505;margin:9px 0 4px;">'
                '<span style="background:rgba(90,221,164,.3);padding:0 2px">'
                + mm.group(1) + '</span></p>')
    b2 = re.sub(r'<p class="iq" style="font-size:8\.8px;line-height:1\.35">(.*?)</p>',
                rep, b)
    parts[i] = b2
assert changed == 5, f'{changed} questions modifiees, 5 attendues (p.96-98)'
FLIP.write_text(''.join(parts))
print(f'1. Flipbook p.96-98 : {changed} questions au format p.32 : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 2. Web edition : memes questions, markup <p class="dq"><mark>…</mark></p>
#    (limite a la section Julien Guex)
# ─────────────────────────────────────────────────────────────────────────────
idx = web.find('id="portrait-julien-guex-fit"')
assert idx != -1, 'web: section Guex introuvable'
s = web.rfind('<section', 0, idx)
e = web.find('</section>', idx)
assert s != -1 and e != -1, 'web: bornes section Guex introuvables'
sec = web[s:e]
sec2, n = re.subn(r'<p><strong>([^<]*\?)</strong></p>',
                  r'<p class="dq"><mark>\1</mark></p>', sec)
assert n == 5, f'web: {n} questions modifiees, 5 attendues'
web = web[:s] + sec2 + web[e:]
WEB.write_text(web)
print(f'2. Web edition Guex : {n} questions au format <dq><mark> : ok')
