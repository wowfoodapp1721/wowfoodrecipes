const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const filePath = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // 1. Check initial state of subfilter strip
  const initialVisibility = await page.evaluate(() => {
    const el = document.getElementById('poultry-subfilter-strip');
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const poultryBtn = document.getElementById('primary-pill-poultry');
    return {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      height: rect.height,
      poultryActive: poultryBtn.classList.contains('active'),
      ariaExpanded: poultryBtn.getAttribute('aria-expanded'),
      ariaHidden: el.getAttribute('aria-hidden')
    };
  });
  console.log('1. Initial State Check:', initialVisibility);

  // 2. Click Poultry pill to activate
  await page.click('#primary-pill-poultry');
  await page.waitForTimeout(400);

  const activeVisibility = await page.evaluate(() => {
    const el = document.getElementById('poultry-subfilter-strip');
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const poultryBtn = document.getElementById('primary-pill-poultry');
    const applianceRow = document.querySelector('.filter-section .filter-scroll-row:last-of-type');
    const applianceRect = applianceRow ? applianceRow.getBoundingClientRect() : null;
    return {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      height: rect.height,
      poultryActive: poultryBtn.classList.contains('active'),
      ariaExpanded: poultryBtn.getAttribute('aria-expanded'),
      ariaHidden: el.getAttribute('aria-hidden'),
      applianceTop: applianceRect ? applianceRect.top : null
    };
  });
  console.log('2. Active State Check (Poultry Clicked):', activeVisibility);

  // 3. Click Poultry pill again to deactivate
  await page.click('#primary-pill-poultry');
  await page.waitForTimeout(400);

  const deactivatedVisibility = await page.evaluate(() => {
    const el = document.getElementById('poultry-subfilter-strip');
    const style = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    const poultryBtn = document.getElementById('primary-pill-poultry');
    return {
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity,
      height: rect.height,
      poultryActive: poultryBtn.classList.contains('active'),
      ariaExpanded: poultryBtn.getAttribute('aria-expanded'),
      ariaHidden: el.getAttribute('aria-hidden')
    };
  });
  console.log('3. Deactivated State Check:', deactivatedVisibility);

  // 4. Click Poultry pill, then click Duck sub-filter, check recipe rendering
  await page.click('#primary-pill-poultry');
  await page.waitForTimeout(300);
  await page.click('.subfilter-pill[data-poultry-sub="duck"]');
  await page.waitForTimeout(600);

  const duckCards = await page.evaluate(() => {
    const cards = document.querySelectorAll('#recipe-feed-container .recipe-card');
    return {
      count: cards.length,
      titles: Array.from(cards).map(c => c.querySelector('.recipe-card__title')?.innerText || c.querySelector('h4')?.innerText)
    };
  });
  console.log('4. Duck sub-filter recipes rendered count:', duckCards.count);
  console.log('Sample titles:', duckCards.titles.slice(0, 3));

  await browser.close();
  console.log('Verification completed successfully!');
})();
