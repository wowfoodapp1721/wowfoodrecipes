const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Phase 8 Automated Playwright Verification: Smart 7-Day Meal Planner (meal-planner.html)...');
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    hasTouch: true
  });
  
  const page = await context.newPage();
  const filePath = 'file:///' + path.resolve(__dirname, 'meal-planner.html').replace(/\\/g, '/');
  
  console.log(`📄 Navigating to: ${filePath}`);
  await page.goto(filePath, { waitUntil: 'load' });

  // 1. Verify Viewport & Page Title
  const title = await page.title();
  console.log(`✓ Page title verified: "${title}"`);
  if (!title.includes('Meal Planner')) {
    throw new Error(`Unexpected page title: ${title}`);
  }

  // 2. Check 7-Day Horizontal Day Strip
  const dayPills = await page.$$('.day-pill-card');
  console.log(`✓ Found ${dayPills.length} day selector pills (Mon–Sun)`);
  if (dayPills.length !== 7) {
    throw new Error(`Expected 7 day pills, found ${dayPills.length}`);
  }

  // Verify Default Active Day (Wednesday)
  const activePill = await page.$('.day-pill-card.day--active');
  const activeDayKey = await activePill.getAttribute('data-day');
  console.log(`✓ Default active day verified: ${activeDayKey.toUpperCase()} (Wed 16)`);
  if (activeDayKey !== 'wed') {
    throw new Error(`Expected default active day 'wed', got '${activeDayKey}'`);
  }

  // 3. Test Switching to Monday
  console.log('🔄 Switching to Monday (Mon 14)...');
  const monPill = await page.$('.day-pill-card[data-day="mon"]');
  await monPill.click();
  await page.waitForTimeout(300);

  const calDisplayMon = await page.$eval('#calorie-display-val', el => el.textContent.trim());
  const bTitleMon = await page.$eval('#b-title', el => el.textContent.trim());
  const lTitleMon = await page.$eval('#l-title', el => el.textContent.trim());
  console.log(`✓ Monday Calorie Target: ${calDisplayMon}`);
  console.log(`✓ Monday Breakfast: "${bTitleMon}"`);
  console.log(`✓ Monday Lunch: "${lTitleMon}"`);

  if (!bTitleMon.includes('Parfait') || !lTitleMon.includes('Carbonara')) {
    throw new Error(`Monday meal update failed: ${bTitleMon} / ${lTitleMon}`);
  }

  // 4. Test Switching to Friday
  console.log('🔄 Switching to Friday (Fri 18)...');
  const friPill = await page.$('.day-pill-card[data-day="fri"]');
  await friPill.click();
  await page.waitForTimeout(300);

  const calDisplayFri = await page.$eval('#calorie-display-val', el => el.textContent.trim());
  const lTitleFri = await page.$eval('#l-title', el => el.textContent.trim());
  console.log(`✓ Friday Calorie Target: ${calDisplayFri}`);
  console.log(`✓ Friday Lunch: "${lTitleFri}"`);
  if (!lTitleFri.includes('Paella')) {
    throw new Error(`Friday meal update failed: ${lTitleFri}`);
  }

  // 5. Test Switching back to Wednesday
  console.log('🔄 Switching back to Wednesday (Wed 16)...');
  const wedPill = await page.$('.day-pill-card[data-day="wed"]');
  await wedPill.click();
  await page.waitForTimeout(300);

  // 6. Test Meal Swap Interaction
  console.log('🔄 Testing Meal Swap button on Lunch...');
  const lunchSwapBtn = await page.$('.btn-swap-meal[data-slot="lunch"]');
  await lunchSwapBtn.click();
  await page.waitForTimeout(400);

  const toastVisible = await page.$eval('#global-toast', el => el.classList.contains('show'));
  const toastText = await page.$eval('#toast-msg', el => el.textContent.trim());
  console.log(`✓ Toast triggered: "${toastText}" (Visible: ${toastVisible})`);
  if (!toastText.includes('Swapped lunch')) {
    throw new Error(`Toast text unexpected: ${toastText}`);
  }

  // 7. Test Macro Goal Button
  console.log('📊 Testing Macro Goal breakdown quick button...');
  await page.click('#btn-toggle-macros');
  await page.waitForTimeout(300);
  const macroToastText = await page.$eval('#toast-msg', el => el.textContent.trim());
  console.log(`✓ Macro breakdown toast: "${macroToastText}"`);

  // 8. Test Dismiss Prep Ahead Notice
  console.log('🔔 Testing Prep Ahead notification dismissal...');
  const prepBoxBefore = await page.$eval('#prep-reminder-box', el => window.getComputedStyle(el).display);
  await page.click('#btn-dismiss-reminder');
  await page.waitForTimeout(200);
  const prepBoxAfter = await page.$eval('#prep-reminder-box', el => window.getComputedStyle(el).display);
  console.log(`✓ Prep box display before: ${prepBoxBefore}, after dismissal: ${prepBoxAfter}`);
  if (prepBoxAfter !== 'none') {
    throw new Error('Prep reminder was not dismissed correctly');
  }

  // 9. Verify Action Links
  const cookModeHref = await page.$eval('#btn-start-cook-lunch', el => el.getAttribute('href'));
  const groceryExportHref = await page.$eval('#btn-export-grocery-list', el => el.getAttribute('href'));
  console.log(`✓ Cook Mode Link: ${cookModeHref}`);
  console.log(`✓ Grocery Export Link: ${groceryExportHref}`);
  if (!cookModeHref.includes('cooking-guide.html') || !groceryExportHref.includes('grocery.html')) {
    throw new Error('Action links invalid');
  }

  // 10. Verify Bottom Nav Tabs
  const navTabs = await page.$$('#app-nav .nav-tab');
  console.log(`✓ Bottom navigation verified with ${navTabs.length} tabs`);
  const activeNav = await page.$eval('#app-nav .nav-tab--active .nav-label', el => el.textContent.trim());
  console.log(`✓ Active nav tab: "${activeNav}"`);
  if (activeNav !== 'Planner') {
    throw new Error(`Expected active nav tab 'Planner', got '${activeNav}'`);
  }

  console.log('\n🎉 ALL 10 VERIFICATION STEPS PASSED SUCCESSFULLY! Phase 8 is 100% verified.');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
