const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('=== STARTING PLYR VIDEO STREAMING INFRASTRUCTURE VERIFICATION ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 500, height: 950 }
  });

  let passCount = 0;
  let testCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passCount++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 1. TEST: recipe-detail.html
  // ──────────────────────────────────────────────────────────────────────────
  console.log('--- 1. Testing recipe-detail.html ---');
  const recipeDetailPage = await context.newPage();
  const recipeDetailUrl = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  await recipeDetailPage.goto(recipeDetailUrl, { waitUntil: 'load' });
  await recipeDetailPage.waitForTimeout(600);

  const rdData = await recipeDetailPage.evaluate(() => {
    const container = document.querySelector('.media-container');
    const img = container ? container.querySelector('.media-cover-img') : null;
    const computedRoot = getComputedStyle(document.documentElement);
    const computedContainer = container ? getComputedStyle(container) : null;

    // Test on-demand streaming mount
    let streamPlayer = null;
    if (window.PlyrWrapper) {
      streamPlayer = window.PlyrWrapper.init(container);
    }
    const playerLayer = container ? container.querySelector('.plyr-stream-layer') : null;
    const computedLayer = playerLayer ? getComputedStyle(playerLayer) : null;

    return {
      containerExists: !!container,
      provider: container ? container.getAttribute('data-plyr-provider') : null,
      embedId: container ? container.getAttribute('data-plyr-embed-id') : null,
      imgExists: !!img,
      imgSrc: img ? img.getAttribute('src') : null,
      plyrColorMain: computedRoot.getPropertyValue('--plyr-color-main').trim(),
      plyrVideoBg: computedRoot.getPropertyValue('--plyr-video-background').trim(),
      plyrControlHover: computedRoot.getPropertyValue('--plyr-control-bg-hover').trim(),
      containerRadius: computedContainer ? computedContainer.borderRadius : null,
      layerRadius: computedLayer ? computedLayer.borderRadius : null,
      hasPlyrWrapper: typeof window.PlyrWrapper !== 'undefined',
      viewportFrozen: !!document.getElementById('viewport'),
      hasTopNavOverlay: !!(container && container.querySelector('.media-top-nav')),
      hasBottomBadges: !!(container && container.querySelector('.media-bottom-badges'))
    };
  });

  assert(rdData.containerExists, 'recipe-detail.html: .media-container node exists');
  assert(rdData.provider === 'youtube', `recipe-detail.html: data-plyr-provider is "youtube" (found: ${rdData.provider})`);
  assert(rdData.embedId === '3AAdKl1UYZs', `recipe-detail.html: data-plyr-embed-id is "3AAdKl1UYZs" (found: ${rdData.embedId})`);
  assert(rdData.imgExists && rdData.imgSrc.length > 0, 'recipe-detail.html: active visual poster image remains loaded and visible');
  assert(rdData.plyrColorMain === '#3DF2E0', `recipe-detail.html: --plyr-color-main is #3DF2E0 (found: ${rdData.plyrColorMain})`);
  assert(rdData.plyrVideoBg === '#0B0F14', `recipe-detail.html: --plyr-video-background is #0B0F14 (found: ${rdData.plyrVideoBg})`);
  assert(rdData.plyrControlHover === '#171E26', `recipe-detail.html: --plyr-control-bg-hover is #171E26 (found: ${rdData.plyrControlHover})`);
  assert(rdData.containerRadius && (rdData.containerRadius === '14px' || rdData.containerRadius === '12px'), `recipe-detail.html: card container border-radius geometry is configured (${rdData.containerRadius})`);
  assert(rdData.layerRadius === rdData.containerRadius, `recipe-detail.html: player layer matches card container border-radius (${rdData.layerRadius})`);
  assert(rdData.hasPlyrWrapper, 'recipe-detail.html: window.PlyrWrapper is initialized');
  assert(rdData.hasTopNavOverlay, 'recipe-detail.html: top navigation overlay controls are preserved');
  assert(rdData.hasBottomBadges, 'recipe-detail.html: bottom micro badges are preserved');
  assert(rdData.viewportFrozen, 'recipe-detail.html: viewport container layout is intact and frozen');

  // Test tabs and action buttons without regression
  await recipeDetailPage.click('#tab-btn-1');
  await recipeDetailPage.waitForTimeout(200);
  const isTab1Active = await recipeDetailPage.evaluate(() => {
    const p1 = document.getElementById('tab-panel-1');
    return p1 && !p1.classList.contains('hidden');
  });
  assert(isTab1Active, 'recipe-detail.html: Instructions Tab 2 switched successfully');

  await recipeDetailPage.click('#tab-btn-0');
  await recipeDetailPage.waitForTimeout(200);
  await recipeDetailPage.screenshot({ path: 'verify_recipe_detail_video_baseline.png' });
  console.log('  📸 Screenshot saved: verify_recipe_detail_video_baseline.png');
  await recipeDetailPage.close();


  // ──────────────────────────────────────────────────────────────────────────
  // 2. TEST: cooking-guide.html
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 2. Testing cooking-guide.html ---');
  const cookingGuidePage = await context.newPage();
  const cookingGuideUrl = 'file:///' + path.resolve(__dirname, 'cooking-guide.html').replace(/\\/g, '/');
  await cookingGuidePage.goto(cookingGuideUrl, { waitUntil: 'load' });
  await cookingGuidePage.waitForTimeout(600);

  const cgData = await cookingGuidePage.evaluate(() => {
    const container = document.querySelector('#step-media-frame.step-media-container');
    const img = container ? container.querySelector('#step-media-photo') : null;
    const computedRoot = getComputedStyle(document.documentElement);
    const computedContainer = container ? getComputedStyle(container) : null;

    // Test on-demand streaming mount
    let streamPlayer = null;
    if (window.PlyrWrapper) {
      streamPlayer = window.PlyrWrapper.init(container);
    }
    const playerLayer = container ? container.querySelector('.plyr-stream-layer') : null;
    const computedLayer = playerLayer ? getComputedStyle(playerLayer) : null;

    return {
      containerExists: !!container,
      provider: container ? container.getAttribute('data-plyr-provider') : null,
      embedId: container ? container.getAttribute('data-plyr-embed-id') : null,
      imgExists: !!img,
      imgSrc: img ? img.getAttribute('src') : null,
      plyrColorMain: computedRoot.getPropertyValue('--plyr-color-main').trim(),
      plyrVideoBg: computedRoot.getPropertyValue('--plyr-video-background').trim(),
      plyrControlHover: computedRoot.getPropertyValue('--plyr-control-bg-hover').trim(),
      containerRadius: computedContainer ? computedContainer.borderRadius : null,
      layerRadius: computedLayer ? computedLayer.borderRadius : null,
      hasPlyrWrapper: typeof window.PlyrWrapper !== 'undefined'
    };
  });

  assert(cgData.containerExists, 'cooking-guide.html: #step-media-frame.step-media-container exists');
  assert(cgData.provider === 'youtube', `cooking-guide.html: data-plyr-provider is "youtube" (found: ${cgData.provider})`);
  assert(cgData.embedId === '3AAdKl1UYZs', `cooking-guide.html: data-plyr-embed-id is "3AAdKl1UYZs" (found: ${cgData.embedId})`);
  assert(cgData.imgExists && cgData.imgSrc.length > 0, 'cooking-guide.html: active step visual photo remains loaded');
  assert(cgData.plyrColorMain === '#3DF2E0', `cooking-guide.html: --plyr-color-main is #3DF2E0 (found: ${cgData.plyrColorMain})`);
  assert(cgData.plyrVideoBg === '#0B0F14', `cooking-guide.html: --plyr-video-background is #0B0F14 (found: ${cgData.plyrVideoBg})`);
  assert(cgData.plyrControlHover === '#171E26', `cooking-guide.html: --plyr-control-bg-hover is #171E26 (found: ${cgData.plyrControlHover})`);
  assert(cgData.containerRadius && (cgData.containerRadius === '18px' || cgData.containerRadius === '14px'), `cooking-guide.html: step media container border-radius is configured (${cgData.containerRadius})`);
  assert(cgData.layerRadius === cgData.containerRadius, `cooking-guide.html: player layer matches step container border-radius (${cgData.layerRadius})`);
  assert(cgData.hasPlyrWrapper, 'cooking-guide.html: window.PlyrWrapper is initialized');

  // Verify interactive cooking step progression
  await cookingGuidePage.click('#btn-next-step');
  await cookingGuidePage.waitForTimeout(200);
  await cookingGuidePage.click('#btn-unlock-cook-mode', { force: true });
  await cookingGuidePage.waitForTimeout(300);
  await cookingGuidePage.click('#btn-process-final-payment', { force: true });
  await cookingGuidePage.waitForTimeout(1600);
  await cookingGuidePage.click('#btn-start-cooking-success', { force: true });
  await cookingGuidePage.waitForTimeout(400);

  const step2Counter = await cookingGuidePage.locator('#step-counter-display').textContent();
  assert(step2Counter.includes('2/4'), 'cooking-guide.html: Step progression after unlock works seamlessly');

  await cookingGuidePage.screenshot({ path: 'verify_cooking_guide_video_baseline.png' });
  console.log('  📸 Screenshot saved: verify_cooking_guide_video_baseline.png');
  await cookingGuidePage.close();


  // ──────────────────────────────────────────────────────────────────────────
  // 3. TEST: immersive-cooking.html
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- 3. Testing immersive-cooking.html ---');
  const immersivePage = await context.newPage();
  const immersiveUrl = 'file:///' + path.resolve(__dirname, 'immersive-cooking.html').replace(/\\/g, '/');
  await immersivePage.goto(immersiveUrl, { waitUntil: 'load' });
  await immersivePage.waitForTimeout(600);

  const icData = await immersivePage.evaluate(() => {
    const container = document.querySelector('#step-media-frame.step-media-container');
    const img = container ? container.querySelector('#step-media-photo') : null;
    const computedRoot = getComputedStyle(document.documentElement);
    const computedContainer = container ? getComputedStyle(container) : null;

    // Test on-demand streaming mount
    let streamPlayer = null;
    if (window.PlyrWrapper) {
      streamPlayer = window.PlyrWrapper.init(container);
    }
    const playerLayer = container ? container.querySelector('.plyr-stream-layer') : null;
    const computedLayer = playerLayer ? getComputedStyle(playerLayer) : null;

    return {
      containerExists: !!container,
      provider: container ? container.getAttribute('data-plyr-provider') : null,
      embedId: container ? container.getAttribute('data-plyr-embed-id') : null,
      imgExists: !!img,
      imgSrc: img ? img.getAttribute('src') : null,
      plyrColorMain: computedRoot.getPropertyValue('--plyr-color-main').trim(),
      plyrVideoBg: computedRoot.getPropertyValue('--plyr-video-background').trim(),
      plyrControlHover: computedRoot.getPropertyValue('--plyr-control-bg-hover').trim(),
      containerRadius: computedContainer ? computedContainer.borderRadius : null,
      layerRadius: computedLayer ? computedLayer.borderRadius : null,
      hasPlyrWrapper: typeof window.PlyrWrapper !== 'undefined'
    };
  });

  assert(icData.containerExists, 'immersive-cooking.html: #step-media-frame.step-media-container exists');
  assert(icData.provider === 'youtube', `immersive-cooking.html: data-plyr-provider is "youtube" (found: ${icData.provider})`);
  assert(icData.embedId === '3AAdKl1UYZs', `immersive-cooking.html: data-plyr-embed-id is "3AAdKl1UYZs" (found: ${icData.embedId})`);
  assert(icData.imgExists && icData.imgSrc.length > 0, 'immersive-cooking.html: active step visual photo remains loaded');
  assert(icData.plyrColorMain === '#3DF2E0', `immersive-cooking.html: --plyr-color-main is #3DF2E0 (found: ${icData.plyrColorMain})`);
  assert(icData.plyrVideoBg === '#0B0F14', `immersive-cooking.html: --plyr-video-background is #0B0F14 (found: ${icData.plyrVideoBg})`);
  assert(icData.plyrControlHover === '#171E26', `immersive-cooking.html: --plyr-control-bg-hover is #171E26 (found: ${icData.plyrControlHover})`);
  assert(icData.containerRadius && (icData.containerRadius === '18px' || icData.containerRadius === '14px'), `immersive-cooking.html: step media container border-radius is configured (${icData.containerRadius})`);
  assert(icData.layerRadius === icData.containerRadius, `immersive-cooking.html: player layer matches step container border-radius (${icData.layerRadius})`);
  assert(icData.hasPlyrWrapper, 'immersive-cooking.html: window.PlyrWrapper is initialized');

  await immersivePage.screenshot({ path: 'verify_immersive_cooking_video_baseline.png' });
  console.log('  📸 Screenshot saved: verify_immersive_cooking_video_baseline.png');
  await immersivePage.close();

  await browser.close();

  console.log(`\n=======================================================`);
  console.log(`  ALL ${passCount}/${testCount} TESTS PASSED WITH 100% INTEGRITY`);
  console.log(`=======================================================\n`);
})();
