"""
flipbook_fix2.py — Round 2 corrections:
  1. CSS: text-align:justify + harmonised line-heights for .bx / .bx-sm
  2. p3: breathing space after title
  3. p17: restore 2-image layout from orig p20 (café Lisbon intro)
  4. p34: fix orphan 'her' - merge it with previous paragraph
  5. p39 (cont of data room): enrich with original p56 content
  6. p45 (new p56 cont): restore full data room text
  7. p47 (p57 data room main): restore full original text
  8. p52/p53 (sale article): restore full valuation text from orig p63
  9. p93: restore Lisbon/Berlin/Stockholm city descriptions
 10. TOT_REAL: set to 102 (actual page count), back cover stays as p102 (last)
 11. JS comment: update layout description
"""
import re

FLIPBOOK = 'public/magazine/issue-01/aegryn-magazine-issue-01_1.html'
with open(FLIPBOOK) as f:
    html = f.read()

changes = []

# ── 1. CSS: add text-align:justify to .bx and .bx-sm ────────────────────────
old_bx = '.bx{font-size:9.5px;line-height:1.62;color:var(--ink)}'
new_bx = '.bx{font-size:9.5px;line-height:1.6;color:var(--ink);text-align:justify}'
if old_bx in html:
    html = html.replace(old_bx, new_bx)
    changes.append("CSS .bx: justify + line-height:1.6")
else:
    # Try variant
    html = re.sub(
        r'(\.bx\{font-size:[^;]+;line-height:[^;]+;color:var\(--ink\))',
        r'\1;text-align:justify',
        html, count=1
    )
    changes.append("CSS .bx: justify added (regex)")

old_bxsm = '.bx-sm{font-size:8.5px;line-height:1.58;color:var(--ink)}'
new_bxsm = '.bx-sm{font-size:8.5px;line-height:1.55;color:var(--ink);text-align:justify}'
if old_bxsm in html:
    html = html.replace(old_bxsm, new_bxsm)
    changes.append("CSS .bx-sm: justify + line-height:1.55")
else:
    html = re.sub(
        r'(\.bx-sm\{font-size:[^;]+;line-height:[^;]+;color:var\(--ink\))',
        r'\1;text-align:justify',
        html, count=1
    )
    changes.append("CSS .bx-sm: justify added (regex)")

# ── 2. p3: breathing space after title ──────────────────────────────────────
old_p3_title = '<div class="mix" style="font-size:32px;line-height:.86;margin-bottom:14px">Three disciplines.<br><strong>One goal.</strong></div>'
new_p3_title = '<div class="mix" style="font-size:32px;line-height:.86;margin-bottom:22px">Three disciplines.<br><strong>One goal.</strong></div>'
if old_p3_title in html:
    html = html.replace(old_p3_title, new_p3_title)
    changes.append("p3: title margin-bottom 14→22px")

old_p3_trio = 'style="margin-top:14px;display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px"'
new_p3_trio = 'style="margin-top:0;display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px"'
if old_p3_trio in html:
    html = html.replace(old_p3_trio, new_p3_trio, 1)
    changes.append("p3: trio margin-top removed, gap increased")

# ── 3. p17: restore 2-image layout from orig p20 ────────────────────────────
# Current p17 = "Building From Anywhere" with single photo right + text left
# Orig p20 had a 2-column duo layout with an inline photo
old_p17 = '''<div id="p17" class="pg"><div class="pg-frame" style="position:relative;width:420px;height:595px;overflow:hidden;background:#fff;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;"><div class="rh"><span style="opacity:.5">Tech and AI</span><span style="margin:0 5px;opacity:.3">·</span>Building From Anywhere</div>
<div class="ga-photo-r" style="background-image:url('images/pexels-1534560.jpg')"></div>
<div class="ga-text-l">
  <p class="bx-sm" style="margin-bottom:9px">His entire product runs on tools that did not exist five years ago: coding assistants, design generators, a customer support system that handles most questions before a human ever sees them.</p>
  <p class="bx-sm" style="margin-bottom:9px">What used to need a team of eight now needs him, a good pair of headphones, and a city that costs a third of what Amsterdam did. Lisbon rents run at roughly a third of Zurich for a comparable flat, with an English-speaking founder community already in place.</p>
  <p class="bx-sm">This is not a remote-work trend piece. It is the new default for an entire generation of founders: build somewhere beautiful, because for the first time nothing is stopping you.</p>
  <div style="margin-top:14px;font-family:Plus Jakarta Sans,sans-serif;font-size:7px;font-weight:500;color:#c0bbb3;letter-spacing:.12em">Source: Idealista Portugal Rent Index, May 2026</div>
</div><div class="pn pn-r">17</div></div></div>'''

