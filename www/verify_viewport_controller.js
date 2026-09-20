const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 STARTING AUDIT: Global Viewport Controller & Status Bar System');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  const page = await context.newPage();

  // ══════════════════════════════════════════════════════════════════════════
  // AUDIT ITEM 1: Class StandardStatusBarView Verification
  // ══════════════════════════════════════════════════════════════════════════
  console.log('📱 [Test 1] StandardStatusBarView on Home Dashboard (dashboard.html)...');
  await page.goto('file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#global-status-bar, .mock-status-bar');

  const dashboardBarVisible = await page.$eval('#global-status-bar, .mock-status-bar', el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none' && style.visibility !== 'hidden';
  });
  console.log(`   ✓ Dashboard Status Bar visible: ${dashboardBarVisible}`);
  if (!dashboardBarVisible) throw new Error('Status bar should be visible on dashboard.html');

  const timeString = await page.$eval('#status-bar-clock, .status-bar-time', el => el.textContent.trim());
  const iconCount = await page.$$eval('#global-status-bar .status-icon, .mock-status-bar .status-icon, .status-bar-icons span', els => els.length);
  console.log(`   ✓ Clock String: "${timeString}"`);
  console.log(`   ✓ Status Bar Icon Count (Cellular, Wi-Fi, Battery): ${iconCount}`);
  if (!timeString || iconCount < 3) throw new Error('Status bar elements missing on dashboard');

  console.log('\n📱 [Test 1.1] StandardStatusBarView on Screen 1A AI Personalization (onboarding.html)...');
  await page.goto('file:///' + path.resolve(__dirname, 'onboarding.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#global-status-bar, .mock-status-bar');

  const onboardingBarVisible = await page.$eval('#global-status-bar, .mock-status-bar', el => {
    const style = window.getComputedStyle(el);
    return style.display !== 'none';
  });
  console.log(`   ✓ Onboarding Status Bar visible: ${onboardingBarVisible}`);
  if (!onboardingBarVisible) throw new Error('Status bar should be visible on onboarding.html');

  // ══════════════════════════════════════════════════════════════════════════
  // AUDIT ITEM 2: Class ImmersiveFullScreenView Verification
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n🎯 [Test 2] ImmersiveFullScreenView on Hands-Free Cook Guide (cooking-guide.html)...');
  await page.goto('file:///' + path.resolve(__dirname, 'cooking-guide.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(100);

  const cookingBarHidden = await page.evaluate(() => {
    const el = document.getElementById('global-status-bar') || document.querySelector('.mock-status-bar');
    if (!el) return true;
    const style = window.getComputedStyle(el);
    return style.display === 'none' || style.visibility === 'hidden' || el.classList.contains('status-bar--hidden');
  });
  console.log(`   ✓ Status Bar successfully hidden on Cooking Guide: ${cookingBarHidden}`);
  if (!cookingBarHidden) throw new Error('Status bar should be hidden on cooking-guide.html');

  console.log('\n🎯 [Test 2.1] ImmersiveFullScreenView on AI Live Camera Scanner (scanner.html)...');
  await page.goto('file:///' + path.resolve(__dirname, 'scanner.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(100);

  const scannerBarHidden = await page.evaluate(() => {
    const el = document.getElementById('global-status-bar') || document.querySelector('.mock-status-bar');
    if (!el) return true;
    const style = window.getComputedStyle(el);
    return style.display === 'none' || style.visibility === 'hidden' || el.classList.contains('status-bar--hidden');
  });
  console.log(`   ✓ Status Bar successfully hidden on AI Camera Scanner: ${scannerBarHidden}`);
  if (!scannerBarHidden) throw new Error('Status bar should be hidden on scanner.html');

  console.log('\n🎯 [Test 2.2] ImmersiveFullScreenView on Print Preview Engine (recipe-print.html)...');
  await page.goto('file:///' + path.resolve(__dirname, 'recipe-print.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(100);

  const printBarHidden = await page.evaluate(() => {
    const el = document.getElementById('global-status-bar') || document.querySelector('.mock-status-bar');
    if (!el) return true;
    const style = window.getComputedStyle(el);
    return style.display === 'none' || style.visibility === 'hidden';
  });
  console.log(`   ✓ Status Bar successfully hidden on Print Preview: ${printBarHidden}`);
  if (!printBarHidden) throw new Error('Status bar should be hidden on recipe-print.html');

  // ══════════════════════════════════════════════════════════════════════════
  // AUDIT ITEM 3: Class InheritedDrawerOverlayView Verification
  // ══════════════════════════════════════════════════════════════════════════
  console.log('\n🗂️ [Test 3] InheritedDrawerOverlayView on wow Chef AI Drawer Overlay...');
  await page.goto('file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/'), { waitUntil: 'domcontentloaded' });

  // Trigger Chef AI Drawer
  await page.waitForSelector('#wow-chef-ai-fab, .wow-chef-ai-fab');
  await page.click('#wow-chef-ai-fab, .wow-chef-ai-fab');
  await page.waitForTimeout(200);

  const drawerIsOpen = await page.$eval('#wow-chef-ai-overlay', el => el.classList.contains('open'));
  const barContinuity = await page.evaluate(() => {
    const bar = document.getElementById('global-status-bar') || document.querySelector('.mock-status-bar');
    return bar && window.getComputedStyle(bar).display !== 'none';
  });
  console.log(`   ✓ Assistant Drawer opened: ${drawerIsOpen}`);
  console.log(`   ✓ Background Status Bar continuity maintained: ${barContinuity}`);
  if (!drawerIsOpen || !barContinuity) throw new Error('InheritedDrawerOverlayView failed continuity test');

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🏆 VIEWPORT CONTROLLER AUDIT: 100% OF CHECKS PASSED SUCCESSFULLY!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
})();
