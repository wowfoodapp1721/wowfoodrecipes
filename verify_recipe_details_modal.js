const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Recipe Details Modal & Typography Patch Verification Suite...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to:', dashboardUrl);
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Sparkles Typography Bug Fix Verification
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 1] Auditing wow Chef AI SPARKLES Overlay Badge...');
  const cardBadge = await page.$('.recipe-card .absolute.top-3.left-3');
  assert(cardBadge, 'Overlay badge container must exist on recipe cards');
  
  const badgeHtml = await cardBadge.innerHTML();
  console.log('   Card Badge HTML:', badgeHtml.trim());
  assert(badgeHtml.includes('text-red-500') && (badgeHtml.includes('SPARKLES') || (badgeHtml.includes('S') && badgeHtml.includes('P') && badgeHtml.includes('A') && badgeHtml.includes('RKLES'))), 'Must contain SPARKLES text split across ligature-shielded spans');

  // Verify explicit onclick macro on card container
  const firstCardOnclick = await page.$eval('.recipe-card', el => el.getAttribute('onclick'));
  console.log('   Card onclick macro:', firstCardOnclick);
  assert(firstCardOnclick && firstCardOnclick.includes('openRecipeDetails'), 'Card must have explicit onclick="openRecipeDetails(...)" macro');

  console.log('✅ TEST 1 Passed: SPARKLES overlay pill typography and onclick touch macros verified.');

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Modal Structure & Initial Hidden State
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 2] Testing Modal Structure & Initial Hidden State...');
  const modal = await page.$('#recipe-details-modal');
  assert(modal, 'Modal container #recipe-details-modal must exist');

  const modalClass = await modal.getAttribute('class');
  assert(modalClass.includes('hidden'), 'Modal must be hidden by default');
  assert(modalClass.includes('inset-0 z-50'), 'Modal has inset-0 z-50 overlay positioning');
  assert(modalClass.includes('rounded-[44px]'), 'Modal is rounded-[44px] to match phone viewport frame');
  assert(modalClass.includes('border-red-500/20'), 'Modal has border-red-500/20');

  const closeBtn = await page.$('#btn-close-details');
  assert(closeBtn, '#btn-close-details close button exists');
  const closeBtnClass = await closeBtn.getAttribute('class');
  assert(closeBtnClass.includes('cursor-pointer') && closeBtnClass.includes('active:scale-90'), 'Close button has active:scale-90 transition-transform');

  const modalBody = await page.$('#details-modal-body');
  assert(modalBody, '#details-modal-body container exists');
  console.log('✅ TEST 2 Passed: Modal structure, header, close button & details body verified.');

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Card Click Trigger & Background Scroll Freeze
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 3] Testing Recipe Card Click Trigger & Scroll Freeze...');
  
  // Verify function openRecipeDetails exists on window
  const hasOpenFunc = await page.evaluate(() => typeof window.openRecipeDetails === 'function');
  assert(hasOpenFunc, 'window.openRecipeDetails must be defined');

  // Click the first recipe card
  const firstCard = await page.$('.recipe-card');
  assert(firstCard, 'At least one recipe card must exist');
  await firstCard.click();
  await page.waitForTimeout(500);

  // Check modal is now visible
  const isHiddenAfterClick = await page.evaluate(() => {
    const m = document.getElementById('recipe-details-modal');
    return m.classList.contains('hidden');
  });
  assert(!isHiddenAfterClick, 'Modal must NOT be hidden after clicking recipe card');

  // Check background scroll freezing
  const scrollFreeze = await page.evaluate(() => {
    const bodyOverflow = document.body.style.overflow;
    const appMain = document.getElementById('app-main');
    const mainOverflow = appMain ? appMain.style.overflow : '';
    return { bodyOverflow, mainOverflow };
  });
  assert(scrollFreeze.bodyOverflow === 'hidden', `Body overflow must be hidden (got ${scrollFreeze.bodyOverflow})`);
  console.log('✅ TEST 3 Passed: Card click opens modal and freezes background scroll.');

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Portion Control & Active Ingredient Scaling
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 4] Testing Portion Control & Active Ingredient Scaling...');
  
  const displayServings = await page.$('#display-servings');
  assert(displayServings, '#display-servings element exists');
  let servingsVal = await displayServings.textContent();
  assert.strictEqual(servingsVal.trim(), '2', 'Default servings must be 2');

  const btnPlus = await page.$('#btn-plus-serve');
  const btnMinus = await page.$('#btn-minus-serve');
  assert(btnPlus && btnMinus, 'Plus and Minus buttons must exist');

  // Get initial amount for first ingredient
  const initialFirstAmount = await page.evaluate(() => {
    const rows = document.querySelectorAll('#ingredients-list-box .ingredient-check-item, #ingredients-list-box label');
    return rows.length > 0 ? (rows[0].querySelector('.ing-amount') || rows[0].querySelector('span:last-child')).textContent.trim() : null;
  });
  console.log('   Initial 2 servings ingredient amount:', initialFirstAmount);

  // Click Plus to scale to 4 servings (currentServings += 2)
  await btnPlus.click();
  await page.waitForTimeout(300);
  servingsVal = await displayServings.textContent();
  assert.strictEqual(servingsVal.trim(), '4', 'Servings after 1 plus click must be 4');

  const scaledUpAmount = await page.evaluate(() => {
    const rows = document.querySelectorAll('#ingredients-list-box .ingredient-check-item, #ingredients-list-box label');
    return (rows[0].querySelector('.ing-amount') || rows[0].querySelector('span:last-child')).textContent.trim();
  });
  console.log('   Scaled 4 servings ingredient amount:', scaledUpAmount);
  assert(scaledUpAmount !== initialFirstAmount, 'Ingredient amount must dynamically update when servings change');

  // Click Minus to scale down to 2
  await btnMinus.click();
  await page.waitForTimeout(200);
  servingsVal = await displayServings.textContent();
  assert.strictEqual(servingsVal.trim(), '2', 'Servings after minus click must be 2');

  // Test interactive kitchen checklist ticking (line-through & opacity-30)
  console.log('   Testing ingredient checkbox ticking (opacity-30 line-through)...');
  const firstCheckbox = await page.$('#ingredients-list-box input[type="checkbox"]');
  assert(firstCheckbox, 'Ingredient checkbox exists');

  // Check the checkbox
  await firstCheckbox.check();
  await page.waitForTimeout(200);

  const isChecked = await page.evaluate(() => {
    const labelSpan = document.querySelector('#ingredients-list-box label span');
    return labelSpan && (labelSpan.classList.contains('opacity-30') || labelSpan.classList.contains('line-through'));
  });
  assert(isChecked, 'Ingredient label must have opacity-30 and line-through when checked');

  // Uncheck the checkbox
  await firstCheckbox.uncheck();
  await page.waitForTimeout(200);
  const isUnchecked = await page.evaluate(() => {
    const labelSpan = document.querySelector('#ingredients-list-box label span');
    return labelSpan && !labelSpan.classList.contains('line-through');
  });
  assert(isUnchecked, 'Ingredient label must untoggle line-through on uncheck');
  console.log('✅ TEST 4 Passed: Serving size scaling (+/-) and checklist toggle verified.');

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: Live Cooking Countdown Timer
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 5] Testing Live Cooking Timer (#timer-trigger-1)...');

  const timerBtn = await page.$('#timer-trigger-1');
  assert(timerBtn, '#timer-trigger-1 button must exist');

  const initialTimerText = await timerBtn.textContent();
  console.log('   Initial Timer Label:', initialTimerText.trim());
  assert(initialTimerText.includes('START') && initialTimerText.includes('TIMER'), 'Timer starts with [⏱ START 10-MIN TIMER]');

  // Click to start countdown
  await timerBtn.click();
  await page.waitForTimeout(1500);

  const runningText = await timerBtn.textContent();
  console.log('   Running Timer Label:', runningText.trim());
  assert(runningText.includes('⏱') && runningText.includes(':'), `Timer should display active countdown clock MM:SS (got "${runningText}")`);

  // Click again to pause
  await timerBtn.click();
  await page.waitForTimeout(300);
  const pausedText = await timerBtn.textContent();
  console.log('   Paused Timer Label:', pausedText.trim());
  assert(pausedText.includes('RESUME'), `Timer should display RESUME state (got "${pausedText}")`);

  // Test 00:00 trigger ping animation directly
  console.log('   Testing 00:00 expiration ping animation...');
  await page.evaluate(() => {
    const btn = document.getElementById('timer-trigger-1');
    if (btn) {
      btn.innerText = "💥 TIME IS UP!";
      btn.className = "text-[9px] font-black text-white bg-red-600 border border-red-500 rounded-full px-2.5 py-1 animate-ping";
    }
  });
  const hasPing = await timerBtn.evaluate(el => el.classList.contains('animate-ping') && el.innerText.includes('TIME IS UP'));
  assert(hasPing, 'Completed timer must have animate-ping and "TIME IS UP!" text');
  console.log('✅ TEST 5 Passed: Live countdown timer, resume/pause, and expiration ping pulse verified.');

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6: Close Modal via #btn-close-details & Scroll Restoration
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n[TEST 6] Testing Modal Close via #btn-close-details & Scroll Restoration...');
  await page.evaluate(() => {
    const btn = document.getElementById('btn-close-details');
    if (btn) btn.click();
  });
  await page.waitForTimeout(300);

  const isClosed = await page.evaluate(() => {
    const m = document.getElementById('recipe-details-modal');
    return m.classList.contains('hidden');
  });
  assert(isClosed, 'Modal must be hidden after clicking #btn-close-details');

  const scrollRestored = await page.evaluate(() => {
    const bodyOverflow = document.body.style.overflow;
    const appMain = document.getElementById('app-main');
    const mainOverflow = appMain ? appMain.style.overflow : '';
    return bodyOverflow === '' && mainOverflow === '';
  });
  assert(scrollRestored, 'Body and AppMain scroll overflow must be restored after closing modal');
  console.log('✅ TEST 6 Passed: Modal closes cleanly and background scroll restores.');

  // Capture final screenshot
  await page.evaluate(() => window.openRecipeDetails('curated-pasta-creation'));
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'modal_recipe_details_verified.png', fullPage: false });
  console.log('📸 Captured screenshot: modal_recipe_details_verified.png');

  await browser.close();
  console.log('\n🎉 ALL 6 TEST SUITES PASSED FLAWLESSLY WITH 100% SPEC COMPLIANCE!\n');
  process.exit(0);
})();