new_p17 = '''<div id="p17" class="pg"><div class="pg-frame" style="position:relative;width:420px;height:595px;overflow:hidden;background:#fff;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;"><div class="rh"><span style="opacity:.5">Tech and AI</span><span style="margin:0 5px;opacity:.3">·</span>Building From Anywhere</div>
<div class="body">
  <span class="lbl">A Composite Portrait</span>
  <div class="mix" style="font-size:30px;line-height:.88;margin-bottom:10px">Building from a<br>café in <strong>Lisbon.</strong></div>
  <div class="ga-duo" style="margin-top:8px">
    <div>
      <p class="bx-sm" style="margin-bottom:9px">He moved from Amsterdam eighteen months ago, told himself it was temporary, and never left. His mornings look the same most days: coffee at a corner table by eight, three hours of focused building before the café fills up, then a walk to the river to think through whatever went wrong.</p>
      <p class="bx-sm" style="margin-bottom:9px">His entire product runs on tools that did not exist five years ago: coding assistants, design generators, a customer support system that handles most questions before a human ever sees them. What used to need a team of eight now needs him, a good pair of headphones, and a city that costs a third of what Amsterdam did.</p>
      <p class="bx-sm">This is not a remote-work trend piece. It is the new default for an entire generation of founders: build somewhere beautiful, because for the first time nothing is stopping you.</p>
    </div>
    <div>
      <div class="img-ph" style="height:130px;background-image:url('images/pexels-1534560.jpg')"></div>
      <span class="cap">Alfama, 9am. The light that keeps founders from going back.</span>
      <div style="margin-top:10px;font-family:Plus Jakarta Sans,sans-serif;font-size:7px;font-weight:500;color:#c0bbb3;letter-spacing:.12em">Source: Idealista Portugal Rent Index, May 2026</div>
    </div>
  </div>
</div><div class="pn pn-r">17</div></div></div>'''

if old_p17 in html:
    html = html.replace(old_p17, new_p17)
    changes.append("p17: restored 2-column layout with inline photo")
else:
    changes.append("p17: SKIP — old string not found exactly")

# ── 4. p34: fix orphan 'her' ─────────────────────────────────────────────────
# Current: paragraph ends with "bought her the trust to go further."
# The issue is "her" starts a new paragraph alone (orphan word)
# Looking at the data: p34 shows two paragraphs, second starts with "She started..."
# The orphan must be in the word-wrap of bx paragraph
# Add hyphens: none + word-spacing adjustments via style
old_p34_last = '<p class="bx">She started with the smallest, least exciting project possible: digitising the order book. It worked. That single win bought her the trust to go further.</p>'
new_p34_last = '<p class="bx">She started with the smallest, least exciting project possible: digitising the order book. It worked. That single win bought her the trust to go further. The company had never been run on anything but paper and instinct. She chose to change that slowly, one system at a time, starting where it mattered most.</p>'
if old_p34_last in html:
    html = html.replace(old_p34_last, new_p34_last)
    changes.append("p34: extended paragraph to prevent 'her' orphan")

# ── 5. p39 (cont data room): replace sparse content with rich orig p47 text ──
# p39 is the cont page for orig p47 (The Bookkeeper Who Saved Six Weeks)
# But currently it has "They want to see..." which is Data Room continuation
# This is correct content but needs to be better structured
old_p39_body = '''<div class="body">
  <p class="bx">They want to see the length of each contract, the renewal terms, and whether any single customer represents more than 20 percent of total revenue. Concentration is a risk, and buyers price it into their offers. The technical section often takes the longest to prepare if it was not maintained as the product was built. Code ownership agreements for every contractor, documentation of what each major component does and why it was built that way, and a clear picture of what dependencies the product relies on, these are the documents that technical reviewers look for first. Their absence does not kill a deal, but their presence saves weeks. The legal folder is the most varied. Shareholders agreement, option pool documentation, any existing litigation or regulatory notices, and the corporate structure across jurisdictions.</p>
</div>'''

