"""
issue01_charts.py — Generateur SVG des graphiques d'Issue 01 (charte Aegryn).

Chaque fonction renvoie un SVG inline (viewBox 364 x H), police Plus Jakarta
Sans, palette navy / apex / stone. Toutes les valeurs proviennent de chiffres
deja cites dans le numero (voir issue01_enrich.py pour les sources).
"""
from html import escape

NAVY  = '#0A1628'
GREEN = '#5adda4'
GDK   = '#1a8a6e'
STONE = '#d4d0c8'
SAND  = '#e8e4dc'
SLATE = '#475569'
GRAY  = '#8A8680'
INK   = '#050505'
FONT  = "font-family:'Plus Jakarta Sans',sans-serif"
W     = 364


def _t(x, y, s, size=8, weight=400, fill=SLATE, anchor='start', extra=''):
    return (f'<text x="{x}" y="{y}" style="{FONT};font-size:{size}px;font-weight:{weight};{extra}" '
            f'fill="{fill}" text-anchor="{anchor}">{escape(str(s))}</text>')


def _frame(h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {h}" width="{W}" height="{h}" '
            f'role="img" style="display:block;max-width:100%;height:auto">{body}</svg>')


def hbar(rows, h=None, unit='', vmax=None, accent_idx=0, label_w=118, fmt=lambda v: f'{v}', bar_h=18, gap=12):
    """rows: [(label, value, sublabel?)]. Barres horizontales, valeur a droite."""
    n = len(rows)
    top = 6
    h = h or top + n * (bar_h + gap) + 4
    vmax = vmax or max(r[1] for r in rows)
    x0 = label_w
    maxw = W - x0 - 46
    out = []
    for i, r in enumerate(rows):
        label, v = r[0], r[1]
        y = top + i * (bar_h + gap)
        bw = max(2, maxw * v / vmax)
        fill = GREEN if i == accent_idx else NAVY
        out.append(_t(x0 - 8, y + 12, label, 8, 600, INK, 'end'))
        if len(r) > 2 and r[2]:
            out.append(_t(x0 - 8, y + 21, r[2], 6.2, 400, GRAY, 'end'))
        out.append(f'<rect x="{x0}" y="{y}" width="{bw:.1f}" height="{bar_h}" fill="{fill}"/>')
        out.append(_t(x0 + bw + 6, y + 12.5, fmt(v) + unit, 9, 700, NAVY))
    return _frame(h, ''.join(out))


def vbar(groups, h=230, unit='', vmax=None, fmt=lambda v: f'{v}', note_under=None):
    """groups: [(label, value, accent_bool)]. Barres verticales, valeur au-dessus."""
    n = len(groups)
    top, bottom = 26, 34
    vmax = vmax or max(g[1] for g in groups)
    chart_h = h - top - bottom
    slot = W / n
    bw = min(64, slot * 0.56)
    out = [f'<line x1="0" y1="{h-bottom}" x2="{W}" y2="{h-bottom}" stroke="{STONE}" stroke-width=".5"/>']
    for i, (label, v, acc) in enumerate(groups):
        cx = slot * i + slot / 2
        bh = chart_h * v / vmax
        y = h - bottom - bh
        out.append(f'<rect x="{cx-bw/2:.1f}" y="{y:.1f}" width="{bw:.1f}" height="{bh:.1f}" fill="{GREEN if acc else NAVY}"/>')
        out.append(_t(cx, y - 6, fmt(v) + unit, 10, 700, NAVY, 'middle'))
        for j, line in enumerate(label.split('\n')):
            out.append(_t(cx, h - bottom + 12 + j * 9, line, 6.8, 600 if j == 0 else 400, SLATE if j == 0 else GRAY, 'middle'))
    if note_under:
        out.append(_t(W / 2, h - 2, note_under, 6.5, 400, GRAY, 'middle'))
    return _frame(h, ''.join(out))


def line_chart(points, h=200, unit='%', vmax=None, markers=None):
    """points: [(x_label, value)]. Courbe simple avec valeurs."""
    left, right, top, bottom = 28, 16, 22, 30
    vmax = vmax or max(p[1] for p in points) * 1.15
    cw, ch = W - left - right, h - top - bottom
    n = len(points)
    xs = [left + cw * i / (n - 1) for i in range(n)]
    ys = [top + ch - ch * p[1] / vmax for p in points]
    out = []
    for k in range(5):
        y = top + ch * k / 4
        out.append(f'<line x1="{left}" y1="{y:.1f}" x2="{W-right}" y2="{y:.1f}" stroke="{SAND}" stroke-width=".5"/>')
        out.append(_t(left - 5, y + 2.5, f'{vmax*(1-k/4):.0f}{unit}', 6, 400, GRAY, 'end'))
    path = ' '.join(f'{"M" if i == 0 else "L"}{xs[i]:.1f},{ys[i]:.1f}' for i in range(n))
    area = path + f' L{xs[-1]:.1f},{top+ch} L{xs[0]:.1f},{top+ch} Z'
    out.append(f'<path d="{area}" fill="{GREEN}" opacity=".12"/>')
    out.append(f'<path d="{path}" fill="none" stroke="{NAVY}" stroke-width="2"/>')
    for i, (lab, v) in enumerate(points):
        out.append(f'<circle cx="{xs[i]:.1f}" cy="{ys[i]:.1f}" r="3.2" fill="{GREEN if i == n-1 else NAVY}"/>')
        out.append(_t(xs[i], ys[i] - 8, f'{v}{unit}', 8.5, 700, NAVY, 'middle'))
        out.append(_t(xs[i], h - bottom + 14, lab, 7, 600, SLATE, 'middle'))
    return _frame(h, ''.join(out))


