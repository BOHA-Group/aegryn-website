"""
issue01_enrich.py — Issue 01 v1.1 : graphiques, dossier, charte, frise.

Lit les deux fichiers de l'Issue 01 tels qu'ils etaient avant enrichissement
(commit BASE, edition 1.0 a 138 pages) pour etre rejouable, insere les nouvelles pages dans le flipbook, renumerote,
puis reporte les memes contenus dans la web edition et regenere toc.ts.

Toutes les donnees des graphiques sont des chiffres deja cites dans le
numero (page indiquee dans CHARTS[...]['cite']).

Usage : python3 scripts/issue01_enrich.py   (depuis aegryn-site/)
"""
import re, subprocess, html, json
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent))
import issue01_charts as C

ROOT = Path(__file__).resolve().parents[1]
FLIP = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_1.html'
WEB  = ROOT / 'private/magazine/issue-01/aegryn-magazine-issue-01_web.html'
TOC  = ROOT / 'content/magazine/issue-01/toc.ts'

BASE = '5719aa6'   # derniere version 138 pages (edition 1.0)

def git_show(p):
    rel = p.relative_to(ROOT)
    return subprocess.run(['git', 'show', f'{BASE}:{rel}'], capture_output=True, text=True, cwd=ROOT).stdout

flip = git_show(FLIP)
web  = git_show(WEB)
toc  = git_show(TOC)
assert flip.count('TOT_REAL = 138') >= 1, 'flipbook de base attendu a 138 pages'

# ─────────────────────────────────────────────────────────────────────────────
# 1. Gabarits de page (420 x 595)
# ─────────────────────────────────────────────────────────────────────────────
FRAME_W = ("<div class=\"pg-frame\" style=\"position:relative;width:420px;height:595px;overflow:hidden;"
           "background:#fff;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;\">")
FRAME_N = ("<div class=\"pg-frame\" style=\"position:relative;width:420px;height:595px;overflow:hidden;"
           "background:#0A1628;font-family:'Plus Jakarta Sans',sans-serif;box-sizing:border-box;\">")
SRC = "font-family:Plus Jakarta Sans,sans-serif;font-size:7px;color:#c0bbb3;letter-spacing:.1em;margin-top:8px"
CAP = "font-family:Plus Jakarta Sans,sans-serif;font-size:7.5px;font-style:italic;color:#8a867f;margin-top:6px;line-height:1.45"

def rh(section, title):
    return (f'<div class="rh"><span style="opacity:.5">{html.escape(section)}</span>'
            f'<span style="margin:0 5px;opacity:.3">·</span>{html.escape(title)}</div>')

def page(section, title, inner, navy=False, pid='pNEW'):
    cls = 'pg pg-navy' if navy else 'pg'
    frame = FRAME_N if navy else FRAME_W
    rhx = '<div class="rh rh-dk"></div>' if navy else rh(section, title)
    pn = '<div class="pn pn-dk pn-l">0</div>' if navy else '<div class="pn pn-l">0</div>'
    return f'<div id="{pid}" class="{cls}">{frame}{rhx} {inner}{pn}</div></div>'

def p_bx(text, size=None, mb=9, cls='bx'):
    st = f'margin-bottom:{mb}px' + (f';font-size:{size}px' if size else '')
    return f'<p class="{cls}" style="{st}">{text}</p>'

def chart_page(section, title, lbl, verdict, intro, svg, caption, source):
    inner = (f'<div class="body"><span class="lbl">{lbl}</span>'
             f'<div class="mix" style="font-size:22px;line-height:.92;margin-bottom:8px">{verdict}</div>'
             f'<hr class="dv">'
             + (p_bx(intro, 9, 10) if intro else '') +
             f'<div style="margin-top:6px">{svg}</div>'
             f'<div style="{CAP}">{caption}</div>'
             f'<div style="{SRC}">{source}</div></div>')
    return page(section, title, inner)

def text_page(section, title, lbl, headline, paras, standfirst=None, source=None, box=None):
    inner = f'<div class="body"><span class="lbl">{lbl}</span>'
    if headline:
        inner += f'<div class="mix" style="font-size:22px;line-height:.92;margin-bottom:8px">{headline}</div><hr class="dv">'
    if standfirst:
        inner += f'<p class="bx-sm" style="font-size:8.5px;line-height:1.55;font-style:italic;color:#5a5650;margin-bottom:8px">{standfirst}</p>'
    for ptxt in paras:
        inner += p_bx(ptxt, 9.2, 8)
    if box:
        inner += box
    if source:
        inner += f'<div style="{SRC}">{source}</div>'
    inner += '</div>'
    return page(section, title, inner)

def cta_box(title, body):
    return (f'<div class="cta" style="margin-top:6px"><div class="cta-title">{title}</div>'
            f'<p class="cta-body">{body}</p></div>')

# ─────────────────────────────────────────────────────────────────────────────
# 2. Graphiques (donnees citees dans le numero)
# ─────────────────────────────────────────────────────────────────────────────
CH = {}
CH['ai'] = C.line_chart([('2021', 7.7), ('2024', 13.5), ('2025', 20.0)], h=160, vmax=30) + \
    C.hbar([('Large enterprises', 55, '250+ employees'), ('Small enterprises', 17, '10 to 49 employees'),
            ('Denmark', 42, 'highest adoption'), ('Finland', 38, '')], unit='%', vmax=60, accent_idx=0, label_w=104, bar_h=15, gap=9)
CH['digital'] = C.stacked_single([('Very high', 9, C.GDK), ('High', 27, C.NAVY), ('Basic only', 35, C.STONE), ('Below basic', 29, C.SAND)], h=86)
CH['funding'] = C.hbar([('United Kingdom', 18.7, '423 deals'), ('Germany', 6.3, ''), ('France', 6.0, '132 deals'), ('Sweden', 2.8, '')],
                       unit='bn', vmax=20, accent_idx=0, label_w=110, fmt=lambda v: f'€{v}', bar_h=24, gap=16)
CH['multiples'] = C.vbar([('United States\nmedian EV/Revenue', 5.3, True), ('United Kingdom', 4.0, False), ('France', 2.7, False)],
                         h=250, unit='×', vmax=6.5, fmt=lambda v: f'{v:.1f}')
CH['swiss'] = C.vbar([('Early-stage\n2024', 0.864, False), ('Early-stage\n2025', 1.4, True), ('All rounds\n2025', 2.95, False)],
                     h=250, vmax=3.3, fmt=lambda v: f'CHF {v:.2f}bn' if v > 1 else f'CHF {v*1000:.0f}m')
