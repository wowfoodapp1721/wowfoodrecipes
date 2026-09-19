const { chromium } = require('playwright');

(async () => {
  console.log('--- STARTING ULTRA-PREMIUM COOKING SUITE VERIFICATION ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 393, height: 852 } });

  // Clear local storage for clean free-tier test
  await page.goto('http://localhost:3000/cooking-guide.html');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });

  // TEST 1: Initial Free Tier Step 1 Verification
  console.log('\n[TEST 1] Auditing Step 1 Free Tier Initial State...');
  const stepCounter = await page.locator('#step-counter-display').textContent();
  console.log('  - Step counter:', stepCounter.trim());
  if (!stepCounter.includes('1/4')) throw new Error('Expected Step 1/4');

  // Verify timer interaction works on Step 1
  await page.click('#btn-timer-toggle');
  await page.waitForTimeout(200);
  const timerText = await page.locator('#timer-btn-text').textContent();
  console.log('  - Timer running on Step 1:', timerText.trim());

  // TEST 2: Glassmorphic Preview Gate Interception on Step 1 -> Step 2
  console.log('\n[TEST 2] Testing Paywall Interception on Next Step click...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(300);

  const isShieldActive = await page.evaluate(() => {
    const el = document.getElementById('cook-mode-paywall-overlay');
    return el && el.classList.contains('active');
  });
  console.log('  - Glassmorphic Preview Gate Shield active:', isShieldActive);
  if (!isShieldActive) throw new Error('Expected paywall shield to intercept transition');

  // TEST 3: Ultra-Premium Payment Modal Slide-Up
  console.log('\n[TEST 3] Testing UNLOCK FULL RECIPE to trigger payment modal...');
  await page.click('#btn-unlock-cook-mode', { force: true });
  await page.waitForTimeout(400);

  const isPaymentModalVisible = await page.evaluate(() => {
    const el = document.getElementById('payment-gateway-modal');
    return el && !el.classList.contains('hidden');
  });
  console.log('  - 2026 Payment Gateway Modal opened:', isPaymentModalVisible);
  if (!isPaymentModalVisible) throw new Error('Expected payment gateway modal to be visible');

  // Check UPI / Cards / Razorpay options exist
  const gatewayCardsCount = await page.locator('.neo-gateway-card').count();
  console.log('  - Payment gateway selection rows count:', gatewayCardsCount);
  if (gatewayCardsCount < 6) throw new Error('Expected at least 6 gateway cards');

  // TEST 4: 1.2-Second Bank Authentication & Emerald Success View Transition
  console.log('\n[TEST 4] Testing PROCEED TO SECURE PAYMENT & 1.2s Authentication Simulation...');
  await page.click('#btn-process-final-payment', { force: true });
  await page.waitForTimeout(1600);

  const isSuccessViewVisible = await page.evaluate(() => {
    const el = document.getElementById('neo-payment-success-view');
    return el && !el.classList.contains('hidden');
  });
  console.log('  - Emerald-Green Success View rendered:', isSuccessViewVisible);
  if (!isSuccessViewVisible) throw new Error('Expected Emerald Success View to be visible');

  const txnRef = await page.locator('#success-receipt-ref').textContent();
  console.log('  - Generated Secure Transaction Ref:', txnRef.trim());

  // TEST 5: Complete Workflow & Step 2 Progression
  console.log('\n[TEST 5] Clicking START COOKING to dismiss modals and advance to Step 2...');
  await page.click('#btn-start-cooking-success', { force: true });
  await page.waitForTimeout(600);

  const step2Counter = await page.locator('#step-counter-display').textContent();
  console.log('  - Unlocked Step Counter:', step2Counter.trim());
  if (!step2Counter.includes('2/4')) throw new Error('Expected Step 2/4 after unlocking');

  // TEST 6: Scale-on-Demand Dynamic Step Engine with Multi-Recipe URL Params
  console.log('\n[TEST 6] Testing Scale-on-Demand Dynamic Step Engine (Butter Chicken 6 Steps)...');
  await page.goto('http://localhost:3000/cooking-guide.html?recipe=butter-chicken');
  await page.waitForTimeout(300);

  const butterTitle = await page.locator('#label-recipe-title').textContent();
  const butterCounter = await page.locator('#step-counter-display').textContent();
  console.log('  - Dynamic Recipe Title:', butterTitle.trim());
  console.log('  - Dynamic Step Counter:', butterCounter.trim());
  if (!butterCounter.includes('1/6')) throw new Error('Expected Step 1/6 for Butter Chicken');

  // Advance through steps to completion
  for (let i = 1; i <= 5; i++) {
    await page.click('#btn-next-step', { force: true });
    await page.waitForTimeout(150);
  }
  const finalStepCounter = await page.locator('#step-counter-display').textContent();
  const finishBtnLabel = await page.locator('#btn-next-label').textContent();
  console.log('  - Final Step Counter:', finalStepCounter.trim());
  console.log('  - Finish Button Label:', finishBtnLabel.trim());

  // Finish recipe to launch celebration overlay
  await page.click('#btn-next-step', { force: true });
  await page.waitForTimeout(400);

  const isCelebrationActive = await page.evaluate(() => {
    const el = document.getElementById('celebration-overlay');
    return el && el.classList.contains('active');
  });
  console.log('  - Celebration Overlay Active:', isCelebrationActive);
  if (!isCelebrationActive) throw new Error('Expected celebration overlay on completion');

  await browser.close();
  console.log('\n🎉 ALL 6 ULTRA-PREMIUM FEATURE SUITE TESTS PASSED WITH 100% SUCCESS!');
})();
