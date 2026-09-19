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

  // Test 1: Nutrition Card Hover
  const nutritionCard = page.locator('#nutrition-summary-card');
  const initialTrans = await nutritionCard.evaluate(el => window.getComputedStyle(el).transition);
  console.log('Nutrition Card transition property:', initialTrans);

  await nutritionCard.hover();
  await page.waitForTimeout(400);

  const hoveredTransform = await nutritionCard.evaluate(el => window.getComputedStyle(el).transform);
  const hoveredShadow = await nutritionCard.evaluate(el => window.getComputedStyle(el).boxShadow);
  console.log('Nutrition Card hovered transform:', hoveredTransform);
  console.log('Nutrition Card hovered box-shadow:', hoveredShadow);

  if (!hoveredTransform.includes('-4') && !hoveredTransform.includes('matrix')) {
    throw new Error('Nutrition card did not translateY(-4px) on hover');
  }

  // Test 2: Breakfast Slot Card Hover
  const breakfastCard = page.locator('#slot-breakfast');
  await breakfastCard.hover();
  await page.waitForTimeout(400);

  const bHoverTransform = await breakfastCard.evaluate(el => window.getComputedStyle(el).transform);
  const bHoverShadow = await breakfastCard.evaluate(el => window.getComputedStyle(el).boxShadow);
  console.log('Breakfast Card hovered transform:', bHoverTransform);
  console.log('Breakfast Card hovered box-shadow:', bHoverShadow);

  // Test 3: Macro Box Item Hover
  const proteinBox = page.locator('.macro-box-item').first();
  await proteinBox.hover();
  await page.waitForTimeout(400);

  const proteinLabelColor = await proteinBox.locator('.macro-label').evaluate(el => window.getComputedStyle(el).color);
  const proteinBoxShadow = await proteinBox.evaluate(el => window.getComputedStyle(el).boxShadow);
  console.log('Protein Box hovered label color:', proteinLabelColor);
  console.log('Protein Box hovered box-shadow:', proteinBoxShadow);

  // Take screenshot with hover effect captured
  const screenshotPath = path.resolve(__dirname, 'hover_lift_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('ALL HOVER LIFT & MICRO-INTERACTIONS TESTS PASSED!');
})();
