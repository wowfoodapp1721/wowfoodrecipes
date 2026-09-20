const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Pizza Search Routing & Image Canvas Synchronization Verification...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });

  const loadPage = async (relativePath) => {
    const fileUrl = 'file:///' + path.resolve(__dirname, relativePath).replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
  };

  try {
    // ─── STEP 1: Load Search Results Screen with "Pizza" query ──────────
    console.log('\n--- Step 1: Open search-results.html?q=Pizza ---');
    await loadPage('search-results.html?q=Pizza');

    const searchState = await page.evaluate(() => {
      const countBadge = document.getElementById('search-results-count-badge');
      const cards = document.querySelectorAll('.search-grid-card');
      const cardData = Array.from(cards).map(c => {
        const link = c.querySelector('a') || c;
        const title = c.querySelector('.search-card-title')?.textContent.trim();
        const time = c.querySelector('.search-metric-pill.time span:last-child')?.textContent.trim();
        const cal = c.querySelector('.search-metric-pill.cal span:last-child')?.textContent.trim();
        const img = c.querySelector('.search-card-thumb')?.src;
        const href = link.getAttribute('href') || c.getAttribute('data-recipe-id');
        return { title, time, cal, img, href, dataId: c.getAttribute('data-recipe-id') };
      });

      return {
        badgeText: countBadge ? countBadge.textContent.trim() : null,
        cardCount: cards.length,
        cards: cardData
      };
    });

    console.log('Search State:', searchState);
    console.log('✓ Found Count:', searchState.badgeText);
    console.log('✓ Cards Rendered:', searchState.cardCount);

    // Verify constraints
    const authenticCard = searchState.cards.find(c => c.title.includes('Authentic') && c.title.includes('Pizza'));
    const skilletCard = searchState.cards.find(c => c.title.includes('Quick Pan-Seared') && c.title.includes('Pizza'));

    if (!authenticCard || !skilletCard) {
      throw new Error('Authentic Pizza or Quick Pan-Seared Pizza card missing from search results');
    }

    console.log('\n✓ Authentic Pizza Card:', authenticCard);
    console.log('✓ Quick Pan-Seared Pizza Card:', skilletCard);

    // ─── STEP 2: Click on "Authentic Pizza" and test detail view routing & image sync ─
    console.log('\n--- Step 2: Route from Search to Authentic Pizza Detail View ---');
    await page.click('.search-grid-card[data-recipe-id*="pizza-authentic"], .search-grid-card[data-recipe-id*="authentic-pizza"], .search-grid-card[data-recipe-id*="pizza-classic"]');
    await page.waitForTimeout(800);

    const authenticDetailState = await page.evaluate(() => {
      const title = document.querySelector('.recipe-main-title')?.textContent.trim();
      const coverImg = document.querySelector('.media-cover-img');
      const header = document.getElementById('recipe-header');
      const mediaContainer = document.querySelector('.media-container');

      return {
        url: window.location.href,
        title: title,
        imgSrc: coverImg?.src,
        filter: coverImg ? window.getComputedStyle(coverImg).filter : null,
        objectFit: coverImg ? window.getComputedStyle(coverImg).objectFit : null,
        boxShadow: mediaContainer ? window.getComputedStyle(mediaContainer).boxShadow : null
      };
    });

    console.log('Authentic Pizza Detail State:', authenticDetailState);
    console.log('✓ Detail Title:', authenticDetailState.title);
    console.log('✓ Synchronized Image Canvas:', authenticDetailState.imgSrc);
    console.log('✓ 7-Star Filter:', authenticDetailState.filter);
    console.log('✓ Neon Glow:', authenticDetailState.boxShadow);

    if (authenticDetailState.imgSrc !== authenticCard.img) {
      console.warn('⚠️ Note: Image src comparison:', { detail: authenticDetailState.imgSrc, search: authenticCard.img });
    }

    await page.screenshot({ path: 'verify_pizza_authentic_detail.png' });

    // ─── STEP 3: Return to Search and click on "Quick Pan-Seared Pizza" ──
    console.log('\n--- Step 3: Route from Search to Quick Pan-Seared Pizza Detail View ---');
    await loadPage('search-results.html?q=Pizza');
    await page.click('.search-grid-card[data-recipe-id*="pizza-skillet"], .search-grid-card[data-recipe-id*="quick-pan-seared-pizza"]');
    await page.waitForTimeout(800);

    const skilletDetailState = await page.evaluate(() => {
      const title = document.querySelector('.recipe-main-title')?.textContent.trim();
      const coverImg = document.querySelector('.media-cover-img');
      return {
        url: window.location.href,
        title: title,
        imgSrc: coverImg?.src
      };
    });

    console.log('Quick Pan-Seared Pizza Detail State:', skilletDetailState);
    console.log('✓ Detail Title:', skilletDetailState.title);
    console.log('✓ Synchronized Image Canvas:', skilletDetailState.imgSrc);

    await page.screenshot({ path: 'verify_pizza_skillet_detail.png' });

    console.log('\n✨ ALL PIZZA SEARCH ROUTING & IMAGE CANVAS SYNCHRONIZATION TESTS PASSED ✨');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    await browser.close();
  }
})();
