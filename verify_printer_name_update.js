const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-print.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // Verify printer label
  const initialPrinter = await page.$eval('#printer-name-label', el => el.textContent.trim());
  console.log('Initial Printer Label:', initialPrinter);

  if (initialPrinter !== 'wow AirPrint Pro') {
    throw new Error(`Expected "wow AirPrint Pro", got "${initialPrinter}"`);
  }

  // Verify printer icon is cyan
  const iconColor = await page.$eval('.config-row:first-child .config-label .material-symbols-outlined', el => getComputedStyle(el).color);
  console.log('Printer Icon Color:', iconColor);

  // Click to cycle and verify cycling back to wow AirPrint Pro
  await page.click('#btn-select-printer');
  await page.waitForTimeout(100);
  const printer2 = await page.$eval('#printer-name-label', el => el.textContent.trim());
  console.log('Cycled Printer 2:', printer2);

  await page.click('#btn-select-printer');
  await page.waitForTimeout(100);
  const printer3 = await page.$eval('#printer-name-label', el => el.textContent.trim());
  console.log('Cycled Printer 3:', printer3);

  await page.click('#btn-select-printer');
  await page.waitForTimeout(100);
  const printerCycleBack = await page.$eval('#printer-name-label', el => el.textContent.trim());
  console.log('Cycled Back Printer:', printerCycleBack);

  if (printerCycleBack !== 'wow AirPrint Pro') {
    throw new Error(`Expected cycle back to "wow AirPrint Pro", got "${printerCycleBack}"`);
  }

  await page.screenshot({ path: 'verify_printer_name_update.png' });
  console.log('Saved verify_printer_name_update.png');

  console.log('Printer hardware device name update verified successfully!');
  await browser.close();
})();
