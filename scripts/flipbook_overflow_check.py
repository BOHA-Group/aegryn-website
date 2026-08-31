"""
flipbook_overflow_check.py — QA tool: detect clipped/overflowing text on flipbook pages.

Run this after ANY edit to the flipbook HTML (new articles, images, ad
placements, copy changes) to catch text silently cut off by CSS
overflow:hidden before it ships. Zero output = no clipped text.

Usage:
    python3 scripts/flipbook_overflow_check.py

Requires: npx playwright (auto-installed on first run if needed).
"""
import subprocess, os, sys

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
    pages.forEach(pg => {
      const id = pg.id;
      if (!/^p\d+$/.test(id)) return;
      const containers = pg.querySelectorAll(
        '.body, .ga-text-l, .ga-text-r, .ga-text-bottom, .ga-narrow-r, .ga-solo, .bx-col, .bx-col3, .bx-col4, .ga-duo, .ga-trio'
      );
      containers.forEach(c => {
        const sh = c.scrollHeight, ch = c.clientHeight;
        if (sh > ch + 3 && ch > 0) {
          out.push({ page: id, cls: c.className, overflowPx: Math.round(sh-ch), clientH: ch, scrollH: sh });
        }
      });
    });
    return out;
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})();
""" % FLIPBOOK_ABS

with open('/tmp/_flipbook_overflow_check.js', 'w') as f:
    f.write(JS)

result = subprocess.run(['node', '/tmp/_flipbook_overflow_check.js'], capture_output=True, text=True)
print(result.stdout)
if result.returncode != 0:
    print("STDERR:", result.stderr, file=sys.stderr)
    sys.exit(1)

import json
data = json.loads(result.stdout)
if data:
    print(f"\n⚠️  {len(data)} page(s) with clipped text — text is being cut, needs continuation page or spacing fix.")
    sys.exit(1)
else:
    print("✓ No clipped text detected across all pages.")