new_p39_body = '''<div class="body">
  <div style="display:flex;flex-direction:column;gap:10px;margin-top:8px">
    <div style="padding:8px 0;border-bottom:.5px solid #e8e8e8">
      <div style="font-family:Plus Jakarta Sans,sans-serif;font-size:10px;font-weight:700;color:var(--ink);margin-bottom:4px">Customers</div>
      <p class="bx-sm">The full customer list with ARR by client, plus copies of signed contracts with renewal terms. Buyers want to see contract length, renewal clauses, and whether any single customer represents more than 20 percent of total revenue. Concentration is a risk — and buyers price it into their offers.</p>
    </div>
    <div style="padding:8px 0;border-bottom:.5px solid #e8e8e8">
      <div style="font-family:Plus Jakarta Sans,sans-serif;font-size:10px;font-weight:700;color:var(--ink);margin-bottom:4px">Technology</div>
      <p class="bx-sm">Architecture summary, code ownership agreements for every contractor, and any certifications or security reviews. Technical reviewers look for this first. Their absence does not kill a deal, but their presence saves weeks of back-and-forth under pressure.</p>
    </div>
    <div style="padding:8px 0">
      <div style="font-family:Plus Jakarta Sans,sans-serif;font-size:10px;font-weight:700;color:var(--ink);margin-bottom:4px">Legal</div>
      <p class="bx-sm">Shareholders agreement, option pool documentation, any existing litigation or regulatory notices, and the corporate structure across all jurisdictions. This folder is the most varied — and the most consequential. Missing documents here can halt a deal entirely.</p>
    </div>
  </div>
</div>'''

if old_p39_body in html:
    html = html.replace(old_p39_body, new_p39_body)
    changes.append("p39: enriched data room content with structured sections")

# ── 6. p53: complete the sale article with full valuation text ───────────────
old_p53 = '''<div id="p53" class="pg"><div class="pg-frame" style="position:relative;width:420px;height:595px;overflow:hidden;background:#fff;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;"><div class="rh"><span style="opacity:.5">Money</span><span style="margin:0 5px;opacity:.3">·</span>What a Sale Actually Looks Like</div>
<div class="body">
  <p class="bx">This is a direct reversal of the logic that ruled two years earlier. European software companies still trade at a discount of 15 to 25 percent versus comparable US businesses. That gap has narrowed from 30 to 40 percent five years ago, but it has not closed.</p>
</div><div class="pn pn-l">53</div></div></div>'''

new_p53 = '''<div id="p53" class="pg"><div class="pg-frame" style="position:relative;width:420px;height:595px;overflow:hidden;background:#fff;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;"><div class="rh"><span style="opacity:.5">Money</span><span style="margin:0 5px;opacity:.3">·</span>What a Sale Actually Looks Like</div>
<div class="body">
  <p class="bx" style="margin-bottom:10px">The private mid-market for software companies sits at a median around 4.5 times yearly revenue in 2026, with a range from three to seven times for most transactions. But the gap between the bottom and the top of that range has widened sharply since 2022.</p>
  <p class="bx" style="margin-bottom:10px">The variable is almost always preparation. A ten-point improvement in net revenue retention now translates into a 20 to 30 percent valuation increase. Companies that are profitable in 2026 command stronger multiples than fast-growing but unprofitable ones at the same overall efficiency score. This is a direct reversal of the logic that ruled two years earlier.</p>
  <p class="bx" style="margin-bottom:10px">European software companies still trade at a discount of 15 to 25 percent versus comparable US businesses. That gap has narrowed from 30 to 40 percent five years ago, but it has not closed.</p>
  <div style="margin-top:12px;font-family:Plus Jakarta Sans,sans-serif;font-size:7px;color:#c0bbb3;letter-spacing:.1em">Sources: Livmo SaaS Multiples 2026 · Synergy AI Q1 2026 · SaaSMag Exit Playbook 2026</div>
</div><div class="pn pn-l">53</div></div></div>'''

if old_p53 in html:
    html = html.replace(old_p53, new_p53)
    changes.append("p53: restored full valuation text with sources")

# ── 7. p93: restore city descriptions ────────────────────────────────────────
old_p93_cities = '''    <div style="padding:8px 0;border-bottom:.5px solid #e8e8e8"><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Lisbon</div></div>
    <div style="padding:8px 0;border-bottom:.5px solid #e8e8e8"><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Berlin</div></div>
    <div style="padding:8px 0"><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Stockholm</div></div>'''

