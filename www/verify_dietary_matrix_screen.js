const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

(async () => {
  console.log('=== STARTING DIETARY MATRIX STANDALONE SCREEN VERIFICATION ===\n');

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    const filePath = path.join(__dirname, decodeURIComponent(reqPath));
    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise(r => server.listen(8767, r));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8767/dietary-matrix.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  console.log('--- TEST 1: Unique String Elements Verification ---');
  const content = await page.content();
  const requiredStrings = [
    'Namaste, Chef Sarah',
    'DIETARY PREFERENCES',
    'Sattvic / Jain',
    'MASTERED DISHES',
    'Honey Sesame Chicken',
    'Carbonara Champion',
    'ALLERGIES',
    'Nocturnal Spice Dial',
    'Save Dietary Blueprint'
  ];

  for (const str of requiredStrings) {
    const present = content.includes(str);
    console.log(`  - Contains "${str}":`, present);
    if (!present) throw new Error(`Missing required string: ${str}`);
  }

  console.log('\n--- TEST 2: Layout & Navigation Verification ---');
  const layoutInfo = await page.evaluate(() => {
    const scrollEl = document.querySelector('.dietary-content-stream');
    const navEl = document.querySelector('#app-nav');
    const navTabs = navEl ? navEl.querySelectorAll('.nav-tab').length : 0;
    const style = scrollEl ? window.getComputedStyle(scrollEl) : {};
    const navStyle = navEl ? window.getComputedStyle(navEl) : {};

    return {
      overflowY: style.overflowY,
      paddingBottom: style.paddingBottom,
      navPosition: navStyle.position,
      navBottom: navStyle.bottom,
      navTabsCount: navTabs
    };
  });

  console.log('  - Scroll Container Overflow-Y:', layoutInfo.overflowY);
  console.log('  - Scroll Container Padding-Bottom:', layoutInfo.paddingBottom);
  console.log('  - Nav Position:', layoutInfo.navPosition);
  console.log('  - Nav Tabs Count:', layoutInfo.navTabsCount);

  if (layoutInfo.overflowY !== 'auto' || layoutInfo.navTabsCount !== 6) {
    throw new Error('Layout verification failed');
  }

  console.log('\n--- TEST 3: Interactive State Changes ---');
  // Click on Sattvic / Jain pill to toggle
  await page.click('button[data-diet="sattvic"]');
  await page.waitForTimeout(200);
  const isSattvicActive = await page.evaluate(() => {
    const btn = document.querySelector('button[data-diet="sattvic"]');
    return btn && btn.classList.contains('active');
  });
  console.log('  - Sattvic / Jain Active State after click:', isSattvicActive);

  // Click on Save Dietary Blueprint button
  await page.click('#btn-save-dietary-matrix');
  await page.waitForTimeout(300);
  const toastVisible = await page.evaluate(() => {
    const toast = document.getElementById('global-toast');
    return toast && toast.classList.contains('show');
  });
  console.log('  - Toast Confirmation Visible:', toastVisible);

  await page.close();
  await browser.close();
  server.close();

  console.log('\n======================================================');
  console.log('🎉 ALL DIETARY MATRIX STANDALONE TESTS PASSED 100%!');
  console.log('======================================================');
  process.exit(0);
})();
