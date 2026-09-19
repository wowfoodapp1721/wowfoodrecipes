const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting Automated Test for Pad Thai (ID 5) & Ceviche (ID 6) Image Assets...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const dashboardUrl = 'file://' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  const searchPantryUrl = 'file://' + path.resolve(__dirname, 'search-pantry.html').replace(/\\/g, '/');
  const recipeDetailUrl = 'file://' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 1: Direct ID 5 ("Authentic Thai Pad Thai") Navigation & Image Test
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 1] Testing Pad Thai (ID 5) Image Routing from Dashboard...');
  await page.goto(dashboardUrl, { waitUntil: 'networkidle' });

  const cardPadThai = page.locator('#card-padthai');
  await cardPadThai.scrollIntoViewIfNeeded();
  assert(await cardPadThai.isVisible(), 'Card 5 (Authentic Thai Pad Thai) is visible on Dashboard');

  // Verify Dashboard card photo src
  const padThaiDashImg = await cardPadThai.locator('.card-photo').getAttribute('src');
  assert(padThaiDashImg.includes('assets/pad-thai.png'), `Dashboard card photo src is assets/pad-thai.png (got ${padThaiDashImg})`);

  // Click card to navigate to recipe-detail.html
  await cardPadThai.click();
  await page.waitForTimeout(600);

  const detailTitle5 = await page.locator('.recipe-main-title').textContent();
  assert(detailTitle5.includes('Pad Thai'), `Detail title updated to Pad Thai (got: "${detailTitle5.trim()}")`);

  const detailCover5 = page.locator('.media-cover-img');
  const coverSrc5 = await detailCover5.getAttribute('src');
  assert(coverSrc5.includes('assets/pad-thai.png'), `Detail hero cover image points to assets/pad-thai.png (got: "${coverSrc5}")`);

  // Check image loaded state in browser
  const isImageLoaded5 = await detailCover5.evaluate(img => img.complete && img.naturalWidth > 0);
  assert(isImageLoaded5, 'Pad Thai hero image rendered successfully (naturalWidth > 0)');

  // Check ingredients images on Screen 3A
  const ingImages5 = await page.locator('.ingredient-card img').all();
  assert(ingImages5.length >= 5, `Rendered ${ingImages5.length} ingredients for Pad Thai`);
  const firstIngSrc5 = await ingImages5[0].getAttribute('src');
  assert(firstIngSrc5.includes('assets/pad-thai.png'), `Ingredient thumbnail points to assets/pad-thai.png (got: "${firstIngSrc5}")`);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 2: Direct ID 6 ("Classic Peruvian Ceviche") Navigation & Image Test
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 2] Testing Classic Peruvian Ceviche (ID 6) Image Routing from Dashboard...');
  await page.goto(dashboardUrl, { waitUntil: 'networkidle' });

  const cardCeviche = page.locator('#card-ceviche');
  await cardCeviche.scrollIntoViewIfNeeded();
  assert(await cardCeviche.isVisible(), 'Card 6 (Classic Peruvian Ceviche) is visible on Dashboard');

  // Verify Dashboard card photo src
  const cevicheDashImg = await cardCeviche.locator('.card-photo').getAttribute('src');
  assert(cevicheDashImg.includes('assets/ceviche.png'), `Dashboard card photo src is assets/ceviche.png (got ${cevicheDashImg})`);

  // Click card to navigate to recipe-detail.html
  await cardCeviche.click();
  await page.waitForTimeout(600);

  const detailTitle6 = await page.locator('.recipe-main-title').textContent();
  assert(detailTitle6.includes('Ceviche'), `Detail title updated to Ceviche (got: "${detailTitle6.trim()}")`);

  const detailCover6 = page.locator('.media-cover-img');
  const coverSrc6 = await detailCover6.getAttribute('src');
  assert(coverSrc6.includes('assets/ceviche.png'), `Detail hero cover image points to assets/ceviche.png (got: "${coverSrc6}")`);

  const isImageLoaded6 = await detailCover6.evaluate(img => img.complete && img.naturalWidth > 0);
  assert(isImageLoaded6, 'Ceviche hero image rendered successfully (naturalWidth > 0)');

  // Check Screen 3A (Ingredients)
  const ingCards6 = await page.locator('.ingredient-card').all();
  assert(ingCards6.length === 7, `Rendered 7 ingredients for Ceviche (got ${ingCards6.length})`);
  const firstIngSrc6 = await ingCards6[0].locator('img').getAttribute('src');
  assert(firstIngSrc6.includes('assets/ceviche.png'), `Ingredient image points to assets/ceviche.png (got: "${firstIngSrc6}")`);

  // Check Screen 3B (Instructions)
  await page.locator('#tab-btn-1').click();
  await page.waitForTimeout(300);
  const stepCards6 = await page.locator('.instruction-step-card').all();
  assert(stepCards6.length === 4, `Rendered 4 instruction steps for Ceviche (got ${stepCards6.length})`);

  // Check Screen 3C (Health Score Matrix)
  await page.locator('#tab-btn-2').click();
  await page.waitForTimeout(300);
  const healthScoreVal6 = await page.locator('.score-large').textContent();
  assert(healthScoreVal6.trim() === '9.6', `Health Score for Ceviche is 9.6 (got: "${healthScoreVal6.trim()}")`);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 3: Direct Numeric ID invocation via openRecipeDetail(5) and openRecipeDetail(6)
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 3] Testing openRecipeDetail(5) and openRecipeDetail(6) numeric ID hooks...');
  await page.goto(recipeDetailUrl, { waitUntil: 'networkidle' });

  // Test numeric ID 5
  await page.evaluate(() => window.openRecipeDetail(5));
  await page.waitForTimeout(300);
  const hero5Numeric = await page.locator('.media-cover-img').getAttribute('src');
  assert(hero5Numeric.includes('assets/pad-thai.png'), `openRecipeDetail(5) hydrated hero to assets/pad-thai.png (got: "${hero5Numeric}")`);

  // Test numeric ID 6
  await page.evaluate(() => window.openRecipeDetail(6));
  await page.waitForTimeout(300);
  const hero6Numeric = await page.locator('.media-cover-img').getAttribute('src');
  assert(hero6Numeric.includes('assets/ceviche.png'), `openRecipeDetail(6) hydrated hero to assets/ceviche.png (got: "${hero6Numeric}")`);

  // ───────────────────────────────────────────────────────────────────────────
  // TEST 4: Search Pantry Match Card 4 (Authentic Thai Pad Thai) Image & Navigation
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 4] Testing Search Pantry Match Card 4 (Pad Thai)...');
  await page.goto(searchPantryUrl, { waitUntil: 'networkidle' });

  const matchPadThai = page.locator('.match-card:has-text("Pad Thai")');
  assert(await matchPadThai.isVisible(), 'Pad Thai match card is visible on search pantry');

  const matchPadThaiImg = await matchPadThai.locator('.match-img').getAttribute('src');
  assert(matchPadThaiImg.includes('assets/pad-thai.png') && !matchPadThaiImg.includes('.png.png'), `Search pantry image is assets/pad-thai.png without double extension (got: "${matchPadThaiImg}")`);

  await matchPadThai.click();
  await page.waitForTimeout(600);

  const navigatedTitle = await page.locator('.recipe-main-title').textContent();
  assert(navigatedTitle.includes('Pad Thai'), `Navigated from Search Pantry to Pad Thai (got: "${navigatedTitle.trim()}")`);
  const navigatedHero = await page.locator('.media-cover-img').getAttribute('src');
  assert(navigatedHero.includes('assets/pad-thai.png'), `Hero image is assets/pad-thai.png (got: "${navigatedHero}")`);

  // ───────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ───────────────────────────────────────────────────────────────────────────
  console.log(`\n========================================`);
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  await browser.close();
  if (failed > 0) process.exit(1);
})();
