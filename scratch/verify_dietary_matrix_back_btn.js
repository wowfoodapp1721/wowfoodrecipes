const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('=== VERIFYING DIETARY MATRIX BACK ARROW NAVIGATION ===\n');

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    const filePath = path.join(process.cwd(), decodeURIComponent(reqPath));
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

  await new Promise(r => server.listen(8772, r));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8772/dietary-matrix.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const backBtn = await page.$('#btn-back-to-profile');
  console.log('1. Back Arrow Button found in dietary-matrix.html:', !!backBtn);

  const headerDetails = await page.evaluate(() => {
    const btn = document.getElementById('btn-back-to-profile');
    const brand = document.querySelector('.brand-logo-wrap');
    const btnRect = btn ? btn.getBoundingClientRect() : null;
    const brandRect = brand ? brand.getBoundingClientRect() : null;
    return {
      btnLeft: btnRect ? btnRect.left : null,
      brandLeft: brandRect ? brandRect.left : null,
      isBtnLeftOfBrand: btnRect && brandRect ? btnRect.left < brandRect.left : false,
      btnColor: btn ? window.getComputedStyle(btn.querySelector('.material-symbols-outlined') || btn).color : null
    };
  });

  console.log('2. Header Layout Alignment:', JSON.stringify(headerDetails, null, 2));

  if (!headerDetails.isBtnLeftOfBrand) {
    throw new Error('Back arrow is not to the left of the brand title');
  }

  await page.screenshot({ path: 'test-dietary-matrix-back-arrow.png' });
  console.log('3. Screenshot saved to test-dietary-matrix-back-arrow.png');

  // Test click navigation
  console.log('4. Testing click on back arrow...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    backBtn.click()
  ]);

  console.log('5. Navigated URL:', page.url());
  const isProfile = page.url().includes('profile.html');
  console.log('6. Successfully arrived at profile.html:', isProfile);

  if (!isProfile) {
    throw new Error('Failed to navigate back to profile.html');
  }

  console.log('\n🎉 ALL BACK BUTTON NAVIGATION TESTS PASSED 100%!');
  await browser.close();
  server.close();
})();
