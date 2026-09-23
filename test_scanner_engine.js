const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Unhide modal directly
  await page.$eval('#modal-appliance-sync', el => {
    el.classList.remove('hidden');
    el.setAttribute('aria-hidden', 'false');
  });

  await page.waitForSelector('#modal-appliance-sync:not(.hidden)', { timeout: 3000 });

  // Verify Steps text preservation
  const stepsTexts = await page.$$eval('#modal-appliance-sync h4', els => els.map(e => e.textContent.trim()));
  console.log('1. Step Headers Preserved:', stepsTexts);

  // 2. Verify Initial State of Radar Action Button
  const scanBtnTextInitial = await page.$eval('#btn-scan-local-appliances', btn => btn.textContent.trim());
  console.log('2. Radar Action Button Initial Text:', scanBtnTextInitial);

  // 3. Click Radar Action Button & verify Scanning State Animation
  await page.click('#btn-scan-local-appliances');
  await page.waitForTimeout(200);

  const scanBtnTextScanning = await page.$eval('#btn-scan-local-appliances', btn => btn.textContent.trim());
  const isScanningClassActive = await page.$eval('#btn-scan-local-appliances', btn => btn.classList.contains('radar-scanning-active'));

  console.log('3. Radar Action Button Scanning Text:', scanBtnTextScanning);
  console.log('4. Radar Scanning Active Class Applied:', isScanningClassActive);

  // 4. Wait for 4 seconds timeout resolution
  console.log('Waiting 4.2 seconds for scanner status resolution...');
  await page.waitForTimeout(4200);

  const scanBtnTextFinal = await page.$eval('#btn-scan-local-appliances', btn => btn.textContent.trim());
  const isScanningClassRemoved = await page.$eval('#btn-scan-local-appliances', btn => !btn.classList.contains('radar-scanning-active'));

  console.log('5. Radar Action Button Final Resolution Text:', scanBtnTextFinal);
  console.log('6. Radar Scanning Class Removed:', isScanningClassRemoved);

  await browser.close();
})();
