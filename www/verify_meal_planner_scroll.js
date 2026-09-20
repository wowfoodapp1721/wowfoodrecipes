const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 900 }
  });
  const page = await context.newPage();

  const mealPlannerUrl = 'file:///' + path.resolve(__dirname, 'meal_planner.html').replace(/\\/g, '/');
  await page.goto(mealPlannerUrl);
  await page.waitForLoadState('networkidle');

  // Scroll main container slightly to show lunch & dinner slots
  await page.locator('.planner-content-body').evaluate(el => el.scrollTop = 220);
  await page.waitForTimeout(500);

  const screenshotPath = path.resolve(__dirname, 'meal_planner_scrolled_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Scrolled screenshot saved to:', screenshotPath);

  await browser.close();
})();
