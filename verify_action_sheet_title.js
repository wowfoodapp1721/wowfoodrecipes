const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  await page.goto(fileUrl + '?recipe=spaghetti-carbonara', { waitUntil: 'domcontentloaded' });

  // Open the action sheet drawer (e.g. by clicking more icon in top bar or calling openActionSheet)
  await page.evaluate(() => {
    if (typeof openActionSheet === 'function') {
      openActionSheet();
    } else {
      document.getElementById('action-sheet-overlay').classList.add('open');
    }
  });

  await page.waitForSelector('#action-sheet-overlay.open');
  await page.waitForTimeout(300);

  const titleEl = await page.$('.action-sheet-title');
  const titleText = await titleEl.textContent();
  console.log('Action Sheet Title textContent:', titleText.trim());

  if (titleText.trim() !== 'RECIPE OPTIONS • WOW VAULT') {
    throw new Error(`Unexpected title: ${titleText}`);
  }

  await page.screenshot({ path: 'verify_action_sheet_wow_vault.png' });
  console.log('Saved verify_action_sheet_wow_vault.png');

  await browser.close();
  console.log('Verification passed successfully!');
})();
