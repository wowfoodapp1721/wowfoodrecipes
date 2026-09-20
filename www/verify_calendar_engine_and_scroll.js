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

  // Test 1: Check initial header text
  const initialHeadline = await page.locator('#week-headline-label').innerText();
  console.log('Initial headline:', initialHeadline);
  if (!initialHeadline.includes('2026')) {
    throw new Error(`Expected headline to include 2026, got "${initialHeadline}"`);
  }

  // Test 2: Verify viewport scrolling properties
  const viewportOverflow = await page.locator('#viewport').evaluate(el => window.getComputedStyle(el).overflowY);
  console.log('#viewport overflow-y:', viewportOverflow);
  if (viewportOverflow !== 'auto' && viewportOverflow !== 'scroll') {
    throw new Error(`Expected #viewport overflow-y to be auto/scroll, got ${viewportOverflow}`);
  }

  // Test 3: Click calendar picker button to open dropdown
  const calendarBtn = page.locator('#btn-calendar-picker');
  await calendarBtn.click();
  await page.waitForTimeout(300);

  const dropdownVisible = await page.locator('#month-picker-dropdown').isVisible();
  console.log('Month picker dropdown visible:', dropdownVisible);
  if (!dropdownVisible) {
    throw new Error('Month picker dropdown did not open on button click');
  }

  // Take screenshot with dropdown open
  const screenshotDropdownPath = path.resolve(__dirname, 'calendar_dropdown_open.png');
  await page.screenshot({ path: screenshotDropdownPath, fullPage: true });
  console.log('Dropdown screenshot saved to:', screenshotDropdownPath);

  // Test 4: Select November month
  const novBtn = page.locator('button.month-grid-item[data-month-name="Nov"]');
  await novBtn.click();
  await page.waitForTimeout(400);

  // Verify dropdown closed
  const isClosed = await page.locator('#month-picker-dropdown').isHidden();
  console.log('Dropdown closed after month click:', isClosed);
  if (!isClosed) {
    throw new Error('Dropdown did not close after selecting month');
  }

  // Verify updated headline
  const novHeadline = await page.locator('#week-headline-label').innerText();
  console.log('Updated November headline:', novHeadline);
  if (!novHeadline.includes('Nov 01, 2026')) {
    throw new Error(`Expected headline to be "Week of Nov 01, 2026", got "${novHeadline}"`);
  }

  // Verify November day count is 30
  const novDayCount = await page.locator('.day-pill-card').count();
  console.log('November generated day pills count:', novDayCount);
  if (novDayCount !== 30) {
    throw new Error(`Expected 30 days for November, got ${novDayCount}`);
  }

  // Verify Day 01 is active with Neon Cyan fill
  const firstDayPill = page.locator('.day-pill-card').first();
  const firstDayActive = await firstDayPill.evaluate(el => el.classList.contains('day--active'));
  const firstDayNum = await firstDayPill.locator('.day-num-tag').innerText();
  console.log('First day active:', firstDayActive, 'Day number:', firstDayNum);
  if (!firstDayActive || firstDayNum !== '01') {
    throw new Error('Day 01 is not active');
  }

  // Test 5: February Leap Year vs Standard Year
  // Open dropdown and change year to 2028 (leap year)
  await calendarBtn.click();
  await page.waitForTimeout(200);
  await page.locator('#btn-year-next').click(); // 2027
  await page.waitForTimeout(100);
  await page.locator('#btn-year-next').click(); // 2028
  await page.waitForTimeout(100);

  const febBtn = page.locator('button.month-grid-item[data-month-name="Feb"]');
  await febBtn.click();
  await page.waitForTimeout(400);

  const feb2028DayCount = await page.locator('.day-pill-card').count();
  console.log('Feb 2028 (Leap Year) day count:', feb2028DayCount);
  if (feb2028DayCount !== 29) {
    throw new Error(`Expected 29 days for Feb 2028, got ${feb2028DayCount}`);
  }

  // Open dropdown and change back to 2026 (standard year)
  await calendarBtn.click();
  await page.waitForTimeout(200);
  await page.locator('#btn-year-prev').click(); // 2027
  await page.waitForTimeout(100);
  await page.locator('#btn-year-prev').click(); // 2026
  await page.waitForTimeout(100);

  await febBtn.click();
  await page.waitForTimeout(400);

  const feb2026DayCount = await page.locator('.day-pill-card').count();
  console.log('Feb 2026 (Standard Year) day count:', feb2026DayCount);
  if (feb2026DayCount !== 28) {
    throw new Error(`Expected 28 days for Feb 2026, got ${feb2026DayCount}`);
  }

  // Switch back to Oct 14, 2026
  await calendarBtn.click();
  await page.waitForTimeout(200);
  const octBtn = page.locator('button.month-grid-item[data-month-name="Oct"]');
  await octBtn.click();
  await page.waitForTimeout(400);

  // Click on Day 14
  const day14Pill = page.locator('.day-pill-card[data-date="14"]');
  await day14Pill.click();
  await page.waitForTimeout(400);

  // Test 6: Viewport Scrolling
  console.log('Testing vertical scrolling down the page...');
  await page.locator('#viewport').evaluate(el => el.scrollTop = 400);
  await page.waitForTimeout(400);
  const scrolledTop = await page.locator('#viewport').evaluate(el => el.scrollTop);
  console.log('Viewport scrolled scrollTop:', scrolledTop);
  if (scrolledTop < 200) {
    throw new Error('Viewport did not scroll vertically');
  }

  // Take final verified screenshot
  const screenshotFinalPath = path.resolve(__dirname, 'calendar_engine_final_verified.png');
  await page.screenshot({ path: screenshotFinalPath, fullPage: true });
  console.log('Final verified screenshot saved to:', screenshotFinalPath);

  await browser.close();
  console.log('ALL CALENDAR ENGINE & VIEWPORT SCROLLING TESTS PASSED PERFECTLY!');
})();
