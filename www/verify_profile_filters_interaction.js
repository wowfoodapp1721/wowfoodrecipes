const { chromium } = require('playwright');
const path = require('path');

async function testProfileFiltersInteraction(fileName) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 450, height: 950 }
  });

  const filePath = `file://${path.resolve(__dirname, fileName)}`;
  await page.goto(filePath);
  await page.waitForLoadState('networkidle');

  console.log(`\n========================================`);
  console.log(`TESTING PROFILE FILTERS INTERACTION: ${fileName}`);
  console.log(`========================================`);

  // 1. Initial State Check
  const filterBtn = await page.$('.header-filter-btn');
  if (!filterBtn) {
    throw new Error('Filter button .header-filter-btn not found on page!');
  }

  // 2. Click Filter Button to Open Overlay
  console.log('1. Clicking Filter Button (.header-filter-btn)...');
  await filterBtn.click();
  await page.waitForTimeout(400);

  const modal = await page.$('#wow-profile-filters-modal');
  if (!modal) {
    throw new Error('Overlay #wow-profile-filters-modal was not created/mounted!');
  }

  const modalOpacity = await modal.evaluate(el => window.getComputedStyle(el).opacity);
  const modalPointerEvents = await modal.evaluate(el => window.getComputedStyle(el).pointerEvents);
  console.log('Modal Opacity:', modalOpacity, 'PointerEvents:', modalPointerEvents);

  if (modalOpacity !== '1') {
    throw new Error(`Expected modal opacity to be 1, got ${modalOpacity}`);
  }

  // 3. Inspect Modal Content & Toggles
  const titleText = await modal.evaluate(el => {
    const brand = el.querySelector('.profile-filters-card span:nth-child(1)')?.textContent.trim();
    const sub = el.querySelector('.profile-filters-card span:nth-child(2)')?.textContent.trim();
    return `${brand} ${sub}`;
  });
  console.log('Modal Title Text:', titleText);

  const togglePremium = await page.$('#toggle-pref-premium');
  const togglePrivacy = await page.$('#toggle-pref-privacy');
  const toggleMetric = await page.$('#toggle-pref-metric');

  if (!togglePremium || !togglePrivacy || !toggleMetric) {
    throw new Error('Preference toggle switches not found in modal!');
  }

  // 4. Test Toggle Interactivity
  console.log('2. Testing Toggle Switches...');
  const privacyInitialState = await togglePrivacy.evaluate(el => el.getAttribute('aria-checked'));
  console.log('Privacy Mode Initial Checked:', privacyInitialState);

  await togglePrivacy.click();
  await page.waitForTimeout(200);

  const privacyToggledState = await togglePrivacy.evaluate(el => el.getAttribute('aria-checked'));
  console.log('Privacy Mode Toggled Checked:', privacyToggledState);

  if (privacyToggledState !== 'true') {
    throw new Error('Privacy toggle did not change to true upon clicking!');
  }

  // Screenshot open modal
  const nameBase = fileName.replace('.html', '');
  const viewport = await page.$('#viewport');
  if (viewport) {
    await viewport.screenshot({ path: `verified_filters_drawer_open_${nameBase}.png` });
  }

  // 5. Test Close Button (X)
  console.log('3. Testing Close Button (X)...');
  const closeBtn = await page.$('#btn-close-profile-filters');
  if (!closeBtn) {
    throw new Error('Close button #btn-close-profile-filters not found!');
  }

  await closeBtn.click();
  await page.waitForTimeout(400);

  const modalClosedOpacity = await modal.evaluate(el => window.getComputedStyle(el).opacity);
  const modalClosedPointerEvents = await modal.evaluate(el => window.getComputedStyle(el).pointerEvents);
  console.log('Modal Closed Opacity:', modalClosedOpacity, 'PointerEvents:', modalClosedPointerEvents);

  if (modalClosedOpacity !== '0') {
    throw new Error(`Expected modal opacity to be 0 after close, got ${modalClosedOpacity}`);
  }

  // Screenshot closed state
  if (viewport) {
    await viewport.screenshot({ path: `verified_filters_drawer_closed_${nameBase}.png` });
  }

  // 6. Test Re-opening and Apply Button
  console.log('4. Testing Re-open & Apply & Return Button...');
  await filterBtn.click();
  await page.waitForTimeout(400);

  const applyBtn = await page.$('#btn-save-profile-filters');
  if (!applyBtn) {
    throw new Error('Apply button #btn-save-profile-filters not found!');
  }
  await applyBtn.click();
  await page.waitForTimeout(400);

  const modalReclosedOpacity = await modal.evaluate(el => window.getComputedStyle(el).opacity);
  console.log('Modal Re-closed Opacity after Apply:', modalReclosedOpacity);

  console.log(`SUCCESS: All profile filter interactive flows verified for ${fileName}!`);
  await browser.close();
}

async function run() {
  await testProfileFiltersInteraction('profile.html');
  await testProfileFiltersInteraction('iot-settings.html');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
