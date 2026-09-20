const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const filePath = 'file://' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // 1. Click on the Veggies pill
  console.log('Clicking Veggies pill...');
  await page.evaluate(() => {
    const veggiesPill = Array.from(document.querySelectorAll('.filter-pill-item, .category-pill, .filter-chip, [data-category]')).find(el => el.textContent.trim().includes('Veggies'));
    if (veggiesPill) veggiesPill.click();
  });
  await page.waitForTimeout(1500);

  // 2. Click Leafy Greens subfilter pill
  console.log('Clicking Leafy Greens subfilter pill...');
  await page.evaluate(() => {
    const leafyPill = Array.from(document.querySelectorAll('#veggies-subfilter-strip button, #veggies-subfilter-strip .subfilter-pill')).find(el => el.textContent.trim().includes('Leafy Greens'));
    if (leafyPill) leafyPill.click();
  });
  await page.waitForTimeout(2000);

  // 3. Find Sautéed Kale with Garlic card
  const kaleCardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    const kale = cards.find(c => c.innerText.includes('Sautéed Kale with Garlic') || c.innerText.includes('Sauteed Kale with Garlic'));
    if (!kale) return null;
    const img = kale.querySelector('.card-photo');
    const badge = kale.querySelector('.card-photo-wrap .absolute');
    return {
      title: kale.querySelector('.card-title') ? kale.querySelector('.card-title').innerText : '',
      imgSrc: img ? img.getAttribute('src') : null,
      fallback: img ? img.getAttribute('data-fallback') : null,
      style: img ? img.getAttribute('style') : null,
      classes: img ? img.className : '',
      hasChefBadge: !!badge,
      badgeText: badge ? badge.innerText : ''
    };
  });

  console.log('Sautéed Kale with Garlic Card Info:', kaleCardInfo);

  if (!kaleCardInfo) {
    console.error('FAIL: Sautéed Kale with Garlic card was not found in DOM!');
    await browser.close();
    process.exit(1);
  }

  const expectedUrl = "https://images.unsplash.com/photo-1524182576066-1be96137b395?auto=format&fit=crop&w=1200&q=80";
  if (kaleCardInfo.imgSrc === expectedUrl && kaleCardInfo.hasChefBadge) {
    console.log('SUCCESS: Sautéed Kale with Garlic visual data override is 100% verified and flawless!');
  } else {
    console.error('FAIL: Image src does not match expected URL! Got:', kaleCardInfo.imgSrc);
    await browser.close();
    process.exit(1);
  }

  await browser.close();
  process.exit(0);
})();
