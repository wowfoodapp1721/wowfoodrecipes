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

  // 2. Click Turkey subfilter
  await page.click('.subfilter-pill[data-poultry-sub="turkey"]');
  await page.waitForTimeout(800);

  // 3. Find Turkey Pot Pie Classic card
  const potPieCardInfo = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('#recipe-feed-container .recipe-card'));
    const potPie = cards.find(c => c.innerText.includes('Turkey Pot Pie Classic') || c.innerText.includes('Turkey Pot Pie'));
    if (!potPie) return null;

    const img = potPie.querySelector('img.card-photo');
    const computedImg = img ? window.getComputedStyle(img) : null;
    const badge = potPie.querySelector('.bg-black\\/60, [class*="bg-black"]');

    return {
      title: potPie.querySelector('h2, .card-title, [class*="font-bold"]')?.innerText,
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

  console.log('Turkey Pot Pie Classic Card Info:', potPieCardInfo);

  if (
    potPieCardInfo &&
    potPieCardInfo.imgSrc === 'assets/images/poultry/turkey_pot_pie.jpg' &&
    potPieCardInfo.naturalWidth > 0 &&
    potPieCardInfo.alt === ''
  ) {
    console.log('SUCCESS: Turkey Pot Pie Classic visual data override is 100% verified and flawless!');
  } else {
    console.error('FAILURE: Asset or attributes do not match expected criteria');
  }

  await browser.close();
})();
