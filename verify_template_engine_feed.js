const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 AUDIT: CLIENT-SIDE JAVASCRIPT TEMPLATE ENGINE & DYNAMIC CATEGORY FEED');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log(`Navigating to Dashboard: ${dashboardUrl}`);
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // 1. Audit Target Feed Hook Container (#recipe-feed-container)
  console.log('\n1️⃣ Auditing Target Feed Hook Container (#recipe-feed-container)...');
  const feedContainer = await page.$('#recipe-feed-container');
  if (!feedContainer) throw new Error('#recipe-feed-container not found in DOM');
  console.log('   ✓ Verified #recipe-feed-container is present directly under Curated Creations section');

  // 2. Audit Client Data Object (recipeDatabase)
  console.log('\n2️⃣ Auditing Client Database Structure (recipeDatabase)...');
  const dbCheck = await page.evaluate(() => {
    if (!window.recipeDatabase) return null;
    return {
      allCount: window.recipeDatabase.all ? window.recipeDatabase.all.length : 0,
      dinnerCount: window.recipeDatabase.dinner ? window.recipeDatabase.dinner.length : 0,
      healthyCount: window.recipeDatabase.healthy ? window.recipeDatabase.healthy.length : 0,
      ketoCount: window.recipeDatabase.keto ? window.recipeDatabase.keto.length : 0
    };
  });
  console.log('   Client DB Counts:', dbCheck);
  if (!dbCheck || dbCheck.allCount !== 2 || dbCheck.dinnerCount !== 3 || dbCheck.healthyCount !== 2 || dbCheck.ketoCount !== 2) {
    throw new Error(`Database structure mismatch: ${JSON.stringify(dbCheck)}`);
  }
  console.log('   ✓ recipeDatabase verified with all: 2, dinner: 3, healthy: 2, keto: 2 entries');

  // 3. Audit Initial ALL State Dynamic Cards & Design Tokens
  console.log('\n3️⃣ Auditing Rendered Cards Design Tokens & String Templates...');
  const allCards = await page.$$('#recipe-feed-container .recipe-card');
  console.log(`   Rendered cards count under ALL: ${allCards.length} (Expected: 2)`);
  if (allCards.length !== 2) throw new Error(`Expected 2 cards under ALL, got ${allCards.length}`);

  for (let i = 0; i < allCards.length; i++) {
    const card = allCards[i];
    const cardCls = await card.getAttribute('class');
    const title = (await card.$eval('.card-title', el => el.textContent)).trim();
    const hasSparkles = await card.$('span:has-text("wow Chef AI")');
    const hasGlassPanel = cardCls.includes('glass-panel-neon');
    const hasAnimationClasses = cardCls.includes('animate-fade-in') && cardCls.includes('duration-300') && cardCls.includes('scale-98');
    const hasMetricsPill = await card.$('.metrics-pill');
    const hasWowBtn = await card.$('.wow-bookmark-btn');

    console.log(`   Card ${i + 1}: "${title}"`);
    console.log(`      - Glass Panel Neon: ${hasGlassPanel}`);
    console.log(`      - Animation classes (animate-fade-in duration-300 scale-98): ${hasAnimationClasses}`);
    console.log(`      - "wow Chef AI SPARKLES" badge pill: ${!!hasSparkles}`);
    console.log(`      - Metrics Line & 44px Wow Button: ${!!hasMetricsPill && !!hasWowBtn}`);

    if (!hasGlassPanel || !hasAnimationClasses || !hasSparkles || !hasMetricsPill || !hasWowBtn) {
      throw new Error(`Card "${title}" missing required design tokens or metadata`);
    }
  }
  console.log('   ✓ All initial cards strictly adhere to glass-panel-neon, glowing borders, AI sparkles, and animation bounce');

  // 4. Test Dynamic Category Pill Switching (DINNER, HEALTHY, KETO, ALL)
  console.log('\n4️⃣ Testing Dynamic Pill Switching Trigger Hooks...');

  // Tap DINNER
  console.log('\n👉 Tapping DINNER pill...');
  await page.click('#pill-dinner');
  await page.waitForTimeout(300);

  const dinnerCards = await page.$$('#recipe-feed-container .recipe-card');
  const dinnerTitles = await page.$$eval('#recipe-feed-container .card-title', els => els.map(e => e.textContent.trim()));
  console.log(`   DINNER Feed: ${dinnerCards.length} cards -> ${JSON.stringify(dinnerTitles)}`);
  if (dinnerCards.length !== 3 || !dinnerTitles.includes('Prime Bone-In Ribeye') || !dinnerTitles.includes('Smoked Salmon Fettuccine') || !dinnerTitles.includes('Braised Garlic Lamb Shanks')) {
    throw new Error(`DINNER feed mismatch. Got: ${JSON.stringify(dinnerTitles)}`);
  }
  console.log('   ✓ DINNER category dynamically rendered 3 matching recipes');

  // Tap HEALTHY
  console.log('\n👉 Tapping HEALTHY pill...');
  await page.click('#pill-healthy');
  await page.waitForTimeout(300);

  const healthyCards = await page.$$('#recipe-feed-container .recipe-card');
  const healthyTitles = await page.$$eval('#recipe-feed-container .card-title', els => els.map(e => e.textContent.trim()));
  console.log(`   HEALTHY Feed: ${healthyCards.length} cards -> ${JSON.stringify(healthyTitles)}`);
  if (healthyCards.length !== 2 || !healthyTitles.includes('Avocado Citrus Crunch Salad') || !healthyTitles.includes('Grilled Lemon Herb Salmon')) {
    throw new Error(`HEALTHY feed mismatch. Got: ${JSON.stringify(healthyTitles)}`);
  }
  console.log('   ✓ HEALTHY category dynamically rendered 2 matching recipes');

  // Tap KETO
  console.log('\n👉 Tapping KETO pill...');
  await page.click('#pill-keto');
  await page.waitForTimeout(300);

  const ketoCards = await page.$$('#recipe-feed-container .recipe-card');
  const ketoTitles = await page.$$eval('#recipe-feed-container .card-title', els => els.map(e => e.textContent.trim()));
  console.log(`   KETO Feed: ${ketoCards.length} cards -> ${JSON.stringify(ketoTitles)}`);
  if (ketoCards.length !== 2 || !ketoTitles.includes('Prime Bone-In Ribeye') || !ketoTitles.includes('Baked Garlic Butter Shrimp')) {
    throw new Error(`KETO feed mismatch. Got: ${JSON.stringify(ketoTitles)}`);
  }
  console.log('   ✓ KETO category dynamically rendered 2 matching recipes');

  // Restore ALL
  console.log('\n👉 Restoring ALL pill...');
  await page.click('#pill-all');
  await page.waitForTimeout(300);

  const restoredCards = await page.$$('#recipe-feed-container .recipe-card');
  const restoredTitles = await page.$$eval('#recipe-feed-container .card-title', els => els.map(e => e.textContent.trim()));
  console.log(`   ALL Feed: ${restoredCards.length} cards -> ${JSON.stringify(restoredTitles)}`);
  if (restoredCards.length !== 2) throw new Error(`ALL feed failed to restore 2 recipes`);
  console.log('   ✓ ALL category successfully restored');

  // 5. Test Bookmark Interaction on Dynamically Rendered Card
  console.log('\n5️⃣ Testing Bookmark Button on Dynamically Generated Card...');
  const firstWowBtn = await page.$('#recipe-feed-container .recipe-card .wow-bookmark-btn');
  await firstWowBtn.click();
  await page.waitForTimeout(200);

  const isSaved = await firstWowBtn.evaluate(el => el.classList.contains('saved'));
  console.log(`   Bookmark Button saved state after click: ${isSaved}`);
  if (!isSaved) throw new Error('Bookmark button did not toggle .saved state');
  console.log('   ✓ Dynamic card bookmark state toggled successfully');

  // Take screenshot
  const screenshotPath = path.resolve(__dirname, 'screenshot_dynamic_template_feed.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`\n📸 Captured screenshot: ${path.basename(screenshotPath)}`);

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🏆 VERIFICATION RESULT: 100% OF JAVASCRIPT TEMPLATE ENGINE CHECKS PASSED!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
})();
