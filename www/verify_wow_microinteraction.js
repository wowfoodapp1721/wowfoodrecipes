const { chromium } = require('playwright');
const path = require('path');

async function runVerification() {
  console.log('🚀 Starting Verification: Two-State Micro-Interaction & Pop-up Toast Component...');
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

    // Clear localStorage
    await page.evaluate(() => localStorage.removeItem('wow_saved_recipes'));

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 1: State A (Default Unsaved) Verification
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Testing State A (Default Unsaved) ---');
    const firstBtn = page.locator('#card-carbonara .wow-bookmark-btn');
    const textSpan = firstBtn.locator('.wow-btn-text');
    const checkSpan = firstBtn.locator('.wow-btn-check');

    const stateA = await firstBtn.evaluate(el => {
      const s = window.getComputedStyle(el);
      const textEl = el.querySelector('.wow-btn-text');
      const checkEl = el.querySelector('.wow-btn-check');
      const ts = textEl ? window.getComputedStyle(textEl) : {};
      const cs = checkEl ? window.getComputedStyle(checkEl) : {};
      return {
        bg: s.backgroundColor,
        borderRadius: s.borderRadius,
        textOpacity: ts.opacity,
        textScale: ts.transform,
        textString: textEl ? textEl.textContent.trim() : '',
        textColor: ts.color,
        checkOpacity: cs.opacity,
        hasSavedClass: el.classList.contains('saved')
      };
    });

    console.log('State A Styles:', stateA);

    // Verify State A Background (#FF5500 = rgb(255, 85, 0))
    if (stateA.bg !== 'rgb(255, 85, 0)') {
      console.error(`❌ Expected State A background rgb(255, 85, 0), got ${stateA.bg}`);
      passed = false;
    } else {
      console.log('✅ State A background is vibrant neon orange (#FF5500)');
    }

    if (stateA.textString !== 'wow' || stateA.textOpacity !== '1') {
      console.error(`❌ Expected text "wow" with opacity 1, got "${stateA.textString}" with opacity ${stateA.textOpacity}`);
      passed = false;
    } else {
      console.log('✅ State A displays bold white "wow" text string at opacity 1');
    }

    if (stateA.checkOpacity !== '0') {
      console.error(`❌ Checkmark should be hidden (opacity 0), got opacity ${stateA.checkOpacity}`);
      passed = false;
    } else {
      console.log('✅ State A checkmark icon is hidden (opacity: 0)');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 2: Tap to Trigger State B (Saved Collection State & Toast)
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Tapping Button to Trigger State B & Toast Notification ---');
    
    // Check navigation does not happen
    let navigated = false;
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame() && frame.url().includes('recipe-detail.html')) {
        navigated = true;
      }
    });

    await firstBtn.click();
    await page.waitForTimeout(350); // wait for 0.3s CSS transition

    if (navigated || page.url().includes('recipe-detail.html')) {
      console.error('❌ Tapping button triggered navigation! event.stopPropagation() failed.');
      passed = false;
    } else {
      console.log('✅ Event bubbling isolated: stayed on Dashboard');
    }

    const stateB = await firstBtn.evaluate(el => {
      const s = window.getComputedStyle(el);
      const textEl = el.querySelector('.wow-btn-text');
      const checkEl = el.querySelector('.wow-btn-check');
      const ts = textEl ? window.getComputedStyle(textEl) : {};
      const cs = checkEl ? window.getComputedStyle(checkEl) : {};
      return {
        bg: s.backgroundColor,
        textOpacity: ts.opacity,
        checkOpacity: cs.opacity,
        checkTransform: cs.transform,
        hasSavedClass: el.classList.contains('saved')
      };
    });

    console.log('State B Styles after 0.3s transition:', stateB);

    // Verify State B Background (#C9002B = rgb(201, 0, 43))
    if (stateB.bg !== 'rgb(201, 0, 43)') {
      console.error(`❌ Expected State B background deep crimson red rgb(201, 0, 43), got ${stateB.bg}`);
      passed = false;
    } else {
      console.log('✅ State B background morphed to deep crimson red (#C9002B)');
    }

    if (stateB.textOpacity !== '0') {
      console.error(`❌ "wow" text should be faded out (opacity 0), got ${stateB.textOpacity}`);
      passed = false;
    } else {
      console.log('✅ State B "wow" text is smoothly faded out (opacity: 0)');
    }

    if (stateB.checkOpacity !== '1') {
      console.error(`❌ Checkmark should be scaled up (opacity 1), got ${stateB.checkOpacity}`);
      passed = false;
    } else {
      console.log('✅ State B checkmark icon is smoothly scaled up and visible (opacity: 1)');
    }

    // Verify Toast Notification
    const toast = page.locator('#wow-toast-notification');
    const toastInfo = await toast.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        hasShowClass: el.classList.contains('show'),
        opacity: s.opacity,
        visibility: s.visibility,
        text: el.textContent.trim(),
        position: s.position,
        top: s.top,
        zIndex: s.zIndex,
        bg: s.backgroundColor,
        border: s.borderColor
      };
    });

    console.log('Toast Notification Properties:', toastInfo);

    if (!toastInfo.hasShowClass || toastInfo.opacity !== '1' || toastInfo.visibility !== 'visible') {
      console.error('❌ Toast notification is not visible with .show class');
      passed = false;
    } else {
      console.log('✅ Toast notification is visible (.show class, opacity: 1, visibility: visible)');
    }

    if (!toastInfo.text.includes('Saved to Collection!')) {
      console.error(`❌ Toast text should contain "Saved to Collection!", got "${toastInfo.text}"`);
      passed = false;
    } else {
      console.log('✅ Toast text is exactly "Saved to Collection!"');
    }

    if (toastInfo.position !== 'fixed' || toastInfo.top !== '24px' || parseInt(toastInfo.zIndex) < 9999) {
      console.error(`❌ Toast position/top/zIndex mismatch: position=${toastInfo.position}, top=${toastInfo.top}, zIndex=${toastInfo.zIndex}`);
      passed = false;
    } else {
      console.log('✅ Toast is fixed at top: 24px with z-index: 9999');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 3: Toast Auto-Dismissal After 2.5s
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Waiting for Toast 2.5s Auto-Dismissal ---');
    await page.waitForTimeout(2700); // 2.5s timer + 0.2s buffer

    const toastAfter2_5s = await toast.evaluate(el => {
      return {
        hasShowClass: el.classList.contains('show')
      };
    });

    if (toastAfter2_5s.hasShowClass) {
      console.error('❌ Toast notification still has .show class after 2.5s');
      passed = false;
    } else {
      console.log('✅ Toast notification auto-dismissed after 2.5s (.show removed)');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 4: Tap Again to Toggle Back to State A
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Tapping Button Again to Toggle Back to State A ---');
    await firstBtn.click();
    await page.waitForTimeout(350);

    const stateAToggled = await firstBtn.evaluate(el => {
      const s = window.getComputedStyle(el);
      const textEl = el.querySelector('.wow-btn-text');
      const checkEl = el.querySelector('.wow-btn-check');
      const ts = textEl ? window.getComputedStyle(textEl) : {};
      const cs = checkEl ? window.getComputedStyle(checkEl) : {};
      return {
        bg: s.backgroundColor,
        textOpacity: ts.opacity,
        checkOpacity: cs.opacity,
        hasSavedClass: el.classList.contains('saved')
      };
    });

    console.log('State A after toggle:', stateAToggled);

    if (stateAToggled.bg !== 'rgb(255, 85, 0)' || stateAToggled.hasSavedClass) {
      console.error('❌ Failed to toggle back to State A neon orange background');
      passed = false;
    } else {
      console.log('✅ Successfully toggled back to State A neon orange background (#FF5500)');
    }

    if (stateAToggled.textOpacity !== '1' || stateAToggled.checkOpacity !== '0') {
      console.error('❌ "wow" text should be visible (opacity 1) and checkmark hidden (opacity 0)');
      passed = false;
    } else {
      console.log('✅ "wow" text restored and checkmark hidden');
    }

    // ══════════════════════════════════════════════════════════════════════════
    // TEST 5: Search Results Grid Two-State & Toast Verification
    // ══════════════════════════════════════════════════════════════════════════
    console.log('\n--- Testing Search Results Screen Two-State Transition & Toast ---');
    const searchUrl = `file://${path.resolve(__dirname, 'search-results.html')}?q=pasta`;
    await page.goto(searchUrl, { waitUntil: 'load' });
    await page.waitForTimeout(600);

    const searchBtn = page.locator('#search-results-grid .search-grid-card .wow-bookmark-btn').first();
    await searchBtn.click();
    await page.waitForTimeout(350);

    const searchStateB = await searchBtn.evaluate(el => {
      const s = window.getComputedStyle(el);
      return {
        bg: s.backgroundColor,
        hasSavedClass: el.classList.contains('saved')
      };
    });

    if (searchStateB.bg !== 'rgb(201, 0, 43)' || !searchStateB.hasSavedClass) {
      console.error(`❌ Search card button failed to transition to State B: ${searchStateB.bg}`);
      passed = false;
    } else {
      console.log('✅ Search card button transitioned to deep crimson red State B');
    }

    const searchToast = page.locator('#wow-toast-notification');
    const searchToastVisible = await searchToast.evaluate(el => el.classList.contains('show'));
    if (!searchToastVisible) {
      console.error('❌ Toast notification did not show on search results page');
      passed = false;
    } else {
      console.log('✅ Toast notification showed on search results page');
    }

    // Take screenshot with Toast and State B button visible
    await page.goto(dashboardUrl, { waitUntil: 'load' });
    await page.waitForTimeout(400);
    const carbonaraBtn = page.locator('#card-carbonara .wow-bookmark-btn');
    await carbonaraBtn.click(); // Trigger State B and Toast
    await page.waitForTimeout(200);

    const screenshotPath = path.resolve(__dirname, 'screenshot_wow_microinteraction_toast.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`📸 Saved screenshot with Toast and State B to: ${screenshotPath}`);

  } catch (err) {
    console.error('Verification Error:', err);
    passed = false;
  } finally {
    await browser.close();
  }

  if (passed) {
    console.log('\n🎉 ALL TESTS PASSED: Two-State Micro-Interaction & Toast Component are 100% verified!');
    process.exit(0);
  } else {
    console.error('\n❌ SOME TESTS FAILED');
    process.exit(1);
  }
}

runVerification();