CH['compliance'] = C.waterfall([('Avoided internal\nremediation', 760, 'add'), ('Regulatory delay\nrisk, discounted', 140, 'add'),
                                ('Added to the\nseller\'s price', 900, 'total')], h=250)
CH['succession'] = C.vbar([('Seek a successor\nby 2029', 545, False), ('Plan to close\ninstead', 569, True)],
                          h=250, vmax=640, fmt=lambda v: f'{v:,}k')
CH['index'] = C.donut(64, h=140, label='First submissions with incomplete IP assignment',
                      sub='Contractor agreements that never transferred code ownership')

# ─────────────────────────────────────────────────────────────────────────────
# 3. Nouvelles pages
# ─────────────────────────────────────────────────────────────────────────────
NEW = {}   # key -> (after_old_page, [page_html...], web_sections[list of (anchor,title,section_label,inner_web_html)])

# 3.1 Charte editoriale (Opening, apres p12)
charter_paras = [
    "A consulting firm that publishes a magazine owes its readers an explanation. Here is ours. Aegryn works with the leaders of organisations between ten and three hundred million euros of revenue, on strategy, compliance, technology, people and transactions. We see the same questions return in different rooms. This magazine is where we answer them in public, with the sources attached, so that the reasoning can be checked by people who will never be our clients.",
    "The magazine is not an advertisement. No page is sold to a client, no story is placed, and the deals and portraits in these pages are chosen for what they teach, not for who they flatter. Advertising, when it appears, is marked as such and kept to the pages that say so. Our commercial interest is simple and declared: a reader who understands how value is built, measured and transferred is a better counterpart, whether or not they ever work with us.",
    "Four commitments follow from that. Every figure is sourced by name where it appears, and the list of sources is printed on the previous page. Stories about founders and buyers are anonymised; the decisions and their timing are kept as they happened, the identifying details are not. Where artificial intelligence assists in research or drafting, a human editor is responsible for every published sentence, as the European AI Act, Article 50, now requires us to disclose. And when we are wrong, we print the correction in the next issue, on this page.",
    "What the magazine will never do: recommend a specific transaction, publish a figure we cannot trace, or describe a company as certified when it is not. The CIFSO 5000 grade is awarded by an audit, not by an editor. Keeping those two roles apart is the condition of being read.",
]
NEW['charter'] = (12, [text_page('Editorial standards', 'Why a Consulting Firm Publishes a Magazine', 'Editorial standards',
                                  'Why a consulting firm <strong>publishes a magazine.</strong>', charter_paras,
                                  source='Aegryn editorial board · Corrections: contact@boha-group.com')],
                  [('editorial-why-a-consulting-firm-publishes', 'Why a Consulting Firm Publishes a Magazine', 'Editorial standards',
                    ''.join(f'<p>{p}</p>' for p in charter_paras))])

# 3.5 Emplacement publicitaire 03 (ancienne p32, juste apres le dossier) : subblink, actif Aegryn
SB_ACC = '#4ADDA5'
def sb_lbl(t, color='rgba(255,255,255,.45)'):
    return f'<div style="font-family:\'DM Mono\',ui-monospace,monospace;font-size:6.6px;letter-spacing:.22em;text-transform:uppercase;color:{color};margin-bottom:5px">{t}</div>'
def sb_cell(title, body):
    return (f'<div style="padding:7px 0;border-top:.5px solid rgba(255,255,255,.1)">'
            f'<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:8.6px;font-weight:700;color:#fff;margin-bottom:2px">{title}</div>'
            f'<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:7.6px;line-height:1.5;color:rgba(255,255,255,.62)">{body}</div></div>')
SUBBLINK_INNER = (
  '<div style="position:absolute;inset:0;background:#0c0c0c"></div>'
  '<div style="position:absolute;top:0;left:0;right:0;height:28px;display:flex;align-items:center;justify-content:center;font-family:\'Plus Jakarta Sans\',sans-serif;font-size:6px;font-weight:600;letter-spacing:.3em;text-transform:uppercase;color:rgba(255,255,255,.3);border-bottom:.5px solid rgba(255,255,255,.08)"><span style="opacity:.6">Advertising</span><span style="margin:0 5px;opacity:.4">·</span>An Aegryn proprietary asset</div>'
  '<div style="position:absolute;top:28px;bottom:24px;left:0;right:0;padding:18px 28px 12px;display:flex;flex-direction:column">'
  # wordmark
  '<div style="display:flex;align-items:baseline;gap:3px;margin-bottom:10px"><span style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:30px;font-weight:800;letter-spacing:-.04em;color:#fff;line-height:1">subblink</span><span style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:9px;color:#fff;position:relative;top:-14px">®</span></div>'
  f'<div style="width:22px;height:2px;background:{SB_ACC};margin-bottom:10px"></div>'
  '<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:19px;font-weight:700;letter-spacing:-.025em;line-height:1.08;color:#fff;margin-bottom:8px">Read the contract<br>before you sign it.<br><span style="color:' + SB_ACC + '">In sixty seconds.</span></div>'
  '<p style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:8.6px;line-height:1.55;color:rgba(255,255,255,.7);margin:0 0 10px">subblink is an AI contract analyser built in Switzerland by Aegryn. Upload a PDF; receive a risk score from 1 to 10, the clauses that need attention, and the points you can negotiate, in plain language. Swiss and European law, six languages. A basic analysis needs no account.</p>'
  # two columns
  '<div style="display:grid;grid-template-columns:1fr 1fr;gap:0 14px;flex:1">'
  '<div>' + sb_lbl('What it reads', SB_ACC)
  + sb_cell('Employment and freelance contracts', 'Notice, non-compete, IP assignment, variable pay.')
  + sb_cell('Leases', 'Termination clauses, charges, works at the tenant\'s expense.')
  + sb_cell('Supplier and partnership agreements', 'Liability caps, auto-renewal, unilateral changes, penalties.')
  + sb_cell('Subscriptions and service terms', 'Hidden commitments, price revisions, exit conditions.')
  + '<div style="margin-top:8px">' + sb_lbl('For whom', SB_ACC) + '<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:7.8px;line-height:1.5;color:rgba(255,255,255,.62)">Freelancers, SMEs, legal practices and individuals in Switzerland and the EU (CH, FR, DE, ES, IT, NL legal frameworks).</div></div>'
  '</div>'
  '<div>' + sb_lbl('Why AI helps here, and where it stops', SB_ACC)
  + sb_cell('It reads everything, once', 'A forty-page agreement is read in full, not skimmed. The model finds the patterns that hide risk: a renewal buried in an annex, a cap that excludes the one liability that matters.')
  + sb_cell('It explains, it does not decide', 'Each flagged clause comes with the reason and a negotiation point. subblink gives information, not legal advice; a verified lawyer from the network can take over from the report.')
  + sb_cell('It scores, so you can compare', 'A ContractScore from A to E and a market benchmark put the document next to its peers, instead of leaving you with a feeling.')
  + '</div></div>'
  # privacy strip
  f'<div style="margin-top:8px;padding:8px 10px;border:1px solid rgba(74,221,165,.3);background:rgba(74,221,165,.07)">'
  + sb_lbl('Protection · GDPR and Swiss FADP', SB_ACC)
  + '<div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:7.6px;line-height:1.5;color:rgba(255,255,255,.75)">Documents are processed for the analysis and not retained. No account is required for a basic analysis. Processing complies with the EU General Data Protection Regulation and the Swiss Federal Act on Data Protection. The service is operated from Switzerland.</div></div>'
  # footer line
  '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px;font-family:\'DM Mono\',ui-monospace,monospace;font-size:6.6px;letter-spacing:.18em;text-transform:uppercase;color:rgba(255,255,255,.4)"><span>subblink.com</span><span>Built by Aegryn · Switzerland</span></div>'
  '</div>'
  '<div class="pn pn-dk pn-l" style="position:absolute">0</div>')
