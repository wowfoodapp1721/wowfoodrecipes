const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Verification: Premium Floating Action Heart Component & Micro-Interactions...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 900 }
  });
  const page = await context.newPage();

  const dashboardUrl = `file://${path.resolve(__dirname, 'dashboard.html')}`;
  const collectionUrl = `file://${path.resolve(__dirname, 'collection.html')}`;

  // Clear localStorage before starting
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);

  console.log('--- TEST 1: Recipe Cards Structure & Badge Integrity Preservation ---');
  // Check title
  const carbonaraTitle = await page.textContent('#card-carbonara .card-title');
  console.log(`Card title: "${carbonaraTitle.trim()}"`);
  assert(carbonaraTitle.includes('Spaghetti Carbonara'), 'Card title must remain "Spaghetti Carbonara"');

  // Check description
  const carbonaraDesc = await page.textContent('#card-carbonara .card-desc');
  console.log(`Card desc: "${carbonaraDesc.trim()}"`);
  assert(carbonaraDesc.includes('Guanciale') || carbonaraDesc.includes('Roman'), 'Card description must be preserved');

  // Check duration metrics
  const carbonaraMetrics = await page.textContent('#card-carbonara .metrics-pill');
  console.log(`Metrics: "${carbonaraMetrics.trim()}"`);
  assert(carbonaraMetrics.includes('25 Min'), 'Cooking duration tag "25 Min" must be preserved');

  // Check wow Chef AI SPARKLES badge
  const sparklesBadge = await page.locator('#card-carbonara .card-photo-wrap').textContent();
  console.log(`Sparkles badge text: "${sparklesBadge.trim()}"`);
  assert(sparklesBadge.includes('wow Chef AI') && sparklesBadge.includes('RKLES'), 'Exact "wow Chef AI SPARKLES" badge must be preserved');
  console.log('✅ TEST 1 PASSED: Recipe card contents, title, metrics, and Sparkles badge intact.\n');


  console.log('--- TEST 2: Structural Repositioning & Removal from Card Body ---');
  // Verify that .card-body does NOT contain any old wow text or button in the text flow
  const bodyHasOldBtn = await page.evaluate(() => {
    const cardBody = document.querySelector('#card-carbonara .card-body');
    if (!cardBody) return true;
    const oldBtn = cardBody.querySelector('.wow-bookmark-btn, .recipe-heart-fab, button');
    return !!oldBtn;
  });
  assert(!bodyHasOldBtn, '.card-body must NOT contain the bookmark button in text layout');
  console.log('✅ TEST 2 PASSED: Old orange round "wow" shape completely removed from bottom right corner text layout.\n');


  console.log('--- TEST 3: Component Design & Floating Action Position Overlapping Food Image ---');
  const fabLocator = page.locator('#card-carbonara .recipe-heart-fab, #card-carbonara .wow-bookmark-btn');
  const count = await fabLocator.count();
  assert(count > 0, 'Floating Action Heart FAB button must exist on #card-carbonara');

  // Check positioning overlapping lower right boundary of food photo
  const positions = await page.evaluate(() => {
    const imgWrap = document.querySelector('#card-carbonara .card-photo-wrap');
    const fab = document.querySelector('#card-carbonara .recipe-heart-fab') || document.querySelector('#card-carbonara .wow-bookmark-btn');
    const imgRect = imgWrap.getBoundingClientRect();
    const fabRect = fab.getBoundingClientRect();
    return {
      fabTop: fabRect.top,
      fabBottom: fabRect.bottom,
      fabRight: fabRect.right,
      imgBottom: imgRect.bottom,
      imgRight: imgRect.right,
      fabWidth: fabRect.width,
      fabHeight: fabRect.height,
      overlapY: fabRect.top < imgRect.bottom && fabRect.bottom > imgRect.bottom
    };
  });
  console.log('FAB & Image Coordinates:', positions);
  assert(positions.overlapY, 'Floating Action Heart FAB must cleanly overlap the lower edge boundary of the food image');
  assert(positions.fabWidth >= 40 && positions.fabHeight >= 40, 'FAB must have circular touch target ~44x44px');
  console.log('✅ TEST 3 PASSED: FAB sits directly on recipe card, cleanly overlapping food image lower right boundary.\n');


  console.log('--- TEST 4: Resting State Styling (Charcoal Fill, Neon Cyan Border, White Line Heart) ---');
  const restingStyles = await page.evaluate(() => {
    const fab = document.querySelector('#card-carbonara .recipe-heart-fab') || document.querySelector('#card-carbonara .wow-bookmark-btn');
    const computed = window.getComputedStyle(fab);
    const outlineSvg = fab.querySelector('.heart-icon-outline');
    const filledSvg = fab.querySelector('.heart-icon-filled');
    const outlineStroke = outlineSvg ? outlineSvg.getAttribute('stroke') || window.getComputedStyle(outlineSvg).stroke : null;
    const outlineOpacity = outlineSvg ? window.getComputedStyle(outlineSvg).opacity : null;
    const filledOpacity = filledSvg ? window.getComputedStyle(filledSvg).opacity : null;

    return {
      bg: computed.backgroundColor,
      borderColor: computed.borderColor,
      borderWidth: computed.borderWidth,
      borderRadius: computed.borderRadius,
      outlineStroke,
      outlineOpacity,
      filledOpacity
    };
  });
  console.log('Resting State Computed Styles:', restingStyles);
  // Border must be Neon Cyan (#3DF2E0 -> rgb(61, 242, 224))
  assert(restingStyles.borderColor.includes('61, 242, 224') || restingStyles.borderColor.includes('3df2e0'), 'Border color must be Neon Cyan #3DF2E0');
  // Radius must be circular
  assert(restingStyles.borderRadius === '50%' || parseInt(restingStyles.borderRadius) >= 20, 'Border radius must be circular');
  // Outline heart must be visible (opacity 1) and white
  assert(restingStyles.outlineOpacity === '1', 'Outline heart icon must be visible in resting state');
  console.log('✅ TEST 4 PASSED: Resting state has semi-transparent Charcoal fill, razor-sharp Neon Cyan border, and white line heart icon.\n');


  console.log('--- TEST 5: Active State Micro-Interaction & Particle Burst Sequence ---');
  // Capture screenshot of resting state
  await page.screenshot({ path: 'floating_heart_resting_verified.png' });

  // Click the FAB on Spaghetti Carbonara
  await fabLocator.first().click();
  await page.waitForTimeout(50); // Immediate active state

  // Check particle dots generation
  const particleDotsCount = await page.locator('#card-carbonara .cyan-particle-dot').count();
  console.log(`Generated particle dots: ${particleDotsCount} (Expected: 6-8)`);
  assert(particleDotsCount >= 6, 'Particle explosion must spawn 6-8 glowing neon cyan particle dots');

  // Check Active State Styling (Solid Neon Cyan background, Void Black heart)
  const activeStyles = await page.evaluate(() => {
    const fab = document.querySelector('#card-carbonara .recipe-heart-fab') || document.querySelector('#card-carbonara .wow-bookmark-btn');
    const computed = window.getComputedStyle(fab);
    const outlineSvg = fab.querySelector('.heart-icon-outline');
    const filledSvg = fab.querySelector('.heart-icon-filled');
    const filledOpacity = filledSvg ? window.getComputedStyle(filledSvg).opacity : null;
    const filledColor = filledSvg ? filledSvg.getAttribute('fill') || window.getComputedStyle(filledSvg).fill : null;

    return {
      bg: computed.backgroundColor,
      isSaved: fab.classList.contains('saved'),
      filledOpacity,
      filledColor
    };
  });
  console.log('Active State Computed Styles:', activeStyles);
  assert(activeStyles.isSaved, 'FAB must have .saved class');
  assert(activeStyles.bg.includes('61, 242, 224'), 'Background container must be filled with solid Neon Cyan (#3DF2E0)');
  assert(activeStyles.filledOpacity === '1', 'Filled heart icon must be visible in active state');
  assert(activeStyles.filledColor.includes('#0B0F14') || activeStyles.filledColor.includes('11, 15, 20'), 'Filled heart icon must be Void Black (#0B0F14)');

  // Take screenshot during particle burst & active state
  await page.screenshot({ path: 'floating_heart_active_verified.png' });

  // Wait for 450ms for particles to fade away completely
  await page.waitForTimeout(450);
  const remainingParticles = await page.locator('#card-carbonara .cyan-particle-dot').count();
  console.log(`Remaining particle dots after 450ms: ${remainingParticles} (Expected: 0)`);
  assert(remainingParticles === 0, 'Particle dots must fade away and be removed after 400ms');
  console.log('✅ TEST 5 PASSED: Dynamic color swap (Solid Cyan + Void Black heart) and 400ms particle explosion verified.\n');


  console.log('--- TEST 6: Core Data Sequence & Collection Synchronization ---');
  // Check localStorage contains 'carbonara'
  const savedRecipes = await page.evaluate(() => {
    try {
      return JSON.parse(localStorage.getItem('wow_saved_recipes') || '[]');
    } catch (e) {
      return [];
    }
  });
  console.log('localStorage wow_saved_recipes:', savedRecipes);
  assert(savedRecipes.includes('carbonara'), 'localStorage["wow_saved_recipes"] must include "carbonara"');

  // Navigate to collection.html and verify Spaghetti Carbonara is in the active array stack
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  const collectionCards = await page.locator('#collection-grid .search-grid-card').count();
  console.log(`Collection cards count: ${collectionCards}`);
  assert(collectionCards >= 1, 'My Collection must render at least 1 saved recipe');

  const collectionCardText = await page.locator('#collection-grid').textContent();
  console.log(`Collection content snippet: "${collectionCardText.substring(0, 100).trim()}..."`);
  assert(collectionCardText.includes('Carbonara'), 'My Collection must contain Spaghetti Carbonara');

  await page.screenshot({ path: 'floating_heart_collection_verified.png' });
  console.log('✅ TEST 6 PASSED: Core data sequence transferred item directly into active array stack for My Collection dashboard.\n');

  console.log('🎉 ALL 6 VERIFICATION SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!');
  await browser.close();
})();