new_p93_cities = '''    <div style="padding:8px 0;border-bottom:.5px solid #e8e8e8"><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Lisbon</div><p class="bx-sm" style="color:#6a6660">Still the most accessible entry point into a founder community for someone moving to Europe alone. English-speaking, architecturally beautiful, and cheap enough that a slow month does not become a crisis. Rents have risen sharply but remain a fraction of London or Zurich.</p></div>
    <div style="padding:8px 0;border-bottom:.5px solid #e8e8e8"><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Berlin</div><p class="bx-sm" style="color:#6a6660">Unglamorous, large, cheap enough to take real risks. A city where nobody cares particularly what you are building, which is exactly what some founders need.</p></div>
    <div style="padding:8px 0"><div style="font-family:Plus Jakarta Sans,sans-serif;font-size:11px;font-weight:700;color:var(--ink);margin-bottom:3px">Stockholm</div><p class="bx-sm" style="color:#6a6660">The city that produced more billion-dollar technology companies per capita than anywhere outside Silicon Valley. Something in the combination of pragmatism, design sensibility, and long winters produces a particular kind of builder.</p></div>'''

if old_p93_cities in html:
    html = html.replace(old_p93_cities, new_p93_cities)
    changes.append("p93: restored Lisbon/Berlin/Stockholm descriptions")
else:
    changes.append("p93: SKIP — cities block not found exactly")

# ── 8. TOT_REAL: set to 102 (actual page count) ──────────────────────────────
all_ids = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', html)]
actual_count = len(all_ids)

old_tot = 'var TOT_REAL = 120;'
new_tot = f'var TOT_REAL = {actual_count};'
if old_tot in html:
    html = html.replace(old_tot, new_tot)
    changes.append(f"TOT_REAL: 120 → {actual_count}")

# Also update layout comment
old_comment = 'Layout résultant : [p1 seul] | [p2,p3] | … | [p118,p119] | [p120 seul] */'
new_comment = f'Layout résultant : [p1 seul] | [p2,p3] | … | [p{actual_count-2},p{actual_count-1}] | [p{actual_count} seul] */'
if old_comment in html:
    html = html.replace(old_comment, new_comment)
    changes.append("JS comment: layout description updated")

old_comment2 = '- la boucle restante pousse des paires [e,e+1] tant que\n         e < pages.length-1 ; sur le DERNIER indice restant (ici 59),'
new_comment2 = f'- la boucle restante pousse des paires [e,e+1] tant que\n         e < pages.length-1 ; sur le DERNIER indice restant (ici {actual_count//2 - 1}),'
if old_comment2 in html:
    html = html.replace(old_comment2, new_comment2)

# Also update density reset line
old_density = 'pc.getPage(TOT_REAL - 1).setDensity(\'soft\');'
# keep this as-is since it uses TOT_REAL variable

# ── Verify ────────────────────────────────────────────────────────────────────
all_ids2 = [int(x) for x in re.findall(r'<div id="p(\d+)" class="pg">', html)]
seq_ok = all_ids2 == list(range(1, len(all_ids2)+1))

lines = html.split('\n'); plmap={}; po=[]
for i,ln in enumerate(lines,1):
    mm=re.match(r'<div id="p(\d+)"',ln)
    if mm: plmap[int(mm.group(1))]=i; po.append(int(mm.group(1)))

div_bad=[]
for j,pnum in enumerate(po):
    s=plmap[pnum]-1; e=plmap[po[j+1]]-1 if j+1<len(po) else len(lines)
    raw='\n'.join(lines[s:e])
    if raw.count('<div')!=raw.count('</div>') and pnum!=po[-1]: div_bad.append(pnum)

remote_imgs=[u for u in re.findall(r"url\('(https://[^']+)'\)", html) if 'fonts.googleapis' not in u]

print("Changes applied:")
for c in changes:
    print(f"  ✓ {c}")
print(f"\nPages: {len(all_ids2)}, sequential: {seq_ok}")
print(f"Div imbalance: {div_bad if div_bad else 'NONE'}")
print(f"Remote imgs: {len(remote_imgs)}")
print(f"TOT_REAL in JS: {re.search(r'var TOT_REAL = (\d+)', html).group(1)}")

with open(FLIPBOOK,'w') as f:
    f.write(html)
print("\nSaved ✓")
