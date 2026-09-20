const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const filePath = path.join(__dirname, 'dashboard.html');
  await page.goto(`file://${filePath}`);
  await page.waitForTimeout(1000);

  // Screenshot the entire dashboard
  await page.screenshot({ path: 'dashboard_chrome_logo_verified.png' });
  console.log('Saved dashboard_chrome_logo_verified.png');

  // Screenshot the header specifically
  const header = page.locator('#app-header');
  await header.screenshot({ path: 'header_chrome_logo_closeup.png' });
  console.log('Saved header_chrome_logo_closeup.png');

  await browser.close();
})();