SUBBLINK_PAGE = f'<div id="pNEW" class="pg pg-navy">{FRAME_N.replace("#0A1628", "#0c0c0c")}{SUBBLINK_INNER}</div></div>'
SUBBLINK_WEB = (
  '<p><em>Advertising. subblink is a proprietary asset of Aegryn.</em></p>'
  '<p><strong>Read the contract before you sign it. In sixty seconds.</strong> subblink is an AI contract analyser built in Switzerland by Aegryn. Upload a PDF; receive a risk score from 1 to 10, the clauses that need attention, and the points you can negotiate, in plain language. Swiss and European law, six languages. A basic analysis needs no account.</p>'
  '<p><strong>What it reads.</strong> Employment and freelance contracts (notice, non-compete, IP assignment, variable pay); leases (termination clauses, charges, works at the tenant\'s expense); supplier and partnership agreements (liability caps, auto-renewal, unilateral changes, penalties); subscriptions and service terms (hidden commitments, price revisions, exit conditions).</p>'
  '<p><strong>For whom.</strong> Freelancers, SMEs, legal practices and individuals in Switzerland and the EU (CH, FR, DE, ES, IT, NL legal frameworks).</p>'
  '<p><strong>Why AI helps here, and where it stops.</strong> It reads everything, once: a forty-page agreement is read in full, not skimmed, and the model finds the patterns that hide risk, a renewal buried in an annex, a cap that excludes the one liability that matters. It explains, it does not decide: each flagged clause comes with the reason and a negotiation point; subblink gives information, not legal advice, and a verified lawyer from the network can take over from the report. It scores, so you can compare: a ContractScore from A to E and a market benchmark put the document next to its peers.</p>'
  '<div class="cta"><div class="cta-title">Protection · GDPR and Swiss FADP</div><p class="cta-body">Documents are processed for the analysis and not retained. No account is required for a basic analysis. Processing complies with the EU General Data Protection Regulation and the Swiss Federal Act on Data Protection. The service is operated from Switzerland.</p></div>'
  '<p><a href="https://subblink.com" target="_blank" rel="noopener">subblink.com</a> · Built by Aegryn, Switzerland.</p>')


# 3.2 Dossier (apres p29, fin de Tech and AI) : 8 pages
D = []
# D1 opener navy
d1 = ('<div class="img-ph" style="position:absolute;inset:0;opacity:.26;background-image:url(\'images/pexels-1181675.jpg\');background-size:cover;background-position:center"></div>'
      '<div class="opener"><div class="opener-num">D</div><div class="opener-rule"></div>'
      '<div class="opener-title">The Back Office<br>Goes Autonomous</div>'
      '<div class="opener-deck">One EU enterprise in five now uses at least one AI technology. The headlines are about models. The money is about what changes inside the finance, legal and operations functions of a two-hundred-person company, and what a buyer makes of it when the data room opens. A dossier in six parts.</div>'
      '<div class="opener-toc"><div class="opener-toc-item">What the Data Says</div><div class="opener-toc-item">A CFO\'s Year, in Her Words</div>'
      '<div class="opener-toc-item">Where the Value Moves</div><div class="opener-toc-item">The Regulatory Clock</div>'
      '<div class="opener-toc-item">Five Words for the Board</div><div class="opener-toc-item">What to Do on Monday</div></div></div>')
D.append(page('Dossier', 'The Back Office Goes Autonomous', d1, navy=True))

# D2 data page
D.append(chart_page('Dossier', 'What the Data Says', 'Dossier · 01 · The numbers',
                    'Adoption has <strong>almost tripled</strong> in four years. Size decides who moves first.',
                    "Eurostat's 2025 survey found that 20 percent of EU enterprises with ten or more employees use at least one AI technology, up from 13.5 percent a year earlier and 7.7 percent in 2021. The gap is not between countries, it is between sizes: 17 percent of small enterprises against 55 percent of large ones. The most common use is the analysis of written language (11.8 percent), followed by image or audio generation (9.6). Text or code generation reached 8.8 percent, roughly double two years earlier.",
                    CH['ai'], 'Share of enterprises with ten or more employees using at least one AI technology, EU, and 2025 breakdown.',
                    'Source: Eurostat, Use of artificial intelligence in enterprises, 2025 edition. Figures as cited on pages 13 and 26 of this issue.'))

