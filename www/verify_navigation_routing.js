const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Navigation Routing Verification Suite...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log('Navigating to Dashboard:', dashboardUrl);
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // 1. Audit bottom navigation tabs in dashboard.html
  console.log('\n[TEST 1] Auditing Bottom Navigation Links in dashboard.html...');
  const navTabs = await page.$$eval('#app-nav .nav-tab', tabs => tabs.map(t => ({
    id: t.id,
    href: t.getAttribute('href'),
    label: t.querySelector('.nav-label')?.textContent?.trim()
  })));

  console.log('   Found Navigation Tabs:', navTabs);
  assert.strictEqual(navTabs.length, 5, 'Must have 5 navigation tabs');

  const exploreTab = navTabs.find(t => t.id === 'nav-explore');
  assert(exploreTab, 'Explore tab must exist');
  assert.strictEqual(exploreTab.href, 'explore-pantry.html', 'Explore tab must route to explore-pantry.html');

  const collectionTab = navTabs.find(t => t.id === 'nav-collection');
  assert(collectionTab, 'Collection tab must exist');
  assert.strictEqual(collectionTab.href, 'collection.html', 'Collection tab must route to collection.html');

  const groceryTab = navTabs.find(t => t.id === 'nav-grocery');
  assert(groceryTab, 'Grocery tab must exist');
  assert.strictEqual(groceryTab.href, 'grocery.html', 'Grocery tab must route to grocery.html');

  const cookTab = navTabs.find(t => t.id === 'nav-cook');
  assert(cookTab, 'Cook tab must exist');
  assert.strictEqual(cookTab.href, 'cooking-guide.html', 'Cook tab must route to cooking-guide.html');
  console.log('✅ TEST 1 Passed: All 5 bottom navigation tabs correctly wired.');

  // 2. Audit explore-pantry.html top-left close trigger
  console.log('\n[TEST 2] Auditing Return Trigger inside explore-pantry.html...');
  const explorePantryUrl = 'file:///' + path.resolve(__dirname, 'explore-pantry.html').replace(/\\/g, '/');
  await page.goto(explorePantryUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  const closeBtn = await page.$('.top-camera-hud a[aria-label="Close Scanner"], .top-camera-hud a.hud-circle-btn');
  assert(closeBtn, 'Top-left close button in explore-pantry.html must exist');

  const closeHref = await closeBtn.getAttribute('href');
  console.log('   explore-pantry.html close button href:', closeHref);
  assert.strictEqual(closeHref, 'dashboard.html', 'Close button must route directly to dashboard.html');

  // Test clicking return link to verify navigation
  await Promise.all([
    page.waitForNavigation(),
    closeBtn.click()
  ]);
  const currentUrl = page.url();
  console.log('   Navigated back to:', currentUrl);
  assert(currentUrl.includes('dashboard.html'), 'Clicking close button must return to dashboard.html');
  console.log('✅ TEST 2 Passed: Return trigger successfully routes back to dashboard.html.');

  await browser.close();
  console.log('\n🎉 ALL NAVIGATION ROUTING AUDITS PASSED WITH 100% COMPLIANCE!');
})();
