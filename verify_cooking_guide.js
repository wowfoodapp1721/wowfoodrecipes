const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('--- PLAYWRIGHT COOKING GUIDE VERIFICATION SCRIPT START ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'cooking-guide.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);

  await page.goto(filePath, { waitUntil: 'load' });
  console.log('Page loaded successfully. Title:', await page.title());

  // 1. Verify Initial Step 1 State
  const initialStepCounter = await page.locator('#step-counter-display').textContent();
  const initialBadge = await page.locator('#step-badge-label').textContent();
  console.log('Initial Step Counter:', initialStepCounter.trim());
  console.log('Initial Step Badge:', initialBadge.trim());

  if (!initialStepCounter.includes('1/4')) {
    throw new Error('Expected Step 1/4 initially');
  }

  // 2. Advance to Step 2 (Intercepted by Paywall, then unlocked)
  console.log('Testing Next Step click on Step 1 (Paywall Intercept)...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(200);

  // Trigger unlock flow
  await page.click('#btn-unlock-cook-mode', { force: true });
  await page.waitForTimeout(300);
  await page.click('#btn-process-final-payment', { force: true });
  await page.waitForTimeout(1600);
  await page.click('#btn-start-cooking-success', { force: true });
  await page.waitForTimeout(400);

  const step2Counter = await page.locator('#step-counter-display').textContent();
  console.log('Step 2 Counter after unlock:', step2Counter.trim());
  if (!step2Counter.includes('2/4')) {
    throw new Error('Expected Step 2/4');
  }

  // 3. Test Timer on Step 2
  console.log('Starting timer on Step 2...');
  await page.click('#btn-timer-toggle');
  await page.waitForTimeout(200);

  const timerBtnText = await page.locator('#timer-btn-text').textContent();
  console.log('Timer Button Text while running:', timerBtnText.trim());

  // 4. Test Voice HUD button
  console.log('Toggling Voice Assistant HUD...');
  await page.click('#btn-toggle-voice');
  await page.waitForTimeout(200);

  const voiceStatus = await page.locator('#voice-status-text').textContent();
  console.log('Voice HUD Status Text:', voiceStatus.trim());

  // 5. Advance to Step 3 and Step 4
  console.log('Advancing to Step 3...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(200);

  console.log('Advancing to Step 4...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(200);

  const step4Counter = await page.locator('#step-counter-display').textContent();
  const finishBtnText = await page.locator('#btn-next-label').textContent();
  console.log('Step 4 Counter:', step4Counter.trim());
  console.log('Finish Button Label:', finishBtnText.trim());

  // 6. Click Finish button to trigger SCR-04D Celebration Overlay
  console.log('Clicking "Wow Cooking Done" to launch Celebration Flow...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(400);

  const isCelebrationActive = await page.evaluate(() => {
    const el = document.getElementById('celebration-overlay');
    return el && el.classList.contains('active');
  });
  console.log('SCR-04D Celebration Overlay Active State:', isCelebrationActive);

  if (!isCelebrationActive) {
    throw new Error('Expected celebration overlay to be active');
  }

  const celebrationHeadline = await page.locator('.celebration-headline').textContent();
  console.log('Celebration Headline:', celebrationHeadline.trim());

  const shareHref = await page.locator('#btn-share-celebration').getAttribute('href');
  console.log('Share Cook Destination Link:', shareHref);

  // 7. Verify calibration.html
  const calibPath = 'file:///' + path.resolve(__dirname, 'calibration.html').replace(/\\/g, '/');
  console.log('Navigating to calibration:', calibPath);
  await page.goto(calibPath, { waitUntil: 'load' });

  await page.click('#btn-run-calibration');
  await page.waitForTimeout(2000);

  const calibBtnText = await page.locator('#btn-run-calibration').textContent();
  console.log('Calibration Completed Button Text:', calibBtnText.trim());

  await browser.close();
  console.log('--- PLAYWRIGHT COOKING GUIDE VERIFICATION COMPLETED WITH 100% SUCCESS ---');
})();
