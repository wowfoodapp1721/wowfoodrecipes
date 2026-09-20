const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 420, height: 900 } });
  const page = await context.newPage();
  
  const fileUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(fileUrl);
  await page.waitForTimeout(1000);

  // 1. Open Pasta
  await page.evaluate(() => {
    window.openRecipeDetails('pasta');
  });
  await page.waitForTimeout(500);

  const pastaTitle = await page.textContent('#modal-recipe-title');
  const pastaSub = await page.textContent('#modal-recipe-sub');
  const pastaCal = await page.textContent('#detail-panes-wrapper');
  console.log('Pasta Opened:', { pastaTitle, pastaSub });

  const pastaScreenshot = path.resolve('C:/Users/Lenovo/.gemini/antigravity-ide/brain/7f748c82-e61c-4d5b-a6d1-6089ebde95ab', 'dynamic_pasta_modal_verified.png');
  await page.screenshot({ path: pastaScreenshot });
  console.log('Pasta Screenshot saved to:', pastaScreenshot);

  // 2. Open Ribeye
  await page.evaluate(() => {
    window.openRecipeDetails('ribeye');
  });
  await page.waitForTimeout(500);

  const ribeyeTitle = await page.textContent('#modal-recipe-title');
  const ribeyeSub = await page.textContent('#modal-recipe-sub');
  console.log('Ribeye Opened:', { ribeyeTitle, ribeyeSub });

  // Test Servings Stepper
  const plusBtn = page.locator('#btn-plus-serve');
  await plusBtn.click();
  await page.waitForTimeout(200);
  const servingsVal = await page.textContent('#display-servings');
  console.log('Incremented Servings:', servingsVal);

  const ribeyeScreenshot = path.resolve('C:/Users/Lenovo/.gemini/antigravity-ide/brain/7f748c82-e61c-4d5b-a6d1-6089ebde95ab', 'dynamic_ribeye_modal_verified.png');
  await page.screenshot({ path: ribeyeScreenshot });
  console.log('Ribeye Screenshot saved to:', ribeyeScreenshot);

  await browser.close();
})();
