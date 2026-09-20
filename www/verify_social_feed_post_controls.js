const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('=== STARTING SOCIAL FEED POST CONTROLS & ACTION SHEET VERIFICATION ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 } // Pixel 7 standard mobile viewport
  });

  const page = await context.newPage();
  const feedUrl = 'file://' + path.resolve(__dirname, 'social-feed.html').replace(/\\/g, '/');

  console.log('1. Navigating to social feed screen:', feedUrl);
  await page.goto(feedUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1: THREE-DOTS BUTTONS DISCOVERY & MODAL SHEET REVEAL
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: Three-Dots Button Discovery & Action Sheet Activation ---');
  const moreBtns = page.locator('.more-opts-btn');
  const count = await moreBtns.count();
  console.log('  - Total Three-Dots Buttons Found:', count);
  assert(count >= 3, 'Should find multiple three-dots menu buttons on chef name plates');

  // Click the first three-dots button
  console.log('1.1 Clicking first three-dots icon on Chef Sarah card...');
  await moreBtns.first().click();
  await page.waitForTimeout(400);

  // Verify slide-up sheet is open
  const isSheetOpen = await page.evaluate(() => {
    const sheet = document.getElementById('wow-post-controls-sheet');
    const card = sheet ? sheet.querySelector('.post-controls-card') : null;
    return sheet && window.getComputedStyle(sheet).opacity === '1' && card && card.style.transform === 'translateY(0px)';
  });
  console.log('  - Post Controls Sheet Active & Open:', isSheetOpen);
  assert(isSheetOpen, 'Post Controls Sheet should be active with opacity 1 and translateY(0)');

  // Verify sheet title & options
  const sheetTitle = await page.locator('#wow-post-controls-sheet').textContent();
  console.log('  - Sheet Content Check (Contains "post controls"):', sheetTitle.includes('post controls'));
  assert(sheetTitle.includes('post controls'), 'Sheet must have "post controls" title');
  assert(sheetTitle.includes('Hide this Post'), 'Sheet must contain "Hide this Post" option');
  assert(sheetTitle.includes('Copy Recipe Link'), 'Sheet must contain "Copy Recipe Link" option');
  assert(sheetTitle.includes('Report Post'), 'Sheet must contain "Report Post" option');

  // Screenshot open sheet
  await page.screenshot({ path: 'verify_post_controls_sheet_open.png' });
  console.log('  - Screenshot saved: verify_post_controls_sheet_open.png');

  // Test dismiss via Cancel button
  console.log('1.2 Testing smooth dismissal via Cancel button...');
  await page.click('#btn-cancel-post-controls');
  await page.waitForTimeout(400);

  const isSheetClosedAfterCancel = await page.evaluate(() => {
    const sheet = document.getElementById('wow-post-controls-sheet');
    return sheet && (window.getComputedStyle(sheet).opacity === '0' || sheet.style.pointerEvents === 'none');
  });
  console.log('  - Post Controls Sheet Closed after Cancel:', isSheetClosedAfterCancel);
  assert(isSheetClosedAfterCancel, 'Sheet should close smoothly on cancel');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 2: COPY RECIPE LINK ACTION & TOAST NOTIFICATION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: "Copy Recipe Link" Interaction ---');
  await moreBtns.first().click();
  await page.waitForTimeout(350);

  console.log('2.1 Clicking "Copy Recipe Link" (#opt-copy-link)...');
  await page.click('#opt-copy-link');
  await page.waitForTimeout(250);

  // Check toast message
  const toastMsg = await page.locator('#toast-msg').textContent();
  const toastShown = await page.locator('#global-toast').evaluate(el => el.classList.contains('show'));
  console.log('  - Toast Alert Shown:', toastShown);
  console.log('  - Toast Message:', toastMsg);
  assert(toastMsg.includes('Link Copied'), 'Toast message should read "Link Copied!"');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3: REPORT POST ACTION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 3: "Report Post" Interaction ---');
  await moreBtns.nth(1).click();
  await page.waitForTimeout(350);

  console.log('3.1 Clicking "Report Post" (#opt-report-post)...');
  await page.click('#opt-report-post');
  await page.waitForTimeout(250);

  const reportToastMsg = await page.locator('#toast-msg').textContent();
  console.log('  - Report Toast Message:', reportToastMsg);
  assert(reportToastMsg.includes('reported'), 'Toast should confirm post report');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 4: HIDE THIS POST ACTION (SWIFT 200MS FADE & REMOVAL)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: "Hide this Post" Swift Removal Matrix ---');
  const initialPostCards = await page.locator('#feed-main .post-card').count();
  console.log('  - Initial Post Cards in DOM:', initialPostCards);

  const firstCardId = await page.locator('#feed-main .post-card').first().getAttribute('data-post-id');
  console.log('  - First Post Card ID to Hide:', firstCardId);

  // Click three-dots on first card
  await page.locator('#feed-main .post-card').first().locator('.more-opts-btn').click();
  await page.waitForTimeout(350);

  // Click Hide this Post
  console.log('4.1 Clicking "Hide this Post" (#opt-hide-post)...');
  await page.click('#opt-hide-post');

  // Wait 300ms for fade-out and DOM removal
  await page.waitForTimeout(350);

  const remainingPostCards = await page.locator('#feed-main .post-card').count();
  console.log('  - Remaining Post Cards in DOM:', remainingPostCards);
  assert(remainingPostCards === initialPostCards - 1, 'Post card should be removed from DOM');

  // Verify the hidden card is no longer present
  const isOldCardPresent = await page.locator(`.post-card[data-post-id="${firstCardId}"]`).count();
  console.log('  - Hidden Card Still in DOM count:', isOldCardPresent);
  assert(isOldCardPresent === 0, 'Hidden card must be completely purged from DOM');

  // Capture final screenshot
  await page.screenshot({ path: 'verify_post_controls_hidden_feed.png' });
  console.log('  - Screenshot saved: verify_post_controls_hidden_feed.png');

  console.log('\n=============================================================');
  console.log('🎉 ALL POST CONTROLS & ACTION SHEET TESTS PASSED 100%!');
  console.log('=============================================================');

  await browser.close();
})();
