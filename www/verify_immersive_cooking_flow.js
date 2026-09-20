const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Simple HTTP server for clean web testing
const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/cooking-guide.html';
  const filePath = path.join(__dirname, reqPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath);
    const contentType = ext === '.html' ? 'text/html' : ext === '.css' ? 'text/css' : ext === '.js' ? 'application/javascript' : ext === '.png' ? 'image/png' : 'text/plain';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

server.listen(3999, async () => {
  console.log('--- STARTING IMMERSIVE COOKING MODE COMPREHENSIVE VERIFICATION ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 393, height: 852 } });

  try {
    // 1. Clear storage & Navigate
    await page.goto('http://localhost:3999/cooking-guide.html?recipe=sesame-chicken');
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'load' });

    console.log('\n[TEST 1] Verifying Visual Theme Swap & Contrast Tokens...');
    
    // Check Viewport canvas background
    const viewportBg = await page.locator('#viewport').evaluate(el => window.getComputedStyle(el).backgroundColor);
    console.log('  - Viewport Canvas Background:', viewportBg);
    if (viewportBg !== 'rgb(11, 15, 20)') throw new Error(`Expected rgb(11, 15, 20) but got ${viewportBg}`);

    // Check STEP 1 badge background and text color
    const badgeStyle = await page.locator('#step-badge-label').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color, text: el.textContent.trim() };
    });
    console.log('  - Step 1 Badge:', badgeStyle);
    if (badgeStyle.bg !== 'rgb(61, 242, 224)') throw new Error(`Expected cyan badge background but got ${badgeStyle.bg}`);
    if (badgeStyle.color !== 'rgb(11, 15, 20)') throw new Error(`Expected dark badge text but got ${badgeStyle.color}`);

    // Check Next Step button background and text color
    const nextBtnStyle = await page.locator('#btn-next-step').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { bg: cs.backgroundColor, color: cs.color, text: el.textContent.trim() };
    });
    console.log('  - Next Step Button resting state:', nextBtnStyle);
    if (nextBtnStyle.bg !== 'rgb(61, 242, 224)') throw new Error(`Expected cyan next button bg but got ${nextBtnStyle.bg}`);
    if (nextBtnStyle.color !== 'rgb(11, 15, 20)') throw new Error(`Expected dark next button text but got ${nextBtnStyle.color}`);

    // Check Voice Assistant HUD Button
    const voiceHudStyle = await page.locator('#btn-toggle-voice').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { border: cs.borderColor, color: cs.color };
    });
    console.log('  - Voice HUD Button styling:', voiceHudStyle);
    if (voiceHudStyle.color !== 'rgb(61, 242, 224)') throw new Error(`Expected cyan voice text but got ${voiceHudStyle.color}`);

    // Check Step 1 Text preservation
    const stepHeadline = await page.locator('#step-headline-text').textContent();
    const stepCounter = await page.locator('#step-counter-display').textContent();
    const stepTime = await page.locator('#step-time-label').textContent();
    console.log('  - Step 1 Headline:', stepHeadline.trim());
    console.log('  - Step 1 Counter:', stepCounter.trim());
    console.log('  - Step 1 Time:', stepTime.trim());
    if (!stepHeadline.includes('1. Prep & Coat the Chicken') && !stepHeadline.includes('1. Prep & Ingredient Mise en Place')) throw new Error('Step headline altered');
    if (!stepCounter.includes('STEP 1/4')) throw new Error('Step counter altered');
    if (!stepTime.includes('10 mins') && !stepTime.includes('9 mins')) throw new Error('Step time altered');

    // Take screenshot of resting Step 1
    await page.screenshot({ path: 'verify_cooking_step1_cyan.png' });
    console.log('  - Screenshot saved: verify_cooking_step1_cyan.png');

    console.log('\n[TEST 2] Verifying Tactile Hover Lift Mechanics...');
    // Hover over Start Timer button
    await page.hover('#btn-timer-toggle');
    await page.waitForTimeout(200);
    const timerHoverStyle = await page.locator('#btn-timer-toggle').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, shadow: cs.boxShadow, bg: cs.backgroundColor, color: cs.color };
    });
    console.log('  - Timer Button on Hover:', timerHoverStyle);
    if (!timerHoverStyle.transform.includes('matrix') && timerHoverStyle.transform === 'none') {
      throw new Error('Expected transform matrix on timer hover');
    }

    // Hover over Voice button
    await page.hover('#btn-toggle-voice');
    await page.waitForTimeout(200);
    const voiceHoverStyle = await page.locator('#btn-toggle-voice').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, shadow: cs.boxShadow };
    });
    console.log('  - Voice Button on Hover:', voiceHoverStyle);

    // Hover over Next Step button
    await page.hover('#btn-next-step');
    await page.waitForTimeout(200);
    const nextHoverStyle = await page.locator('#btn-next-step').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { transform: cs.transform, shadow: cs.boxShadow, color: cs.color };
    });
    console.log('  - Next Step Button on Hover:', nextHoverStyle);

    console.log('\n[TEST 3] Testing Step 2 Pro Paywall Interception Hook...');
    // Click Next Step on Step 1 (unpaid)
    await page.click('#btn-next-step');
    await page.waitForTimeout(300);

    // Verify Step 2 is blocked (counter remains STEP 1/4)
    const blockedCounter = await page.locator('#step-counter-display').textContent();
    console.log('  - Step counter after click:', blockedCounter.trim());
    if (!blockedCounter.includes('1/4')) throw new Error('Step 2 data should be blocked prior to payment');

    // Verify Paywall overlay is active
    const isPaywallActive = await page.evaluate(() => {
      const el = document.getElementById('cook-mode-paywall-overlay');
      return el && el.classList.contains('active');
    });
    console.log('  - Paywall Overlay active state:', isPaywallActive);
    if (!isPaywallActive) throw new Error('Paywall overlay must be triggered on Next Step');

    // Screenshot Paywall overlay
    await page.screenshot({ path: 'verify_cooking_paywall_overlay.png' });
    console.log('  - Screenshot saved: verify_cooking_paywall_overlay.png');

    console.log('\n[TEST 4] Testing Premium Subscription & Payment Gateway Workflow...');
    // Click UNLOCK FULL RECIPE to open payment gateway modal
    await page.click('#btn-unlock-cook-mode', { force: true });
    await page.waitForTimeout(400);

    const isPaymentGatewayOpen = await page.evaluate(() => {
      const el = document.getElementById('payment-gateway-modal');
      return el && !el.classList.contains('hidden');
    });
    console.log('  - Payment Gateway modal open:', isPaymentGatewayOpen);
    if (!isPaymentGatewayOpen) throw new Error('Payment gateway modal should be open');

    // Proceed to payment
    await page.click('#btn-process-final-payment', { force: true });
    console.log('  - Processing 1.2s secure bank verification...');
    await page.waitForTimeout(1600);

    // Success view rendered
    const isSuccessViewVisible = await page.evaluate(() => {
      const el = document.getElementById('neo-payment-success-view');
      return el && !el.classList.contains('hidden');
    });
    console.log('  - Emerald-Green Success View visible:', isSuccessViewVisible);
    if (!isSuccessViewVisible) throw new Error('Success view should be visible');

    // Click START COOKING
    await page.click('#btn-start-cooking-success', { force: true });
    await page.waitForTimeout(500);

    console.log('\n[TEST 5] Verifying Step Progression After Unlocking...');
    // Verify Step 2 is rendered and progress bar is 50%
    const step2Counter = await page.locator('#step-counter-display').textContent();
    const step2Headline = await page.locator('#step-headline-text').textContent();
    const progressWidth = await page.locator('#step-progress-fill').evaluate(el => el.style.width);
    console.log('  - Unlocked Step Counter:', step2Counter.trim());
    console.log('  - Unlocked Step Headline:', step2Headline.trim());
    console.log('  - Progress Bar Fill Width:', progressWidth);
    if (!step2Counter.includes('2/4')) throw new Error('Expected Step 2/4 after checkout');
    if (progressWidth !== '50%') throw new Error(`Expected progress width 50% but got ${progressWidth}`);

    // Verify progression through Step 3 and Step 4
    await page.click('#btn-next-step');
    await page.waitForTimeout(200);
    const step3Counter = await page.locator('#step-counter-display').textContent();
    console.log('  - Step 3 Counter:', step3Counter.trim());
    if (!step3Counter.includes('3/4')) throw new Error('Expected Step 3/4');

    await page.click('#btn-next-step');
    await page.waitForTimeout(200);
    const step4Counter = await page.locator('#step-counter-display').textContent();
    const finishLabel = await page.locator('#btn-next-label').textContent();
    console.log('  - Step 4 Counter:', step4Counter.trim());
    console.log('  - Finish Button Label:', finishLabel.trim());
    if (!step4Counter.includes('4/4')) throw new Error('Expected Step 4/4');

    // Complete cooking to launch celebration overlay
    await page.click('#btn-next-step');
    await page.waitForTimeout(400);

    const isCelebrationActive = await page.evaluate(() => {
      const el = document.getElementById('celebration-overlay');
      return el && el.classList.contains('active');
    });
    console.log('  - Celebration Overlay Active:', isCelebrationActive);
    if (!isCelebrationActive) throw new Error('Celebration overlay should be active');

    await page.screenshot({ path: 'verify_cooking_celebration_cyan.png' });
    console.log('  - Screenshot saved: verify_cooking_celebration_cyan.png');

    console.log('\n========================================');
    console.log('🎉 ALL IMMERSIVE COOKING FLOW VERIFICATION TESTS PASSED WITH 100% SUCCESS!');
    console.log('========================================');

  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
