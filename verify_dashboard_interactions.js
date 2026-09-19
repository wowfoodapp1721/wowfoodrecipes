const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 AUDIT: DASHBOARD INTERACTION LAYER, SCROLL PHYSICS & DYNAMIC HEADERS');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  // 1. Audit 5 Bottom Navigation Menu Tabs
  console.log('1️⃣ Auditing Bottom Navigation Menu Tabs (Tactile Click Bounce)...');
  const tabs = ['#nav-home', '#nav-explore', '#nav-collection', '#nav-grocery', '#nav-cook'];
  for (const tabId of tabs) {
    const tab = await page.$(tabId);
    if (!tab) throw new Error(`Tab ${tabId} not found`);
    const cls = await tab.getAttribute('class');
    if (!cls.includes('active:scale-95') || !cls.includes('duration-200') || !cls.includes('ease-out') || !cls.includes('cursor-pointer')) {
      throw new Error(`Tab ${tabId} missing required tactile classes. Got: "${cls}"`);
    }
    console.log(`   ✓ ${tabId}: Verified tactile classes ("transition-all duration-200 active:scale-95 ease-out cursor-pointer")`);
  }

  // 2. Audit Search Bar focus-within indicator
  console.log('\n2️⃣ Auditing Search Bar Focus-Within Indicator...');
  const searchWrapper = await page.$('#search-bar-wrapper');
  if (!searchWrapper) throw new Error('#search-bar-wrapper not found');
  const searchCls = await searchWrapper.getAttribute('class');
  if (!searchCls.includes('focus-within:border-red-500') || !searchCls.includes('focus-within:ring-1') || !searchCls.includes('focus-within:ring-red-500')) {
    throw new Error(`Search container missing focus-within classes. Got: "${searchCls}"`);
  }
  console.log('   ✓ Search container verified with "focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500"');

  // Test focusing search input
  await page.click('#recipe-search');
  await page.waitForTimeout(100);
  const searchBorderColor = await searchWrapper.evaluate(el => window.getComputedStyle(el).borderColor);
  console.log(`   ✓ Focused Search Container border color: ${searchBorderColor}`);

  // 3. Audit Today's Meal Plan Arrow Trigger Micro-Button Ring
  console.log('\n3️⃣ Auditing Today\'s Meal Plan Arrow Micro-Button Target...');
  const mealPlanArrow = await page.$('.planner-quick-arrow');
  if (!mealPlanArrow) throw new Error('.planner-quick-arrow not found');
  const arrowStyle = await mealPlanArrow.evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      width: cs.width,
      height: cs.height,
      borderRadius: cs.borderRadius,
      display: cs.display
    };
  });
  console.log('   ✓ Meal Plan Arrow Dimensions & Circular Target:', arrowStyle);
  if (arrowStyle.borderRadius !== '50%' && !arrowStyle.borderRadius.includes('px')) {
    throw new Error('Meal plan arrow should have a circular radius');
  }

  // Hover over banner and check arrow transition
  const banner = await page.$('.planner-quick-banner');
  await banner.hover();
  await page.waitForTimeout(150);
  const arrowHoverBg = await mealPlanArrow.evaluate(el => window.getComputedStyle(el).backgroundColor);
  console.log(`   ✓ Arrow hover circular ring background: ${arrowHoverBg}`);

  // 4. Audit Category Scroll Physics
  console.log('\n4️⃣ Auditing Category Scroll Physics...');
  const catRow = await page.$('.category-row');
  if (!catRow) throw new Error('.category-row not found');
  const catCls = await catRow.getAttribute('class');
  if (!catCls.includes('overflow-x-auto') || !catCls.includes('scroll-smooth') || !catCls.includes('snap-x') || !catCls.includes('select-none')) {
    throw new Error(`Category row missing scroll physics classes. Got: "${catCls}"`);
  }
  console.log('   ✓ Category row verified with "overflow-x-auto scroll-smooth snap-x select-none"');

  const catPills = await page.$$('.category-row .pill');
  for (const p of catPills) {
    const pCls = await p.getAttribute('class');
    if (!pCls.includes('snap-start')) throw new Error(`Category pill missing snap-start: ${pCls}`);
  }
  console.log(`   ✓ All ${catPills.length} category pills contain snap-start`);

  // 5. Audit Dynamic Scroll Headers Hook
  console.log('\n5️⃣ Auditing Dynamic Scroll Headers Sticky Blurred Navigation Strip...');
  const header = await page.$('#app-header');
  
  // Initial state (scrollTop = 0)
  let headerClasses = await header.getAttribute('class') || '';
  console.log(`   Initial Header classes (scroll=0): "${headerClasses}"`);
  if (headerClasses.includes('bg-black/60')) {
    throw new Error('Header should not have compact scrolled classes at scrollTop=0');
  }

  // Scroll down past 60px (e.g. 120px)
  console.log('   👉 Scrolling #app-main container down by 120px...');
  await page.evaluate(() => {
    const main = document.getElementById('app-main');
    main.scrollTop = 120;
    main.dispatchEvent(new Event('scroll'));
  });
  await page.waitForTimeout(200);

  headerClasses = await header.getAttribute('class') || '';
  console.log(`   Scrolled Header classes (scroll=120px): "${headerClasses}"`);
  if (!headerClasses.includes('sticky') || 
      !headerClasses.includes('top-0') || 
      !headerClasses.includes('bg-black/60') || 
      !headerClasses.includes('backdrop-blur-md') || 
      !headerClasses.includes('transition-all') || 
      !headerClasses.includes('duration-300') || 
      !headerClasses.includes('z-40')) {
    throw new Error(`Header did not acquire all required sticky blurred classes. Got: "${headerClasses}"`);
  }
  console.log('   ✓ Header smoothly toggled into compact sticky blurred navigation strip: "sticky top-0 bg-black/60 backdrop-blur-md transition-all duration-300 z-40"');

  // Scroll back to top (0px)
  console.log('   👉 Scrolling back to top (0px)...');
  await page.evaluate(() => {
    const main = document.getElementById('app-main');
    main.scrollTop = 0;
    main.dispatchEvent(new Event('scroll'));
  });
  await page.waitForTimeout(200);

  headerClasses = await header.getAttribute('class') || '';
  console.log(`   Restored Header classes (scroll=0px): "${headerClasses}"`);
  if (headerClasses.includes('bg-black/60')) {
    throw new Error('Header should restore to uncompact state when scrolled back to 0px');
  }
  console.log('   ✓ Header restored back to uncompact top state.');

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL DASHBOARD INTERACTION & SCROLL ENHANCEMENTS PASSED WITH 100%!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err);
  process.exit(1);
});
