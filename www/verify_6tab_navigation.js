const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const filesToTest = [
    { file: 'dashboard.html', activeIndex: 0, activeName: 'Home' },
    { file: 'search-pantry.html', activeIndex: 1, activeName: 'Explore' },
    { file: 'collection.html', activeIndex: 3, activeName: 'Collection' },
    { file: 'chef-ai-showcase.html', activeIndex: 5, activeName: 'Pro Chef AI' },
    { file: 'social-feed.html', activeIndex: -1, activeName: 'None' },
    { file: 'search-results.html', activeIndex: 1, activeName: 'Explore' },
    { file: 'profile.html', activeIndex: -1, activeName: 'None' },
    { file: 'iot-settings.html', activeIndex: -1, activeName: 'None' },
    { file: 'meal-planner.html', activeIndex: -1, activeName: 'None' }
  ];

  const expectedTabs = [
    { label: 'Home', href: 'dashboard.html', icon: 'home' },
    { label: 'Explore', href: 'search-pantry.html', icon: 'explore' },
    { label: 'Pantry Scan', href: 'pantry_scan.html', icon: 'photo_camera' },
    { label: 'Collection', href: 'collection.html', icon: 'bookmark' },
    { label: 'Grocery', href: 'grocery.html', icon: 'shopping_cart' },
    { label: 'Pro Chef AI', href: 'chef-ai-showcase.html', icon: 'smart_toy' }
  ];

  console.log('=== VERIFYING 6-TAB NAVIGATION BAR ACROSS ALL APP LAYOUTS ===');

  for (const item of filesToTest) {
    const filePath = 'file:///' + path.resolve(__dirname, item.file).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });

    const nav = await page.$('#app-nav');
    if (!nav) {
      console.error(`❌ FAIL: #app-nav not found in ${item.file}`);
      process.exit(1);
    }

    const tabs = await page.$$('#app-nav .nav-tab');
    if (tabs.length !== 6) {
      console.error(`❌ FAIL: ${item.file} has ${tabs.length} tabs instead of 6`);
      process.exit(1);
    }

    for (let i = 0; i < 6; i++) {
      const tab = tabs[i];
      const labelEl = await tab.$('.nav-label');
      const iconEl = await tab.$('.material-symbols-outlined');
      const href = await tab.getAttribute('href');
      const labelText = labelEl ? (await labelEl.textContent()).trim() : '';
      const iconText = iconEl ? (await iconEl.textContent()).trim() : '';

      if (labelText !== expectedTabs[i].label) {
        console.error(`❌ FAIL: ${item.file} tab ${i} label is "${labelText}", expected "${expectedTabs[i].label}"`);
        process.exit(1);
      }
      if (href !== expectedTabs[i].href) {
        console.error(`❌ FAIL: ${item.file} tab ${i} href is "${href}", expected "${expectedTabs[i].href}"`);
        process.exit(1);
      }
      if (iconText !== expectedTabs[i].icon) {
        console.error(`❌ FAIL: ${item.file} tab ${i} icon is "${iconText}", expected "${expectedTabs[i].icon}"`);
        process.exit(1);
      }
    }

    console.log(`✅ PASS: ${item.file} has exactly 6 tabs in proper sequence with correct labels, icons, and hrefs.`);
  }

  // Specific check: Test Navigation from Dashboard -> Pantry Scan -> Collection
  console.log('\n=== TESTING USER ROUTING FLOW ===');
  const dashPath = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(dashPath, { waitUntil: 'load' });

  // Click Pantry Scan tab
  await page.click('#nav-scan');
  await page.waitForTimeout(400);
  console.log('Current URL after clicking Pantry Scan:', page.url());
  if (!page.url().includes('pantry_scan.html')) {
    console.error('❌ FAIL: Clicking #nav-scan did not navigate to pantry_scan.html');
    process.exit(1);
  }
  console.log('✅ PASS: Navigation from Dashboard to Pantry Scan verified.');

  // Take screenshot of Pantry Scan view
  await page.screenshot({ path: 'verify_pantry_scan_view.png' });

  // Go to Collection and verify active state
  const colPath = 'file:///' + path.resolve(__dirname, 'collection.html').replace(/\\/g, '/');
  await page.goto(colPath, { waitUntil: 'load' });
  const collectionActive = await page.$('#nav-collection.nav-tab--active');
  if (!collectionActive) {
    console.error('❌ FAIL: #nav-collection is not active on collection.html');
    process.exit(1);
  }
  console.log('✅ PASS: Collection tab active state verified on collection.html.');

  // Take screenshot of Collection with 6-tab nav bar
  await page.screenshot({ path: 'verify_collection_6tabs.png' });

  // Go to Dashboard and take screenshot with 6-tab nav bar
  await page.goto(dashPath, { waitUntil: 'load' });
  await page.screenshot({ path: 'verify_dashboard_6tabs.png' });

  console.log('\n🎉 ALL 6-TAB NAVIGATION VERIFICATIONS PASSED SUCCESSFULLY!');
  await browser.close();
})();
