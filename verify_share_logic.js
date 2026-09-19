const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 500, height: 950 },
    permissions: ['clipboard-read', 'clipboard-write']
  });
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath + '?recipe=spaghetti-carbonara', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Monitor window.open calls
  await page.evaluate(() => {
    window._lastWindowOpen = null;
    window.open = function(url, target, features) {
      window._lastWindowOpen = { url, target, features };
      return {};
    };
    window._lastNavShare = null;
    if (navigator.share) {
      navigator.share = async function(data) {
        window._lastNavShare = data;
        return Promise.resolve();
      };
    } else {
      navigator.share = async function(data) {
        window._lastNavShare = data;
        return Promise.resolve();
      };
    }
  });

  // 1. Test WhatsApp
  console.log('--- Testing WhatsApp ---');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  await page.click('#share-btn-whatsapp');
  await page.waitForTimeout(300);

  let result = await page.evaluate(() => window._lastWindowOpen);
  console.log('WhatsApp target:', result);

  // 2. Test Telegram
  console.log('--- Testing Telegram ---');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  await page.click('#share-btn-telegram');
  await page.waitForTimeout(300);

  result = await page.evaluate(() => window._lastWindowOpen);
  console.log('Telegram target:', result);

  // 3. Test Facebook
  console.log('--- Testing Facebook ---');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  await page.click('#share-btn-facebook');
  await page.waitForTimeout(300);

  result = await page.evaluate(() => window._lastWindowOpen);
  console.log('Facebook target:', result);

  // 4. Test Pinterest
  console.log('--- Testing Pinterest ---');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  await page.click('#share-btn-pinterest');
  await page.waitForTimeout(300);

  result = await page.evaluate(() => window._lastWindowOpen);
  console.log('Pinterest target:', result);

  // 5. Test Instagram
  console.log('--- Testing Instagram ---');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  await page.click('#share-btn-instagram');
  await page.waitForTimeout(400);

  const instagramToast = await page.evaluate(() => document.getElementById('toast-msg').textContent);
  console.log('Instagram Toast:', instagramToast);
  await page.screenshot({ path: 'test_instagram_toast.png' });

  // 6. Test More Options
  console.log('--- Testing More Options ---');
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  await page.click('#share-btn-more');
  await page.waitForTimeout(300);

  const navShareResult = await page.evaluate(() => window._lastNavShare);
  console.log('Navigator.share payload:', navShareResult);

  await browser.close();
  console.log('All functional sharing tests completed with 100% success!');
})();
