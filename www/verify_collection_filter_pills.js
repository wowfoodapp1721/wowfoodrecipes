const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Verification: Screen 9 Expanded Category Filter Pills & Fluid Scroll...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const dashboardUrl = 'file://' + path.join(__dirname, 'dashboard.html').replace(/\\/g, '/');
  const collectionUrl = 'file://' + path.join(__dirname, 'collection.html').replace(/\\/g, '/');

  let passedAll = true;

  const EXPECTED_TAGS = [
    'All Saved',
    'Poultry',
    'Pasta',
    'Seafood',
    'Comfort',
    'Pizza & Flatbreads',
    'Burgers & Sliders',
    'Snacks & Starters',
    'Breakfast & Brunch',
    'Desserts & Baking',
    '⚡ Under 15 Mins',
    '⚡ Under 30 Mins',
    '🤖 In My Fridge'
  ];

  // ─── 1. Check Dashboard Collection Screen Filter Row ──────────────────────
  console.log('\n--- Step 1: Validating Dashboard Screen 9 Filter Pills ---');
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // Pre-save some diverse recipes for filtering validation
  await page.evaluate(() => {
    localStorage.setItem('wow_saved_recipes', JSON.stringify([
      'sesame-chicken',
      'carbonara',
      'ribeye',
      'birria-tacos',
      'ceviche',
      'pad-thai'
    ]));
  });

  // Open Screen 9
  await page.click('#app-nav #nav-collection');
  await page.waitForTimeout(500);

  const dashboardPills = await page.$$eval('#collection-filter-scroll .collection-pill', els => els.map(e => e.textContent.trim()));
  console.log(`Found ${dashboardPills.length} pills in Dashboard Screen 9:`);
  console.log(dashboardPills);

  const missingInDashboard = EXPECTED_TAGS.filter(t => !dashboardPills.includes(t));
  if (missingInDashboard.length === 0 && dashboardPills.length === EXPECTED_TAGS.length) {
    console.log('✅ All 13 expected filter tags present in Dashboard Screen 9 with exact strings!');
  } else {
    console.error('❌ Missing or unexpected filter tags in Dashboard Screen 9:', missingInDashboard);
    passedAll = false;
  }

  // Check CSS styling & Horizontal Scroll properties
  const scrollContainerStyle = await page.$eval('#collection-filter-scroll', el => {
    const s = window.getComputedStyle(el);
    return {
      display: s.display,
      flexDirection: s.flexDirection,
      overflowX: s.overflowX,
      whiteSpace: s.whiteSpace,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth
    };
  });
  console.log('Scroll container properties:', scrollContainerStyle);

  if (scrollContainerStyle.overflowX === 'auto' && scrollContainerStyle.scrollWidth > scrollContainerStyle.clientWidth) {
    console.log('✅ Continuous horizontal scroll container verified: scrollWidth > clientWidth with overflowX=auto');
  } else {
    console.error('❌ Horizontal scroll properties not met:', scrollContainerStyle);
    passedAll = false;
  }

  // ─── 2. Test Interactive Filter Toggles & Active State (#FF5500) ──────────
  console.log('\n--- Step 2: Testing Interactive Pill Selection & Color Swapping ---');
  // Click on "Comfort" pill
  const comfortPill = await page.$('#collection-filter-scroll .collection-pill:has-text("Comfort")');
  if (comfortPill) {
    await comfortPill.click();
    await page.waitForTimeout(300);

    const comfortActive = await comfortPill.evaluate(el => {
      const s = window.getComputedStyle(el);
      return el.classList.contains('active') && (s.backgroundColor.includes('255, 85, 0') || s.backgroundColor === '#ff5500');
    });

    console.log(`"Comfort" pill active with neon orange (#FF5500) background: ${comfortActive}`);
    if (comfortActive) {
      console.log('✅ Color swap to vibrant neon orange (#FF5500) verified upon click!');
    } else {
      console.error('❌ "Comfort" pill did not properly receive active #FF5500 styling');
      passedAll = false;
    }
  }

  // Click on "⚡ Under 15 Mins" smart tag
  const under15Pill = await page.$('#collection-filter-scroll .collection-pill:has-text("Under 15 Mins")');
  if (under15Pill) {
    await under15Pill.click();
    await page.waitForTimeout(300);

    const under15Active = await under15Pill.evaluate(el => el.classList.contains('active'));
    console.log(`"⚡ Under 15 Mins" pill active: ${under15Active}`);
    if (under15Active) {
      console.log('✅ Smart dynamic tag "⚡ Under 15 Mins" selection verified!');
    } else {
      console.error('❌ "⚡ Under 15 Mins" failed to activate');
      passedAll = false;
    }
  }

  // Capture screenshot of expanded filter bar in action
  const screenshotPath = path.join(__dirname, 'screenshot_expanded_filter_pills.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`📸 Saved screenshot: ${screenshotPath}`);

  // ─── 3. Check Standalone collection.html Filter Row ───────────────────────
  console.log('\n--- Step 3: Validating Standalone collection.html Filter Pills ---');
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const standalonePills = await page.$$eval('.filter-pills-row .filter-pill', els => els.map(e => e.textContent.trim()));
  console.log(`Found ${standalonePills.length} pills in collection.html:`);
  console.log(standalonePills);

  const missingInStandalone = EXPECTED_TAGS.filter(t => !standalonePills.includes(t));
  if (missingInStandalone.length === 0 && standalonePills.length === EXPECTED_TAGS.length) {
    console.log('✅ All 13 expected filter tags present in collection.html with exact strings!');
  } else {
    console.error('❌ Missing or unexpected filter tags in collection.html:', missingInStandalone);
    passedAll = false;
  }

  await browser.close();

  if (passedAll) {
    console.log('\n🎉 ALL FILTER PILL EXPANSION TESTS PASSED! 100% verified.');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED.');
    process.exit(1);
  }
})();
