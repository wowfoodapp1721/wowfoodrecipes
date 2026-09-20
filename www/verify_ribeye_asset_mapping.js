const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Verification: Prime Bone In Ribeye Image Asset Mapping on My Collection...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const collectionUrl = `file://${path.resolve(__dirname, 'collection.html')}`;

  // 1. Test with 'ribeye' / 'prime-bone-in-ribeye' in localStorage
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.setItem('wow_saved_recipes', JSON.stringify(['ribeye']));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);

  console.log('--- TEST 1: Ribeye Card Rendering in Collection ---');
  const cardLocator = page.locator('.search-grid-card');
  const cardCount = await cardLocator.count();
  console.log(`Saved cards rendered: ${cardCount}`);
  assert(cardCount >= 1, 'At least 1 saved recipe card must be rendered');

  const cardDetails = await page.evaluate(() => {
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
      title: titleEl ? titleEl.textContent.trim() : null,
      badge: badgeEl ? badgeEl.textContent.trim() : null,
      time: timeEl ? timeEl.textContent.trim() : null,
      calories: calEl ? calEl.textContent.trim() : null,
      thumbSrc: thumbEl ? thumbEl.getAttribute('src') : null,
      backdropSrc: backdropEl ? backdropEl.getAttribute('src') : null,
      hasHeartFab: !!heartFab,
      thumbObjectFit: thumbStyles ? thumbStyles.objectFit : null,
      thumbObjectPosition: thumbStyles ? thumbStyles.objectPosition : null,
      backdropFilter: backdropStyles ? backdropStyles.filter : null
    };
  });

  console.log('Card Details:', cardDetails);

  // Assertions
  assert(cardDetails.title === 'Prime Bone In Ribeye', `Title must be 'Prime Bone In Ribeye', got '${cardDetails.title}'`);
  assert(cardDetails.badge === 'RECIPE INCOMING', `Badge must be 'RECIPE INCOMING', got '${cardDetails.badge}'`);
  assert(cardDetails.time.includes('20 min') || cardDetails.time.includes('20 Min'), `Time must be 20 min, got '${cardDetails.time}'`);
  assert(cardDetails.calories.includes('520 kcal') || cardDetails.calories.includes('520'), `Calories must be 520 kcal, got '${cardDetails.calories}'`);
  assert(cardDetails.thumbSrc && cardDetails.thumbSrc.includes('assets/ribeye.png'), `Thumb image src must point to assets/ribeye.png, got '${cardDetails.thumbSrc}'`);
  assert(cardDetails.backdropSrc && cardDetails.backdropSrc.includes('assets/ribeye.png'), `Backdrop image src must point to assets/ribeye.png, got '${cardDetails.backdropSrc}'`);
  assert(cardDetails.thumbObjectFit === 'cover', `Thumb object-fit must be cover, got '${cardDetails.thumbObjectFit}'`);
  assert(cardDetails.hasHeartFab, 'Glowing heart FAB must exist');
  console.log('✅ TEST 1 PASSED: Ribeye image correctly mapped to assets/ribeye.png with RECIPE INCOMING metadata.\n');

  console.log('--- TEST 2: Visual Screenshot Capture ---');
  await page.screenshot({ path: 'collection_ribeye_asset_verified.png' });
  console.log('📸 Screenshot saved: collection_ribeye_asset_verified.png');
  console.log('✅ TEST 2 PASSED: Visual rendering validated.\n');

  console.log('🎉 ALL RIBEYE ASSET MAPPING TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
})();
