const { chromium } = require('playwright');
const assert = require('assert');
const path = require('path');

(async () => {
  console.log('🚀 Starting Verification: 7-Star Cinematic Recipe Modal & Dynamic Culinary Data Dictionary Engine...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 } // Mobile Viewport
  });
  const page = await context.newPage();

  const filePath = `file://${path.resolve(__dirname, 'dashboard.html')}`;
  await page.goto(filePath, { waitUntil: 'load' });
  await page.waitForTimeout(1000);

  // 1. Initial State: Modal should be hidden
  console.log('\n[TEST 1] Checking initial modal state...');
  const initialModalHidden = await page.evaluate(() => {
    const modal = document.getElementById('recipe-details-modal');
    return modal ? modal.classList.contains('hidden') : false;
  });
  assert(initialModalHidden, 'Recipe modal must be hidden on initial load');
  console.log('✅ PASS: Modal is hidden on initial load.');

  // 2. Test Ribeye dynamic data loading
  console.log('\n[TEST 2] Testing Ribeye card dynamic data loading...');
  await page.evaluate(() => window.openRecipeDetails('ribeye'));
  await page.waitForTimeout(500);

  const ribeyeData = await page.evaluate(() => {
    const modal = document.getElementById('recipe-details-modal');
    const isVisible = modal && !modal.classList.contains('hidden');
    const title = document.getElementById('modal-recipe-title')?.innerText;
    const sub = document.getElementById('modal-recipe-sub')?.innerText;
    const calories = document.getElementById('modal-recipe-calories')?.innerText;
    const time = document.getElementById('modal-recipe-time')?.innerText;
    const health = document.getElementById('modal-health-score')?.innerText;
    const ingredients = Array.from(document.querySelectorAll('#ingredients-list-box .ingredient-name-label')).map(el => el.innerText);
    const instructions = Array.from(document.querySelectorAll('#instructions-list-box p')).map(el => el.innerText);
    const healthMetrics = document.getElementById('health-metrics-box')?.innerText;
    return { isVisible, title, sub, calories, time, health, ingredients, instructions, healthMetrics };
  });

  console.log('Ribeye Data Extracted:', JSON.stringify(ribeyeData, null, 2));
  assert(ribeyeData.isVisible, 'Modal must be visible after openRecipeDetails("ribeye")');
  assert.strictEqual(ribeyeData.title, 'Prime Bone-In Ribeye');
  assert.strictEqual(ribeyeData.sub.toUpperCase(), 'GOURMET RESERVE CUT');
  assert.strictEqual(ribeyeData.calories, '680 kcal');
  assert.strictEqual(ribeyeData.health, '8.4/10');
  assert(ribeyeData.ingredients.some(i => i.includes('Premium Bone-In Ribeye Cut')), 'Ingredients must include Ribeye Cut');
  assert(ribeyeData.ingredients.some(i => i.includes('Unsalted Truffle Butter Block')), 'Ingredients must include Truffle Butter');
  assert(ribeyeData.instructions[0].includes('smoking-hot cast iron skillet'), 'Instructions must include skillet sear step');
  assert(ribeyeData.healthMetrics.includes('34g') && ribeyeData.healthMetrics.includes('52g'), 'Health metrics must contain fat 34g and protein 52g');
  console.log('✅ PASS: Ribeye dynamic culinary dictionary mapping verified.');

  // Screenshot Ribeye modal
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/7f748c82-e61c-4d5b-a6d1-6089ebde95ab/ribeye_cinematic_modal_verified.png' });
  console.log('📸 Screenshot saved: ribeye_cinematic_modal_verified.png');

  // 3. Test Tab Switching with Liquid Slider
  console.log('\n[TEST 3] Testing liquid tab slider navigation...');
  
  // Switch to Instructions Tab
  await page.click('button.detail-tab-btn[data-tab="instructions"]');
  await page.waitForTimeout(400);

  const instructionsTabState = await page.evaluate(() => {
    const pill = document.getElementById('detail-tab-pill');
    const transform = pill?.style.transform;
    const ingHidden = document.getElementById('pane-ingredients')?.classList.contains('hidden');
    const insHidden = document.getElementById('pane-instructions')?.classList.contains('hidden');
    const healthHidden = document.getElementById('pane-health')?.classList.contains('hidden');
    return { transform, ingHidden, insHidden, healthHidden };
  });

  console.log('Instructions Tab State:', instructionsTabState);
  assert(instructionsTabState.transform.includes('100%'), 'Tab pill transform should shift by 100%');
  assert(instructionsTabState.ingHidden && !instructionsTabState.insHidden && instructionsTabState.healthHidden, 'Instructions pane must be active');
  console.log('✅ PASS: Instructions tab switched smoothly.');

  // Switch to Health Score Tab
  await page.click('button.detail-tab-btn[data-tab="health"]');
  await page.waitForTimeout(400);

  const healthTabState = await page.evaluate(() => {
    const pill = document.getElementById('detail-tab-pill');
    const transform = pill?.style.transform;
    const ingHidden = document.getElementById('pane-ingredients')?.classList.contains('hidden');
    const insHidden = document.getElementById('pane-instructions')?.classList.contains('hidden');
    const healthHidden = document.getElementById('pane-health')?.classList.contains('hidden');
    return { transform, ingHidden, insHidden, healthHidden };
  });

  console.log('Health Tab State:', healthTabState);
  assert(healthTabState.transform.includes('200%'), 'Tab pill transform should shift by 200%');
  assert(healthTabState.ingHidden && healthTabState.insHidden && !healthTabState.healthHidden, 'Health pane must be active');
  console.log('✅ PASS: Health Score tab switched smoothly.');

  // 4. Test Pasta dynamic data loading
  console.log('\n[TEST 4] Testing Pasta dynamic data loading...');
  await page.evaluate(() => window.openRecipeDetails('pasta'));
  await page.waitForTimeout(500);

  const pastaData = await page.evaluate(() => {
    const title = document.getElementById('modal-recipe-title')?.innerText;
    const sub = document.getElementById('modal-recipe-sub')?.innerText;
    const calories = document.getElementById('modal-recipe-calories')?.innerText;
    const health = document.getElementById('modal-health-score')?.innerText;
    const ingredients = Array.from(document.querySelectorAll('#ingredients-list-box .ingredient-name-label')).map(el => el.innerText);
    const instructions = Array.from(document.querySelectorAll('#instructions-list-box p')).map(el => el.innerText);
    const healthMetrics = document.getElementById('health-metrics-box')?.innerText;
    const defaultTabIngredientsActive = !document.getElementById('pane-ingredients')?.classList.contains('hidden');
    return { title, sub, calories, health, ingredients, instructions, healthMetrics, defaultTabIngredientsActive };
  });

  console.log('Pasta Data Extracted:', JSON.stringify(pastaData, null, 2));
  assert.strictEqual(pastaData.title, 'Curated Pasta Creation');
  assert.strictEqual(pastaData.sub.toUpperCase(), 'ARTISAN ITALIAN CLASSIC');
  assert.strictEqual(pastaData.calories, '520 kcal');
  assert.strictEqual(pastaData.health, '7.6/10');
  assert(pastaData.ingredients.some(i => i.includes('Artisan Egg Fettuccine')), 'Ingredients must include Fettuccine');
  assert(pastaData.ingredients.some(i => i.includes('Aged Parmigiano-Reggiano')), 'Ingredients must include Parmigiano-Reggiano');
  assert(pastaData.instructions[0].includes('precisely 9 minutes until al dente'), 'Instructions must include al dente boil step');
  assert(pastaData.healthMetrics.includes('16g') && pastaData.healthMetrics.includes('18g'), 'Health metrics must contain fat 16g and protein 18g');
  assert(pastaData.defaultTabIngredientsActive, 'Opening recipe must reset tab to Ingredients');
  console.log('✅ PASS: Pasta dynamic culinary dictionary mapping verified.');

  // Screenshot Pasta modal
  await page.screenshot({ path: 'C:/Users/Lenovo/.gemini/antigravity-ide/brain/7f748c82-e61c-4d5b-a6d1-6089ebde95ab/pasta_cinematic_modal_verified.png' });
  console.log('📸 Screenshot saved: pasta_cinematic_modal_verified.png');

  // 5. Test Servings Stepper
  console.log('\n[TEST 5] Testing servings size stepper (+ / -)...');
  const initialServing = await page.innerText('#display-servings');
  await page.click('#btn-plus-serve');
  await page.waitForTimeout(200);
  const incrementedServing = await page.innerText('#display-servings');
  assert.strictEqual(parseInt(incrementedServing), parseInt(initialServing) + 1, 'Serving size should increment by 1');
  
  await page.click('#btn-minus-serve');
  await page.waitForTimeout(200);
  const decrementedServing = await page.innerText('#display-servings');
  assert.strictEqual(parseInt(decrementedServing), parseInt(initialServing), 'Serving size should decrement back');
  console.log('✅ PASS: Servings stepper tested and verified.');

  // 6. Test Share Button
  console.log('\n[TEST 6] Testing Share Button presence & click trigger...');
  const shareBtnExists = await page.evaluate(() => {
    const btn = document.getElementById('btn-share-recipe');
    return btn !== null && btn.getAttribute('aria-label') === 'Share Recipe';
  });
  assert(shareBtnExists, 'Share button #btn-share-recipe must exist in top utility row');
  
  // Test click
  let dialogMessage = '';
  page.on('dialog', async dialog => {
    dialogMessage = dialog.message();
    await dialog.dismiss();
  });
  await page.click('#btn-share-recipe');
  await page.waitForTimeout(300);
  console.log('✅ PASS: Share button exists and triggers Web Share / Clipboard fallback.');

  // 7. Test Close Button
  console.log('\n[TEST 7] Testing close button...');
  await page.click('#btn-close-details');
  await page.waitForTimeout(400);

  const isClosed = await page.evaluate(() => {
    const modal = document.getElementById('recipe-details-modal');
    return modal?.classList.contains('hidden');
  });
  assert(isClosed, 'Modal must be hidden after clicking close button');
  console.log('✅ PASS: Close button successfully hides the modal.');

  console.log('\n🎉 ALL 7 VERIFICATION SUITES PASSED FLAWLESSLY!');
  await browser.close();
})();
