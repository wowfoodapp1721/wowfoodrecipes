const { chromium } = require('playwright');

(async () => {
  console.log('--- AUDITING PRIME BONE-IN RIBEYE HEADER IMAGE ASSET ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 393, height: 852 } });

  // 1. Visit recipe-detail with recipe=ribeye
  await page.goto('http://localhost:3000/recipe-detail.html?recipe=ribeye');
  await page.waitForTimeout(300);

  // Helper to inspect the header image
  const getHeaderImageSrc = async () => {
    return await page.evaluate(() => {
      const img = document.querySelector('.media-cover-img');
      return img ? img.getAttribute('src') : null;
    });
  };

  // 2. Tab 1: Ingredients Tab (Default)
  console.log('\n[TEST 1] Auditing Header on Ingredients Tab (Tab 0)...');
  const tab0Img = await getHeaderImageSrc();
  console.log('  - Tab 0 Header Image Src:', tab0Img);
  if (!tab0Img || !tab0Img.includes('assets/ribeye.png')) {
    throw new Error(`Expected assets/ribeye.png on Tab 0, got: ${tab0Img}`);
  }

  // 3. Tab 2: Instructions Tab
  console.log('\n[TEST 2] Auditing Header on Instructions Tab (Tab 1)...');
  await page.click('#tab-btn-1');
  await page.waitForTimeout(200);
  const tab1Img = await getHeaderImageSrc();
  console.log('  - Tab 1 Header Image Src:', tab1Img);
  if (!tab1Img || !tab1Img.includes('assets/ribeye.png')) {
    throw new Error(`Expected assets/ribeye.png on Tab 1, got: ${tab1Img}`);
  }

  // 4. Tab 3: Health Score Tab
  console.log('\n[TEST 3] Auditing Header on Health Score Tab (Tab 2)...');
  await page.click('#tab-btn-2');
  await page.waitForTimeout(200);
  const tab2Img = await getHeaderImageSrc();
  console.log('  - Tab 2 Header Image Src:', tab2Img);
  if (!tab2Img || !tab2Img.includes('assets/ribeye.png')) {
    throw new Error(`Expected assets/ribeye.png on Tab 2, got: ${tab2Img}`);
  }

  // 5. Direct test via Dashboard click
  console.log('\n[TEST 4] Auditing Navigation from Home Dashboard Card...');
  await page.goto('http://localhost:3000/dashboard.html');
  await page.waitForTimeout(300);

  const ribeyeCard = page.locator('#card-ribeye, [data-recipe-id="ribeye"]');
  if (await ribeyeCard.count() > 0) {
    await ribeyeCard.first().click();
    await page.waitForURL(/recipe-detail\.html/);
    await page.waitForTimeout(300);
    const navImg = await getHeaderImageSrc();
    console.log('  - Header Image after Dashboard click:', navImg);
    if (!navImg || !navImg.includes('assets/ribeye.png')) {
      throw new Error(`Expected assets/ribeye.png after dashboard click, got: ${navImg}`);
    }
  }

  console.log('\n🎉 ALL TESTS PASSED: Prime Bone-In Ribeye header image strictly renders assets/ribeye.png across all sub-tabs!');
  await browser.close();
})();
