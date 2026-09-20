const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Recipe Detail Tabs (3A, 3B, 3C) Refinements Verification...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 412, height: 915 }
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verify Tab Underline Controller Structure & Classes
  console.log('🔍 [1. Tab Layout Fluid Underline Controller Test]');
  const tabSlider = page.locator('#tab-slider');
  await tabSlider.waitFor({ state: 'attached' });
  const sliderClasses = await tabSlider.getAttribute('class');
  console.log(`   - Tab Slider classes: "${sliderClasses}"`);
  assert(sliderClasses.includes('transition-all'), 'Slider must include transition-all');
  assert(sliderClasses.includes('duration-300'), 'Slider must include duration-300');
  assert(sliderClasses.includes('ease-out'), 'Slider must include ease-out');
  assert(sliderClasses.includes('transform'), 'Slider must include transform');

  // Verify Tab 0 (Ingredients) default active
  const tab0 = page.locator('#tab-btn-0');
  const tab1 = page.locator('#tab-btn-1');
  const tab2 = page.locator('#tab-btn-2');

  const tab0Classes = await tab0.getAttribute('class');
  console.log(`   - Tab 0 active classes: "${tab0Classes}"`);
  assert(tab0Classes.includes('active'), 'Tab 0 should have active class initially');

  // Switch to Tab 1 (Instructions - 3B)
  console.log('   - Clicking Tab 1 (Instructions)...');
  await tab1.click();
  await page.waitForTimeout(400);

  const tab1ClassesAfter = await tab1.getAttribute('class');
  const tab0ClassesAfter = await tab0.getAttribute('class');
  const sliderTransform1 = await page.evaluate(() => document.getElementById('tab-slider').style.transform);
  console.log(`   - Tab 1 active classes: "${tab1ClassesAfter}"`);
  console.log(`   - Tab 0 classes after switch: "${tab0ClassesAfter}"`);
  console.log(`   - Slider transform: "${sliderTransform1}"`);

  assert(tab1ClassesAfter.includes('active'), 'Tab 1 should have active class after click');
  assert(tab1ClassesAfter.includes('text-white') && tab1ClassesAfter.includes('font-bold'), 'Tab 1 should have text-white font-bold');
  assert(!tab0ClassesAfter.includes('active'), 'Tab 0 should not be active');
  assert(sliderTransform1.includes('100%'), 'Slider transform should slide to 100%');

  // Switch to Tab 2 (Health Score - 3C)
  console.log('   - Clicking Tab 2 (Health Score)...');
  await tab2.click();
  await page.waitForTimeout(400);

  const tab2ClassesAfter = await tab2.getAttribute('class');
  const sliderTransform2 = await page.evaluate(() => document.getElementById('tab-slider').style.transform);
  console.log(`   - Tab 2 active classes: "${tab2ClassesAfter}"`);
  console.log(`   - Slider transform: "${sliderTransform2}"`);

  assert(tab2ClassesAfter.includes('active'), 'Tab 2 should have active class after click');
  assert(tab2ClassesAfter.includes('text-white') && tab2ClassesAfter.includes('font-bold'), 'Tab 2 should have text-white font-bold');
  assert(sliderTransform2.includes('200%'), 'Slider transform should slide to 200%');

  // 2. Verify Missing Images OnError Safeguard (Screen 3B)
  console.log('\n🔍 [2. Missing Images OnError Safeguard Test (Screen 3B)]');
  await tab1.click();
  await page.waitForTimeout(300);

  const stepImgWrappers = await page.locator('#tab-panel-1 .step-img-wrapper').all();
  console.log(`   - Found ${stepImgWrappers.length} step image wrappers in Screen 3B`);
  assert(stepImgWrappers.length > 0, 'Screen 3B must have step image wrappers');

  for (let i = 0; i < stepImgWrappers.length; i++) {
    const img = stepImgWrappers[i].locator('img');
    const onerrorAttr = await img.getAttribute('onerror');
    console.log(`   - Step img ${i + 1} onerror attribute: "${onerrorAttr}"`);
    assert(onerrorAttr && onerrorAttr.includes("this.parentNode.style.display='none'"), `Step img ${i + 1} must have onerror handler`);
  }

  // Test simulation of broken image onerror trigger
  const testBrokenImgResult = await page.evaluate(() => {
    const firstImg = document.querySelector('#tab-panel-1 .step-img-wrapper img');
    if (!firstImg) return { success: false, reason: 'img not found' };
    const parent = firstImg.parentNode;
    // trigger error event
    firstImg.dispatchEvent(new Event('error'));
    return {
      success: true,
      parentDisplay: parent.style.display
    };
  });
  console.log(`   - Broken img simulation result: parentDisplay = "${testBrokenImgResult.parentDisplay}"`);
  assert(testBrokenImgResult.parentDisplay === 'none', 'Image parent wrapper should hide with display: none on error');

  // 3. Verify Scroll Clearance Padding Enhancement (Screen 3C)
  console.log('\n🔍 [3. Scroll Clearance Padding Enhancement Test (Screen 3C)]');
  await tab2.click();
  await page.waitForTimeout(300);

  const panel2 = page.locator('#tab-panel-2');
  const panel2Classes = await panel2.getAttribute('class');
  const panel2Style = await panel2.getAttribute('style');
  console.log(`   - Tab panel 2 classes: "${panel2Classes}"`);
  console.log(`   - Tab panel 2 style: "${panel2Style}"`);

  assert(panel2Classes.includes('pb-28') || panel2Classes.includes('pb-32'), 'Tab panel 2 must have pb-28 or pb-32 class');

  // Verify Sodium row is scrollable clear above fixed footer
  const footerBox = await page.locator('#fixed-footer-action').boundingBox();
  console.log(`   - Fixed footer bounding box: top=${footerBox.y}, height=${footerBox.height}`);

  // Scroll to bottom of #scroll-content
  await page.evaluate(() => {
    const scrollEl = document.getElementById('scroll-content');
    scrollEl.scrollTop = scrollEl.scrollHeight;
  });
  await page.waitForTimeout(400);

  const sodiumRow = page.locator('.nutrition-row:has-text("Sodium")');
  const sodiumBox = await sodiumRow.boundingBox();
  console.log(`   - Sodium row bounding box after scroll to bottom: top=${sodiumBox.y}, bottom=${sodiumBox.y + sodiumBox.height}`);

  // Sodium row bottom must be above footer top (or fully in viewport)
  assert(sodiumBox.y + sodiumBox.height <= footerBox.y + 10, 'Sodium metrics row must be completely visible above the floating footer action bar');

  // Capture screenshot of Screen 3C scrolled with full clearance
  const screenshotPath = path.resolve(__dirname, 'screen_3c_scroll_clearance_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`   - Screenshot saved to: ${screenshotPath}`);

  await browser.close();
  console.log('\n✨ ALL TAB SWITCHING, ONERROR SAFEGUARDS, AND SCROLL CLEARANCE TESTS PASSED 100%!');
})();
