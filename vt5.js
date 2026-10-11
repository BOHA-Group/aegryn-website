const puppeteer = require('puppeteer');
(async () => {
  const b = await puppeteer.launch({ headless: true });
  const p = await b.newPage();
  await p.setViewport({width:1440,height:900});
  await p.goto('http://127.0.0.1:55570/fr/about', {waitUntil:'networkidle2',timeout:60000});
  await new Promise(r=>setTimeout(r,1000));
  const y = await p.evaluate(() => { const el=[...document.querySelectorAll('section')].find(s=>s.textContent.includes('Notre vision')); return el.getBoundingClientRect().top+window.scrollY });
  await p.evaluate(v=>window.scrollTo({top:v,behavior:'instant'}), y-200);
  await new Promise(r=>setTimeout(r,38000)); // laisser finir
  // navigation client : home puis retour about
  await p.evaluate(() => { const a=[...document.querySelectorAll('a')].find(x=>x.getAttribute('href')==='/fr'||x.getAttribute('href')==='/'); a && a.click() });
  await new Promise(r=>setTimeout(r,2500));
  await p.evaluate(() => { const a=[...document.querySelectorAll('a')].find(x=>/about/.test(x.getAttribute('href')||'')); a && a.click() });
  await new Promise(r=>setTimeout(r,3000));
  const state = await p.evaluate(() => {
    const el=[...document.querySelectorAll('section')].find(s=>s.textContent.includes('Notre vision'));
    const span=el && el.querySelector('.absolute');
    return span ? span.textContent.length : -1;
  });
  console.log('typed length after nav back:', state);
  await p.evaluate(() => { const el=[...document.querySelectorAll('section')].find(s=>s.textContent.includes('Notre vision')); window.scrollTo({top:el.getBoundingClientRect().top+window.scrollY-200,behavior:'instant'}) });
  await new Promise(r=>setTimeout(r,800));
  await p.screenshot({path:'/tmp/vt_after_nav.png'});
  await b.close();
})();
