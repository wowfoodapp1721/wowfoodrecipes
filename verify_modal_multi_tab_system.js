const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Recipe Details Modal Multi-Tab System Verification in dashboard.html...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 412, height: 915 }
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // 1. Verify Structure inside #details-modal-body
  console.log('🔍 [1. Verifying Multi-Tab Modal Markup Structure]');
  const modal = page.locator('#recipe-details-modal');
  await modal.waitFor({ state: 'visible' });

  const modalImg = page.locator('#modal-recipe-img');
  const modalTitle = page.locator('#modal-recipe-title');
  const tabButtons = await page.locator('.detail-tab-btn').all();
  const panesWrapper = page.locator('#detail-panes-wrapper');
  const paneIngredients = page.locator('#pane-ingredients');
  const paneInstructions = page.locator('#pane-instructions');
  const paneHealth = page.locator('#pane-health');
  const startCookBtn = page.locator('#btn-start-cook');

  assert(await modalImg.count() > 0, 'Modal recipe image must exist');
  assert(await modalTitle.count() > 0, 'Modal recipe title must exist');
  assert(tabButtons.length === 3, `Must have exactly 3 tab buttons, found ${tabButtons.length}`);
  assert(await panesWrapper.count() > 0, 'Panes wrapper #detail-panes-wrapper must exist');
  assert(await paneIngredients.count() > 0, '#pane-ingredients must exist');
  assert(await paneInstructions.count() > 0, '#pane-instructions must exist');
  assert(await paneHealth.count() > 0, '#pane-health must exist');
  assert(await startCookBtn.count() > 0, '#btn-start-cook must exist');

  // Verify Initial Tab States
  console.log('🔍 [2. Verifying Default Active Tab (Ingredients)]');
  const isIngVisible = await paneIngredients.isVisible();
  const isInstHidden = await paneInstructions.evaluate(el => el.classList.contains('hidden'));
  const isHealthHidden = await paneHealth.evaluate(el => el.classList.contains('hidden'));

  assert(isIngVisible, 'Ingredients pane should be visible by default');
  assert(isInstHidden, 'Instructions pane should be hidden by default');
  assert(isHealthHidden, 'Health pane should be hidden by default');

  // 3. Test Tab Switch to Instructions
  console.log('🔍 [3. Testing Tab Switch to Instructions]');
  const instBtn = page.locator('.detail-tab-btn[data-tab="instructions"]');
  await instBtn.click();
  await page.waitForTimeout(300);

  assert(await paneIngredients.evaluate(el => el.classList.contains('hidden')), 'Ingredients pane should now be hidden');
  assert(!await paneInstructions.evaluate(el => el.classList.contains('hidden')), 'Instructions pane should now be visible');
  assert(await paneHealth.evaluate(el => el.classList.contains('hidden')), 'Health pane should remain hidden');
  assert(await instBtn.evaluate(el => el.classList.contains('border-red-600')), 'Instructions button should have active red border class');

  // 4. Test Tab Switch to Health Score
  console.log('🔍 [4. Testing Tab Switch to Health Score]');
  const healthBtn = page.locator('.detail-tab-btn[data-tab="health"]');
  await healthBtn.click();
  await page.waitForTimeout(300);

  assert(await paneIngredients.evaluate(el => el.classList.contains('hidden')), 'Ingredients pane should be hidden');
  assert(await paneInstructions.evaluate(el => el.classList.contains('hidden')), 'Instructions pane should be hidden');
  assert(!await paneHealth.evaluate(el => el.classList.contains('hidden')), 'Health pane should now be visible');
  assert(await healthBtn.evaluate(el => el.classList.contains('border-red-600')), 'Health button should have active red border class');

  // Verify WOW RANKING content in Health Score
  const healthText = await paneHealth.innerText();
  assert(healthText.includes('7.2'), 'Health Score should display 7.2 score');
  assert(healthText.includes('WOW RANKING'), 'Health Score should display WOW RANKING');

  // 5. Test dynamic invocation of openRecipeDetails(mealId)
  console.log('🔍 [5. Testing openRecipeDetails(mealId) dynamic call]');
  await page.evaluate(() => {
    window.openRecipeDetails('meal-test-1');
  });
  await page.waitForTimeout(300);

  // Check that tabs still work after dynamic re-render
  const ingBtn = page.locator('.detail-tab-btn[data-tab="ingredients"]');
  await ingBtn.click();
  await page.waitForTimeout(200);
  assert(!await page.locator('#pane-ingredients').evaluate(el => el.classList.contains('hidden')), 'Ingredients pane must be visible after clicking tab');

  // Take screenshot for visual verification
  const screenshotPath = path.resolve(__dirname, 'modal_multi_tab_verified.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log(`   - Screenshot saved to: ${screenshotPath}`);

  await browser.close();
  console.log('\n✨ ALL MODAL MULTI-TAB TEMPLATE & NAVIGATION TESTS PASSED 100%!');
})();
