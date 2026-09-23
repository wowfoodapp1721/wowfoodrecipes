const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Unhide view-help-support directly
  await page.$eval('#view-help-support', el => {
    el.classList.add('view--active');
    el.setAttribute('aria-hidden', 'false');
  });

  await page.waitForSelector('#view-help-support.view--active', { timeout: 3000 });

  // Listen for dialog alert
  let alertMessage = '';
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    console.log('Captured Dialog Alert Message:', alertMessage);
    await dialog.accept();
  });

  // Click cardEmailSupport
  await page.click('#card-email-support');
  await page.waitForTimeout(500);

  const expectedMsg = "🚀 Mobile Intent Handshake Triggered! Target Box: support@wowfoodrecipes.com • Subject: Mobile Support Request • Action Status: Waiting for native phone compilation stack.";
  const isExactMatch = alertMessage === expectedMsg;

  console.log('1. Alert Message Captured:', alertMessage);
  console.log('2. Exact Alert Message Match:', isExactMatch);

  await browser.close();
})();
