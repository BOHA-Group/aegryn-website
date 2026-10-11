const puppeteer = require('puppeteer');
const pages = ['/','/about','/advisory','/advisory/strategy','/advisory/technology','/advisory/risk-compliance','/advisory/talent-organization','/advisory/ma','/alliances','/annuaire','/assets','/assets/subblink','/audit','/career','/contact','/data-protection-notice-neediu','/experts','/franchir/lancement','/franchir/croissance','/franchir/restructuration','/franchir/acquisition','/franchir/transmission','/glossaire','/grade','/grade/brochure','/help/faq','/industries','/industries/sante-sciences-de-la-vie','/investisseurs','/portfolio','/privacy','/roadmap','/security','/services/acquisition-support','/services/build','/talent','/talent/entreprises','/talent/transition','/talent/candidats','/terms/ai-usage','/terms/cgv','/terms/use','/valuation','/valuation/index','/verify','/what-we-build','/workforce'];
const vps = [['d',1440,900],['t',820,1180],['m',390,844]];
(async () => {
  const b = await puppeteer.launch({ headless: true });
  const p = await b.newPage();
  const out = {};
  for (const route of pages) {
    out[route] = {};
    for (const [tag,w,h] of vps) {
      await p.setViewport({width:w,height:h});
      try { await p.goto('http://127.0.0.1:55570/fr'+route, { waitUntil:'domcontentloaded', timeout:45000 }); }
      catch(e){ out[route][tag] = {error:e.message.slice(0,60)}; continue; }
      await new Promise(r=>setTimeout(r,700));
      const data = await p.evaluate(() => {
        const exempt = el => el.closest('nav, footer, form, table, header, [role="navigation"], select, input, textarea, aside');
        const res = [];
        document.querySelectorAll('p, li').forEach(el => {
          const cs = getComputedStyle(el);
          const txt = (el.textContent||'').trim();
          if (!txt || txt.length < 30) return;
          if (cs.display==='none' || parseFloat(cs.opacity)===0) return;
          res.push({ tag: el.tagName.toLowerCase(), fs: parseFloat(cs.fontSize),
            cls: (el.className||'').toString().slice(0,80), exempt: !!exempt(el),
            txt: txt.slice(0,45) });
        });
        // lead = premier p après le premier h1
        const h1 = document.querySelector('h1');
        let lead = null;
        if (h1) {
          let el = h1.nextElementSibling;
          const scope = h1.closest('section, header, div') || document.body;
          const cand = scope.querySelector('p');
          if (cand && cand.textContent.trim().length > 30) {
            lead = { fs: parseFloat(getComputedStyle(cand).fontSize), txt: cand.textContent.trim().slice(0,45) };
          }
        }
        return { els: res, lead };
      });
      out[route][tag] = data;
    }
  }
  console.log(JSON.stringify(out));
  await b.close();
})().catch(e=>{console.error('FATAL',e.message);process.exit(1)});
