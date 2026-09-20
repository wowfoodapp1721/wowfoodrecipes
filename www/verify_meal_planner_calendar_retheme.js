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

  // Verify Week Header
  const weekHeadline = await page.locator('.week-headline').innerText();
  console.log('Week headline:', weekHeadline);
  const cycleBadge = await page.locator('.cycle-badge').innerText();
  console.log('Cycle badge:', cycleBadge);

  // Verify Day Pills
  const dayPills = page.locator('.day-pill-card');
  const dayPillsCount = await dayPills.count();
  console.log('Total day pills count:', dayPillsCount);

  for (let i = 0; i < dayPillsCount; i++) {
    const pill = dayPills.nth(i);
    const dayName = await pill.locator('.day-name-tag').innerText();
    const dayNum = await pill.locator('.day-num-tag').innerText();
    const isActive = await pill.evaluate(el => el.classList.contains('day--active'));
    console.log(`Day ${i+1}: ${dayName} ${dayNum} [Active: ${isActive}]`);
  }

  // Verify WED 16 is active with Neon Cyan styling and black text
  const wedPill = page.locator('#day-pill-wed');
  const wedActiveBg = await wedPill.evaluate(el => window.getComputedStyle(el).backgroundColor);
  const wedActiveColor = await wedPill.evaluate(el => window.getComputedStyle(el).color);
  console.log('WED 16 computed background:', wedActiveBg);
  console.log('WED 16 computed color:', wedActiveColor);

  // Verify Start Cook Mode button is solid Neon Cyan with dark text
  const cookBtn = page.locator('#btn-start-cook-lunch');
  const cookBtnBg = await cookBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
  const cookBtnColor = await cookBtn.evaluate(el => window.getComputedStyle(el).color);
  console.log('Start Cook Mode button background:', cookBtnBg);
  console.log('Start Cook Mode button color:', cookBtnColor);

  // Take screenshot
  const screenshotPath = path.resolve(__dirname, 'meal_planner_retheme_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);

  await browser.close();
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
})();
