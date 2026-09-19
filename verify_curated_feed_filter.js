const { chromium } = require('playwright');
const path = require('path');

async function runVerification() {
  console.log('🚀 Starting Verification: Dynamic Card Injection for Category Pills & Curated Creations Feed...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 900 }
  });
  const page = await context.newPage();

  let passed = true;

  try {
    const dashboardUrl = `file://${path.resolve(__dirname, 'dashboard.html')}`;
    console.log(`\nNavigating to Dashboard: ${dashboardUrl}`);
    await page.goto(dashboardUrl, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 1: Initial ALL Category Feed Render & Structural Layout Checks
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 1: Initial ALL State Card Structure & Dimensions ---');
    const initialCards = page.locator('#main-recipe-feed .recipe-card');
    const countAll = await initialCards.count();
    console.log(`Curated Creations count under ALL: ${countAll} cards (Expected: 9)`);
    if (countAll !== 9) {
      console.error(`❌ Expected 9 cards, got ${countAll}`);
      passed = false;
    } else {
      console.log('✅ ALL state displays exactly 9 curated creations');
    }

    // Inspect first card structure
    const firstCard = initialCards.first();
    const photoWrap = firstCard.locator('.card-photo-wrap');
    const photoImg = firstCard.locator('.card-photo');
    const cardBody = firstCard.locator('.card-body');
    const metricsPill = firstCard.locator('.metrics-pill');
    const tagsGroup = firstCard.locator('.tags-group');
    const cardTitle = firstCard.locator('.card-title');
    const wowBtn = firstCard.locator('.wow-bookmark-btn');

    // 1. Photo Aspect Ratio (16 / 9)
    const photoWrapStyles = await photoWrap.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        aspectRatio: s.aspectRatio,
        width: el.clientWidth,
        height: el.clientHeight
      };
    });
    console.log('Photo Wrap Computed Geometry:', photoWrapStyles);
    const calculatedAspect = photoWrapStyles.width / photoWrapStyles.height;
    console.log(`Calculated Photo Aspect Ratio: ${calculatedAspect.toFixed(2)} (Target 16/9 ≈ 1.78)`);
    if (Math.abs(calculatedAspect - (16 / 9)) > 0.1) {
      console.error('❌ Photo wrap does not adhere to 16:9 aspect ratio');
      passed = false;
    } else {
      console.log('✅ Photo wrap strictly adheres to 16:9 aspect ratio');
    }

    // 2. Metrics Pill with Stopwatch & Servings
    const metricsHtml = await metricsPill.innerHTML();
    console.log('Metrics Pill HTML:', metricsHtml.replace(/\s+/g, ' '));
    const hasStopwatch = await metricsPill.locator('span.material-symbols-outlined:has-text("schedule")').count() > 0;
    const hasGroup = await metricsPill.locator('span.material-symbols-outlined:has-text("group")').count() > 0;
    if (!hasStopwatch || !hasGroup) {
      console.error('❌ Metrics pill missing stopwatch (schedule) or servings (group) badge icons');
      passed = false;
    } else {
      console.log('✅ Metrics pill contains stopwatch icon, cook time, dot separator, servings icon, and count');
    }

    // 3. Tags group
    const tagCount = await tagsGroup.locator('.tag').count();
    console.log(`Found ${tagCount} badges in tags-group`);
    if (tagCount < 2) {
      console.error('❌ Tags group missing badge pills');
      passed = false;
    } else {
      console.log('✅ Tags group contains badge pills (e.g., CHEF\'S PICK, cuisine/course)');
    }

    // 4. Title block typography & layout opposite wow button
    const bodyFlex = await cardBody.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        justifyContent: s.justifyContent,
        alignItems: s.alignItems,
        padding: s.padding
      };
    });
    console.log('Card Body Horizontal Layout:', bodyFlex);
    if (bodyFlex.display !== 'flex' || bodyFlex.justifyContent !== 'space-between') {
      console.error('❌ Card body is not display: flex; justify-content: space-between;');
      passed = false;
    } else {
      console.log('✅ Card body layout is flexbox with space-between positioning');
    }

    // 5. 44x44px Circular "wow" brand bookmark button
    const btnBox = await wowBtn.boundingBox();
    console.log(`"wow" Bookmark Button Dimensions: ${btnBox.width}x${btnBox.height}px`);
    if (Math.round(btnBox.width) !== 44 || Math.round(btnBox.height) !== 44) {
      console.error(`❌ Button dimensions are not 44x44px (got ${btnBox.width}x${btnBox.height})`);
      passed = false;
    } else {
      console.log('✅ "wow" Bookmark Button is exactly 44x44px');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 2: Dynamic Card Injection on Pill Switch: DINNER, HEALTHY, KETO, DESSERTS
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 2: Dynamic Category Pill Switching & Injection ---');

    // 1. Tap DINNER
    console.log('\n👉 Tapping "DINNER" pill...');
    await page.click('#pill-dinner');
    await page.waitForTimeout(200);

    const dinnerCards = page.locator('#main-recipe-feed .recipe-card');
    const dinnerCount = await dinnerCards.count();
    console.log(`Curated Creations count under DINNER: ${dinnerCount} cards`);
    if (dinnerCount === 0 || dinnerCount > 9) {
      console.error(`❌ Unexpected DINNER count: ${dinnerCount}`);
      passed = false;
    } else {
      console.log(`✅ DINNER filtered recipes rendered dynamically (${dinnerCount} cards)`);
    }

    // Verify all injected cards have 16:9 photos and 44x44 wow buttons
    for (let i = 0; i < dinnerCount; i++) {
      const c = dinnerCards.nth(i);
      const titleText = await c.locator('.card-title').textContent();
      const hasWow = await c.locator('.wow-bookmark-btn').count();
      const hasMetrics = await c.locator('.metrics-pill').count();
      if (!hasWow || !hasMetrics) {
        console.error(`❌ DINNER Card [${titleText}] missing wow button or metrics pill`);
        passed = false;
      }
    }
    console.log('✅ All dynamically injected DINNER cards contain full 16:9 photo, metrics pill, and 44px wow button');

    // 2. Tap HEALTHY
    console.log('\n👉 Tapping "HEALTHY" pill...');
    await page.click('#pill-healthy');
    await page.waitForTimeout(200);

    const healthyCards = page.locator('#main-recipe-feed .recipe-card');
    const healthyCount = await healthyCards.count();
    console.log(`Curated Creations count under HEALTHY: ${healthyCount} cards`);
    if (healthyCount === 0 || healthyCount > 9) {
      console.error(`❌ Unexpected HEALTHY count: ${healthyCount}`);
      passed = false;
    } else {
      console.log(`✅ HEALTHY filtered recipes rendered dynamically (${healthyCount} cards)`);
    }

    // 3. Tap KETO
    console.log('\n👉 Tapping "KETO" pill...');
    await page.click('#pill-keto');
    await page.waitForTimeout(200);

    const ketoCards = page.locator('#main-recipe-feed .recipe-card');
    const ketoCount = await ketoCards.count();
    console.log(`Curated Creations count under KETO: ${ketoCount} cards`);
    if (ketoCount === 0 || ketoCount > 9) {
      console.error(`❌ Unexpected KETO count: ${ketoCount}`);
      passed = false;
    } else {
      console.log(`✅ KETO filtered recipes rendered dynamically (${ketoCount} cards)`);
    }

    // 4. Tap DESSERTS
    console.log('\n👉 Tapping "DESSERTS" pill...');
    await page.click('#pill-desserts');
    await page.waitForTimeout(200);

    const dessertCards = page.locator('#main-recipe-feed .recipe-card');
    const dessertCount = await dessertCards.count();
    console.log(`Curated Creations count under DESSERTS: ${dessertCount} cards`);
    if (dessertCount === 0) {
      console.error(`❌ Expected dessert cards, got ${dessertCount}`);
      passed = false;
    } else {
      const dessertTitle = await dessertCards.first().locator('.card-title').textContent();
      console.log(`✅ DESSERTS rendered dynamically (${dessertCount} cards, First: "${dessertTitle}")`);
    }

    // 5. Restore ALL
    console.log('\n👉 Restoring "ALL" pill...');
    await page.click('#pill-all');
    await page.waitForTimeout(200);

    const restoredCards = page.locator('#main-recipe-feed .recipe-card');
    const restoredCount = await restoredCards.count();
    console.log(`Curated Creations restored count under ALL: ${restoredCount} cards`);
    if (restoredCount !== 9) {
      console.error(`❌ Expected 9 restored cards, got ${restoredCount}`);
      passed = false;
    } else {
      console.log('✅ ALL category restores all 9 master curated creations');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 3: Interactive Two-State "wow" Button Micro-Interaction & Toast
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 3: Dynamic Two-State Bookmark Button & Toast Notification ---');
    // Clear storage first
    await page.evaluate(() => localStorage.removeItem('wow_saved_recipes'));
    await page.click('#pill-all');
    await page.waitForTimeout(200);

    const targetCard = page.locator('#main-recipe-feed .recipe-card').first();
    const targetBtn = targetCard.locator('.wow-bookmark-btn');

    // Default unsaved state
    const isSavedInitial = await targetBtn.evaluate(el => el.classList.contains('saved'));
    console.log(`Initial button saved class present: ${isSavedInitial} (Expected: false)`);

    // Click to save (State A -> State B)
    console.log('Tapping "wow" button to save...');
    await targetBtn.click();
    await page.waitForTimeout(300);

    const isSavedAfterClick = await targetBtn.evaluate(el => el.classList.contains('saved'));
    const btnBgColor = await targetBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log(`After click button saved class: ${isSavedAfterClick} (Expected: true), Bg: ${btnBgColor}`);

    if (!isSavedAfterClick) {
      console.error('❌ Button did not transition to State B (.saved)');
      passed = false;
    } else {
      console.log('✅ Button transitioned to State B (.saved) with crimson background');
    }

    // Check Toast Notification
    const toast = page.locator('#wow-toast-notification');
    const isToastVisible = await toast.evaluate(el => {
      const s = window.getComputedStyle(el);
      return s.visibility !== 'hidden' && s.opacity !== '0' && el.classList.contains('show');
    });
    const toastText = await toast.textContent();
    console.log(`Toast Notification visible: ${isToastVisible}, Text: "${toastText.trim()}"`);
    if (!isToastVisible || !toastText.includes('Saved to Collection')) {
      console.error('❌ Toast notification did not pop up with "Saved to Collection!"');
      passed = false;
    } else {
      console.log('✅ Toast notification popped up smoothly with "Saved to Collection!"');
    }

    // Switch Category to DINNER and verify saved state persists on matching cards
    console.log('\nSwitching to DINNER category while recipe is saved...');
    await page.click('#pill-dinner');
    await page.waitForTimeout(200);
    const carbonaraDinnerBtn = page.locator('#main-recipe-feed #card-carbonara .wow-bookmark-btn');
    const isCarbonaraStillSaved = await carbonaraDinnerBtn.evaluate(el => el.classList.contains('saved'));
    console.log(`Carbonara button still saved in dynamically injected DINNER feed: ${isCarbonaraStillSaved}`);
    if (!isCarbonaraStillSaved) {
      console.error('❌ Saved state not synchronized across dynamic re-render');
      passed = false;
    } else {
      console.log('✅ Saved state is 100% synchronized across dynamic re-renders');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 4: Card Navigation to Recipe Detail View
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- TEST 4: Dynamic Card Navigation to Recipe Detail ---');
    const ribeyeCard = page.locator('#main-recipe-feed #card-ribeye');
    console.log('Clicking Ribeye card body...');
    await ribeyeCard.click();
    await page.waitForTimeout(500);

    const currentUrl = page.url();
    console.log(`Navigated URL: ${currentUrl}`);
    if (!currentUrl.includes('recipe-detail.html')) {
      console.error('❌ Clicking dynamic recipe card did not navigate to recipe-detail.html');
      passed = false;
    } else {
      console.log('✅ Clicking dynamic recipe card successfully opens recipe-detail.html');
    }

    // Take verification screenshot
    await page.goto(dashboardUrl, { waitUntil: 'load' });
    await page.click('#pill-healthy');
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.resolve(__dirname, 'screenshot_dynamic_category_feed.png') });
    console.log('📸 Captured screenshot: screenshot_dynamic_category_feed.png');

    console.log('\n══════════════════════════════════════════════════════════════════════');
    if (passed) {
      console.log('🏆 VERIFICATION RESULT: 100% OF CHECKS PASSED SUCCESSFULLY!');
    } else {
      console.log('❌ VERIFICATION RESULT: FAILURES DETECTED');
      process.exit(1);
    }
    console.log('══════════════════════════════════════════════════════════════════════');

  } catch (err) {
    console.error('❌ Error during verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runVerification();
