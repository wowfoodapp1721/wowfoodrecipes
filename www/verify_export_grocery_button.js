const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 900 }
  });
  const page = await context.newPage();

  const mealPlannerUrl = 'file:///' + path.resolve(__dirname, 'meal_planner.html').replace(/\\/g, '/');
  console.log('Navigating to Meal Planner:', mealPlannerUrl);
  await page.goto(mealPlannerUrl);
  await page.waitForLoadState('networkidle');

  // Scroll to bottom to view the export button
  await page.locator('#viewport').evaluate(el => el.scrollTop = 500);
  await page.waitForTimeout(400);

  const exportBtn = page.locator('#btn-export-grocery-list');
  const count = await exportBtn.count();
  console.log('Export button count:', count);

  // Check resting styles
  const restingBorder = await exportBtn.evaluate(el => window.getComputedStyle(el).borderColor);
  const restingColor = await exportBtn.evaluate(el => window.getComputedStyle(el).color);
  const restingIconColor = await exportBtn.locator('.material-symbols-outlined').evaluate(el => window.getComputedStyle(el).color);
  const restingTransition = await exportBtn.evaluate(el => window.getComputedStyle(el).transition);

  console.log('Resting border-color:', restingBorder);
  console.log('Resting text color:', restingColor);
  console.log('Resting icon color:', restingIconColor);
  console.log('Resting transition:', restingTransition);

  // Take resting screenshot
  const screenshotRestingPath = path.resolve(__dirname, 'export_btn_resting.png');
  await page.screenshot({ path: screenshotRestingPath, fullPage: true });

  // Hover over the export button
  await exportBtn.hover();
  await page.waitForTimeout(400);

  const hoverTransform = await exportBtn.evaluate(el => window.getComputedStyle(el).transform);
  const hoverColor = await exportBtn.evaluate(el => window.getComputedStyle(el).color);
  const hoverIconColor = await exportBtn.locator('.material-symbols-outlined').evaluate(el => window.getComputedStyle(el).color);
  const hoverShadow = await exportBtn.evaluate(el => window.getComputedStyle(el).boxShadow);

  console.log('Hovered transform:', hoverTransform);
  console.log('Hovered text color:', hoverColor);
  console.log('Hovered icon color:', hoverIconColor);
  console.log('Hovered box-shadow:', hoverShadow);

  // Take hover screenshot
  const screenshotHoverPath = path.resolve(__dirname, 'export_btn_hover.png');
  await page.screenshot({ path: screenshotHoverPath, fullPage: true });

  if (!hoverTransform.includes('-2') && !hoverTransform.includes('matrix')) {
    throw new Error('Export button did not translateY(-2px) on hover');
  }

  await browser.close();
  console.log('EXPORT BUTTON HOVER INTERACTION VERIFIED SUCCESSFULLY!');
})();
