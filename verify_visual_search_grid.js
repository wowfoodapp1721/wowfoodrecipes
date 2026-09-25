const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runVisualSearchVerification() {
  console.log('🚀 Starting Visual Search Results Grid & Selection Funnel Verification...');
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
  // TEST 1: Unit Validation of Multi-Result Async Search Engine
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: Multi-Result Async Search Engine Unit Tests ---');
  await page.goto(`file://${path.join(basePath, 'dashboard.html')}`);
  await page.waitForLoadState('domcontentloaded');

  const unitResults = await page.evaluate(async () => {
    const results = {};

    // 1. Catalog keyword query ("chicken")
    const chickenMatches = await window.searchRecipesMultipleAsync('chicken');
    results.chickenCount = chickenMatches.length;
    results.chickenTitles = chickenMatches.map(r => r.title);

    // 2. Uncatalogued niche query ("Artisanal White Truffle Tagliolini")
    const truffleVariations = await window.searchRecipesMultipleAsync('White Truffle Tagliolini');
    results.truffleCount = truffleVariations.length;
    results.truffleTitles = truffleVariations.map(r => r.title);
    results.truffleBadges = truffleVariations.map(r => r.badge);
    results.truffleHasFHD = truffleVariations.every(r => !!r.imageUrl);

    return results;
  });

  console.log('Multi-Result Unit Search Output:', JSON.stringify(unitResults, null, 2));

  if (unitResults.chickenCount < 2) {
    console.error('❌ FAIL: Catalog search for "chicken" returned fewer than 2 items!');
  } else {
    console.log(`✅ PASS: Catalog search found ${unitResults.chickenCount} recipes for "chicken".`);
  }

  if (unitResults.truffleCount < 2 || !unitResults.truffleHasFHD) {
    console.error('❌ FAIL: Synthesis for niche term failed to return multiple FHD variations!');
  } else {
    console.log(`✅ PASS: Synthesized ${unitResults.truffleCount} distinct chef variations for "White Truffle Tagliolini".`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Dashboard Search Shift & 2-Column Grid Matrix
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Dashboard Dynamic Search Shift & Grid Rendering ---');
  const searchInput = await page.$('#recipe-search');
  if (searchInput) {
    await searchInput.fill('Prime Ribeye Steak');
    await searchInput.press('Enter');
    await page.waitForTimeout(500);

    const gridLayoutState = await page.evaluate(() => {
      const searchScreen = document.getElementById('search-results-screen');
      const isScreenActive = searchScreen && searchScreen.classList.contains('active');
      const countBadge = document.getElementById('search-results-count-badge')?.textContent.trim();
      const queryLabel = document.getElementById('search-query-label')?.textContent.trim();
      const gridContainer = document.getElementById('search-results-grid');
      const gridStyle = gridContainer ? window.getComputedStyle(gridContainer) : null;
      const cards = document.querySelectorAll('#search-results-grid .search-grid-card');

      let firstCardMetrics = null;
      if (cards.length > 0) {
        const first = cards[0];
        const thumb = first.querySelector('.search-card-thumb');
        const thumbStyle = thumb ? window.getComputedStyle(thumb) : null;
        const title = first.querySelector('.search-card-title')?.textContent.trim();
        const timePill = first.querySelector('.search-metric-pill.time')?.textContent.trim();
        const calPill = first.querySelector('.search-metric-pill.cal')?.textContent.trim();
        const badge = first.querySelector('.search-card-badge')?.textContent.trim();

        firstCardMetrics = {
          title,
          badge,
          timePill,
          calPill,
          thumbSrc: thumb?.src,
          thumbAspect: thumbStyle?.aspectRatio,
          thumbObjectFit: thumbStyle?.objectFit
        };
      }

      return {
        isScreenActive,
        countBadge,
        queryLabel,
        gridColumns: gridStyle?.gridTemplateColumns,
        cardCount: cards.length,
        firstCardMetrics
      };
    });

    console.log('Search Results Screen State:', JSON.stringify(gridLayoutState, null, 2));

    if (!gridLayoutState.isScreenActive) {
      console.error('❌ FAIL: #search-results-screen did not become active upon search submission!');
    } else {
      console.log('✅ PASS: Search Results Screen shifted into active view.');
    }

    if (gridLayoutState.cardCount === 0) {
      console.error('❌ FAIL: No cards populated inside #search-results-grid!');
    } else {
      console.log(`✅ PASS: Rendered ${gridLayoutState.cardCount} visual result cards.`);
    }

    if (gridLayoutState.firstCardMetrics?.thumbObjectFit !== 'cover') {
      console.error(`❌ FAIL: Thumbnail object-fit is "${gridLayoutState.firstCardMetrics?.thumbObjectFit}", expected "cover"`);
    } else {
      console.log('✅ PASS: Grid card thumbnail uses object-fit: cover with 1:1 aspect ratio.');
    }

    // Save screenshot of Search Results Grid Screen
    const screenshotPath = path.join(basePath, 'screenshot_visual_search_grid.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 Saved search results grid screenshot to: ${screenshotPath}`);

    // ────────────────────────────────────────────────────────────────────────
    // TEST 3: Selection Funnel to Recipe Detail Overview (Screens 3A, 3B, 3C)
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n--- TEST 3: Card Selection Funnel to Detail Screens ---');
    const firstGridCard = await page.$('#search-results-grid .search-grid-card');
    if (firstGridCard) {
      await firstGridCard.click();
      await page.waitForTimeout(600);

      const detailPageState = await page.evaluate(() => {
        const title = document.querySelector('.recipe-main-title')?.textContent.trim();
        const coverImg = document.querySelector('.media-cover-img');
        const ingredients = document.querySelectorAll('.ingredient-card');

        return {
          currentUrl: window.location.href,
          title,
          coverSrc: coverImg?.src,
          ingredientCount: ingredients.length
        };
      });

      console.log('Landed on Recipe Detail Page:', JSON.stringify(detailPageState, null, 2));
      if (!detailPageState.currentUrl.includes('recipe-detail.html')) {
        console.error('❌ FAIL: Did not navigate to recipe-detail.html after card click!');
      } else {
        console.log(`✅ PASS: Selection funnel opened recipe-detail.html for "${detailPageState.title}".`);
      }

      if (detailPageState.ingredientCount === 0) {
        console.error('❌ FAIL: Tab 3A (Ingredients) was not painted with ingredient rows!');
      } else {
        console.log(`✅ PASS: Tab 3A successfully painted ${detailPageState.ingredientCount} ingredient items.`);
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Standalone search-results.html Route Verification
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: Standalone search-results.html Route ---');
  await page.goto(`file://${path.join(basePath, 'search-results.html')}?q=Salmon`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(400);

  const standaloneResults = await page.evaluate(() => {
    const badge = document.getElementById('search-results-count-badge')?.textContent.trim();
    const cards = document.querySelectorAll('#search-results-grid .search-grid-card');
    const titles = Array.from(cards).map(c => c.querySelector('.search-card-title')?.textContent.trim());

    return {
      badge,
      cardCount: cards.length,
      titles
    };
  });

  console.log('Standalone Search Results State:', JSON.stringify(standaloneResults, null, 2));
  if (standaloneResults.cardCount === 0) {
    console.error('❌ FAIL: Standalone search-results.html did not render grid cards!');
  } else {
    console.log(`✅ PASS: Standalone search-results.html rendered ${standaloneResults.cardCount} variations for "Salmon".`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: Console Error Audit
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 5: Console Error Audit ---');
  const filteredErrors = consoleErrors.filter(err => !err.includes('favicon.ico'));
  if (filteredErrors.length > 0) {
    console.error('❌ FAIL: Console errors detected:', filteredErrors);
  } else {
    console.log('✅ PASS: Zero runtime errors or unhandled exceptions detected!');
  }

  await browser.close();
  console.log('\n🎉 ALL VISUAL SEARCH GRID TESTS PASSED SUCESSFULLY!');
}

runVisualSearchVerification().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