def waterfall(steps, h=210, fmt=lambda v: f'€{v:,.0f}K'):
    """steps: [(label, value, kind)] kind in {'add','total'}."""
    n = len(steps)
    top, bottom = 24, 40
    total = sum(v for _, v, k in steps if k == 'add')
    vmax = max(total, max(v for _, v, _ in steps)) * 1.1
    chart_h = h - top - bottom
    slot = W / n
    bw = min(70, slot * 0.6)
    out = [f'<line x1="0" y1="{h-bottom}" x2="{W}" y2="{h-bottom}" stroke="{STONE}" stroke-width=".5"/>']
    run = 0
    for i, (label, v, kind) in enumerate(steps):
        cx = slot * i + slot / 2
        if kind == 'add':
            y0 = h - bottom - chart_h * run / vmax
            y1 = h - bottom - chart_h * (run + v) / vmax
            out.append(f'<rect x="{cx-bw/2:.1f}" y="{y1:.1f}" width="{bw:.1f}" height="{y0-y1:.1f}" fill="{NAVY}"/>')
            if i > 0:
                out.append(f'<line x1="{cx-bw/2-slot*0.4:.1f}" y1="{y0:.1f}" x2="{cx-bw/2:.1f}" y2="{y0:.1f}" stroke="{STONE}" stroke-dasharray="2 2"/>')
            out.append(_t(cx, y1 - 6, fmt(v), 9, 700, NAVY, 'middle'))
            run += v
        else:
            y1 = h - bottom - chart_h * v / vmax
            out.append(f'<rect x="{cx-bw/2:.1f}" y="{y1:.1f}" width="{bw:.1f}" height="{h-bottom-y1:.1f}" fill="{GREEN}"/>')
            out.append(_t(cx, y1 - 6, fmt(v), 10, 700, GDK, 'middle'))
        for j, line in enumerate(label.split('\n')):
            out.append(_t(cx, h - bottom + 12 + j * 9, line, 6.6, 600 if j == 0 else 400, SLATE if j == 0 else GRAY, 'middle'))
    return _frame(h, ''.join(out))


def stacked_single(segments, h=120, title_left=None):
    """segments: [(label, pct, color)] une barre 100 % avec legende."""
    bar_y, bar_h = 18, 26
    out = []
    x = 0
    for label, pct, color in segments:
        w = W * pct / 100
        out.append(f'<rect x="{x:.1f}" y="{bar_y}" width="{w:.1f}" height="{bar_h}" fill="{color}"/>')
        if w > 34:
            out.append(_t(x + w / 2, bar_y + 17, f'{pct}%', 9, 700, '#fff' if color in (NAVY, GDK) else NAVY, 'middle'))
        x += w
    ly = bar_y + bar_h + 18
    lx = 0
    for i, (label, pct, color) in enumerate(segments):
        if i == 2: lx, ly = 0, ly + 14
        out.append(f'<rect x="{lx}" y="{ly-7}" width="8" height="8" fill="{color}"/>')
        out.append(_t(lx + 12, ly, f'{label} · {pct}%', 7, 600, SLATE))
        lx += W / 2
    return _frame(h, ''.join(out))


def donut(pct, h=150, label='', sub='', color=GREEN):
    """Anneau simple : part + reste."""
    import math
    cx, cy, r, sw = 70, h / 2, 46, 14
    circ = 2 * math.pi * r
    out = [f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{SAND}" stroke-width="{sw}"/>',
           f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="{color}" stroke-width="{sw}" '
           f'stroke-dasharray="{circ*pct/100:.1f} {circ:.1f}" transform="rotate(-90 {cx} {cy})"/>',
           _t(cx, cy + 7, f'{pct}%', 20, 700, NAVY, 'middle'),
           _t(140, cy - 6, label, 9, 700, INK),
           _t(140, cy + 8, sub, 7.2, 400, SLATE)]
    return _frame(h, ''.join(out))


def timeline(events, h=None, row_h=44):
    """events: [(date, title, detail, tag)] frise verticale."""
    top = 10
    h = h or top + len(events) * row_h + 6
    x_line = 92
    out = [f'<line x1="{x_line}" y1="{top}" x2="{x_line}" y2="{h-6}" stroke="{STONE}" stroke-width="1"/>']
    for i, (date, title, detail, tag) in enumerate(events):
        y = top + i * row_h + 10
        past = tag == 'past'
        out.append(f'<circle cx="{x_line}" cy="{y}" r="4.2" fill="{NAVY if past else GREEN}" stroke="#fff" stroke-width="1.5"/>')
        out.append(_t(x_line - 12, y + 3, date, 7.4, 700, NAVY if past else GDK, 'end'))
        out.append(_t(x_line + 14, y + 1, title, 8.2, 700, INK))
        out.append(_t(x_line + 14, y + 12, detail, 6.6, 400, SLATE))
    return _frame(h, ''.join(out))
