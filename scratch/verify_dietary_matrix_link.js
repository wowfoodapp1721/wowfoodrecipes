const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

(async () => {
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

  await new Promise(r => server.listen(8771, r));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  await page.goto('http://127.0.0.1:8771/profile.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const card = await page.$('#card-dietary-blueprint-metrics');
  console.log('Dietary Blueprint Metrics Card Found in profile.html:', !!card);

  // Click on card and verify navigation to dietary-matrix.html
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    card.click()
  ]);

  console.log('Current URL after click:', page.url());
  const isDietaryMatrix = page.url().includes('dietary-matrix.html');
  console.log('Successfully navigated to dietary-matrix.html:', isDietaryMatrix);

  await page.waitForTimeout(300);
  const headerText = await page.$eval('.screen-header .brand-title', el => el.innerText.trim());
  console.log('Header text on destination page:', headerText);

  if (!isDietaryMatrix || !headerText.includes('dietary matrix')) {
    throw new Error('Navigation verification failed');
  }

  console.log('\n🎉 ALL NAVIGATION TESTS PASSED 100%!');
  await browser.close();
  server.close();
})();
