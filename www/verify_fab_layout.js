const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🔍 Auditing Home Dashboard Floating Action Button (FAB) and Bottom Navigation Layout...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 450, height: 950 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  const page = await context.newPage();
  const dashUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(dashUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // Measure bounding boxes
  const vpBox = await page.$eval('#viewport', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  const fabBox = await page.$eval('#wow-chef-ai-fab', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  const navBox = await page.$eval('#app-nav', el => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });

  console.log(`Viewport: [${vpBox.width}x${vpBox.height}] at (${vpBox.x}, ${vpBox.y})`);
  console.log(`FAB:      [${fabBox.width}x${fabBox.height}] at (${fabBox.x}, ${fabBox.y})`);
  console.log(`Bottom Nav: [${navBox.width}x${navBox.height}] at (${navBox.x}, ${navBox.y})`);

  const fabBottomY = fabBox.y + fabBox.height;
  const navTopY = navBox.y;
  const verticalGap = navTopY - fabBottomY;
  console.log(`\n📏 Vertical Clearance: ${verticalGap.toFixed(1)}px (FAB bottom to Bottom Nav top)`);

  if (verticalGap < 20) {
    throw new Error(`Vertical clearance too small: ${verticalGap}px`);
  }

  const vpCenterX = vpBox.x + vpBox.width / 2;
  const fabCenterX = fabBox.x + fabBox.width / 2;
  const horizontalOffset = Math.abs(fabCenterX - vpCenterX);
  console.log(`🎯 Horizontal Alignment: offset from viewport center is ${horizontalOffset.toFixed(2)}px`);

  if (horizontalOffset > 1) {
    throw new Error(`FAB is not centered horizontally: offset=${horizontalOffset}px`);
  }

  // Test that all 5 bottom nav tabs are clickable without being intercepted by the FAB
  console.log('\n🔘 Testing clickability of all 5 Bottom Navigation tabs:');
  const tabs = ['#nav-home', '#nav-explore', '#nav-community', '#nav-grocery', '#nav-cook'];
  for (const tabSelector of tabs) {
    const tabEl = await page.$(tabSelector);
    const tabBox = await tabEl.boundingBox();
    console.log(`   - Checking ${tabSelector} at (${tabBox.x.toFixed(1)}, ${tabBox.y.toFixed(1)})...`);
    
    // Check if elementFromPoint at center of tab is the tab or child of tab
    const elemAtPoint = await page.evaluate(({x, y}) => {
      const el = document.elementFromPoint(x, y);
      return el ? (el.closest('.nav-tab') ? el.closest('.nav-tab').id : el.tagName + '.' + el.className) : null;
    }, { x: tabBox.x + tabBox.width/2, y: tabBox.y + tabBox.height/2 });
    
    console.log(`     Element at point: ${elemAtPoint}`);
    if (!elemAtPoint || !elemAtPoint.includes(tabSelector.replace('#', ''))) {
      throw new Error(`Tab ${tabSelector} is obstructed by ${elemAtPoint}`);
    }
  }

  console.log('\n✨ Testing clicking FAB opens the wow Chef AI assistant drawer:');
  await page.click('#wow-chef-ai-fab');
  await page.waitForTimeout(400);
  const isOpen = await page.$eval('#wow-chef-ai-overlay', el => el.classList.contains('open'));
  console.log(`   Drawer Open State: ${isOpen}`);
  if (!isOpen) {
    throw new Error('FAB click did not open drawer');
  }

  // Close drawer
  await page.click('#btn-close-chef-drawer');
  await page.waitForTimeout(300);

  // Capture screenshot for visual confirmation
  await page.screenshot({ path: 'assets/dashboard_fab_verified.png' });
  console.log('\n📸 Screenshot saved to assets/dashboard_fab_verified.png');
  console.log('✅ ALL FAB & BOTTOM NAVIGATION LAYOUT CHECKS PASSED PERFECTLY!');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
