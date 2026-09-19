const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting Verification: Collection Bottom Nav & Screen 9 Dynamic Library Engine...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const dashboardUrl = 'file://' + path.join(__dirname, 'dashboard.html').replace(/\\/g, '/');
  const collectionUrl = 'file://' + path.join(__dirname, 'collection.html').replace(/\\/g, '/');
  const searchResultsUrl = 'file://' + path.join(__dirname, 'search-results.html').replace(/\\/g, '/');

  let passedAll = true;

  // ─── 1. Check Bottom Navigation Bar Structure on Dashboard ──────────────
  console.log('--- Step 1: Validating Bottom Nav Structure on Dashboard ---');
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Clear saved recipes to start clean
  await page.evaluate(() => localStorage.removeItem('wow_saved_recipes'));

  const navCollection = await page.$('#app-nav #nav-collection');
  if (!navCollection) {
    console.error('❌ #nav-collection not found in dashboard #app-nav');
    passedAll = false;
  } else {
    const label = await page.$eval('#app-nav #nav-collection .nav-label', el => el.textContent.trim());
    const icon = await page.$eval('#app-nav #nav-collection .material-symbols-outlined', el => el.textContent.trim());
    const hasCommunity = await page.$('#app-nav #nav-community');
    
    if (label === 'Collection' && (icon === 'bookmark' || icon === 'collections_bookmark') && !hasCommunity) {
      console.log(`✅ Bottom nav successfully updated: Label="${label}", Icon="${icon}", Community removed`);
    } else {
      console.error(`❌ Nav tab content unexpected: Label=${label}, Icon=${icon}, hasCommunity=${!!hasCommunity}`);
      passedAll = false;
    }
  }

  // ─── 2. Test Screen 9C: Empty Collection Fallback State Canvas ───────────
  console.log('--- Step 2: Testing Screen 9C Empty Fallback State ---');
  // Click collection tab
  await page.click('#app-nav #nav-collection');
  await page.waitForTimeout(500);

  const isCollectionActive = await page.$eval('#collection-screen', el => el.classList.contains('active'));
  const isTabOrange = await page.$eval('#app-nav #nav-collection', el => {
    const style = window.getComputedStyle(el);
    const color = style.color;
    return el.classList.contains('nav-tab--active-orange') || el.classList.contains('nav-tab--collection-active') || color.includes('255, 85, 0') || color === '#ff5500';
  });

  console.log(`Screen 9 sliding active: ${isCollectionActive}`);
  console.log(`Collection Tab glowing orange: ${isTabOrange}`);

  const emptyTitle = await page.$eval('.empty-collection-title', el => el.textContent.trim()).catch(() => null);
  console.log(`Screen 9C Empty Title: "${emptyTitle}"`);

  if (emptyTitle === 'Your kitchen collection is empty!') {
    console.log('✅ Screen 9C Empty Fallback State Canvas correctly displayed with exact required string!');
  } else {
    console.error(`❌ Expected "Your kitchen collection is empty!", got "${emptyTitle}"`);
    passedAll = false;
  }

  // Take screenshot of Empty State
  const emptyScreenshotPath = path.join(__dirname, 'screenshot_collection_empty_state.png');
  await page.screenshot({ path: emptyScreenshotPath });
  console.log(`📸 Saved empty state screenshot: ${emptyScreenshotPath}`);

  // ─── 3. Test Saving Recipes on Feed & Dynamic Screen 9 Hydration ──────────
  console.log('--- Step 3: Testing Recipe Saving & Screen 9 Dynamic Library Hydration ---');
  // Close collection screen by clicking back button
  await page.click('#collection-back-btn');
  await page.waitForTimeout(400);

  // Bookmark 2 recipes from the feed
  const bookmarkButtons = await page.$$('.recipe-feed .recipe-card .wow-bookmark-btn');
  if (bookmarkButtons.length >= 2) {
    await bookmarkButtons[0].click();
    await page.waitForTimeout(300);
    await bookmarkButtons[1].click();
    await page.waitForTimeout(300);
  }

  const savedList = await page.evaluate(() => JSON.parse(localStorage.getItem('wow_saved_recipes') || '[]'));
  console.log(`Recipes saved in localStorage: ${JSON.stringify(savedList)}`);

  // Navigate back to collection
  await page.click('#app-nav #nav-collection');
  await page.waitForTimeout(500);

  const collectionCards = await page.$$('#collection-grid .search-grid-card');
  console.log(`Collection cards rendered: ${collectionCards.length}`);

  if (collectionCards.length === savedList.length && collectionCards.length > 0) {
    console.log(`✅ Dynamic Filter Payload Mapping: Correctly rendered ${collectionCards.length} saved recipe cards in Screen 9!`);
  } else {
    console.error(`❌ Expected ${savedList.length} cards, found ${collectionCards.length}`);
    passedAll = false;
  }

  // Verify cards have State B 44px bookmark button
  const savedButtonsCount = await page.$$eval('#collection-grid .wow-bookmark-btn.saved', btns => btns.length);
  console.log(`State B bookmark buttons in collection: ${savedButtonsCount}/${collectionCards.length}`);
  if (savedButtonsCount === collectionCards.length) {
    console.log('✅ All collection cards display State B crimson checkmark bookmark button!');
  } else {
    console.error('❌ Mismatch in State B bookmark buttons in collection grid');
    passedAll = false;
  }

  // Take screenshot of Active Collection Grid
  const activeGridScreenshotPath = path.join(__dirname, 'screenshot_collection_active_grid.png');
  await page.screenshot({ path: activeGridScreenshotPath });
  console.log(`📸 Saved active collection grid screenshot: ${activeGridScreenshotPath}`);

  // ─── 4. Test Unsaving in Collection Screen Live Removal ───────────────────
  console.log('--- Step 4: Testing Unsaving Item in Collection Screen ---');
  const firstCardBookmark = await page.$('#collection-grid .search-grid-card:first-child .wow-bookmark-btn');
  if (firstCardBookmark) {
    await firstCardBookmark.click();
    await page.waitForTimeout(400);

    const remainingCards = await page.$$('#collection-grid .search-grid-card');
    console.log(`Remaining collection cards after unsaving 1: ${remainingCards.length}`);
    if (remainingCards.length === 1) {
      console.log('✅ Real-time collection card removal upon unsaving succeeded!');
    } else {
      console.error(`❌ Expected 1 remaining card, got ${remainingCards.length}`);
      passedAll = false;
    }
  }

  // ─── 5. Test Standalone collection.html Page ──────────────────────────────
  console.log('--- Step 5: Testing Standalone collection.html Page ---');
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const standaloneCards = await page.$$('#collection-grid .search-grid-card');
  const standaloneTabActive = await page.$eval('#app-nav #nav-collection', el => el.classList.contains('nav-tab--active-orange') || el.classList.contains('nav-tab--active'));
  console.log(`Standalone collection.html loaded with ${standaloneCards.length} cards, active tab: ${standaloneTabActive}`);

  if (standaloneTabActive) {
    console.log('✅ Standalone collection.html correctly configures active Orange Collection tab!');
  } else {
    console.error('❌ Standalone collection.html active tab state missing');
    passedAll = false;
  }

  // ─── 6. Test search-results.html Bottom Nav ───────────────────────────────
  console.log('--- Step 6: Testing search-results.html Bottom Nav ---');
  await page.goto(searchResultsUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const searchNavCollection = await page.$('#app-nav #nav-collection');
  const searchNavCommunity = await page.$('#app-nav #nav-community');
  if (searchNavCollection && !searchNavCommunity) {
    console.log('✅ search-results.html successfully verified with Collection tab and no Community tab!');
  } else {
    console.error('❌ search-results.html nav check failed');
    passedAll = false;
  }

  await browser.close();

  if (passedAll) {
    console.log('\n🎉 ALL TESTS PASSED! Collection bottom navigation and Screen 9/9C dynamic library engine are 100% verified.');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED.');
    process.exit(1);
  }
})();
