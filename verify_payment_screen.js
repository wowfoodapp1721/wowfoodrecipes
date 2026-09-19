const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const filePath = path.join(__dirname, 'profile.html');
  await page.goto(`file://${filePath}`);
  await page.waitForTimeout(1000);

  // Open paywall modal then activate plan to open payment gateway modal
  await page.evaluate(() => {
    if (window.openGoProCheckoutModal) {
      window.openGoProCheckoutModal();
    }
  });
  await page.waitForTimeout(300);

  await page.click('#btn-activate-premium-plan');
  await page.waitForTimeout(600);

  // Take screenshot of the payment mode selection modal
  await page.screenshot({ path: 'payment_mode_neon_cyan_verified.png' });
  console.log('Screenshot saved to payment_mode_neon_cyan_verified.png');

  // Verify interactive switching to another gateway (e.g. PhonePe or Cards)
  await page.click('label[data-method="phonepe"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'payment_mode_phonepe_selected.png' });
  console.log('PhonePe selection screenshot saved');

  // Switch back to GPay
  await page.click('label[data-method="gpay"]');
  await page.waitForTimeout(300);

  await browser.close();
})();
