const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Verification: Screen 5 Progressive 2-Step Authentication Flow...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  const page = await context.newPage();
  const authUrl = 'file:///' + path.resolve(__dirname, 'auth.html').replace(/\\/g, '/');
  console.log(`\n📄 [Step 1] Loading Auth Gate: ${authUrl}`);
  await page.goto(authUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // 1. Single Viewport Geometry Check (No Scrolling)
  const viewportMetrics = await page.$eval('#viewport', el => {
    return {
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      offsetHeight: el.offsetHeight
    };
  });
  console.log(`\n📐 Viewport Metrics: scrollHeight=${viewportMetrics.scrollHeight}px, clientHeight=${viewportMetrics.clientHeight}px`);
  if (viewportMetrics.scrollHeight > viewportMetrics.clientHeight) {
    throw new Error(`Viewport overflows vertically: scrollHeight (${viewportMetrics.scrollHeight}px) > clientHeight (${viewportMetrics.clientHeight}px)`);
  }
  console.log('   ✓ Single Viewport Fit Verified (0px vertical overflow)');

  // 2. Step 1 Initial View State Verification
  console.log('\n🔒 [Step 2] Testing Step 1 View State (Initial Layout)...');
  
  const stepBadgeText = await page.$eval('#auth-step-badge', el => el.textContent.trim());
  console.log(`   ✓ Step Badge: "${stepBadgeText}"`);
  if (!stepBadgeText.includes('STEP 1 OF 2')) {
    throw new Error(`Unexpected step badge: ${stepBadgeText}`);
  }

  const ctaButtonText1 = await page.$eval('#btn-cta-text', el => el.textContent.trim());
  console.log(`   ✓ Primary CTA Button Text: "${ctaButtonText1}"`);
  if (ctaButtonText1 !== 'CONTINUE TO VERIFY') {
    throw new Error(`Expected CTA text 'CONTINUE TO VERIFY', got '${ctaButtonText1}'`);
  }

  // Verify Name, Email, Password visible
  const nameVisible = await page.$eval('#auth-name-input', el => el.offsetParent !== null);
  const emailVisible = await page.$eval('#auth-email-input', el => el.offsetParent !== null);
  const pwdVisible = await page.$eval('#auth-password-input', el => el.offsetParent !== null);
  console.log(`   ✓ Step 1 Inputs Visible: Name=${nameVisible}, Email=${emailVisible}, Password=${pwdVisible}`);
  if (!nameVisible || !emailVisible || !pwdVisible) {
    throw new Error('Step 1 input fields are not all visible');
  }

  // Verify Mobile, OTP, Biometrics are hidden in Step 1
  const phoneVisible1 = await page.$eval('#auth-phone-input', el => el.offsetParent !== null);
  const otpVisible1 = await page.$eval('#otp-container', el => el.offsetParent !== null);
  const bioVisible1 = await page.$eval('#btn-biometric-auth', el => el.offsetParent !== null);
  console.log(`   ✓ Step 2 Inputs Hidden: Phone=${!phoneVisible1}, OTP Grid=${!otpVisible1}, Biometrics=${!bioVisible1}`);
  if (phoneVisible1 || otpVisible1 || bioVisible1) {
    throw new Error('Step 2 input fields should be hidden in Step 1');
  }

  // Test Typing into Step 1 Inputs
  await page.fill('#auth-name-input', 'Sarah Jenkins');
  await page.fill('#auth-email-input', 'sarah.jenkins@epicure.io');
  await page.fill('#auth-password-input', 'EpicureGourmet2026!');

  // 3. Step 2 Dynamic Transition Verification
  console.log('\n🔄 [Step 3] Clicking "CONTINUE TO VERIFY →" to trigger Step 2 toggle...');
  await page.click('#btn-activate-account');
  await page.waitForTimeout(350);

  const stepBadgeText2 = await page.$eval('#auth-step-badge', el => el.textContent.trim());
  console.log(`   ✓ Step 2 Badge: "${stepBadgeText2}"`);
  if (!stepBadgeText2.includes('STEP 2 OF 2')) {
    throw new Error(`Unexpected step badge for step 2: ${stepBadgeText2}`);
  }

  const ctaButtonText2 = await page.$eval('#btn-cta-text', el => el.textContent.trim());
  console.log(`   ✓ Primary CTA Button Text in Step 2: "${ctaButtonText2}"`);
  if (ctaButtonText2 !== 'ACTIVATE SECURE ACCOUNT') {
    throw new Error(`Expected CTA text 'ACTIVATE SECURE ACCOUNT', got '${ctaButtonText2}'`);
  }

  // Verify Step 1 fields are now hidden
  const nameVisible2 = await page.$eval('#auth-name-input', el => el.offsetParent !== null);
  const emailVisible2 = await page.$eval('#auth-email-input', el => el.offsetParent !== null);
  const pwdVisible2 = await page.$eval('#auth-password-input', el => el.offsetParent !== null);
  console.log(`   ✓ Step 1 Inputs Hidden: Name=${!nameVisible2}, Email=${!emailVisible2}, Password=${!pwdVisible2}`);
  if (nameVisible2 || emailVisible2 || pwdVisible2) {
    throw new Error('Step 1 fields should be hidden in Step 2');
  }

  // Verify Step 2 fields are now visible
  const phoneVisible2 = await page.$eval('#auth-phone-input', el => el.offsetParent !== null);
  const otpVisible2 = await page.$eval('#otp-container', el => el.offsetParent !== null);
  const bioVisible2 = await page.$eval('#btn-biometric-auth', el => el.offsetParent !== null);
  console.log(`   ✓ Step 2 Inputs Visible: Phone=${phoneVisible2}, OTP Grid=${otpVisible2}, Biometrics=${bioVisible2}`);
  if (!phoneVisible2 || !otpVisible2 || !bioVisible2) {
    throw new Error('Step 2 fields should be visible in Step 2');
  }

  // 4. Test "Edit Credentials" Back Navigation
  console.log('\n🔙 [Step 4] Testing "Edit Credentials" button to return to Step 1...');
  await page.click('#btn-back-step1');
  await page.waitForTimeout(300);

  const step1BackBadge = await page.$eval('#auth-step-badge', el => el.textContent.trim());
  console.log(`   ✓ Returned to Step 1: "${step1BackBadge}"`);
  if (!step1BackBadge.includes('STEP 1 OF 2')) {
    throw new Error('Failed to return to Step 1');
  }

  // Return to Step 2 for final activation
  await page.click('#btn-activate-account');
  await page.waitForTimeout(300);

  // 5. Complete Authentication & Route to Screen 1A
  console.log('\n🚀 [Step 5] Clicking "ACTIVATE SECURE ACCOUNT →" to complete authentication...');
  await page.click('#btn-activate-account');
  await page.waitForTimeout(500);

  // Verify Session in localStorage
  const session = await page.evaluate(() => localStorage.getItem('wow_auth_session'));
  console.log(`   ✓ Stored Auth Session: ${session}`);
  if (!session || !session.includes('"authenticated":true')) {
    throw new Error('Auth session was not recorded in localStorage');
  }

  // Verify Redirection
  await page.waitForURL(/onboarding\.html/, { timeout: 4000 });
  console.log(`   ✓ Successfully navigated to Destination: ${page.url()}`);

  console.log('\n🎉 ALL PROGRESSIVE 2-STEP AUTHENTICATION TESTS PASSED WITH 100% SUCCESS!');
  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
