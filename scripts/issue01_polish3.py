"""
issue01_polish3.py — Issue 01 v1.4 : retrait de l'exergue en bas de p.97
(interview Julien Guex).

La citation "It is not the paperwork that creates the value. It is the
readability of what was built." figurait deux fois : en exergue (.pq) et
dans le corps de la reponse, qui la conserve. Supprimee du flipbook et de
la web edition.

Usage : python3 scripts/issue01_polish3.py   (depuis aegryn-site/, apres
issue01_polish2.py ; agit sur les fichiers actuels, une seule fois).
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FLIP = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_1.html'
WEB  = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_web.html'

flip = FLIP.read_text()
web  = WEB.read_text()

old_pq = ('<div class="pq" style="margin-top:2px;padding:6px 4px;font-size:10.5px;margin-bottom:0">'
          '"It is not the paperwork that creates the value. It is the readability of what was built."'
          '<span class="pq-attr">Julien Guex, FIT</span></div>')
assert flip.count(old_pq) == 1, f'flip: exergue p.97 introuvable ({flip.count(old_pq)})'
flip = flip.replace(old_pq, '', 1)

old_pq_web = ('<div class="pq wh"><div class="pq-t dk">'
              '"It is not the paperwork that creates the value. It is the readability of what was built."'
              '</div><div class="pq-a">Julien Guex, FIT</div></div>')
assert web.count(old_pq_web) == 1, f'web: exergue Guex introuvable ({web.count(old_pq_web)})'
web = web.replace(old_pq_web, '', 1)

FLIP.write_text(flip)
WEB.write_text(web)
print('Exergue p.97 retiree (flipbook + web edition) : ok')
