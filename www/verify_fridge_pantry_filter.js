const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Verification: In My Fridge Smart Pantry Cross-Reference Filter...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const dashboardUrl = 'file://' + path.join(__dirname, 'dashboard.html').replace(/\\/g, '/');
  const collectionUrl = 'file://' + path.join(__dirname, 'collection.html').replace(/\\/g, '/');

  let passedAll = true;

  // ─── 1. Test window.scannedIngredients & filterByPantryMatches Unit Logic ─
  console.log('\n--- Step 1: Testing Data Layer & filterByPantryMatches Logic ---');
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  const dataLayerCheck = await page.evaluate(() => {
    const hasScanned = Array.isArray(window.scannedIngredients) && window.scannedIngredients.length > 0;
    const hasFn = typeof window.filterByPantryMatches === 'function';
    
    // Test match logic with mock recipe
    const mockChickenRecipe = {
      title: 'Garlic Butter Chicken',
      ingredients: [{ name: 'Chicken Breast' }, { name: 'Garlic Cloves' }, { name: 'Butter' }]
    };
    const mockTofuRecipe = {
      title: 'Steamed Tofu',
      ingredients: [{ name: 'Silken Tofu' }, { name: 'Soy Sauce' }, { name: 'Sesame Oil' }]
    };
    
    const matches = window.filterByPantryMatches([mockChickenRecipe, mockTofuRecipe]);
    const matchedCorrectly = matches.length === 1 && matches[0].title === 'Garlic Butter Chicken';

    return { hasScanned, hasFn, matchedCorrectly, scannedList: window.scannedIngredients };
  });

  console.log('Data layer check:', dataLayerCheck);
  if (dataLayerCheck.hasScanned && dataLayerCheck.hasFn && dataLayerCheck.matchedCorrectly) {
    console.log('✅ window.scannedIngredients and filterByPantryMatches data cross-reference logic verified!');
  } else {
    console.error('❌ Data layer check failed:', dataLayerCheck);
    passedAll = false;
  }

  // ─── 2. Test In My Fridge Active Matching in Dashboard Screen 9 ───────────
  console.log('\n--- Step 2: Testing Active Pantry Matches in Screen 9 ---');
  await page.evaluate(() => {
    // Save a mix of matching (sesame-chicken, ribeye) and non-matching recipes
    localStorage.setItem('wow_saved_recipes', JSON.stringify(['sesame-chicken', 'ribeye', 'pad-thai']));
    window.scannedIngredients = ["garlic", "tomato", "onion", "chicken", "beef"];
  });

  // Open Collection Screen
  await page.click('#app-nav #nav-collection');
  await page.waitForTimeout(500);

  // Click "In My Fridge" pill
  const fridgePill = await page.$('#collection-filter-scroll .collection-pill:has-text("In My Fridge")');
  if (fridgePill) {
    await fridgePill.click();
    await page.waitForTimeout(400);

    const isFridgePillActive = await fridgePill.evaluate(el => el.classList.contains('active'));
    const renderedPantryCards = await page.$$eval('#collection-grid .search-grid-card', cards => 
      cards.map(c => c.querySelector('.search-card-title')?.textContent.trim())
    );

    console.log(`"In My Fridge" pill active: ${isFridgePillActive}`);
    console.log(`Rendered pantry-matched recipes (${renderedPantryCards.length}):`, renderedPantryCards);

    // Honey Sesame Chicken (chicken/garlic) and Ribeye Steak (beef/garlic) should be matched
    const hasChicken = renderedPantryCards.some(t => /chicken/i.test(t));
    const hasRibeye = renderedPantryCards.some(t => /ribeye|steak/i.test(t));

    if (isFridgePillActive && hasChicken && hasRibeye) {
      console.log('✅ In My Fridge filter accurately displayed matching available recipes!');
    } else {
      console.error('❌ In My Fridge matching failed. Found cards:', renderedPantryCards);
      passedAll = false;
    }

    // Save screenshot of matching fridge recipes
    const matchScreenshotPath = path.join(__dirname, 'screenshot_fridge_pantry_matches.png');
    await page.screenshot({ path: matchScreenshotPath });
    console.log(`📸 Saved pantry match screenshot: ${matchScreenshotPath}`);
  } else {
    console.error('❌ "In My Fridge" pill not found in Dashboard Screen 9');
    passedAll = false;
  }

  // ─── 3. Test Empty Fallback Condition Canvas Layer ────────────────────────
  console.log('\n--- Step 3: Testing Empty Fallback Condition Canvas Layer ---');
  // Change scannedIngredients to something impossible to match with saved recipes
  await page.evaluate(() => {
    window.scannedIngredients = ["dragonfruit_exotic_xyz", "truffle_oil_ultra_rare"];
    // Trigger re-filter
    if (typeof window.renderSavedCollection === 'function') {
      window.renderSavedCollection(document.getElementById('collection-grid'), null, 'fridge');
    }
  });
  await page.waitForTimeout(400);

  const fallbackCanvas = await page.$('#pantry-empty-fallback');
  const fallbackTitle = await page.$eval('#pantry-empty-fallback .empty-collection-title', el => el.textContent.trim()).catch(() => null);
  console.log(`Pantry empty fallback title: "${fallbackTitle}"`);

  const expectedFallbackString = "No matches found for your current fridge items! Try updating your AI Pantry Scanner 🌿";
  if (fallbackCanvas && fallbackTitle === expectedFallbackString) {
    console.log('✅ Empty Fallback Condition Canvas Layer rendered with exact required message!');
  } else {
    console.error(`❌ Fallback check failed. Expected: "${expectedFallbackString}", got: "${fallbackTitle}"`);
    passedAll = false;
  }

  // Save screenshot of empty fridge fallback state
  const emptyScreenshotPath = path.join(__dirname, 'screenshot_fridge_empty_fallback.png');
  await page.screenshot({ path: emptyScreenshotPath });
  console.log(`📸 Saved empty fallback screenshot: ${emptyScreenshotPath}`);

  // ─── 4. Test Standalone collection.html In My Fridge Filter ───────────────
  console.log('\n--- Step 4: Testing Standalone collection.html In My Fridge Filter ---');
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  await page.evaluate(() => {
    window.scannedIngredients = ["garlic", "tomato", "onion", "chicken", "beef"];
  });

  const standaloneFridgePill = await page.$('.filter-pills-row .filter-pill:has-text("In My Fridge")');
  if (standaloneFridgePill) {
    await standaloneFridgePill.click();
    await page.waitForTimeout(400);

    const standaloneCardsCount = await page.$$eval('#collection-grid .search-grid-card', cards => cards.length);
    console.log(`Standalone collection.html pantry matches: ${standaloneCardsCount}`);
    if (standaloneCardsCount >= 2) {
      console.log('✅ Standalone collection.html In My Fridge filter verified!');
    } else {
      console.error('❌ Standalone collection.html In My Fridge filter failed');
      passedAll = false;
    }
  }

  await browser.close();

  if (passedAll) {
    console.log('\n🎉 ALL IN MY FRIDGE PANTRY FILTER TESTS PASSED! 100% verified.');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED.');
    process.exit(1);
  }
})();
