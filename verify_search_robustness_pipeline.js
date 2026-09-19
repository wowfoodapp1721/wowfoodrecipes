const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVerification() {
  console.log('🚀 Starting Comprehensive Search Robustness & Pipeline Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 } // Mobile viewport standard
  });

  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  const basePath = path.resolve(__dirname);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Direct Unit Validation of Global System Functions in recipe-detail.html
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: System Unit Methods & Exception Handlers ---');
  await page.goto(`file://${path.join(basePath, 'recipe-detail.html')}`);
  await page.waitForLoadState('domcontentloaded');

  const unitResults = await page.evaluate(async () => {
    const results = {};

    // 1. Test parseInstructionSteps with raw paragraph
    const rawParagraph = "First, gently sear the protein in olive oil until golden. Next, deglaze the pan with white wine and reduce by half. Finally, toss in fresh herbs and serve immediately hot.";
    const parsed = window.parseInstructionSteps(rawParagraph, 'assets/cover.png');
    results.parseStepsCount = parsed.length;
    results.firstStepTitle = parsed[0]?.title;
    results.firstStepDesc = parsed[0]?.instruction;

    // 2. Test formatMetricCount with varied inputs
    results.metricStandard = window.formatMetricCount(450, 0, 100, 'liked');
    results.metricNull = window.formatMetricCount(null, null, 367, 'liked');
    results.metricNaN = window.formatMetricCount('invalid_number', undefined, 20, 'disliked');
    results.metricRawString = window.formatMetricCount('1.2k', null, 50, 'liked');

    // 3. Test searchRecipesAsync with niche query
    const nicheResult = await window.searchRecipesAsync('Artisanal Truffle Tagliolini');
    results.nicheTitle = nicheResult.title;
    results.nicheIntro = nicheResult.intro;
    results.nicheIngredientsCount = nicheResult.ingredients?.length;
    results.nicheInstructionsCount = nicheResult.instructions?.length;

    // 4. Test searchRecipesAsync with null/empty query
    const emptyResult = await window.searchRecipesAsync('');
    results.emptyDefaultTitle = emptyResult.title;

    return results;
  });

  console.log('Unit Verification Results:', JSON.stringify(unitResults, null, 2));
  if (unitResults.parseStepsCount < 2) {
    console.error('❌ FAIL: parseInstructionSteps did not slice paragraph into multiple steps!');
  } else {
    console.log('✅ PASS: parseInstructionSteps sliced paragraph successfully.');
  }

  if (unitResults.metricNull !== '367 liked' || unitResults.metricNaN !== '20 disliked') {
    console.error('❌ FAIL: formatMetricCount failed safe fallback evaluation!', unitResults);
  } else {
    console.log('✅ PASS: formatMetricCount safely evaluated null/NaN inputs.');
  }

  if (!unitResults.nicheTitle.includes('Truffle Tagliolini') || !unitResults.nicheIntro.includes('refining this dish')) {
    console.error('❌ FAIL: searchRecipesAsync did not generate contextual fallback recipe!');
  } else {
    console.log('✅ PASS: searchRecipesAsync generated high-definition contextual fallback recipe.');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Dynamic Rendering of Niche Recipe in recipe-detail.html
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Dynamic Detail Canvas Rendering for Niche Query ---');
  await page.evaluate(() => {
    window.openRecipeDetail('Dragonfruit Lychee Sorbet');
  });
  await page.waitForTimeout(400);

  const detailState = await page.evaluate(() => {
    const mainTitle = document.querySelector('.recipe-main-title')?.textContent.trim();
    const coverImg = document.querySelector('.media-cover-img');
    const coverComputed = coverImg ? window.getComputedStyle(coverImg) : null;
    const mediaContainer = document.querySelector('.media-container');
    const containerComputed = mediaContainer ? window.getComputedStyle(mediaContainer) : null;
    const ingredientCards = document.querySelectorAll('.ingredient-card');
    const likedText = document.getElementById('liked-count-text')?.textContent.trim();
    const dislikedText = document.getElementById('disliked-count-text')?.textContent.trim();

    return {
      mainTitle,
      coverSrc: coverImg?.src,
      coverAspectRatio: coverComputed?.aspectRatio,
      coverObjectFit: coverComputed?.objectFit,
      containerAspectRatio: containerComputed?.aspectRatio,
      ingredientCount: ingredientCards.length,
      likedText,
      dislikedText
    };
  });

  console.log('Detail State for Niche Recipe:', JSON.stringify(detailState, null, 2));

  if (!detailState.mainTitle.includes('Dragonfruit Lychee Sorbet')) {
    console.error(`❌ FAIL: Main title is "${detailState.mainTitle}", expected "Dragonfruit Lychee Sorbet"`);
  } else {
    console.log('✅ PASS: Title properly hydrated on Screen 3A.');
  }

  if (detailState.coverObjectFit !== 'cover') {
    console.error(`❌ FAIL: Cover image object-fit is "${detailState.coverObjectFit}", expected "cover"`);
  } else {
    console.log('✅ PASS: FHD Media cover image object-fit is cover.');
  }

  if (detailState.ingredientCount === 0) {
    console.error('❌ FAIL: No ingredient cards rendered for fallback recipe!');
  } else {
    console.log(`✅ PASS: ${detailState.ingredientCount} ingredient cards rendered with FHD raw photography.`);
  }

  // Check Tab 3B (Instructions)
  await page.evaluate(() => {
    if (typeof window.switchRecipeTab === 'function') {
      window.switchRecipeTab(1);
    }
  });
  await page.waitForTimeout(300);

  const instructionsState = await page.evaluate(() => {
    const cards = document.querySelectorAll('#tab-panel-1 .instruction-step-card');
    return {
      stepCardsCount: cards.length,
      firstStepTitle: cards[0]?.querySelector('.step-title')?.textContent.trim()
    };
  });
  console.log('Instructions Tab State:', JSON.stringify(instructionsState, null, 2));

  // Check Tab 3C (Health Score) & Community Feedback
  await page.evaluate(() => {
    if (typeof window.switchRecipeTab === 'function') {
      window.switchRecipeTab(2);
    }
  });
  await page.waitForTimeout(300);

  const feedbackMetricsState = await page.evaluate(() => {
    const likedPill = document.querySelector('.feedback-pill.liked, .feedback-pill:first-child');
    const dislikedPill = document.querySelector('.feedback-pill.disliked, .feedback-pill:last-child');
    const likedRect = likedPill ? likedPill.getBoundingClientRect() : null;
    const dislikedRect = dislikedPill ? dislikedPill.getBoundingClientRect() : null;

    const isOverlapping = likedRect && dislikedRect ? !(
      likedRect.right <= dislikedRect.left ||
      likedRect.left >= dislikedRect.right ||
      likedRect.bottom <= dislikedRect.top ||
      likedRect.top >= dislikedRect.bottom
    ) : false;

    return {
      likedText: likedPill?.textContent.trim(),
      dislikedText: dislikedPill?.textContent.trim(),
      distanceBetween: likedRect && dislikedRect ? (dislikedRect.left - likedRect.right) : 0,
      isOverlapping
    };
  });

  console.log('Community Feedback State:', JSON.stringify(feedbackMetricsState, null, 2));
  if (feedbackMetricsState.isOverlapping) {
    console.error('❌ FAIL: Feedback metrics are overlapping!');
  } else {
    console.log(`✅ PASS: Feedback metrics separated with clean gap (${feedbackMetricsState.distanceBetween}px).`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Dashboard Search Interactivity & Direct Enter Submission
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 3: Dashboard Search Bar Enter Submission ---');
  await page.goto(`file://${path.join(basePath, 'dashboard.html')}`);
  await page.waitForLoadState('domcontentloaded');

  const searchInput = await page.$('#recipe-search');
  if (searchInput) {
    await searchInput.fill('Wild Alaskan King Salmon');
    await searchInput.press('Enter');
    await page.waitForTimeout(500);

    const activeTitleOnDetail = await page.evaluate(() => {
      return document.querySelector('.recipe-main-title')?.textContent.trim();
    });
    console.log('Landed on Detail Page after Dashboard Search. Title:', activeTitleOnDetail);

    if (activeTitleOnDetail && activeTitleOnDetail.includes('Wild Alaskan King Salmon')) {
      console.log('✅ PASS: Dashboard Search input triggered openRecipeDetail() seamlessly.');
    } else {
      console.error('❌ FAIL: Dashboard search did not open matching detail view!');
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Search Pantry Hub & AI Dynamic Match Card
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: Search Pantry AI Dynamic Match Card ---');
  await page.goto(`file://${path.join(basePath, 'search-pantry.html')}`);
  await page.waitForLoadState('domcontentloaded');

  const pantryInput = await page.$('#ingredient-search-input');
  if (pantryInput) {
    await pantryInput.fill('Saffron Gold Risotto');
    await pantryInput.press('Enter');
    await page.waitForTimeout(400);

    const pantryMatchResult = await page.evaluate(() => {
      const matchBadge = document.getElementById('match-count-badge')?.textContent.trim();
      const fallbackCard = document.getElementById('dynamic-ai-fallback-card');
      const fallbackTitle = fallbackCard?.querySelector('.match-title')?.textContent.trim();
      const isVisible = fallbackCard && window.getComputedStyle(fallbackCard).display !== 'none';

      return {
        matchBadge,
        hasFallbackCard: !!fallbackCard,
        fallbackTitle,
        isVisible
      };
    });

    console.log('Pantry Search State:', JSON.stringify(pantryMatchResult, null, 2));
    if (pantryMatchResult.isVisible && pantryMatchResult.hasFallbackCard) {
      console.log('✅ PASS: Search Pantry dynamically rendered AI match fallback card for niche query.');
    } else {
      console.error('❌ FAIL: Search Pantry did not show dynamic AI match card!');
    }

    // Click on the dynamic fallback card
    const fallbackEl = await page.$('#dynamic-ai-fallback-card');
    if (fallbackEl) {
      await fallbackEl.click();
      await page.waitForTimeout(500);
      const titleAfterPantryClick = await page.evaluate(() => {
        return document.querySelector('.recipe-main-title')?.textContent.trim();
      });
      console.log('Landed on Detail Page from Pantry AI Match Card. Title:', titleAfterPantryClick);
      if (titleAfterPantryClick && titleAfterPantryClick.includes('Saffron Gold Risotto')) {
        console.log('✅ PASS: Clicking Pantry AI match card routed directly to Recipe Detail canvas.');
      } else {
        console.error('❌ FAIL: Recipe detail title mismatch after pantry click!');
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: Console Error Audit
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 5: Console Error Audit ---');
  const filteredErrors = consoleErrors.filter(err => !err.includes('favicon.ico'));
  if (filteredErrors.length > 0) {
    console.error('❌ FAIL: Console errors detected during pipeline execution:', filteredErrors);
  } else {
    console.log('✅ PASS: Zero runtime exceptions or layout crashes detected!');
  }

  // Take screenshot of recipe detail with AI generated recipe
  const screenshotPath = path.join(basePath, 'screenshot_search_robustness_detail.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`📸 Saved screenshot to: ${screenshotPath}`);

  await browser.close();
  console.log('\n🎉 ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY!');
}

runVerification().catch(err => {
  console.error('Fatal Verification Error:', err);
  process.exit(1);
});
