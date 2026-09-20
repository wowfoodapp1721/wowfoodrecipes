const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const filePath = 'file://' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Click Veggies pill
  await page.evaluate(() => {
    const veggiesPill = Array.from(document.querySelectorAll('.filter-pill-item, .category-pill, .filter-chip, [data-category]')).find(el => el.textContent.trim().includes('Veggies'));
    if (veggiesPill) veggiesPill.click();
  });
  await page.waitForTimeout(1000);

  // Click Leafy Greens
  await page.evaluate(() => {
    const leafyPill = Array.from(document.querySelectorAll('#veggies-subfilter-strip button, #veggies-subfilter-strip .subfilter-pill')).find(el => el.textContent.trim().includes('Leafy Greens'));
    if (leafyPill) leafyPill.click();
  });
  await page.waitForTimeout(1500);

  // Scroll to Sautéed Kale card
  const kaleHandle = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    return cards.find(c => c.innerText.includes('Sautéed Kale with Garlic') || c.innerText.includes('Sauteed Kale with Garlic'));
  });

  if (kaleHandle) {
    const element = kaleHandle.asElement();
    if (element) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const outPath = path.resolve(__dirname, 'verify_sauteed_kale_card.png');
      await element.screenshot({ path: outPath });
      console.log('Saved card screenshot to:', outPath);
    }
  }

  await browser.close();
})();
