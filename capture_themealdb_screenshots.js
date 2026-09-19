const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 }
  });
  const page = await context.newPage();
  const baseUrl = 'file:///' + path.resolve(__dirname).replace(/\\/g, '/');

  // 1. Capture Teriyaki Chicken (52772) Live Detail View
  await page.goto(`${baseUrl}/recipe-detail.html?id=52772`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot_themealdb_52772_detail.png' });
  console.log('Saved screenshot_themealdb_52772_detail.png');

  // 2. Capture Spaghetti alla Carbonara (52982) Live Detail View
  await page.goto(`${baseUrl}/recipe-detail.html?id=52982`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot_themealdb_52982_detail.png' });
  console.log('Saved screenshot_themealdb_52982_detail.png');

  // 3. Capture Immersive Cooking Guide with TheMealDB steps (52772)
  await page.goto(`${baseUrl}/cooking-guide.html?id=52772&step=1`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: 'screenshot_themealdb_52772_cookmode.png' });
  console.log('Saved screenshot_themealdb_52772_cookmode.png');

  await browser.close();
})();