# D3-D4 interview (composite, labelled)
QA1 = [
 ("You run finance for a 220-person industrial group. What did you automate first?",
  "The month-end close. It took twelve working days when I arrived, with three people re-keying supplier invoices and a fourth reconciling bank statements by hand. We started with invoice capture and matching against purchase orders, then the bank reconciliation. Eighteen months later the close takes four days and nobody re-keys anything."),
 ("What did it cost, and what did it save?",
  "Less than one full-time salary a year in licences, once we had stopped paying for two tools that did the same thing. The saving is not mainly the people. Two of the three moved to controlling, which we had never staffed properly. The saving is in what we now know on the fifth working day instead of the fifteenth. Decisions got earlier. That is hard to put in a spreadsheet, so I do not try."),
 ("What broke?",
  "Two things. The first tool we chose stored documents in a region outside the European Union, which our largest customer's security questionnaire did not accept. We had to migrate, which cost us a quarter. The second was dependency. For six months, one person understood how the matching rules worked. When she went on leave, exceptions piled up. We documented the rules and trained a second person. It sounds obvious. It was not, at the time."),
]
QA2 = [
 ("Last year a buyer looked at the group. What did their diligence ask about the automation?",
  "Three questions, in this order. Who can switch it off, and what happens to the close if they do. Where the data sits, with the contract that says so. And whether the audit trail survives the tool: can an auditor follow an invoice from the scan to the ledger entry without asking us to interpret. We could answer all three. We could not have two years earlier."),
 ("Did it change the price?",
  "Not as a premium, no. Nobody paid us more for having good software. It changed the length of the diligence and the number of conditions in the offer. The buyer's finance team spent two weeks with us instead of the six they had planned. Fewer open questions became fewer escrow clauses. In my experience that is how value shows up in a transaction: not as a higher number, as fewer deductions from it."),
 ("What would you tell a peer starting now?",
  "Start where the paper is. Write down the rules before you buy the tool, because the tool will enforce whatever you tell it, including your mistakes. Keep the data in a place you can name in a contract. And make sure two people, not one, can explain every automated step to an outsider. If you cannot explain it to an auditor, you cannot sell it to a buyer."),
]
def qa_block(pairs):
    out = ''
    for q, a in pairs:
        out += (f'<p class="dq" style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:9.4px;font-weight:700;line-height:1.45;color:#050505;margin:9px 0 4px;">'
                f'<span style="background:rgba(90,221,164,.35);box-shadow:0 0 0 2px rgba(90,221,164,.35)">{q}</span></p>'
                f'<p class="bx" style="font-size:9.2px;margin-bottom:4px">{a}</p>')
    return out
int_stand = ("Composite interview. The answers below are drawn from Aegryn advisory conversations held in 2026 with finance leaders of five European SMEs, from eighty to four hundred employees. Details have been merged and identifying figures altered; the decisions, their timing and their consequences are kept as they happened.")
D.append(page('Dossier', "A CFO's Year, in Her Words",
              f'<div class="body"><span class="lbl">Dossier · 02 · Interview</span>'
              f'<div class="mix" style="font-size:22px;line-height:.92;margin-bottom:8px">Twelve days to four. <strong>What the close taught her.</strong></div><hr class="dv">'
              f'<p class="bx-sm" style="font-size:8.3px;line-height:1.5;font-style:italic;color:#5a5650;margin-bottom:6px">{int_stand}</p>'
              + qa_block(QA1) + '</div>'))
D.append(page('Dossier', "A CFO's Year, in Her Words",
              '<div style="position:absolute;top:28px;left:0;right:0;height:150px;background-image:url(\'images/1664575602554-2087b04935a5.jpg\');background-size:cover;background-position:center 30%;background-color:#EDEAE4"></div>'
              '<div class="body" style="top:178px"><span class="lbl">Dossier · 02 · Interview, continued</span>'
              + qa_block(QA2) + '</div>'))

# D5 where the value moves
val_paras = [
 "<strong>The cost of the function.</strong> The first effect is the one everybody models and the least decisive. A finance, legal or operations function that runs on fewer re-keyed documents costs less per transaction and scales without hiring. In a sale it shows up as margin, and margin is priced. But the companies that only cut cost tend to cut the people who understood the process, and buyers notice the gap in the first week of diligence.",
 "<strong>Auditability.</strong> The second effect is the one buyers pay for. An automated process that keeps a complete trail, from the source document to the ledger entry, with the rule that produced each step, is a process an auditor can test without interviewing anyone. The Aegryn Index, on page 108, records that the largest discounts from initial offer to final price occurred where financial statements had not been independently reviewed for 24 months. Automation does not replace that review. It makes it faster and cheaper to obtain, which is the same thing to a buyer in a hurry.",
 "<strong>Dependency.</strong> The third effect cuts the other way. Every automated step is a supplier, a licence, a data location and a person who knows how it works. The founder who used to be the single point of failure is replaced by a tool contract and a configuration nobody has written down. Buyers now ask the question they used to ask about the founder: what happens if this disappears on Monday. The honest answer is the one in the CFO's interview: two people who can explain every step, data in a place you can name in a contract, and a documented path to switch supplier within ninety days.",
]
D.append(text_page('Dossier', 'Where the Value Moves', 'Dossier · 03 · Analysis',
                   'Three effects. Only one of them is <strong>priced the way founders expect.</strong>', val_paras,
                   box=cta_box('What a tool will not do', 'It will not decide which rules are right, only apply the ones it is given. It will not carry legal responsibility for a filing, a payment or a disclosure. And it will not tell a buyer where your data is; your contract has to.')))

# D6 regulatory clock
events = [
 ('1 Sep 2023', 'Swiss revised Data Protection Act', 'In force. Applies to all processing of personal data in Switzerland.', 'past'),
 ('17 Oct 2024', 'NIS2, transposition deadline', 'Cybersecurity duties for essential and important entities in the EU.', 'past'),
 ('17 Jan 2025', 'DORA applies', 'ICT risk and third-party rules for the EU financial sector and its suppliers.', 'past'),
 ('2 Feb 2025', 'AI Act, first obligations', 'Prohibited practices banned; AI literacy duties for deployers.', 'past'),
 ('2 Aug 2025', 'AI Act, general-purpose models', 'Duties for providers of general-purpose AI models; governance in place.', 'past'),
 ('12 Sep 2025', 'EU Data Act applies', 'Access, portability and switching rights for connected products and cloud.', 'past'),
 ('2 Aug 2026', 'AI Act, transparency duties', 'Article 50: disclose AI interaction and synthetic content. High-risk rules deferred.', 'past'),
 ('11 Sep 2026', 'Cyber Resilience Act, reporting', 'Vulnerability and incident reporting for products with digital elements.', 'past'),
 ('2 Dec 2027', 'AI Act, high-risk systems (Annex III)', 'Employment, education, credit, essential services: full obligations, post-Omnibus.', 'next'),
 ('11 Dec 2027', 'Cyber Resilience Act, full application', 'Security-by-design and conformity obligations for all products in scope.', 'next'),
 ('2 Aug 2028', 'AI Act, regulated products (Annex I)', 'High-risk AI embedded in machinery, medical devices, other regulated products.', 'next'),
]
D.append(chart_page('Dossier', 'The Regulatory Clock', 'Dossier · 04 · Timeline',
                    'Eleven dates a board should <strong>already have in its calendar.</strong>',
                    '', C.timeline(events, row_h=31),
                    "Dates as in force at the time of going to press. The Digital Omnibus on AI (Regulation (EU) 2026/1744, in force 27 July 2026) moved the high-risk deadlines from August 2026 and 2027 to 2 December 2027 and 2 August 2028. Swiss companies selling into the EU are in scope of the EU texts for that activity.",
                    'Sources: Official Journal of the EU (Regulations 2022/2554, 2022/2555, 2023/2854, 2024/1689 as amended by 2026/1744, 2024/2847); Fedlex, FADP (SR 235.1). Not legal advice.'))

