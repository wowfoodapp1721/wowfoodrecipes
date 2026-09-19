const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('=== VERIFYING START COOKING TRANSITION & PROFILE WORKSPACE ===\n');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 420, height: 950 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('1. Loading profile.html...');
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Verify initial profile header
  const initialHeader = await page.locator('.header-page-title').textContent();
  console.log(`2. Initial header title: "${initialHeader.trim()}"`);

  // Trigger Go Pro / Paywall modal
  console.log('3. Opening paywall / payment modal...');
  const goProBtn = page.locator('button:has-text("Go Pro"), .pro-banner button, #btn-go-pro');
  if (await goProBtn.count() > 0) {
    await goProBtn.first().click();
    await page.waitForTimeout(400);
  }

  // Click proceed / plan on paywall modal
  const planBtn = page.locator('#plan-annual, .plan-card, button:has-text("ACTIVATE YOUR PLAN"), button:has-text("Subscribe"), #btn-activate-plan');
  if (await planBtn.count() > 0) {
    await planBtn.first().click();
    await page.waitForTimeout(400);
  }

  // Click Pay button to trigger payment success
  const payBtn = page.locator('#btn-pay-action, #btn-pay-now-action, #btn-confirm-razorpay-pay, #btn-pay-text');
  if (await payBtn.count() > 0) {
    console.log('4. Triggering payment completion...');
    await payBtn.first().click();
    // Wait for the simulated 1200ms processing delay
    await page.waitForTimeout(1600);
  }

  // Locate the green "START COOKING 🍳" button
  const startCookingBtn = page.locator('#btn-start-cooking-success');
  console.log('5. Start Cooking button count:', await startCookingBtn.count());
  const btnVisible = await startCookingBtn.isVisible();
  console.log('   Start Cooking button visible:', btnVisible);

  // Click START COOKING button
  console.log('6. Clicking START COOKING 🍳 button...');
  await startCookingBtn.click();
  await page.waitForTimeout(500);

  // Check localStorage and WowAppState
  const storageState = await page.evaluate(() => {
    return {
      wow_premium_user: localStorage.getItem('wow_premium_user'),
      wow_is_premium: localStorage.getItem('wow_is_premium'),
      vipStatus: window.WowAppState ? window.WowAppState.userSubscriptionVIP : null,
      toastVisible: (() => {
        const toast = document.getElementById('global-toast');
        return toast && toast.classList.contains('show');
      })(),
      toastMsg: (() => {
        const msg = document.getElementById('toast-msg');
        return msg ? msg.textContent : '';
      })(),
    };
  });

  console.log('7. Post-transition storage and state:', storageState);

  // Assertions
  if (storageState.wow_premium_user !== 'true') {
    throw new Error(`Expected wow_premium_user to be 'true', got '${storageState.wow_premium_user}'`);
  }
  if (storageState.wow_is_premium !== 'true') {
    throw new Error(`Expected wow_is_premium to be 'true', got '${storageState.wow_is_premium}'`);
  }
  if (storageState.toastMsg.includes('PREMIUM PRO CULINARY MASTERCLASS')) {
    throw new Error('Unwanted popup banner "PREMIUM PRO CULINARY MASTERCLASS" is still present!');
  }

  // Check that header is clean and profile is unobstructed
  const finalHeader = await page.locator('.header-page-title').textContent();
  console.log(`8. Profile header title after transition: "${finalHeader.trim()}"`);
  if (!finalHeader.includes('Profile & Settings')) {
    throw new Error(`Expected header title "Profile & Settings", got "${finalHeader}"`);
  }

  // Verify profile layout elements
  const avatarRing = page.locator('.avatar-glow-ring');
  console.log('9.  Avatar glow ring count:', await avatarRing.count());

  const profileName = page.locator('.profile-name');
  console.log('10. Profile name:', (await profileName.textContent()).trim());

  const dietaryCard = page.locator('.dietary-card');
  console.log('11. Dietary blueprint card count:', await dietaryCard.count());

  const macroCards = page.locator('.grid.grid-cols-3.gap-2 > div');
  console.log('12. 3 Floating Macro Cards count:', await macroCards.count());

  const settingsCard = page.locator('.rounded-3xl.p-4.flex.flex-col');
  console.log('13. Settings card count:', await settingsCard.count());

  // Capture screenshot of the cleanly unblocked profile workspace
  const screenshotPath = path.resolve(__dirname, 'clean_profile_workspace_after_start_cooking.png');
  await page.locator('#viewport').screenshot({ path: screenshotPath });
  console.log(`14. Clean profile workspace screenshot saved to: ${screenshotPath}`);

  await browser.close();
  console.log('\n=== ALL START COOKING TRANSITION CHECKS PASSED 100% ===');
})();
