const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 420, height: 900 }
  });
  const page = await context.newPage();

  console.log('1. Loading profile.html...');
  await page.goto('http://localhost:3000/profile.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  console.log('2. Opening Paywall Modal (Go Pro Trigger)...');
  await page.evaluate(() => {
    if (window.openGoProCheckoutModal) {
      window.openGoProCheckoutModal();
    } else {
      document.getElementById('premium-plan-modal').classList.remove('hidden');
    }
  });
  await page.waitForTimeout(400);

  console.log('3. Clicking ACTIVATE YOUR PLAN button...');
  await page.click('#btn-activate-premium-plan');
  await page.waitForTimeout(600);

  console.log('4. Capturing Glassmorphic Payment Gateway Popup...');
  await page.screenshot({ path: 'screenshot_payment_modal_open.png' });

  console.log('5. Selecting PhonePe UPI method...');
  await page.click('[data-method="phonepe"]');
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'screenshot_payment_method_selected.png' });

  console.log('6. Clicking PROCEED TO SECURE PAYMENT 🔒 (Triggering 1.2s live bank check)...');
  await page.click('#btn-process-final-payment');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshot_payment_loading_state.png' });

  console.log('7. Waiting for Dynamic Emerald-Green Success View...');
  await page.waitForTimeout(1400);
  await page.screenshot({ path: 'screenshot_payment_success_view.png' });

  console.log('8. Clicking Start Cooking 🍳 button...');
  await page.click('#btn-start-cooking-success');
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'screenshot_after_payment_closed.png' });

  console.log('✅ Verification completed successfully!');
  await browser.close();
})();
