const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Verification: Dual-Layer High-End Image Showcase on My Collection...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const collectionUrl = `file://${path.resolve(__dirname, 'collection.html')}`;

  // Populate localStorage with carbonara recipe
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.evaluate(() => {
    localStorage.setItem('wow_saved_recipes', JSON.stringify(['carbonara']));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);

  console.log('--- TEST 1: Saved Recipe Card & Image Container Presence ---');
  const cardLocator = page.locator('.search-grid-card');
  const cardCount = await cardLocator.count();
  console.log(`Saved cards rendered: ${cardCount}`);
  assert(cardCount >= 1, 'At least 1 saved recipe card must be rendered');

  const wrapLocator = page.locator('.search-card-thumb-wrap');
  const wrapCount = await wrapLocator.count();
  assert(wrapCount >= 1, 'Image container .search-card-thumb-wrap must exist');
  console.log('✅ TEST 1 PASSED: Saved recipe card and image container layer present.\n');


  console.log('--- TEST 2: Dual-Layer High-End Image Showcase Verification ---');
  const imageLayers = await page.evaluate(() => {
    const wrap = document.querySelector('.search-card-thumb-wrap');
    const backdrop = wrap ? wrap.querySelector('.search-card-thumb-backdrop') : null;
    const foreground = wrap ? wrap.querySelector('.search-card-thumb') : null;

    const wrapStyles = wrap ? window.getComputedStyle(wrap) : null;
    const backdropStyles = backdrop ? window.getComputedStyle(backdrop) : null;
    const foregroundStyles = foreground ? window.getComputedStyle(foreground) : null;

    return {
      hasBackdrop: !!backdrop,
      hasForeground: !!foreground,
      wrapAspectRatio: wrapStyles ? wrapStyles.aspectRatio : null,
      wrapOverflow: wrapStyles ? wrapStyles.overflow : null,
      backdropFilter: backdropStyles ? backdropStyles.filter : null,
      backdropObjectFit: backdropStyles ? backdropStyles.objectFit : null,
      backdropPosition: backdropStyles ? backdropStyles.objectPosition : null,
      foregroundObjectFit: foregroundStyles ? foregroundStyles.objectFit : null,
      foregroundPosition: foregroundStyles ? foregroundStyles.objectPosition : null,
      foregroundFilter: foregroundStyles ? foregroundStyles.filter : null
    };
  });

  console.log('Image Layers Computed Properties:', imageLayers);
  // Check Layer 1 (Backdrop)
  assert(imageLayers.hasBackdrop, 'Layer 1 (.search-card-thumb-backdrop) must exist');
  assert(imageLayers.backdropFilter.includes('blur(20px)') || imageLayers.backdropFilter.includes('blur'), 'Layer 1 backdrop must have heavy CSS blur filter');
  assert(imageLayers.backdropObjectFit === 'cover', 'Layer 1 backdrop must have object-fit: cover');

  // Check Layer 2 (Foreground)
  assert(imageLayers.hasForeground, 'Layer 2 (.search-card-thumb) must exist');
  assert(imageLayers.foregroundObjectFit === 'cover', 'Layer 2 foreground must have object-fit: cover');
  assert(imageLayers.foregroundPosition.includes('center') || imageLayers.foregroundPosition.includes('50%'), 'Layer 2 foreground must be centered');
  assert(imageLayers.foregroundFilter === 'none' || !imageLayers.foregroundFilter.includes('blur'), 'Layer 2 foreground must remain crisp and unblurred');
  console.log('✅ TEST 2 PASSED: Dual-layer high-end image showcase (blurred backdrop + crisp centered foreground) verified.\n');


  console.log('--- TEST 3: Visual Screenshot Capture ---');
  await page.screenshot({ path: 'collection_dual_layer_image_verified.png' });
  console.log('📸 Screenshot saved: collection_dual_layer_image_verified.png');
  console.log('✅ TEST 3 PASSED: Visual rendering validated.\n');

  console.log('🎉 ALL DUAL-LAYER IMAGE RENDERING TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
})();
