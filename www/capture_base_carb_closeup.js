const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const filePath = 'file://' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click Base / Carb
  await page.evaluate(() => {
    const carbPill = document.getElementById('primary-pill-base-carb');
    if (carbPill) carbPill.click();
  });
  await page.waitForTimeout(800);

  // Click Rice-Based
  await page.evaluate(() => {
    const ricePill = document.querySelector('.subfilter-pill[data-carb-sub="rice-based"]');
    if (ricePill) ricePill.click();
  });
  await page.waitForTimeout(1200);

  // Scroll into view of filter section
  const section = await page.$('.filter-section');
  if (section) {
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const outPath = path.resolve(__dirname, 'verify_base_carb_filter_section.png');
    await section.screenshot({ path: outPath });
    console.log('Saved filter section screenshot to:', outPath);
  }

  // Scroll to first recipe card in feed
  const card = await page.$('.recipe-card');
  if (card) {
    await card.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const cardPath = path.resolve(__dirname, 'verify_base_carb_card.png');
    await card.screenshot({ path: cardPath });
    console.log('Saved card screenshot to:', cardPath);
  }

  await browser.close();
})();
