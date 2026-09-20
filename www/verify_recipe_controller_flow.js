const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Verification of Dynamic Recipe Router (recipe-controller.js)...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 }
  });
  const page = await context.newPage();

  const baseUrl = 'file:///' + path.resolve(__dirname).replace(/\\/g, '/');

  try {
    // ═════════════════════════════════════════════════════════════════════════
    // TEST 1: Avocado Toast Details & Dynamic Injection (recipe-detail.html?id=avocado-toast)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 1: Avocado Toast (recipe-detail.html?id=avocado-toast) ---');
    await page.goto(`${baseUrl}/recipe-detail.html?id=avocado-toast`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const avoTitle = await page.$eval('.recipe-main-title', el => el.textContent.trim());
    console.log(`📌 Recipe Main Title: "${avoTitle}"`);
    assert(avoTitle.toLowerCase().includes('avocado toast'), 'Title must match Avocado Toast');

    const avoCover = await page.$eval('.media-cover-img', el => el.src);
    console.log(`📌 Cover Image src: "${avoCover}"`);
    assert(avoCover.includes('unsplash') || avoCover.includes('avocado'), 'Cover image must update dynamically');

    const avoIngredientCount = await page.$$eval('.ingredient-card', cards => cards.length);
    console.log(`📌 Ingredient Card Count: ${avoIngredientCount}`);
    assert(avoIngredientCount >= 5, 'Must render avocado toast ingredient cards');

    const avoFirstIng = await page.$eval('.ingredient-card .ingredient-name', el => el.textContent.trim());
    console.log(`📌 First Ingredient: "${avoFirstIng}"`);
    assert(avoFirstIng.toLowerCase().includes('avocado'), 'First ingredient must be Avocados');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 2: Start Cooking Session Action Button Handoff (Avocado Toast -> Step Views)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 2: Start Cooking Session Handoff (Avocado Toast) ---');
    await page.click('#start-cooking-action-btn');
    await page.waitForTimeout(600);

    const currentCookUrl = page.url();
    console.log(`📌 Navigated Cook Mode URL: ${currentCookUrl}`);
    assert(currentCookUrl.includes('id=avocado-toast') || currentCookUrl.includes('recipe=avocado-toast'), 'URL must preserve active recipe id');

    const avoCookTitle = await page.$eval('#label-recipe-title', el => el.textContent.trim());
    console.log(`📌 Cook Mode Top Title: "${avoCookTitle}"`);
    assert(avoCookTitle.toLowerCase().includes('avocado toast'), 'Cook mode title must display Avocado Toast');

    const avoStep1Heading = await page.$eval('#step-headline-text', el => el.textContent.trim());
    console.log(`📌 Step 1 Headline: "${avoStep1Heading}"`);
    assert(avoStep1Heading.toLowerCase().includes('toast') || avoStep1Heading.toLowerCase().includes('avocado'), 'Step 1 headline must belong to Avocado Toast');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 3: Spaghetti Carbonara Details (recipe-detail.html?id=spaghetti-carbonara)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 3: Spaghetti Carbonara (recipe-detail.html?id=spaghetti-carbonara) ---');
    await page.goto(`${baseUrl}/recipe-detail.html?id=spaghetti-carbonara`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const carbTitle = await page.$eval('.recipe-main-title', el => el.textContent.trim());
    console.log(`📌 Recipe Main Title: "${carbTitle}"`);
    assert(carbTitle.toLowerCase().includes('carbonara'), 'Title must match Spaghetti Carbonara');

    const carbFirstIng = await page.$eval('.ingredient-card .ingredient-name', el => el.textContent.trim());
    const carbFirstQty = await page.$eval('.ingredient-card .ingredient-amount', el => el.textContent.trim());
    console.log(`📌 First Ingredient: "${carbFirstIng}" (${carbFirstQty})`);
    assert(carbFirstIng.toLowerCase().includes('spaghetti'), 'First ingredient must be Bronze-Cut Spaghetti');
    assert(carbFirstQty.toLowerCase().includes('400g'), 'Core base metric 400g must be rendered');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 4: Start Cooking Session Handoff (Carbonara -> Step Views)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 4: Start Cooking Session Handoff (Spaghetti Carbonara) ---');
    await page.click('#start-cooking-action-btn');
    await page.waitForTimeout(600);

    const carbCookTitle = await page.$eval('#label-recipe-title', el => el.textContent.trim());
    console.log(`📌 Cook Mode Top Title: "${carbCookTitle}"`);
    assert(carbCookTitle.toLowerCase().includes('carbonara'), 'Cook mode title must display Carbonara');

    const carbStep1Heading = await page.$eval('#step-headline-text', el => el.textContent.trim());
    console.log(`📌 Step 1 Headline: "${carbStep1Heading}"`);
    assert(carbStep1Heading.toLowerCase().includes('mise en place') || carbStep1Heading.toLowerCase().includes('prep'), 'Step 1 headline must belong to Carbonara');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 5: AI Meal Planner Card Re-routing (meal-planner.html)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 5: AI Meal Planner Card Triggers (meal-planner.html) ---');
    await page.goto(`${baseUrl}/meal-planner.html`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const slot1Link = await page.$eval('#slot-breakfast .btn-recipe-details', el => el.href);
    console.log(`📌 Breakfast Slot Recipe Link: ${slot1Link}`);
    assert(slot1Link.includes('id=avocado-toast'), 'Breakfast slot link must pass ?id=avocado-toast');

    const slot2Link = await page.$eval('#slot-lunch .btn-recipe-details', el => el.href);
    console.log(`📌 Lunch Slot Recipe Link: ${slot2Link}`);
    assert(slot2Link.includes('id=sesame-chicken'), 'Lunch slot link must pass ?id=sesame-chicken');

    const slot3Link = await page.$eval('#slot-dinner .btn-recipe-details', el => el.href);
    console.log(`📌 Dinner Slot Recipe Link: ${slot3Link}`);
    assert(slot3Link.includes('id=dal-makhani'), 'Dinner slot link must pass ?id=dal-makhani');

    // Click on dinner slot details link to verify direct routing
    await page.click('#slot-dinner .btn-recipe-details');
    await page.waitForTimeout(600);

    const dinnerDetailTitle = await page.$eval('.recipe-main-title', el => el.textContent.trim());
    console.log(`📌 Rendered Detail Title from Planner Click: "${dinnerDetailTitle}"`);
    assert(dinnerDetailTitle.toLowerCase().includes('dal makhani'), 'Clicking dinner slot must open Dal Makhani details');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 6: Immersive-cooking.html standalone validation
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 6: immersive-cooking.html?id=ribeye ---');
    await page.goto(`${baseUrl}/immersive-cooking.html?id=ribeye`, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    const ribeyeTitle = await page.$eval('#label-recipe-title', el => el.textContent.trim());
    console.log(`📌 Immersive Cook Mode Title: "${ribeyeTitle}"`);
    assert(ribeyeTitle.toLowerCase().includes('ribeye'), 'Immersive cooking must display Prime Ribeye');

    const ribeyeStep1 = await page.$eval('#step-headline-text', el => el.textContent.trim());
    console.log(`📌 Ribeye Step 1: "${ribeyeStep1}"`);
    assert(ribeyeStep1.toLowerCase().includes('season') || ribeyeStep1.toLowerCase().includes('temper'), 'Step 1 must be Ribeye seasoning');

    console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ✅');
  } catch (error) {
    console.error('❌ Verification failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
