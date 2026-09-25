const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('=== VERIFYING MEAL PLANNER BACK ARROW NAVIGATION ===\n');

  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/meal-planner.html';
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
      res.end('Not Found');
    }
  });

  await new Promise(r => server.listen(8765, r));
  console.log('Test server running at http://localhost:8765');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
  const page = await context.newPage();

  const filesToTest = ['meal-planner.html', 'meal_planner.html'];

  for (const filename of filesToTest) {
    console.log(`\nTesting ${filename}...`);
    await page.goto(`http://localhost:8765/${filename}`, { waitUntil: 'domcontentloaded' });

    // 1. Verify back button presence
    const backBtn = page.locator('#btn-back-to-profile');
    const isVisible = await backBtn.isVisible();
    console.log(`- Back button visible: ${isVisible}`);
    if (!isVisible) throw new Error(`Back button not visible in ${filename}`);

    // 2. Verify icon text
    const iconText = await backBtn.locator('span.material-symbols-outlined').textContent();
    console.log(`- Icon text: "${iconText.trim()}"`);
    if (iconText.trim() !== 'arrow_back') throw new Error(`Expected arrow_back, got ${iconText}`);

    // 3. Verify href attribute
    const href = await backBtn.getAttribute('href');
    console.log(`- href attribute: "${href}"`);
    if (href !== 'profile.html') throw new Error(`Expected profile.html, got ${href}`);

    // 4. Click back button and verify navigation
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      backBtn.click()
    ]);

    const finalUrl = page.url();
    console.log(`- Navigated to: ${finalUrl}`);
    if (!finalUrl.includes('profile.html')) {
      throw new Error(`Expected navigation to profile.html, but reached ${finalUrl}`);
    }
    console.log(`✅ ${filename} passed all back button navigation tests!`);
  }

  await browser.close();
  server.close();
  console.log('\n🎉 ALL MEAL PLANNER BACK ARROW NAVIGATION VERIFICATIONS PASSED SUCCESSFULLY!');
})();