# D7 five words
words = [
 ('Model', 'A statistical system trained on data to produce text, code, images or predictions. It does not know; it estimates. The question for a board is not how good the model is but what it is allowed to decide alone.'),
 ('Agent', 'Software that chains model outputs into actions: reading an inbox, filling a form, triggering a payment. The step from model to agent is the step from advice to execution, and it is where liability begins.'),
 ('Grounding', 'Tying a model\'s answers to your own documents and data rather than to what it learned in training. Without grounding, an answer can be fluent and wrong; with it, every statement can be traced to a source.'),
 ('Human in the loop', 'A named person who approves, samples or can stop an automated step. The AI Act, DORA and most buyers ask for the same thing in different words: who is accountable, and can they intervene in time.'),
 ('Risk class', 'The AI Act sorts uses, not technologies: prohibited, high-risk, limited-risk, minimal. The same model is minimal-risk when it drafts an email and high-risk when it screens job applicants. Classify the use, then buy the tool.'),
]
d7 = ('<div class="body"><span class="lbl">Dossier · 05 · Primer</span>'
      '<div class="mix" style="font-size:22px;line-height:.92;margin-bottom:8px">Five words <strong>for the board.</strong></div><hr class="dv">'
      '<div style="display:flex;flex-direction:column;gap:0;margin-top:4px">'
      + ''.join(f'<div style="padding:7px 0;border-bottom:.5px solid #e8e4dc"><div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:10px;font-weight:700;color:#050505;margin-bottom:2px">{w}</div><p class="bx-sm" style="font-size:8.6px;text-align:left">{d}</p></div>' for w, d in words)
      + '</div></div>')
D.append(page('Dossier', 'Five Words for the Board', d7))

# D8 Monday + digital intensity chart
monday = [
 ('01', 'Inventory the automations you already run, including the ones a team bought on a card. Name the supplier, the data location and the person who understands each.'),
 ('02', 'Classify each use under the AI Act: minimal, limited, high-risk. Most will be minimal. The two that are not deserve a page each.'),
 ('03', 'Write the rules before the next tool: what gets matched, approved, escalated. The tool will enforce your mistakes as faithfully as your intentions.'),
 ('04', 'Put the data location in the contract. If you cannot name the country, you cannot answer the security questionnaire of your largest customer.'),
 ('05', 'Make two people able to explain every automated step to an outsider, and test it by asking them to.'),
 ('06', 'Keep the audit trail outside the tool, in a format an auditor can read without a licence. That is the document a buyer will ask for first.'),
]
d8 = ('<div class="body"><span class="lbl">Dossier · 06 · Checklist</span>'
      '<div class="mix" style="font-size:22px;line-height:.92;margin-bottom:8px">What to do <strong>on Monday.</strong></div><hr class="dv">'
      + ''.join(f'<div style="display:flex;gap:8px;padding:4px 0;border-bottom:.5px solid #e8e4dc"><span style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:8px;font-weight:700;color:#1a8a6e;flex-shrink:0;padding-top:2px">{n}</span><p class="bx-sm" style="font-size:8.6px;text-align:left">{t}</p></div>' for n, t in monday)
      + '<div style="margin-top:10px"><span class="lbl" style="margin-bottom:4px">Where European SMEs stand</span>'
      + CH['digital'] +
      f'<div style="{CAP}">Digital Intensity Index, EU SMEs, 2025: 71 percent reach at least a basic level, 27 percent a high level, 9 percent a very high level.</div>'
      f'<div style="{SRC}">Source: Eurostat, Digital Intensity Index 2025, as cited on page 27 of this issue.</div></div></div>')
D.append(page('Dossier', 'What to Do on Monday', d8))

NEW['dossier'] = (29, D, [
    ('dossier-the-back-office-goes-autonomous', 'The Back Office Goes Autonomous', 'Dossier',
     '<p>One EU enterprise in five now uses at least one AI technology. The headlines are about models. The money is about what changes inside the finance, legal and operations functions of a two-hundred-person company, and what a buyer makes of it when the data room opens. A dossier in six parts: what the data says, a CFO\'s year in her words, where the value moves, the regulatory clock, five words for the board, and what to do on Monday.</p>'),
    ('dossier-what-the-data-says', 'What the Data Says', 'Dossier',
     "<p>Eurostat's 2025 survey found that 20 percent of EU enterprises with ten or more employees use at least one AI technology, up from 13.5 percent a year earlier and 7.7 percent in 2021. The gap is not between countries, it is between sizes: 17 percent of small enterprises against 55 percent of large ones. The most common use is the analysis of written language (11.8 percent), followed by image or audio generation (9.6). Text or code generation reached 8.8 percent, roughly double two years earlier.</p>"
     f'<figure class="chart">{CH["ai"]}<figcaption>Share of enterprises with ten or more employees using at least one AI technology, EU, and 2025 breakdown. Source: Eurostat, 2025.</figcaption></figure>'),
    ('dossier-a-cfo-s-year-in-her-words', "A CFO's Year, in Her Words", 'Dossier',
     f'<p><em>{int_stand}</em></p>' + ''.join(f'<p class="dq"><mark>{q}</mark></p><p>{a}</p>' for q, a in QA1 + QA2)),
    ('dossier-where-the-value-moves', 'Where the Value Moves', 'Dossier',
     ''.join(f'<p>{p}</p>' for p in val_paras) + '<div class="cta"><div class="cta-title">What a tool will not do</div><p class="cta-body">It will not decide which rules are right, only apply the ones it is given. It will not carry legal responsibility for a filing, a payment or a disclosure. And it will not tell a buyer where your data is; your contract has to.</p></div>'),
    ('dossier-the-regulatory-clock', 'The Regulatory Clock', 'Dossier',
     f'<figure class="chart">{C.timeline(events, row_h=40)}<figcaption>Dates as in force at the time of going to press. The Digital Omnibus on AI (Regulation (EU) 2026/1744, in force 27 July 2026) moved the high-risk deadlines to 2 December 2027 (Annex III) and 2 August 2028 (Annex I). Sources: Official Journal of the EU (2022/2554, 2022/2555, 2023/2854, 2024/1689 as amended by 2026/1744, 2024/2847); Fedlex, FADP. Not legal advice.</figcaption></figure>'),
    ('dossier-five-words-for-the-board', 'Five Words for the Board', 'Dossier',
     ''.join(f'<p><strong>{w}.</strong> {d}</p>' for w, d in words)),
    ('dossier-what-to-do-on-monday', 'What to Do on Monday', 'Dossier',
     ''.join(f'<p><strong>{n}</strong> {t}</p>' for n, t in monday)
     + f'<figure class="chart">{CH["digital"]}<figcaption>Digital Intensity Index, EU SMEs, 2025: 71 percent reach at least a basic level, 27 percent a high level, 9 percent a very high level. Source: Eurostat.</figcaption></figure>'),
    ('advertising-subblink', 'subblink, read the contract before you sign it', 'Advertising', SUBBLINK_WEB),
])

