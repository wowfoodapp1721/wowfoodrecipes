const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const filePath = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // 1. Activate Poultry filter
  await page.click('#primary-pill-poultry');
  await page.waitForTimeout(300);

  // 2. Click Chicken subfilter
  await page.click('.subfilter-pill[data-poultry-sub="chicken"]');
  await page.waitForTimeout(800);

  // 3. Find Tandoori Chicken Skewers card
  const tandooriCardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#recipe-feed-container .recipe-card'));
    const tandoori = cards.find(c => c.innerText.includes('Tandoori Chicken Skewers'));
    if (!tandoori) return null;

    const img = tandoori.querySelector('img.card-photo');
    const computedImg = img ? window.getComputedStyle(img) : null;
    const badge = tandoori.querySelector('.bg-black\\/60, [class*="bg-black"]');

    return {
      title: tandoori.querySelector('h2, .card-title, [class*="font-bold"]')?.innerText,
      imgSrc: img ? img.getAttribute('src') : null,
      imgStyle: img ? img.getAttribute('style') : null,
      alt: img ? img.getAttribute('alt') : null,
      naturalWidth: img ? img.naturalWidth : 0,
      naturalHeight: img ? img.naturalHeight : 0,
      width: computedImg ? computedImg.width : null,
      height: computedImg ? computedImg.height : null,
      objectFit: computedImg ? computedImg.objectFit : null,
      backgroundColor: computedImg ? computedImg.backgroundColor : null,
      borderTopLeftRadius: computedImg ? computedImg.borderTopLeftRadius : null,
      borderTopRightRadius: computedImg ? computedImg.borderTopRightRadius : null,
      hasSparklesBadge: !!badge
    };
  });

  console.log('Tandoori Chicken Skewers Card Info:', tandooriCardInfo);

  if (
    tandooriCardInfo &&
    tandooriCardInfo.imgSrc === 'assets/images/poultry/tandoori_chicken.jpg' &&
    tandooriCardInfo.naturalWidth > 0 &&
    tandooriCardInfo.alt === ''
  ) {
    console.log('SUCCESS: Bulletproof local culinary image loaded with 100% perfection!');
  } else {
    console.error('FAILURE: Asset or attributes do not match expected criteria');
  }

  await browser.close();
})();
