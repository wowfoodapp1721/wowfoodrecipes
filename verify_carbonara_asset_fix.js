const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
  console.log('--- STARTING SPAGHETTI CARBONARA ASSET CORRECTION VALIDATION ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  // 1. Check Dashboard Card
  console.log('\n[TEST 1] Auditing Home Dashboard Card...');
  await page.goto('http://localhost:3000/dashboard.html');
  await page.waitForLoadState('networkidle');

  const cardImg = await page.$eval('#card-spaghetti-carbonara .card-photo, #card-carbonara .card-photo', el => el.getAttribute('src'));
  console.log('Dashboard Card Image Src:', cardImg);
  assert(cardImg.includes('assets/carbonara.png'), 'Dashboard card must use assets/carbonara.png');

  // 2. Navigate to recipe-detail.html
  console.log('\n[TEST 2] Navigating to Spaghetti Carbonara Recipe Detail...');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load' }),
    page.click('#card-spaghetti-carbonara, #card-carbonara')
  ]);

  console.log('Arrived at URL:', page.url());
  await page.waitForTimeout(500);

  // 3. Verify Header Image
  const headerImg = await page.$eval('.media-cover-img', el => el.getAttribute('src'));
  console.log('Recipe Detail Header Image Src:', headerImg);
  assert(headerImg.includes('assets/carbonara.png'), 'Header image must be assets/carbonara.png');

  const titleText = await page.$eval('.recipe-main-title', el => el.textContent.trim());
  console.log('Recipe Main Title:', titleText);

  // 4. Test Tab 0 (Ingredients)
  console.log('\n[TEST 3] Auditing Tab 0: Ingredients...');
  await page.click('#tab-btn-0');
  await page.waitForTimeout(200);
  const tab0HeaderImg = await page.$eval('.media-cover-img', el => el.getAttribute('src'));
  assert(tab0HeaderImg.includes('assets/carbonara.png'), 'Tab 0 header image must remain assets/carbonara.png');
  console.log('✓ Tab 0 Header image verified:', tab0HeaderImg);

  // 5. Test Tab 1 (Instructions)
  console.log('\n[TEST 4] Auditing Tab 1: Instructions...');
  await page.click('#tab-btn-1');
  await page.waitForTimeout(200);
  const tab1HeaderImg = await page.$eval('.media-cover-img', el => el.getAttribute('src'));
  assert(tab1HeaderImg.includes('assets/carbonara.png'), 'Tab 1 header image must remain assets/carbonara.png');

  const stepImgs = await page.$$eval('.instruction-step-card img', els => els.map(el => el.getAttribute('src')));
  console.log('Instruction Step Images:', stepImgs);
  stepImgs.forEach((src, idx) => {
    assert(src.includes('assets/carbonara.png'), `Step ${idx + 1} image must be assets/carbonara.png`);
  });
  console.log('✓ Tab 1 Header & Step images verified');

  // 6. Test Tab 2 (Health Score)
  console.log('\n[TEST 5] Auditing Tab 2: Health Score WOW MATRIX...');
  await page.click('#tab-btn-2');
  await page.waitForTimeout(200);
  const tab2HeaderImg = await page.$eval('.media-cover-img', el => el.getAttribute('src'));
  assert(tab2HeaderImg.includes('assets/carbonara.png'), 'Tab 2 header image must remain assets/carbonara.png');

  const healthScore = await page.$eval('.score-large', el => el.textContent.trim());
  console.log('Health score value:', healthScore);
  assert(healthScore.length > 0, 'Health score must be present');

  // 7. Verify Cooking Session CTA Button
  const ctaBtn = await page.$('.bottom-action-pill, #start-cooking-btn, a[onclick*="openCookingSession"], button[onclick*="openCookingSession"]');
  console.log('Start Cooking Session button present:', !!ctaBtn);

  // Capture verification screenshots
  await page.screenshot({ path: 'verified_carbonara_tab2_health.png' });
  await page.click('#tab-btn-0');
  await page.waitForTimeout(200);
  await page.screenshot({ path: 'verified_carbonara_tab0_ingredients.png' });

  await browser.close();
  console.log('\n🎉 ALL CARBONARA ASSET CORRECTION TESTS PASSED PERFECTLY!');
})();