# 3.3 Pages graphiques dans les articles existants
def chart_entry(key, after, section, title, anchor_base, lbl, verdict, intro, caption, source, web_anchor):
    NEW[key] = (after, [chart_page(section, title, lbl, verdict, intro, CH[key], caption, source)],
                [(anchor_base, title, section, (f'<p>{intro}</p>' if intro else '') + f'<figure class="chart">{CH[key]}<figcaption>{caption} {source}</figcaption></figure>', web_anchor)])

chart_entry('funding', 63, 'Money', 'Market Analysis, the Chart', 'money-market-analysis-the-chart', 'Money · Data',
            'One country raised more than <strong>the next three combined.</strong>',
            'European tech funding reached 44.1 billion euros in the first half of 2026 across roughly 1,740 deals. The United Kingdom alone took 18.7 billion; Germany and France together reached about the same. Sweden, the Netherlands and Spain complete the top six.',
            'Venture funding by country, first half of 2026, billions of euros. Netherlands and Spain: amounts not disclosed in the report extract cited.',
            'Source: tech.eu, H1 2026 Ecosystem Report (30 July 2026), as cited on page 63.', 'money-market-analysis')
chart_entry('multiples', 68, 'Money', 'The Geography of Multiples', 'money-the-geography-of-multiples', 'Money · Data',
            'The same software, <strong>two prices.</strong>',
            'European software companies still trade at a discount of 15 to 25 percent against comparable US businesses, narrowed from 30 to 40 percent five years ago. Deal size is the strongest single driver: the median multiple almost doubles between the 20 to 50 million and the 50 to 100 million brackets.',
            'Median EV/Revenue multiple of SaaS acquisitions by target geography, 2015 to 2026.',
            'Source: Aventis Advisors, SaaS Valuation Multiples 2015 to 2026 (Mergermarket data, 543 deals), as cited on page 66.', 'money-what-buyers-actually-pay')
chart_entry('compliance', 77, 'Money', 'The Compliance Premium, Priced', 'money-the-compliance-premium-priced', 'Money · Data',
            'Eight months of someone else\'s work, <strong>paid for in the price.</strong>',
            'The buyer\'s CFO explained it plainly: the seller\'s certification eliminated roughly eight months of internal DORA remediation at a fully loaded team cost of 95,000 euros a month, plus the discounted risk of a regulatory delay. Both numbers went into the price.',
            'Illustrative reconstruction of the buyer\'s reasoning, from the article. Thousands of euros.',
            'Source: the transaction described on pages 76 and 77; CMS European M&A Study 2026 for the general trend.', 'money-the-compliance-premium')
chart_entry('swiss', 89, 'Portrait', 'The First Capital, in Numbers', 'portrait-the-first-capital-in-numbers', 'Portrait · Data',
            'Early money came back first. <strong>Swiss venture, 2025.</strong>',
            'Venture investment in Swiss startups rose 23.9 percent to 2.95 billion francs across 354 rounds in 2025, the first increase since 2022. The recovery started at the earliest stage, the one FIT has financed since 1994: early-stage funding climbed from 864 million to more than 1.4 billion francs.',
            'Swiss venture investment, 2025, Swiss francs. Early-stage figures as reported; the 2024 total is not shown because the report extract cites it only as a growth rate.',
            'Source: Swiss Venture Capital Report 2026 (startupticker.ch, SECA), as cited on page 13.', 'portrait-julien-guex-fit')
chart_entry('index', 109, 'Value', 'Where First Submissions Fail', 'value-where-first-submissions-fail', 'Value · Data',
            'Two thirds stumble on the same <strong>missing signature.</strong>',
            'Across the first half of 2026, the most common finding in initial CIFSO 5000 reviews was incomplete IP assignment: contractor agreements that never transferred code ownership to the company. It appeared in 64 percent of first submissions, takes eleven weeks on average to resolve once identified, and is almost always fixable. The second most common finding was financial statements not independently reviewed for more than 24 months.',
            'First-submission findings, Aegryn Value Desk, H1 2026. Selection of processes Aegryn participated in or followed; not a statistical sample.',
            'Source: Aegryn CIFSO 5000 Protocol, H1 2026 observations, as reported on pages 108 and 109.', 'value-aegryn-index-grade-distribution')
chart_entry('succession', 121, 'People', 'The Succession Wave, in Numbers', 'people-the-succession-wave-in-numbers', 'People · Data',
            'More Mittelstand owners plan to close <strong>than to hand over.</strong>',
            'Around 545,000 German Mittelstand firms seek a successor by 2029, and 569,000 plan simply to close (KfW, January 2026). In Switzerland, 32 percent of SMEs plan an ownership transfer within five years; at current success rates roughly 12,000 handovers a year will fail (UBS and University of St. Gallen, 2026). Her case, on the previous page, is the exception the data is looking for.',
            'German Mittelstand firms by intention, thousands, horizon 2029.',
            'Sources: KfW Mittelstandspanel, January 2026; UBS and HSG, Swiss SME succession study 2026, as cited on pages 10 and 121.', 'people-workshop-to-platform')


# 3.4 Index des graphiques (Closing, apres p133) : rempli apres renumerotation
NEW['dataindex'] = (133, ['__DATAINDEX__'], [('life-the-charts', 'The Charts', 'Life', '__DATAINDEX_WEB__')])

# ─────────────────────────────────────────────────────────────────────────────
# 4. Insertion dans le flipbook + renumerotation
# ─────────────────────────────────────────────────────────────────────────────
blocks = re.split(r'(?=<div id="p\d+" class="pg)', flip)
head, pages = blocks[0], blocks[1:]
tail_idx = pages[-1].rfind('</div></div>') + len('</div></div>')
tail = pages[-1][tail_idx:]
pages[-1] = pages[-1][:tail_idx]
old_nums = [int(re.match(r'<div id="p(\d+)"', b).group(1)) for b in pages]
assert old_nums == list(range(1, 139))

ordered = []   # (old_num or None, html, key, idx_in_group)
for b, n in zip(pages, old_nums):
    if n == 32:
        assert 'Emplacement 03' in b, 'p32 devait etre l emplacement publicitaire 03'
        b = SUBBLINK_PAGE   # pleine page subblink a la place du placeholder
    ordered.append((n, b, None, None))
    for key, (after, newpages, _w) in NEW.items():
        if after == n:
            for i, np_ in enumerate(newpages):
                ordered.append((None, np_, key, i))

