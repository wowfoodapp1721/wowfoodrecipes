const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl);
  await page.waitForTimeout(500);

  // Scroll to bottom of view-settings-base
  await page.evaluate(() => {
    const main = document.getElementById('view-settings-base');
    if (main) main.scrollTop = main.scrollHeight;
  });
  await page.waitForTimeout(400);

  // Take screenshot of default state
  await page.screenshot({ path: 'verify_signout_default.png' });
  console.log('Saved verify_signout_default.png');

  // Hover over the sign out capsule
  const signoutBtn = await page.$('#btn-signout-account');
  if (signoutBtn) {
    await signoutBtn.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'verify_signout_hover.png' });
    console.log('Saved verify_signout_hover.png');
  } else {
    console.error('Button #btn-signout-account not found!');
  }

  await browser.close();
})();
