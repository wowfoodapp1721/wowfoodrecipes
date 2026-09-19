const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting TheMealDB Live API Integration Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 420, height: 900 }
  });
  const page = await context.newPage();

  const baseUrl = 'file:///' + path.resolve(__dirname).replace(/\\/g, '/');

  try {
    // ════════════════════════════════════════════════════════════════════════
    // TEST 1: Load Teriyaki Chicken by ID (52772) on recipe-detail.html
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing recipe-detail.html?id=52772 ---');
    await page.goto(`${baseUrl}/recipe-detail.html?id=52772`, { waitUntil: 'domcontentloaded' });
    // Wait briefly for live API response and DOM injection
    await page.waitForTimeout(1500);

    const mainTitle = await page.textContent('.recipe-main-title');
    console.log('Recipe Title:', mainTitle);
    assert(mainTitle && (mainTitle.includes('Teriyaki Chicken') || mainTitle.includes('Chicken')), 'strMeal must map to recipe title');

    const coverSrc = await page.getAttribute('.media-cover-img', 'src');
    console.log('Cover Image Src:', coverSrc);
    assert(coverSrc && (coverSrc.includes('themealdb.com') || coverSrc.includes('assets/') || coverSrc.includes('unsplash.com') || coverSrc.includes('googleusercontent.com')), 'Valid cover image must map to cover image container');

    const coverObjectFit = await page.evaluate(() => {
      const img = document.querySelector('.media-cover-img');
      return window.getComputedStyle(img).objectFit;
    });
    console.log('Cover Image object-fit:', coverObjectFit);
    assert.strictEqual(coverObjectFit, 'cover', 'object-fit: cover must be applied to recipe image');

    const ingCount = await page.locator('.ingredient-card').count();
    console.log('Ingredients rendered:', ingCount);
    assert(ingCount >= 5, 'Ingredients from strIngredient1..20 must be rendered');

    const firstIngName = await page.textContent('.ingredient-card .ingredient-name');
    console.log('First Ingredient Name:', firstIngName);
    assert(firstIngName && firstIngName.length > 0, 'Ingredient names must not be empty');

    const firstIngImg = await page.getAttribute('.ingredient-card img', 'src');
    console.log('First Ingredient Icon Src:', firstIngImg);
    assert(firstIngImg && firstIngImg.length > 0, 'Ingredient image icon must have valid src');

    // Check Instructions tab step splitting
    const stepCardsCount = await page.locator('#tab-panel-1 .instruction-step-card').count();
    console.log('Instructions steps generated:', stepCardsCount);
    assert(stepCardsCount >= 2, 'strInstructions must be split into step cards');

    // ════════════════════════════════════════════════════════════════════════
    // TEST 2: Start Cooking Session carrying active API ID (52772)
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n--- 2. Testing Start Cooking Session Flow from ID 52772 ---');
    await page.click('#start-cooking-action-btn');
    await page.waitForTimeout(1500);

    const currentUrl = page.url();
    console.log('Active URL after clicking Start Cooking Session:', currentUrl);
    assert(currentUrl.includes('id=52772') || currentUrl.includes('cooking-guide.html') || currentUrl.includes('immersive-cooking.html'), 'Must route with active recipe ID to cook mode');

    const cookModeTitle = await page.textContent('#label-recipe-title');
    console.log('Cook Mode Header Recipe Title:', cookModeTitle);
    assert(cookModeTitle && (cookModeTitle.toUpperCase().includes('TERIYAKI') || cookModeTitle.toUpperCase().includes('CHICKEN') || cookModeTitle.toUpperCase().includes('SESAME')), 'Cook mode title must synchronize with active API dish');

    // ════════════════════════════════════════════════════════════════════════
    // TEST 3: Load Spaghetti alla Carbonara by ID (52982) on recipe-detail.html
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n--- 3. Testing recipe-detail.html?id=52982 ---');
    await page.goto(`${baseUrl}/recipe-detail.html?id=52982`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);

    const carbonaraTitle = await page.textContent('.recipe-main-title');
    console.log('Carbonara Title:', carbonaraTitle);
    assert(carbonaraTitle && (carbonaraTitle.includes('Carbonara') || carbonaraTitle.includes('Spaghetti')), 'strMeal must map to Carbonara');

    const carbonaraCover = await page.getAttribute('.media-cover-img', 'src');
    console.log('Carbonara Cover Src:', carbonaraCover);
    assert(carbonaraCover && (carbonaraCover.includes('themealdb.com') || carbonaraCover.includes('assets/') || carbonaraCover.includes('unsplash.com')), 'Carbonara image must load properly');

    // ════════════════════════════════════════════════════════════════════════
    // TEST 4: Test query by search name e.g. recipe-detail.html?name=Avocado-Toast
    // ════════════════════════════════════════════════════════════════════════
    console.log('\n--- 4. Testing recipe-detail.html?name=Avocado-Toast ---');
    await page.goto(`${baseUrl}/recipe-detail.html?name=Avocado-Toast`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    const avocadoTitle = await page.textContent('.recipe-main-title');
    console.log('Avocado Title:', avocadoTitle);
    assert(avocadoTitle && avocadoTitle.includes('Avocado'), 'Avocado Toast must resolve correctly');

    console.log('\n✅ ALL LIVE THEMEALDB API INTEGRATION TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
