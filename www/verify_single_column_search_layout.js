const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runSingleColumnSearchVerification() {
  console.log('🚀 Starting Single-Column FHD Search Results Layout Verification...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 } // Exact mobile viewport standard
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
  // TEST 1: Pizza Query Distinct FHD Photography & Multi-Variation Verification
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: Pizza Multi-Variation Distinct Photography ---');
  await page.goto(`file://${path.join(basePath, 'dashboard.html')}`);
  await page.waitForLoadState('domcontentloaded');

  const pizzaVariations = await page.evaluate(async () => {
    const results = await window.searchRecipesMultipleAsync('Pizza');
    return results.map(r => ({
      id: r.id,
      title: r.title,
      badge: r.badge,
      image: r.imageUrl || r.image || r.img || r.strMealThumb,
      cookTime: r.cookTime,
      calories: r.calorieStr || r.calories
    }));
  });

  console.log('Pizza Variations:', JSON.stringify(pizzaVariations, null, 2));

  if (pizzaVariations.length < 4) {
    console.error(`❌ FAIL: Expected 4 variations for "Pizza", got ${pizzaVariations.length}`);
  } else {
    console.log(`✅ PASS: Generated ${pizzaVariations.length} chef variations for "Pizza".`);
  }

  const uniqueImages = new Set(pizzaVariations.map(p => p.image));
  if (uniqueImages.size < pizzaVariations.length) {
    console.error(`❌ FAIL: Expected distinct photographs for each variation, found duplicates: ${uniqueImages.size} unique vs ${pizzaVariations.length} total`);
  } else {
    console.log(`✅ PASS: All ${uniqueImages.size} pizza variations have distinct real FHD photographs.`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Dashboard Search Shift & Single-Column 16:9 Layout Geometry
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Single-Column Layout & 16:9 Aspect Ratio Geometry ---');
  const searchInput = await page.$('#recipe-search');
  if (searchInput) {
    await searchInput.fill('Pizza');
    await searchInput.press('Enter');
    await page.waitForTimeout(500);

    const layoutInspection = await page.evaluate(() => {
      const searchScreen = document.getElementById('search-results-screen');
      const isScreenActive = searchScreen && searchScreen.classList.contains('active');
      const scrollContainer = document.getElementById('search-grid-scroll');
      const scrollStyle = scrollContainer ? window.getComputedStyle(scrollContainer) : null;
      const listContainer = document.getElementById('search-results-grid');
      const listStyle = listContainer ? window.getComputedStyle(listContainer) : null;
      const cards = document.querySelectorAll('#search-results-grid .search-grid-card');
      const fab = document.getElementById('wow-chef-ai-fab');
      const fabStyle = fab ? window.getComputedStyle(fab) : null;
      const searchScreenStyle = searchScreen ? window.getComputedStyle(searchScreen) : null;

      const cardDetails = Array.from(cards).map(card => {
        const cardStyle = window.getComputedStyle(card);
        const thumbWrap = card.querySelector('.search-card-thumb-wrap');
        const thumbWrapStyle = thumbWrap ? window.getComputedStyle(thumbWrap) : null;
        const thumb = card.querySelector('.search-card-thumb');
        const thumbStyle = thumb ? window.getComputedStyle(thumb) : null;
        const title = card.querySelector('.search-card-title');
        const titleStyle = title ? window.getComputedStyle(title) : null;
        const metrics = card.querySelector('.search-card-metrics');
        const metricsStyle = metrics ? window.getComputedStyle(metrics) : null;
        const timePill = card.querySelector('.search-metric-pill.time')?.textContent.trim();
        const calPill = card.querySelector('.search-metric-pill.cal')?.textContent.trim();

        return {
          title: title?.textContent.trim(),
          titleColor: titleStyle?.color,
          cardWidth: cardStyle.width,
          cardDisplay: cardStyle.display,
          thumbWrapAspect: thumbWrapStyle?.aspectRatio,
          thumbObjectFit: thumbStyle?.objectFit,
          thumbSrc: thumb?.src,
          timePill,
          calPill,
          metricsDisplay: metricsStyle?.display
        };
      });

      return {
        isScreenActive,
        searchScreenZIndex: searchScreenStyle?.zIndex,
        fabZIndex: fabStyle?.zIndex,
        fabBottom: fabStyle?.bottom,
        listDisplay: listStyle?.display,
        listFlexDirection: listStyle?.flexDirection,
        scrollPaddingBottom: scrollStyle?.paddingBottom,
        cardCount: cards.length,
        cardDetails
      };
    });

    console.log('Layout Inspection Summary:', JSON.stringify({
      isScreenActive: layoutInspection.isScreenActive,
      searchScreenZIndex: layoutInspection.searchScreenZIndex,
      fabZIndex: layoutInspection.fabZIndex,
      listDisplay: layoutInspection.listDisplay,
      listFlexDirection: layoutInspection.listFlexDirection,
      scrollPaddingBottom: layoutInspection.scrollPaddingBottom,
      cardCount: layoutInspection.cardCount,
      firstCard: layoutInspection.cardDetails[0]
    }, null, 2));

    if (!layoutInspection.isScreenActive) {
      console.error('❌ FAIL: #search-results-screen did not become active!');
    } else {
      console.log('✅ PASS: #search-results-screen active.');
    }

    if (layoutInspection.listFlexDirection !== 'column') {
      console.error(`❌ FAIL: Expected list flex-direction to be 'column', got '${layoutInspection.listFlexDirection}'`);
    } else {
      console.log('✅ PASS: Search results container is a single vertical column (flex-direction: column).');
    }

    const firstCard = layoutInspection.cardDetails[0];
    if (firstCard.thumbWrapAspect !== '16 / 9' && firstCard.thumbWrapAspect !== '1.77778') {
      console.error(`❌ FAIL: Expected 16/9 aspect-ratio on card cover photo, got '${firstCard.thumbWrapAspect}'`);
    } else {
      console.log(`✅ PASS: Cover photo uses 16/9 widescreen aspect-ratio (${firstCard.thumbWrapAspect}).`);
    }

    if (firstCard.thumbObjectFit !== 'cover') {
      console.error(`❌ FAIL: Expected object-fit: cover, got '${firstCard.thumbObjectFit}'`);
    } else {
      console.log('✅ PASS: Cover photo uses object-fit: cover.');
    }

    // Check z-index layering
    const fabZ = parseInt(layoutInspection.fabZIndex || '0', 10);
    const screenZ = parseInt(layoutInspection.searchScreenZIndex || '0', 10);
    if (fabZ <= screenZ) {
      console.error(`❌ FAIL: FAB z-index (${fabZ}) is not higher than search screen z-index (${screenZ})!`);
    } else {
      console.log(`✅ PASS: Floating Chef AI FAB z-index (${fabZ}) is properly elevated above search results screen (${screenZ}).`);
    }

    // Save screenshot of redesigned single-column layout
    const screenshotPath = path.join(basePath, 'screenshot_single_column_search_layout.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 Saved single-column search layout screenshot to: ${screenshotPath}`);

    // ────────────────────────────────────────────────────────────────────────
    // TEST 3: Card Click Funnel to Recipe Detail Screen
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- TEST 3: Card Selection Funnel to Recipe Detail ---');
    const firstCardElement = await page.$('#search-results-grid .search-grid-card');
    if (firstCardElement) {
      await firstCardElement.click();
      await page.waitForTimeout(600);

      const detailState = await page.evaluate(() => {
        const title = document.querySelector('.recipe-main-title')?.textContent.trim();
        const heroImg = document.querySelector('.media-cover-img');
        const ingCount = document.querySelectorAll('.ingredient-card').length;
        const stepsCount = document.querySelectorAll('.instruction-step-card').length;

        return {
          currentUrl: window.location.href,
          title,
          heroSrc: heroImg?.src,
          ingCount,
          stepsCount
        };
      });

      console.log('Landed on Detail Page:', JSON.stringify(detailState, null, 2));
      if (!detailState.currentUrl.includes('recipe-detail.html')) {
        console.error('❌ FAIL: Card click did not route to recipe-detail.html!');
      } else {
        console.log(`✅ PASS: Successfully routed to recipe-detail.html for "${detailState.title}".`);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Standalone search-results.html Verification
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: Standalone search-results.html Route Verification ---');
  await page.goto(`file://${path.join(basePath, 'search-results.html')}?q=Pizza`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(400);

  const standaloneState = await page.evaluate(() => {
    const cards = document.querySelectorAll('#search-results-grid .search-grid-card');
    const fab = document.getElementById('wow-chef-ai-fab');
    return {
      cardCount: cards.length,
      hasFab: !!fab,
      titles: Array.from(cards).map(c => c.querySelector('.search-card-title')?.textContent.trim())
    };
  });

  console.log('Standalone Search State:', JSON.stringify(standaloneState, null, 2));
  if (standaloneState.cardCount === 0) {
    console.error('❌ FAIL: Standalone search-results.html did not render cards!');
  } else {
    console.log(`✅ PASS: Standalone search-results.html rendered ${standaloneState.cardCount} cards for "Pizza".`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: Console Error Audit
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 5: Console Error Audit ---');
  const filteredErrors = consoleErrors.filter(err => !err.includes('favicon.ico'));
  if (filteredErrors.length > 0) {
    console.error('❌ FAIL: Console errors detected:', filteredErrors);
  } else {
    console.log('✅ PASS: Zero runtime exceptions detected!');
  }

  await browser.close();
  console.log('\n🎉 ALL SINGLE-COLUMN FHD SEARCH LAYOUT TESTS COMPLETED!');
}

runSingleColumnSearchVerification().catch(err => {
  console.error('Fatal Test Execution Error:', err);
  process.exit(1);
});
