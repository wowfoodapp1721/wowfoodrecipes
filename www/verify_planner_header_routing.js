const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 900 }
  });
  const page = await context.newPage();

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to dashboard:', dashboardUrl);
  await page.goto(dashboardUrl);
  await page.waitForLoadState('networkidle');

  // Verify branding header link exists and has href="meal_planner.html"
  const brandLink = page.locator('#brand-header-planner-link, a[href="meal_planner.html"]');
  const count = await brandLink.count();
  console.log('Found branding link count:', count);
  if (count === 0) {
    throw new Error('Branding link not found on dashboard.html');
  }

  const href = await brandLink.getAttribute('href');
  console.log('Branding link href attribute:', href);
  if (href !== 'meal_planner.html') {
    throw new Error(`Expected href to be "meal_planner.html", got "${href}"`);
  }

  // Click the branding header
  console.log('Clicking top branding header trigger...');
  await Promise.all([
    page.waitForNavigation({ timeout: 10000 }).catch(() => console.log('Navigation event handled')),
    brandLink.click()
  ]);

  await page.waitForTimeout(1000);
  const currentUrl = page.url();
  console.log('Navigated URL:', currentUrl);
  if (!currentUrl.includes('meal_planner.html')) {
    throw new Error(`Expected URL to include "meal_planner.html", but got "${currentUrl}"`);
  }

  // Verify meal planner elements
  const brandTitle = await page.locator('.brand-title').innerText();
  console.log('Meal Planner Brand title:', brandTitle);

  const daysCount = await page.locator('.day-chip, .week-day-tab, .planner-content-body').count();
  console.log('Planner content elements count:', daysCount);

  // Take screenshot
  const screenshotPath = path.resolve(__dirname, 'planner_routing_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('VERIFICATION SUCCESSFUL: Branding header routes cleanly to meal_planner.html');
})();