old2new = {}
new_pages_pos = {}  # (key, idx) -> new page number
final = []
for i, (n, b, key, idx) in enumerate(ordered, start=1):
    if n is not None:
        old2new[n] = i
    else:
        new_pages_pos[(key, idx)] = i
    final.append((i, n, b, key, idx))
TOTAL = len(final)
assert TOTAL % 2 == 0, f'total impair : {TOTAL}'

# Index des graphiques : liste avec pages
chart_list = [
    ('ai', 'Adoption of AI by EU enterprises, 2021 to 2025', 'Eurostat', ('dossier', 1)),
    ('funding', 'European tech funding by country, H1 2026', 'tech.eu', ('funding', 0)),
    ('multiples', 'Median EV/Revenue multiple by geography', 'Aventis Advisors, Mergermarket', ('multiples', 0)),
    ('compliance', 'The compliance premium, priced', 'Transaction on pp. 76 to 77; CMS', ('compliance', 0)),
    ('swiss', 'Swiss venture investment, 2025', 'Swiss Venture Capital Report 2026', ('swiss', 0)),
    ('index', 'Where first CIFSO 5000 submissions fail', 'Aegryn Value Desk', ('index', 0)),
    ('succession', 'The succession wave, Germany 2029', 'KfW; UBS and HSG', ('succession', 0)),
    ('digital', 'Digital intensity of EU SMEs, 2025', 'Eurostat', ('dossier', 7)),
    ('clock', 'The regulatory clock, 2023 to 2028', 'Official Journal of the EU; Fedlex', ('dossier', 5)),
]
rows_html = ''.join(
    f'<div style="display:grid;grid-template-columns:22px 1fr 44px;gap:8px;padding:7px 0;border-bottom:.5px solid #e8e4dc;align-items:baseline">'
    f'<span style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:8px;font-weight:700;color:#1a8a6e">{i+1:02d}</span>'
    f'<div><div style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:9.4px;font-weight:600;color:#050505">{t}</div>'
    f'<div class="bx-sm" style="font-size:7.6px;color:#8a867f;text-align:left">{s}</div></div>'
    f'<span style="font-family:\'Plus Jakarta Sans\',sans-serif;font-size:9px;font-weight:700;color:#0A1628;text-align:right">p.\u00a0{new_pages_pos[pos]}</span></div>'
    for i, (k, t, s, pos) in enumerate(chart_list))
dataindex_page = page('Life', 'The Charts',
    '<div class="body"><span class="lbl">This Issue, Charted</span>'
    '<div class="mix" style="font-size:22px;line-height:.92;margin-bottom:6px">Nine charts, <strong>one method.</strong></div>'
    '<p class="bx-sm" style="color:#9a9690;font-size:8px;margin-bottom:8px">Every chart in this issue is built only from figures cited in its pages, with the source printed beneath it. Nothing is extrapolated.</p>'
    + rows_html + '</div>')
dataindex_web = ('<p>Every chart in this issue is built only from figures cited in its pages, with the source printed beneath it. Nothing is extrapolated.</p>'
                 + ''.join(f'<p><strong>{i+1:02d}</strong> {t} <em>({s})</em>, p.\u00a0{new_pages_pos[pos]}</p>' for i, (k, t, s, pos) in enumerate(chart_list)))

# Assemble : ids, numeros, parite
out_pages = []
for i, n, b, key, idx in final:
    if b == '__DATAINDEX__':
        b = dataindex_page
    if n is None:
        b = b.replace('id="pNEW"', f'id="p{i}"', 1)
        b = re.sub(r'<div class="pn([^"]*)">0</div>', lambda m: f'<div class="pn{m.group(1)}">{i}</div>', b)
    else:
        b = b.replace('id="pNEW"', f'id="p{i}"', 1)
        b = re.sub(r'^<div id="p\d+"', f'<div id="p{i}"', b, count=1)
        b = re.sub(r'<div class="pn([^"]*)"( style="[^"]*")?>0</div>', lambda m: f'<div class="pn{m.group(1)}"{m.group(2) or ""}>{i}</div>', b)
        b = re.sub(r'(<div class="pn[^"]*">)\d+(</div>)', lambda m: f'{m.group(1)}{i}{m.group(2)}', b)
    side = 'pn-l' if i % 2 == 0 else 'pn-r'
    b = re.sub(r'class="pn([^"]*?)\s?pn-[lr]', lambda m: f'class="pn{m.group(1)} {side}', b)
    out_pages.append(b)

new_flip = head + ''.join(out_pages) + tail
new_flip = new_flip.replace('var TOT_REAL = 138;', f'var TOT_REAL = {TOTAL};')
new_flip = new_flip.replace('from these <strong>138 pages.</strong>', f'from these <strong>{TOTAL} pages.</strong>')
# "Who You Will Meet" : references de pages (114, 118, 120, 122, 84)
def fix_meet(block):
    for old in (114, 118, 120, 122, 84):
        block = re.sub(r'(>\s*)' + str(old) + r'(\s*<)', lambda m: f'{m.group(1)}{old2new[old]}{m.group(2)}', block)
    return block
m = re.search(r'<div id="p\d+" class="pg">(?:(?!<div id="p\d+" class="pg).)*?Who You Will Meet.*?(?=<div id="p\d+" class="pg)', new_flip, flags=re.S)
if m:
    new_flip = new_flip[:m.start()] + fix_meet(m.group(0)) + new_flip[m.end():]
# Renvois textuels vers des pages existantes dans les nouveaux contenus (pages 108, 63, 66, 76, 77, 13, 26, 27, 10, 121, 109)
def fix_refs(s):
    def rep(m):
        a = int(m.group(2)); b = m.group(4)
        s2 = f'{m.group(1)}{old2new.get(a, a)}'
        if b: s2 += f'{m.group(3)}{old2new.get(int(b), int(b))}'
        return s2
    return re.sub(r'(pages? |pp\. |p\. )(\d{1,3})(?:( and | to )(\d{1,3}))?', rep, s)
# appliquer uniquement aux nouvelles pages (les anciennes gardaient des renvois deja justes avant insertion -> a decaler aussi)
new_flip_pages = re.split(r'(?=<div id="p\d+" class="pg)', new_flip)
fixed = [new_flip_pages[0]]
for b in new_flip_pages[1:]:
    fixed.append(fix_refs(b))
new_flip = ''.join(fixed)
# CSS : surlignage questions (dq) deja inline ; figure chart pour la web edition ajoute plus bas
FLIP.write_text(new_flip)
print(f'flipbook : {TOTAL} pages')

