const { chromium } = require('playwright');

(async () => {
  console.log('--- TESTING START COOKING SESSION TRANSITION & PAYWALL ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 393, height: 852 } });

  // 1. Visit recipe-detail.html for carbonara with cleared free tier
  await page.goto('http://localhost:3000/recipe-detail.html?recipe=carbonara');
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });

  // 2. Click the primary red "Start Cooking Session" button
  console.log('\n[TEST 1] Clicking red "Start Cooking Session" button...');
  const ctaBtn = page.locator('#start-cooking-action-btn');
  await ctaBtn.waitFor({ state: 'visible' });
  await ctaBtn.click();

  // Wait for navigation
  await page.waitForURL(/cooking-guide\.html/);
  console.log('  - Current URL after click:', page.url());
  if (!page.url().includes('cooking-guide.html?recipe=carbonara&step=1')) {
    throw new Error('Expected navigation to cooking-guide.html?recipe=carbonara&step=1');
  }

  // 3. Verify Step 1 is active on Screen 4A
  console.log('\n[TEST 2] Verifying Screen 4A Step 1 state...');
  const stepCounter = await page.locator('#step-counter-display').textContent();
  console.log('  - Step counter on load:', stepCounter.trim());
  if (!stepCounter.includes('1/4')) throw new Error('Expected Step 1/4');

  // 4. Test Free Tier protection when proceeding from Step 1 to Step 2
  console.log('\n[TEST 3] Free Tier User clicking "Next Step"...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(300);

  const isPaywallActive = await page.evaluate(() => {
    const el = document.getElementById('cook-mode-paywall-overlay');
    return el && el.classList.contains('active') && el.getAttribute('aria-hidden') === 'false';
  });
  console.log('  - Glassmorphic Paywall overlay active:', isPaywallActive);
  if (!isPaywallActive) throw new Error('Expected Glassmorphic Paywall to wake up and protect Step 2');

  await browser.close();
  console.log('\n🎉 VERIFICATION COMPLETE: Primary red action button & Glassmorphic Paywall protection verified successfully!');
})();
