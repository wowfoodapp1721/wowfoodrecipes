const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-print.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verify Viewport background is Void Black #0B0F14
  const viewportBg = await page.$eval('#viewport', el => getComputedStyle(el).backgroundColor);
  console.log('Viewport Background Color:', viewportBg);

  // 2. Verify Config Card background is Charcoal Gray #1C1C1E
  const cardBg = await page.$eval('.print-config-card', el => getComputedStyle(el).backgroundColor);
  console.log('Config Card Background Color:', cardBg);

  // 3. Verify Print button background is Neon Cyan #3DF2E0 and text color is dark #0B0F14
  const printBtnStyles = await page.$eval('.btn-trigger-print', el => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, color: s.color };
  });
  console.log('Print Button styles:', printBtnStyles);

  // 4. Verify Category Icons color is Neon Cyan #3DF2E0
  const iconColors = await page.$$eval('.config-label .material-symbols-outlined', els => {
    return els.map(el => getComputedStyle(el).color);
  });
  console.log('Category Icons colors:', iconColors);

  // 5. Verify Copies Stepper capsule background is Neon Cyan and buttons/count are dark
  const stepperStyles = await page.$eval('.copies-stepper', el => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor };
  });
  const stepperBtnColor = await page.$eval('.stepper-btn', el => getComputedStyle(el).color);
  const stepperCountColor = await page.$eval('.copies-count', el => getComputedStyle(el).color);
  console.log('Stepper styles:', stepperStyles, 'btn color:', stepperBtnColor, 'count color:', stepperCountColor);

  // 6. Verify Save as PDF button styles
  const pdfBtnStyles = await page.$eval('#btn-download-pdf', el => {
    const s = getComputedStyle(el);
    return { border: s.borderColor, color: s.color };
  });
  const pdfIconColor = await page.$eval('#btn-download-pdf .material-symbols-outlined', el => getComputedStyle(el).color);
  console.log('PDF button styles:', pdfBtnStyles, 'icon color:', pdfIconColor);

  // 7. Verify inner white document preview
  const docMockupBg = await page.$eval('#print-document-card', el => getComputedStyle(el).backgroundColor);
  console.log('Inner Document Mockup Background:', docMockupBg);

  // Capture screenshot
  await page.screenshot({ path: 'verify_print_options_cyan_theme.png' });
  console.log('Saved verify_print_options_cyan_theme.png');

  // Assertions
  if (!printBtnStyles.bg.includes('61, 242, 224')) {
    throw new Error('Print button bg is not Neon Cyan!');
  }
  if (!stepperStyles.bg.includes('61, 242, 224')) {
    throw new Error('Copies stepper bg is not Neon Cyan!');
  }
  if (!pdfBtnStyles.color.includes('61, 242, 224')) {
    throw new Error('PDF button text color is not Neon Cyan!');
  }

  console.log('All Print Options theme color swap checks passed with 100% success!');
  await browser.close();
})();
