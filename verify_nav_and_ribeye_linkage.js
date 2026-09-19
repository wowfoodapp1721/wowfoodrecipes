const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Verification: Precision Navigation Linkage & Ribeye Image Asset Mapping...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const dashboardUrl = `file://${path.resolve(__dirname, 'dashboard.html')}`;
  const collectionUrl = `file://${path.resolve(__dirname, 'collection.html')}`;

  // ─── TEST 1: Bottom Navigation in dashboard.html ───────────────────────────
  console.log('--- TEST 1: Bottom Navigation Linkage on dashboard.html ---');
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const collectionNavTab = page.locator('#app-nav #nav-collection, #app-nav [data-tab="collection"], #app-nav a[href="collection.html"]');
  const navTabCount = await collectionNavTab.count();
  assert(navTabCount >= 1, 'Collection tab anchor must exist in dashboard.html #app-nav');

  const hrefAttr = await collectionNavTab.first().getAttribute('href');
  console.log(`Collection Tab href: "${hrefAttr}"`);
  assert(hrefAttr === 'collection.html', `Expected href="collection.html", got "${hrefAttr}"`);

  // Test click navigation from dashboard to collection
  console.log('Clicking Collection navigation tab from Dashboard...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    collectionNavTab.first().click()
  ]);

  const currentUrl = page.url();
  console.log(`Navigated URL: ${currentUrl}`);
  assert(currentUrl.includes('collection.html'), 'Clicking Collection tab must navigate immediately to collection.html');
  console.log('✅ TEST 1 PASSED: Dashboard Collection tab links directly to collection.html.\n');


  // ─── TEST 2: Ribeye Asset Mapping in collection.html ───────────────────────
  console.log('--- TEST 2: Ribeye Asset Mapping on collection.html ---');
  await page.evaluate(() => {
    localStorage.setItem('wow_saved_recipes', JSON.stringify(['ribeye']));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);

  const cardLocator = page.locator('.search-grid-card');
  const cardCount = await cardLocator.count();
  assert(cardCount >= 1, 'At least 1 saved recipe card must be rendered in collection');

  const cardData = await page.evaluate(() => {
    const card = document.querySelector('.search-grid-card');
    if (!card) return null;

    const titleEl = card.querySelector('.search-card-title');
    const badgeEl = card.querySelector('.search-card-badge');
    const timeEl = card.querySelector('.search-metric-pill.time');
    const calEl = card.querySelector('.search-metric-pill.cal');
    const thumbEl = card.querySelector('.search-card-thumb');
    const backdropEl = card.querySelector('.search-card-thumb-backdrop');
    const heartFab = card.querySelector('.recipe-heart-fab');

    const thumbStyles = thumbEl ? window.getComputedStyle(thumbEl) : null;
    const backdropStyles = backdropEl ? window.getComputedStyle(backdropEl) : null;

    return {
      title: titleEl ? titleEl.textContent.trim() : '',
      badge: badgeEl ? badgeEl.textContent.trim() : '',
      time: timeEl ? timeEl.textContent.trim() : '',
      calories: calEl ? calEl.textContent.trim() : '',
      thumbSrc: thumbEl ? thumbEl.getAttribute('src') : '',
      backdropSrc: backdropEl ? backdropEl.getAttribute('src') : '',
      thumbObjectFit: thumbStyles ? thumbStyles.objectFit : '',
      thumbObjectPosition: thumbStyles ? thumbStyles.objectPosition : '',
      backdropFilter: backdropStyles ? backdropStyles.filter : '',
      hasHeartFab: !!heartFab
    };
  });

  console.log('Card Data:', cardData);

  assert(cardData.title === 'Prime Bone In Ribeye', `Title must be 'Prime Bone In Ribeye', got '${cardData.title}'`);
  assert(cardData.badge === 'RECIPE INCOMING', `Badge must be 'RECIPE INCOMING', got '${cardData.badge}'`);
  assert(cardData.time.includes('20 min') || cardData.time.includes('20 Min'), `Time must be 20 min, got '${cardData.time}'`);
  assert(cardData.calories.includes('520 kcal') || cardData.calories.includes('520'), `Calories must be 520 kcal, got '${cardData.calories}'`);
  assert(cardData.thumbSrc === 'assets/ribeye.jpg', `Expected thumbSrc="assets/ribeye.jpg", got '${cardData.thumbSrc}'`);
  assert(cardData.backdropSrc === 'assets/ribeye.jpg', `Expected backdropSrc="assets/ribeye.jpg", got '${cardData.backdropSrc}'`);
  assert(cardData.thumbObjectFit === 'cover', `Thumb object-fit must be cover, got '${cardData.thumbObjectFit}'`);
  assert(cardData.hasHeartFab, 'Floating heart FAB component must exist');

  console.log('✅ TEST 2 PASSED: Ribeye image correctly mapped to assets/ribeye.jpg with proper cover formatting.\n');

  // ─── TEST 3: Visual Screenshot ────────────────────────────────────────────
  console.log('--- TEST 3: Screenshot Capture ---');
  await page.screenshot({ path: 'collection_nav_and_ribeye_verified.png' });
  console.log('📸 Screenshot saved: collection_nav_and_ribeye_verified.png');
  console.log('✅ TEST 3 PASSED: Visual verification completed.\n');

  console.log('🎉 ALL PRECISION NAVIGATION & ASSET MAPPING TESTS PASSED (100% SUCCESS)!');
  await browser.close();
})();
