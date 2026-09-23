const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Click Privacy Policy link
  await page.click('#link-privacy-policy');
  await page.waitForSelector('#view-privacy-policy.view--active', { timeout: 3000 });

  const isViewVisible = await page.isVisible('#view-privacy-policy');
  console.log('1. Privacy Policy Sub-View Visible:', isViewVisible);

  // 1. Fixed Nav Bar
  const titleText = await page.$eval('#view-privacy-policy header h2', h2 => h2.textContent.trim());
  const hasBackBtn = await page.$eval('#btn-back-from-privacy', btn => !!btn);

  console.log('2. Nav Bar Title:', titleText);
  console.log('3. Back Arrow Present:', hasBackBtn);

  // 2. Summary Header Card
  const summaryText = await page.$eval('#view-privacy-policy p', p => p.textContent.trim());
  console.log('4. Summary Header Card Text:', summaryText);

  // 3. Section Headers
  const sectionHeaders = await page.$$eval('#view-privacy-policy h3', els => els.map(e => e.textContent.trim()));
  console.log('5. Section Headers:', sectionHeaders);

  // 4. Bullet Point Tokens (Neon Cyan)
  const tokenNames = await page.$$eval('#view-privacy-policy span.font-bold.text-\\[\\#3DF2E0\\]', els => els.map(e => e.textContent.trim()));
  console.log('6. Highlighted Bullet Tokens (#3DF2E0):', tokenNames);

  // 5. Test Back Navigation Click
  await page.click('#btn-back-from-privacy');
  await page.waitForTimeout(300);

  const isViewClosed = await page.$eval('#view-privacy-policy', el => !el.classList.contains('view--active'));
  console.log('7. Closed Cleanly on Back Arrow Click:', isViewClosed);

  await browser.close();
})();
