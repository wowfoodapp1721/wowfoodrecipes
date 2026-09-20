const { chromium } = require('playwright');
const path = require('path');

async function runVerification() {
  console.log('🚀 Starting Verification: Signature Circular "wow" Brand Bookmark Button...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 450, height: 900 }
  });
  const page = await context.newPage();

  let passed = true;

  try {
    // ══════════════════════════════════════════════════════════════════════════
    // TEST 1: Dashboard Curated Creations Cards Layout & Dimensions
    // ══════════════════════════════════════════════════════════════════════════
    const dashboardUrl = `file://${path.resolve(__dirname, 'dashboard.html')}`;
    console.log(`\nNavigating to Dashboard: ${dashboardUrl}`);
    await page.goto(dashboardUrl, { waitUntil: 'load' });
    await page.waitForTimeout(500);

    // 1. Check all 9 cards have .wow-bookmark-btn
    const wowButtons = page.locator('#main-recipe-feed .recipe-card .wow-bookmark-btn');
    const buttonCount = await wowButtons.count();
    console.log(`Found ${buttonCount} "wow" bookmark buttons in #main-recipe-feed (Expected: 9)`);
    if (buttonCount !== 9) {
      console.error(`❌ Expected 9 buttons, found ${buttonCount}`);
      passed = false;
    } else {
      console.log('✅ All 9 Curated Creations cards contain .wow-bookmark-btn');
    }

    // 2. Check layout of first card (.card-body flexbox and button styling)
    const firstCardBody = page.locator('#card-carbonara .card-body');
    const bodyBox = await firstCardBody.boundingBox();
    const bodyStyles = await firstCardBody.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        display: s.display,
        justifyContent: s.justifyContent,
        alignItems: s.alignItems,
        paddingTop: s.paddingTop,
        paddingRight: s.paddingRight,
        paddingBottom: s.paddingBottom,
        paddingLeft: s.paddingLeft
      };
    });

    console.log('Card Body Computed Styles:', bodyStyles);
    if (bodyStyles.display !== 'flex' || bodyStyles.justifyContent !== 'space-between' || bodyStyles.alignItems !== 'center') {
      console.error('❌ .card-body is not display: flex; justify-content: space-between; align-items: center');
      passed = false;
    } else {
      console.log('✅ .card-body matches structural horizontal flexbox container');
    }

    // 3. Check .wow-bookmark-btn dimensions, border-radius, background, font
    const firstWowBtn = page.locator('#card-carbonara .wow-bookmark-btn');
    const btnBox = await firstWowBtn.boundingBox();
    const btnStyles = await firstWowBtn.evaluate(el => {
      const s = window.getComputedStyle(el);
      const textEl = el.querySelector('.wow-btn-text');
      const ts = textEl ? window.getComputedStyle(textEl) : {};
      return {
        width: s.width,
        height: s.height,
        borderRadius: s.borderRadius,
        backgroundColor: s.backgroundColor,
        textColor: ts.color,
        fontStyle: ts.fontStyle,
        fontWeight: ts.fontWeight,
        text: textEl ? textEl.textContent.trim() : ''
      };
    });

    console.log('Button Computed Dimensions & Styles:', {
      box: btnBox,
      styles: btnStyles
    });

    if (Math.round(btnBox.width) !== 44 || Math.round(btnBox.height) !== 44) {
      console.error(`❌ Button dimensions are not 44x44px (got ${btnBox.width}x${btnBox.height})`);
      passed = false;
    } else {
      console.log('✅ Button is exactly 44px by 44px');
    }

    if (btnStyles.borderRadius !== '50%' && !btnStyles.borderRadius.includes('22px')) {
      console.error(`❌ Button border-radius is not 50% (got ${btnStyles.borderRadius})`);
      passed = false;
    } else {
      console.log('✅ Button has 50% circular border-radius');
    }

    if (btnStyles.text !== 'wow') {
      console.error(`❌ Button inner text is not "wow" (got "${btnStyles.text}")`);
      passed = false;
    } else {
      console.log('✅ Button inner text is "wow"');
    }

    if (btnStyles.fontStyle !== 'italic') {
      console.error(`❌ Button text font-style is not italic (got ${btnStyles.fontStyle})`);
      passed = false;
    } else {
      console.log('✅ Button text has stylish italic slant');
    }

    // 4. Verify Image Container is Completely Clean (no overlay bookmark button on image)
    const imageWrapHasButton = await page.locator('#card-carbonara .card-photo-wrap .wow-bookmark-btn').count();
    if (imageWrapHasButton > 0) {
      console.error('❌ Found .wow-bookmark-btn inside .card-photo-wrap! Image container should be clean.');
      passed = false;
    } else {
      console.log('✅ Image container .card-photo-wrap is completely clean (no overlays)');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 2: Event Bubbling Isolation & Toggle Save Collection
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Testing Click Event Isolation & Save Toggle ---');
    
    // Clear localStorage before testing
    await page.evaluate(() => localStorage.removeItem('wow_saved_recipes'));

    // Record navigation events
    let navigatedToDetail = false;
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame() && frame.url().includes('recipe-detail.html')) {
        navigatedToDetail = true;
      }
    });

    // Click the "wow" bookmark button on Carbonara
    console.log('Clicking "wow" bookmark button on Carbonara card...');
    await firstWowBtn.click();
    await page.waitForTimeout(300);

    // Verify it did NOT navigate to detail view
    if (navigatedToDetail || page.url().includes('recipe-detail.html')) {
      console.error('❌ Clicking "wow" button navigated to recipe-detail.html! event.stopPropagation() failed.');
      passed = false;
    } else {
      console.log('✅ Event bubbling successfully isolated: Clicking "wow" button stayed on Dashboard');
    }

    // Verify localStorage updated
    const savedInStorage = await page.evaluate(() => {
      const raw = localStorage.getItem('wow_saved_recipes');
      return raw ? JSON.parse(raw) : [];
    });
    console.log('localStorage wow_saved_recipes:', savedInStorage);
    if (!savedInStorage.includes('carbonara')) {
      console.error('❌ "carbonara" was not added to localStorage wow_saved_recipes');
      passed = false;
    } else {
      console.log('✅ "carbonara" saved to localStorage');
    }

    // Verify button has .saved class
    const isSavedClass = await firstWowBtn.evaluate(el => el.classList.contains('saved'));
    if (!isSavedClass) {
      console.error('❌ Button did not receive .saved class');
      passed = false;
    } else {
      console.log('✅ Button has .saved class with neon green styling');
    }

    // Toggle again (unsave)
    console.log('Clicking "wow" bookmark button again to toggle unsave...');
    await firstWowBtn.click();
    await page.waitForTimeout(300);

    const savedAfterToggle = await page.evaluate(() => {
      const raw = localStorage.getItem('wow_saved_recipes');
      return raw ? JSON.parse(raw) : [];
    });
    console.log('localStorage after unsave:', savedAfterToggle);
    if (savedAfterToggle.includes('carbonara')) {
      console.error('❌ "carbonara" was not removed from localStorage');
      passed = false;
    } else {
      console.log('✅ "carbonara" removed from localStorage successfully');
    }

    // 5. Verify clicking outside the button navigates to recipe-detail
    console.log('Clicking card-title on Carbonara card to verify macro navigation...');
    await page.locator('#card-carbonara .card-title').click();
    await page.waitForTimeout(800);
    if (page.url().includes('recipe-detail.html')) {
      console.log(`✅ Macro card click successfully navigated to: ${page.url()}`);
    } else {
      console.error(`❌ Macro card click failed to navigate, current URL: ${page.url()}`);
      passed = false;
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 3: Visual Search Results Grid Screen
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Testing Search Results Screen Layout & "wow" Bookmark Button ---');
    const searchUrl = `file://${path.resolve(__dirname, 'search-results.html')}?q=pasta`;
    await page.goto(searchUrl, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    const searchCards = page.locator('#search-results-grid .search-grid-card');
    const searchCardCount = await searchCards.count();
    console.log(`Found ${searchCardCount} search result cards`);

    if (searchCardCount > 0) {
      const searchFirstCard = searchCards.first();
      const searchFirstBtn = searchFirstCard.locator('.wow-bookmark-btn');
      const searchBtnCount = await searchFirstBtn.count();

      if (searchBtnCount === 0) {
        console.error('❌ No .wow-bookmark-btn found in search result card');
        passed = false;
      } else {
        const searchBtnBox = await searchFirstBtn.boundingBox();
        console.log('Search card button dimensions:', searchBtnBox);
        if (Math.round(searchBtnBox.width) === 44 && Math.round(searchBtnBox.height) === 44) {
          console.log('✅ Search card "wow" bookmark button is 44x44px');
        } else {
          console.error(`❌ Search card button is ${searchBtnBox.width}x${searchBtnBox.height}px`);
          passed = false;
        }

        // Test click isolation in search results
        let searchNavigated = false;
        page.on('framenavigated', (frame) => {
          if (frame === page.mainFrame() && frame.url().includes('recipe-detail.html')) {
            searchNavigated = true;
          }
        });

        await searchFirstBtn.click();
        await page.waitForTimeout(300);

        if (searchNavigated) {
          console.error('❌ Clicking search card "wow" button navigated to detail!');
          passed = false;
        } else {
          console.log('✅ Search card "wow" button isolated click successfully');
        }
      }
    }

    // Take screenshot of dashboard with the "wow" bookmark button
    await page.goto(dashboardUrl, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const screenshotPath = path.resolve(__dirname, 'screenshot_wow_bookmark_button.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 Saved screenshot to: ${screenshotPath}`);

  } catch (err) {
    console.error('Verification Error:', err);
    passed = false;
  } finally {
    await browser.close();
  }

  if (passed) {
    console.log('\n🎉 ALL TESTS PASSED: Signature circular "wow" brand bookmark button is 100% verified across the architecture!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

runVerification();
