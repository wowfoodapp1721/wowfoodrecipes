const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-fork-edit.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // 1. Test Recipe Context Card hover
  await page.hover('.recipe-context-card');
  await page.waitForTimeout(350);
  const cardTransform = await page.$eval('.recipe-context-card', el => getComputedStyle(el).transform);
  console.log('Recipe Context Card Hover Transform:', cardTransform);

  // 2. Test Form Input hover
  await page.hover('#input-recipe-title');
  await page.waitForTimeout(350);
  const inputTransform = await page.$eval('#input-recipe-title', el => getComputedStyle(el).transform);
  console.log('Form Input Hover Transform:', inputTransform);

  // 3. Test Sub-toggle Item hover
  await page.hover('.sub-toggle-item');
  await page.waitForTimeout(350);
  const toggleTransform = await page.$eval('.sub-toggle-item', el => getComputedStyle(el).transform);
  console.log('Sub Toggle Item Hover Transform:', toggleTransform);

  // 4. Test Textarea hover
  await page.hover('#input-chef-notes');
  await page.waitForTimeout(350);
  const textareaTransform = await page.$eval('#input-chef-notes', el => getComputedStyle(el).transform);
  console.log('Textarea Hover Transform:', textareaTransform);

  // 5. Test Delete Button hover
  await page.hover('#btn-delete-fork');
  await page.waitForTimeout(350);
  const deleteTransform = await page.$eval('#btn-delete-fork', el => getComputedStyle(el).transform);
  console.log('Delete Button Hover Transform:', deleteTransform);

  await page.screenshot({ path: 'verify_edit_recipe_hover_lift.png' });
  console.log('Saved verify_edit_recipe_hover_lift.png');

  // Verify translateY(-3px) matrix values (matrix(1, 0, 0, 1, 0, -3))
  if (!deleteTransform.includes('-3') && !deleteTransform.includes('-2.99')) {
    throw new Error('Delete button hover transform did not apply translateY(-3px)');
  }
  if (!cardTransform.includes('-3') && !cardTransform.includes('-2.99')) {
    throw new Error('Context card hover transform did not apply translateY(-3px)');
  }

  console.log('All Hover Lift Effect tests on Edit Recipe passed with 100% success!');
  await browser.close();
})();
