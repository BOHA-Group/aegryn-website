"""
flipbook_overlap_check.py — QA tool: detect overlapping text elements and
text bleeding into the header (.rh, top 28px) or footer folio (.pn, bottom
24px) reserved zones, across all flipbook pages.

Usage:
    python3 scripts/flipbook_overlap_check.py
"""
import subprocess, os, sys, json

REPO_ROOT = subprocess.run(['git', 'rev-parse', '--show-toplevel'],
                            capture_output=True, text=True).stdout.strip()
FLIPBOOK_ABS = os.path.join(REPO_ROOT, 'public/magazine/issue-01/aegryn-magazine-issue-01_1.html')

JS = r"""
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  await page.emulateMedia({ media: 'print' });
  await page.goto('file://%s');
  await page.waitForTimeout(500);

  const results = await page.evaluate(() => {
    const out = [];
    const src = document.getElementById('pg-source');
    const pages = src.querySelectorAll('div[id^="p"]');

    function textRect(el) {
      // Only elements that directly carry visible text (not pure containers)
      const hasOwnText = Array.from(el.childNodes).some(
        n => n.nodeType === 3 && n.textContent.trim().length > 0
      );
      if (!hasOwnText) return null;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return null;
      return r;
    }

    function overlap(a, b) {
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      return ix > 1 && iy > 1 ? ix * iy : 0;
    }

    pages.forEach(pg => {
      const id = pg.id;
      if (!/^p\d+$/.test(id)) return;
      const frame = pg.querySelector('.pg-frame') || pg;
      const frameRect = frame.getBoundingClientRect();
      if (frameRect.width === 0) return;

      const headerZoneBottom = frameRect.top + 28;
      const footerZoneTop = frameRect.bottom - 24;

      const rh = pg.querySelector('.rh');
      const pn = pg.querySelector('.pn');

      const allEls = pg.querySelectorAll('*');
      const textEls = [];
      allEls.forEach(el => {
        if (el === rh || el === pn || rh?.contains(el) || pn?.contains(el)) return;
        const r = textRect(el);
        if (r) textEls.push({ el, r });
      });

      // Check text elements bleeding into header/footer reserved zones
      textEls.forEach(({ el, r }) => {
        if (r.top < headerZoneBottom - 1) {
          out.push({ page: id, type: 'header-zone-intrusion', cls: el.className || el.tagName,
                      text: el.textContent.trim().slice(0,40), depthPx: Math.round(headerZoneBottom - r.top) });
        }
        if (r.bottom > footerZoneTop + 1) {
          out.push({ page: id, type: 'footer-zone-intrusion', cls: el.className || el.tagName,
                      text: el.textContent.trim().slice(0,40), depthPx: Math.round(r.bottom - footerZoneTop) });
        }
      });

      // Check pairwise overlap among sibling-level text elements (leaf nodes only,
      // skip ancestor/descendant pairs since containment is normal)
      for (let i = 0; i < textEls.length; i++) {
        for (let j = i + 1; j < textEls.length; j++) {
          const a = textEls[i], b = textEls[j];
          if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
          const ov = overlap(a.r, b.r);
          if (ov > 30) {
            out.push({ page: id, type: 'text-text-overlap',
                       a: a.el.textContent.trim().slice(0,30), b: b.el.textContent.trim().slice(0,30),
                       overlapAreaPx: Math.round(ov) });
          }
        }
      }
    });
    return out;
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
""" % FLIPBOOK_ABS

with open('/tmp/_flipbook_overlap_check.js', 'w') as f:
    f.write(JS)

result = subprocess.run(['node', '/tmp/_flipbook_overlap_check.js'], capture_output=True, text=True)
if result.returncode != 0:
    print("STDERR:", result.stderr, file=sys.stderr)
    sys.exit(1)

data = json.loads(result.stdout)
print(json.dumps(data, indent=2))
if data:
    print(f"\n⚠️  {len(data)} overlap issue(s) detected.")
    sys.exit(1)
else:
    print("✓ No overlaps or header/footer intrusions detected.")
