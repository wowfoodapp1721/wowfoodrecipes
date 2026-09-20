const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const filesToTest = [
    'dashboard.html',
    'collection.html',
    'search-pantry.html',
    'chef-ai-showcase.html',
    'social-feed.html',
    'search-results.html',
    'profile.html',
    'iot-settings.html',
    'meal-planner.html'
  ];

  const expectedLabels = [
    'Home',
    'Explore',
    'Pantry Scan',
    'Collection',
    'Grocery',
    'Pro Chef'
  ];

  console.log('=== VERIFYING TYPOGRAPHY & STRUCTURAL BASELINE LOCKING ACROSS ALL FILES ===\n');

  for (const file of filesToTest) {
    const filePath = 'file:///' + path.resolve(__dirname, file).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });

    const nav = await page.$('#app-nav');
    if (!nav) {
      console.error(`❌ FAIL: #app-nav not found in ${file}`);
      process.exit(1);
    }

    // Verify parent flexbox container alignment
    const navComputed = await page.evaluate(() => {
      const el = document.getElementById('app-nav');
      const style = window.getComputedStyle(el);
      return {
        display: style.display,
        alignItems: style.alignItems,
        justifyContent: style.justifyContent
      };
    });

    if (navComputed.display !== 'flex' || (navComputed.alignItems !== 'center' && navComputed.alignItems !== 'flex-end')) {
      console.error(`❌ FAIL: #app-nav in ${file} does not have proper flex alignment:`, navComputed);
      process.exit(1);
    }

    const tabs = await page.$$('#app-nav .nav-tab');
    if (tabs.length !== 6) {
      console.error(`❌ FAIL: ${file} has ${tabs.length} tabs instead of 6`);
      process.exit(1);
    }

    // Get bounding boxes and label texts of all tabs
    const tabMetrics = await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('#app-nav .nav-tab .nav-label'));
      return labels.map(l => {
        const rect = l.getBoundingClientRect();
        return {
          text: l.textContent.trim(),
          top: rect.top,
          bottom: rect.bottom,
          height: rect.height
        };
      });
    });

    for (let i = 0; i < 6; i++) {
      if (tabMetrics[i].text !== expectedLabels[i]) {
        console.error(`❌ FAIL: ${file} tab ${i} text is "${tabMetrics[i].text}", expected "${expectedLabels[i]}"`);
        process.exit(1);
      }
    }

    // Verify baseline locking: all label tops and bottoms must be within 1px across all 6 tabs
    const firstTop = tabMetrics[0].top;
    const firstBottom = tabMetrics[0].bottom;
    for (let i = 0; i < 6; i++) {
      const topDiff = Math.abs(tabMetrics[i].top - firstTop);
      const bottomDiff = Math.abs(tabMetrics[i].bottom - firstBottom);
      if (topDiff > 1.5 || bottomDiff > 1.5) {
        console.error(`❌ FAIL: ${file} tab "${tabMetrics[i].text}" baseline is not locked!`, {
          tab: tabMetrics[i],
          expectedTop: firstTop,
          expectedBottom: firstBottom
        });
        process.exit(1);
      }
    }

    console.log(`✅ PASS: ${file} — 6 tabs verified, "Pro Chef" label verified, baseline locked flat at Y=${firstTop.toFixed(1)}px (bottom=${firstBottom.toFixed(1)}px).`);
  }

  // Visual screenshots
  console.log('\n=== CAPTURING VISUAL ARTIFACTS ===');
  const dashPath = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(dashPath, { waitUntil: 'load' });
  await page.screenshot({ path: 'verify_dashboard_pro_chef_nav.png' });
  console.log('Saved verify_dashboard_pro_chef_nav.png');

  const colPath = 'file:///' + path.resolve(__dirname, 'collection.html').replace(/\\/g, '/');
  await page.goto(colPath, { waitUntil: 'load' });
  await page.screenshot({ path: 'verify_collection_pro_chef_nav.png' });
  console.log('Saved verify_collection_pro_chef_nav.png');

  console.log('\n🎉 ALL TYPOGRAPHY AND BASELINE REALIGNMENT VERIFICATIONS PASSED PERFECTLY!');
  await browser.close();
})();