# ─────────────────────────────────────────────────────────────────────────────
# 5. Web edition
# ─────────────────────────────────────────────────────────────────────────────
def web_section(anchor, title, label, inner):
    return (f'\n<section id="{anchor}" class="art wh"><div class="art-w"><span class="lbl k">{html.escape(label)}</span>'
            f'<div class="h1 dk" style="margin-bottom:10px">{html.escape(title)}</div>'
            f'<div style="width:40px;height:1px;background:var(--G);margin-bottom:18px"></div><div class="body">{inner}</div></div></section>')

def insert_after_section(doc, anchor_after, new_html):
    i = doc.find(f'<section id="{anchor_after}"')
    assert i >= 0, anchor_after
    j = doc.find('</section>', i) + len('</section>')
    return doc[:j] + new_html + doc[j:]

# style additions
web = web.replace('</style>', '''
figure.chart{margin:22px 0;padding:18px 18px 12px;background:#FAFAF8;border:1px solid var(--LG)}
figure.chart svg{width:100%;height:auto;display:block}
figure.chart figcaption{font-size:10px;color:rgba(10,10,10,.5);margin-top:10px;line-height:1.5}
.body p.dq{font-weight:700;color:var(--NAVY);margin-top:22px;margin-bottom:6px}
.body p.dq mark{background:rgba(90,221,164,.35);padding:1px 3px}
</style>''', 1)

# ordre d'insertion : apres l'article web correspondant a la page "after"
WEB_AFTER = {
    'charter': 'sources-how-we-know-what-we-say',
    'dossier': 'tech-and-ai-five-honest-lessons',
    'funding': 'money-market-analysis',
    'multiples': 'money-what-buyers-actually-pay',
    'compliance': 'money-the-compliance-premium',
    'swiss': 'portrait-julien-guex-fit',
    'index': 'value-aegryn-index-grade-distribution',
    'succession': 'people-workshop-to-platform',
    'dataindex': 'life-by-the-numbers',
}
for key, (after, newpages, websecs) in NEW.items():
    chunk = ''
    for ws in websecs:
        anchor, title, label, inner = ws[0], ws[1], ws[2], ws[3]
        if inner == '__DATAINDEX_WEB__':
            inner = dataindex_web
        chunk += web_section(anchor, title, label, inner)
    web = insert_after_section(web, WEB_AFTER[key], chunk)

# pages dans la sidebar : mise a jour des existantes + ajout des nouvelles
def new_page_of(key, idx=0): return new_pages_pos[(key, idx)]
# map anchor -> page (anciens) : lire les sb-pg existants
def upd_sb(m):
    old = int(m.group(1)); return f'<span class="sb-pg">p.{old2new.get(old, old):02d}</span>'
web = re.sub(r'<span class="sb-pg">p\.(\d+)</span>', upd_sb, web)
def sb_entry(anchor, title, pg):
    return f'  <a href="#{anchor}" class="sb-a">{html.escape(title)} <span class="sb-pg">p.{pg:02d}</span></a>'
def sb_insert_after(doc, anchor_after, entries_html):
    i = doc.find(f'href="#{anchor_after}" class="sb-a"')
    assert i >= 0, anchor_after
    j = doc.find('</a>', i) + len('</a>')
    return doc[:j] + entries_html + doc[j:]
for key, (after, newpages, websecs) in NEW.items():
    ents = ''
    if key == 'dossier':
        ents += '  <div class="sb-div"></div>  <div class="sb-lbl">Dossier</div>'
        for i, ws in enumerate(websecs):
            ents += sb_entry(ws[0], ws[1], old2new[32] if ws[0] == 'advertising-subblink' else new_page_of('dossier', [0, 1, 2, 4, 5, 6, 7][i]))
    else:
        for i, ws in enumerate(websecs):
            ents += sb_entry(ws[0], ws[1], new_page_of(key, 0))
    web = sb_insert_after(web, WEB_AFTER[key], ents)
web = web.replace('138 pages', f'{TOTAL} pages')
web_pages = fix_refs(web) if False else web  # renvois textuels dans le web : identiques au flipbook, appliques par page ci-dessous
# appliquer fix_refs aux sections (le web reprend les memes textes)
web = re.sub(r'(<section id="[^"]+" class="art[^>]*>.*?</section>)', lambda m: fix_refs(m.group(1)), web, flags=re.S)
WEB.write_text(web)
print('web edition : ok')

# ─────────────────────────────────────────────────────────────────────────────
# 6. toc.ts : pages decalees + nouvelles entrees
# ─────────────────────────────────────────────────────────────────────────────
toc = re.sub(r'page: (\d+) \}', lambda m: f'page: {old2new.get(int(m.group(1)), int(m.group(1)))} }}', toc)
def toc_line(anchor, title, pg): return f'    {{ anchor: \'{anchor}\', title: "{title}", page: {pg} }},\n'
def toc_insert_after(doc, anchor_after, lines):
    i = doc.find(f"anchor: '{anchor_after}'"); assert i >= 0, anchor_after
    j = doc.find('\n', i) + 1
    return doc[:j] + lines + doc[j:]
toc = toc_insert_after(toc, 'sources-how-we-know-what-we-say', toc_line('editorial-why-a-consulting-firm-publishes', 'Why a Consulting Firm Publishes a Magazine', new_page_of('charter')))
dossier_lines = ''.join(toc_line(ws[0], ws[1].replace('"', '\\"'), old2new[32] if ws[0] == 'advertising-subblink' else new_page_of('dossier', [0, 1, 2, 4, 5, 6, 7][i])) for i, ws in enumerate(NEW['dossier'][2]))
toc = toc_insert_after(toc, 'tech-and-ai-five-honest-lessons', dossier_lines)
for key, after_anchor in [('funding', 'money-market-analysis'), ('multiples', 'money-what-buyers-actually-pay'), ('compliance', 'money-the-compliance-premium'),
                          ('swiss', 'portrait-julien-guex-fit'), ('index', 'value-aegryn-index-grade-distribution'), ('succession', 'people-workshop-to-platform'),
                          ('dataindex', 'life-by-the-numbers')]:
    ws = NEW[key][2][0]
    toc = toc_insert_after(toc, after_anchor, toc_line(ws[0], ws[1], new_page_of(key)))
# pageRange par section : recalcule depuis les pages des articles
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
print('toc.ts : ok')
print('mapping (anciennes pages cles) :', {k: old2new[k] for k in (12, 29, 63, 68, 77, 89, 109, 121, 133, 138)})
print('nouvelles pages :', {f'{k}[{i}]': v for (k, i), v in sorted(new_pages_pos.items(), key=lambda x: x[1])})
