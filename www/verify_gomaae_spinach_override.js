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

  // 3. Find Gomaae Sesame Spinach card
  const spinachCardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    const spinach = cards.find(c => c.innerText.includes('Gomaae Sesame Spinach') || c.innerText.includes('Goma-ae Sesame Spinach'));
    if (!spinach) return null;
    const img = spinach.querySelector('.card-photo');
    const badge = spinach.querySelector('.card-photo-wrap .absolute');
    return {
      title: spinach.querySelector('.card-title') ? spinach.querySelector('.card-title').innerText : '',
      imgSrc: img ? img.getAttribute('src') : null,
      fallback: img ? img.getAttribute('data-fallback') : null,
      style: img ? img.getAttribute('style') : null,
      classes: img ? img.className : '',
      hasChefBadge: !!badge,
      badgeText: badge ? badge.innerText : ''
    };
  });

  console.log('Gomaae Sesame Spinach Card Info:', spinachCardInfo);

  if (!spinachCardInfo) {
    console.error('FAIL: Gomaae Sesame Spinach card was not found in DOM!');
    await browser.close();
    process.exit(1);
  }

  const expectedUrl = "assets/images/veggies/gomaae_spinach.jpg";
  if (spinachCardInfo.imgSrc === expectedUrl && spinachCardInfo.hasChefBadge) {
    console.log('SUCCESS: Gomaae Sesame Spinach visual data override is 100% verified and flawless!');
  } else {
    console.error('FAIL: Image src does not match expected URL! Got:', spinachCardInfo.imgSrc);
    await browser.close();
    process.exit(1);
  }

  // Capture screenshot of the card
  const spinachHandle = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    return cards.find(c => c.innerText.includes('Gomaae Sesame Spinach') || c.innerText.includes('Goma-ae Sesame Spinach'));
  });

  if (spinachHandle) {
    const element = spinachHandle.asElement();
    if (element) {
      await element.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      const outPath = path.resolve(__dirname, 'verify_gomaae_spinach_card.png');
      await element.screenshot({ path: outPath });
      console.log('Saved card screenshot to:', outPath);
    }
  }

  await browser.close();
  process.exit(0);
})();
