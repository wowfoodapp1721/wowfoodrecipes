const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const filePath = 'file://' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1500);

  // 1. Initial State Check: #base-carb-subfilter-strip must be hidden by default
  const isHiddenInitially = await page.evaluate(() => {
    const strip = document.getElementById('base-carb-subfilter-strip');
    if (!strip) return false;
    const style = window.getComputedStyle(strip);
    return style.display === 'none' || strip.style.display === 'none';
  });
  console.log('Initial Masking State - #base-carb-subfilter-strip hidden by default:', isHiddenInitially);
  if (!isHiddenInitially) {
    console.error('FAIL: base-carb-subfilter-strip is not hidden initially!');
    process.exit(1);
  }

  // 2. Tier 1 Action: Click Base / Carb pill
  console.log('Clicking Base / Carb primary pill...');
  await page.evaluate(() => {
    const carbPill = document.getElementById('primary-pill-base-carb') || Array.from(document.querySelectorAll('.filter-pill')).find(el => el.textContent.trim().includes('Base / Carb'));
    if (carbPill) carbPill.click();
  });
  await page.waitForTimeout(1000);

  // Check subfilter strip is now visible and has 4 pills
  const subStripState = await page.evaluate(() => {
    const strip = document.getElementById('base-carb-subfilter-strip');
    const pills = Array.from(strip.querySelectorAll('.subfilter-pill'));
    return {
      visible: strip && (window.getComputedStyle(strip).display === 'flex' || strip.classList.contains('visible')),
      pillCount: pills.length,
      pillLabels: pills.map(p => p.innerText.trim().replace(/\s+/g, ' '))
    };
  });
  console.log('Tier 1 State - Base/Carb Sub-Strip:', subStripState);

  if (!subStripState.visible || subStripState.pillCount !== 4) {
    console.error('FAIL: Base/Carb sub-strip failed to open with 4 pills!');
    process.exit(1);
  }

  // 3. Tier 2 Action: Test Sub-Category 1: Rice-Based
  console.log('Testing Sub-Pill: Rice-Based...');
  await page.evaluate(() => {
    const p = document.querySelector('.subfilter-pill[data-carb-sub="rice-based"]');
    if (p) p.click();
  });
  await page.waitForTimeout(2000);

  const riceCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    return {
      count: cards.length,
      titles: cards.map(c => c.querySelector('.card-title') ? c.querySelector('.card-title').innerText : '')
    };
  });
  console.log('Rice-Based Cards rendered:', riceCards);
  if (riceCards.count !== 10 || !riceCards.titles.includes('Risotto alla Milanese')) {
    console.error('FAIL: Rice-Based 10 cards not rendered correctly!');
    process.exit(1);
  }

  // 4. Tier 2 Action: Test Sub-Pill 2: Flour & Pasta
  console.log('Testing Sub-Pill: Flour & Pasta...');
  await page.evaluate(() => {
    const p = document.querySelector('.subfilter-pill[data-carb-sub="flour-pasta"]');
    if (p) p.click();
  });
  await page.waitForTimeout(2000);

  const pastaCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    return {
      count: cards.length,
      titles: cards.map(c => c.querySelector('.card-title') ? c.querySelector('.card-title').innerText : '')
    };
  });
  console.log('Flour & Pasta Cards rendered:', pastaCards);
  if (pastaCards.count !== 10 || !pastaCards.titles.includes('Spaghetti Carbonara') || !pastaCards.titles.includes('Neapolitan Pizza')) {
    console.error('FAIL: Flour & Pasta 10 cards not rendered correctly!');
    process.exit(1);
  }

  // 5. Tier 2 Action: Test Sub-Pill 3: Potato-Centric
  console.log('Testing Sub-Pill: Potato-Centric...');
  await page.evaluate(() => {
    const p = document.querySelector('.subfilter-pill[data-carb-sub="potato-centric"]');
    if (p) p.click();
  });
  await page.waitForTimeout(2000);

  const potatoCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    return {
      count: cards.length,
      titles: cards.map(c => c.querySelector('.card-title') ? c.querySelector('.card-title').innerText : '')
    };
  });
  console.log('Potato-Centric Cards rendered:', potatoCards);
  if (potatoCards.count !== 10 || !potatoCards.titles.includes('Gnocchi di Patate') || !potatoCards.titles.includes('French Poutine')) {
    console.error('FAIL: Potato-Centric 10 cards not rendered correctly!');
    process.exit(1);
  }

  // 6. Tier 2 Action: Test Sub-Pill 4: Corn & Maize
  console.log('Testing Sub-Pill: Corn & Maize...');
  await page.evaluate(() => {
    const p = document.querySelector('.subfilter-pill[data-carb-sub="corn-maize"]');
    if (p) p.click();
  });
  await page.waitForTimeout(2000);

  const cornCards = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.recipe-card'));
    return {
      count: cards.length,
      titles: cards.map(c => c.querySelector('.card-title') ? c.querySelector('.card-title').innerText : '')
    };
  });
  console.log('Corn & Maize Cards rendered:', cornCards);
  if (cornCards.count !== 10 || !cornCards.titles.includes('Mexican Street Tacos') || !cornCards.titles.includes('Shrimp and Grits')) {
    console.error('FAIL: Corn & Maize 10 cards not rendered correctly!');
    process.exit(1);
  }

  // Capture screenshot of the subfilter row and top card
  await page.screenshot({ path: path.resolve(__dirname, 'verify_base_carb_screen.png') });
  console.log('SUCCESS: All 4 Base / Carb sub-groups (40 recipes total) verified flawlessly!');

  await browser.close();
  process.exit(0);
})();
