const { chromium } = require('playwright');
const path = require('path');

async function testDualTabModal(fileName) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 450, height: 950 }
  });

  const filePath = `file://${path.resolve(__dirname, fileName)}`;
  console.log(`\n========================================`);
  console.log(`TESTING DUAL-TAB FILTERS MODAL: ${fileName}`);
  console.log(`========================================`);

  await page.goto(filePath);
  await page.waitForLoadState('networkidle');

  // 1. Open modal via filter button
  const filterBtn = await page.$('.header-filter-btn');
  if (!filterBtn) {
    throw new Error('Filter button .header-filter-btn not found!');
  }
  await filterBtn.click();
  await page.waitForTimeout(400);

  const modal = await page.$('#wow-profile-filters-modal');
  if (!modal) {
    throw new Error('#wow-profile-filters-modal not mounted!');
  }

  // 2. Check tab elements
  const tabApp = await page.$('#tab-btn-app-filters');
  const tabDiet = await page.$('#tab-btn-dietary-matrix');
  const viewApp = await page.$('#view-app-filters');
  const viewDiet = await page.$('#view-dietary-matrix');

  if (!tabApp || !tabDiet || !viewApp || !viewDiet) {
    throw new Error('Dual tabs or view containers missing!');
  }

  // Check initial visibility: App Filters visible, Dietary hidden
  const viewAppDisp = await viewApp.evaluate(el => window.getComputedStyle(el).display);
  const viewDietDisp = await viewDiet.evaluate(el => window.getComputedStyle(el).display);
  console.log('Initial display states -> App:', viewAppDisp, 'Dietary:', viewDietDisp);

  if (viewAppDisp !== 'flex' || viewDietDisp !== 'none') {
    throw new Error(`Expected App=flex and Dietary=none, got App=${viewAppDisp}, Dietary=${viewDietDisp}`);
  }

  // Check the 3 preference toggles are present
  const togglePremium = await page.$('#toggle-pref-premium');
  const togglePrivacy = await page.$('#toggle-pref-privacy');
  const toggleMetric = await page.$('#toggle-pref-metric');
  if (!togglePremium || !togglePrivacy || !toggleMetric) {
    throw new Error('App filter preference toggles missing!');
  }

  // Capture screenshot of App Filters tab
  const nameBase = fileName.replace('.html', '');
  await page.screenshot({ path: `verified_modal_tab_app_filters_${nameBase}.png` });
  console.log(`Saved verified_modal_tab_app_filters_${nameBase}.png`);

  // 3. Switch to Dietary Matrix tab
  console.log('Switching to Dietary Matrix tab...');
  await tabDiet.click();
  await page.waitForTimeout(300);

  const viewAppDisp2 = await viewApp.evaluate(el => window.getComputedStyle(el).display);
  const viewDietDisp2 = await viewDiet.evaluate(el => window.getComputedStyle(el).display);
  console.log('After tab switch -> App:', viewAppDisp2, 'Dietary:', viewDietDisp2);

  if (viewAppDisp2 !== 'none' || viewDietDisp2 !== 'flex') {
    throw new Error(`Expected App=none and Dietary=flex, got App=${viewAppDisp2}, Dietary=${viewDietDisp2}`);
  }

  // Check Dietary Matrix elements
  const veganPill = await page.$('.diet-pill-btn[data-diet="vegan"]');
  const ketoPill = await page.$('.diet-pill-btn[data-diet="keto"]');
  const allergyNuts = await page.$('#toggle-allergy-nuts');

  if (!veganPill || !ketoPill || !allergyNuts) {
    throw new Error('Dietary matrix components missing!');
  }

  // Test toggling Keto pill
  console.log('Testing Keto pill toggle...');
  await ketoPill.click();
  await page.waitForTimeout(200);
  const isKetoActive = await ketoPill.evaluate(el => el.classList.contains('active'));
  console.log('Keto pill active after click:', isKetoActive);
  if (!isKetoActive) {
    throw new Error('Keto pill should be active after clicking!');
  }

  // Capture screenshot of Dietary Matrix tab
  await page.screenshot({ path: `verified_modal_tab_dietary_matrix_${nameBase}.png` });
  console.log(`Saved verified_modal_tab_dietary_matrix_${nameBase}.png`);

  // 4. Switch back to App Filters tab and verify non-destructive state
  console.log('Switching back to App Filters tab...');
  await tabApp.click();
  await page.waitForTimeout(300);

  const viewAppDisp3 = await viewApp.evaluate(el => window.getComputedStyle(el).display);
  console.log('App view display after switching back:', viewAppDisp3);
  if (viewAppDisp3 !== 'flex') {
    throw new Error('App Filters view should be visible after switching back!');
  }

  // 5. Test apply button
  const applyBtn = await page.$('#btn-save-profile-filters');
  await applyBtn.click();
  await page.waitForTimeout(400);

  const modalClosedOpacity = await modal.evaluate(el => window.getComputedStyle(el).opacity);
  console.log('Modal opacity after apply:', modalClosedOpacity);

  console.log(`SUCCESS: Dual-tab modal verification passed for ${fileName}!`);
  await browser.close();
}

async function run() {
  await testDualTabModal('profile.html');
  await testDualTabModal('iot-settings.html');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
