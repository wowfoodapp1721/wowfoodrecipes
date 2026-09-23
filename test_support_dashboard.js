const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const filePath = 'file:///' + path.resolve('profile.html').replace(/\\/g, '/');
  await page.goto(filePath);
  
  // 1. Open Help & Support
  await page.click('#btn-support-direct');
  await page.waitForTimeout(300);

  // 2. Click Online Chat -> opens Support Dashboard
  await page.click('#card-online-chat');
  await page.waitForTimeout(400);

  // 3. Click "How Does Appliance Sync Work?" card row
  await page.click('#card-faq-link');
  await page.waitForTimeout(400);

  // 4. Verify Modal Overlay
  const isModalVisible = await page.evaluate(() => !document.getElementById('modal-appliance-sync').classList.contains('hidden'));
  const modalTitle = await page.textContent('#modal-appliance-sync h3');

  const h4Texts = await page.$$eval('#modal-appliance-sync h4', els => els.map(e => e.textContent));
  const pTexts = await page.$$eval('#modal-appliance-sync p', els => els.map(e => e.textContent));

  console.log('1. Appliance Sync Modal Visible:', isModalVisible);
  console.log('2. Modal Title Text:', modalTitle);
  console.log('3. Step 1 Title:', h4Texts[0]);
  console.log('4. Step 1 Desc:', pTexts[0]);
  console.log('5. Step 2 Title:', h4Texts[1]);
  console.log('6. Step 2 Desc:', pTexts[1]);
  console.log('7. Step 3 Title:', h4Texts[2]);
  console.log('8. Step 3 Desc:', pTexts[2]);

  // 5. Test Close Button (✕)
  await page.click('#btn-close-sync-modal');
  await page.waitForTimeout(300);
  const isModalClosed = await page.evaluate(() => document.getElementById('modal-appliance-sync').classList.contains('hidden'));
  console.log('9. Appliance Sync Modal Closed Cleanly:', isModalClosed);

  await browser.close();
})();
