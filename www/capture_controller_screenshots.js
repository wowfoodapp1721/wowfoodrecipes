const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 } });
  const page = await context.newPage();
  const baseUrl = 'file:///' + path.resolve(__dirname).replace(/\\/g, '/');

  // 1. Screenshot Avocado Toast Detail View
  await page.goto(`${baseUrl}/recipe-detail.html?id=avocado-toast`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_recipe_detail_avocado_toast.png' });
  console.log('Saved screenshot_recipe_detail_avocado_toast.png');

  // 2. Screenshot Carbonara Detail View
  await page.goto(`${baseUrl}/recipe-detail.html?id=spaghetti-carbonara`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_recipe_detail_carbonara_dynamic.png' });
  console.log('Saved screenshot_recipe_detail_carbonara_dynamic.png');

  // 3. Screenshot Avocado Toast Immersive Cook Mode
  await page.goto(`${baseUrl}/cooking-guide.html?id=avocado-toast`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_cook_mode_avocado_toast.png' });
  console.log('Saved screenshot_cook_mode_avocado_toast.png');

  // 4. Screenshot Ribeye Immersive Cook Mode
  await page.goto(`${baseUrl}/immersive-cooking.html?id=ribeye`, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot_cook_mode_ribeye.png' });
  console.log('Saved screenshot_cook_mode_ribeye.png');

  await browser.close();
})();
