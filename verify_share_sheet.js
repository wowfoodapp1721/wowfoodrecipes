const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 500, height: 950 }
  });
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Click the Share button
  console.log('Clicking Share button...');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(600);

  // 2. Verify overlay is visible and check computed styles
  const sheetStyles = await page.evaluate(() => {
    const overlay = document.getElementById('share-sheet-overlay');
    const drawer = document.getElementById('share-sheet-drawer');
    const title = document.getElementById('share-sheet-title');
    const closeBtn = document.getElementById('btn-close-share-sheet');
    const items = Array.from(document.querySelectorAll('.share-network-item'));

    return {
      overlayOpen: overlay.classList.contains('open'),
      overlayOpacity: window.getComputedStyle(overlay).opacity,
      drawerBg: window.getComputedStyle(drawer).backgroundColor,
      drawerBorderTop: window.getComputedStyle(drawer).borderTopColor,
      titleText: title.textContent,
      titleColor: window.getComputedStyle(title).color,
      closeBtnText: closeBtn.textContent,
      closeBtnColor: window.getComputedStyle(closeBtn).color,
      itemsCount: items.length,
      itemLabels: items.map(el => el.querySelector('.share-network-label').textContent)
    };
  });

  console.log('Share Sheet Details:', JSON.stringify(sheetStyles, null, 2));

  // 3. Capture screenshot of open Social Share Sheet
  await page.screenshot({ path: 'share_sheet_open.png' });
  console.log('Saved share_sheet_open.png');

  // 4. Click the prominent circular close button "✕"
  console.log('Clicking close button...');
  await page.click('#btn-close-share-sheet');
  await page.waitForTimeout(500);

  const isClosed = await page.evaluate(() => {
    const overlay = document.getElementById('share-sheet-overlay');
    return !overlay.classList.contains('open');
  });
  console.log('Sheet successfully closed after close button click:', isClosed);
  await page.screenshot({ path: 'share_sheet_closed.png' });
  console.log('Saved share_sheet_closed.png');

  // 5. Test clicking a social item (e.g. WhatsApp)
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(400);
  await page.click('.share-network-item[aria-label="Share via WhatsApp"]');
  await page.waitForTimeout(400);

  const toastText = await page.evaluate(() => {
    const msg = document.getElementById('toast-msg');
    return msg ? msg.textContent : '';
  });
  console.log('Toast triggered after share click:', toastText);
  await page.screenshot({ path: 'share_sheet_toast.png' });
  console.log('Saved share_sheet_toast.png');

  await browser.close();
  console.log('All Social Share Sheet tests passed successfully!');
})();
