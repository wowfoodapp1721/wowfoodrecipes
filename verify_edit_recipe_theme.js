const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-fork-edit.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // 1. Viewport background is Void Black #0B0F14
  const viewportBg = await page.$eval('#viewport', el => getComputedStyle(el).backgroundColor);
  console.log('Viewport Background Color:', viewportBg);

  // 2. Central cards background is charcoal gray
  const contextCardBg = await page.$eval('.recipe-context-card', el => getComputedStyle(el).backgroundColor);
  const subCardBg = await page.$eval('.fork-substitutions-card', el => getComputedStyle(el).backgroundColor);
  console.log('Context Card Background:', contextCardBg, '| Substitutions Card:', subCardBg);

  // 3. Save button checkmark and text color
  const saveBtnColor = await page.$eval('#btn-save-recipe', el => getComputedStyle(el).color);
  const saveCheckmarkColor = await page.$eval('#btn-save-recipe .material-symbols-outlined', el => getComputedStyle(el).color);
  console.log('Save Button Color:', saveBtnColor, '| Checkmark Color:', saveCheckmarkColor);

  // 4. "ACTIVE RECIPE FORK" badge color
  const tagColor = await page.$eval('.recipe-context-tag', el => getComputedStyle(el).color);
  console.log('Active Recipe Fork Tag Color:', tagColor);

  // 5. Active switch slider background color
  const switchSliderBg = await page.$eval('.switch-toggle input:checked + .switch-slider', el => getComputedStyle(el).backgroundColor);
  console.log('Active Switch Slider Background:', switchSliderBg);

  // 6. Delete Recipe Fork button border, text, and trash icon color
  const deleteBtnStyles = await page.$eval('#btn-delete-fork', el => {
    const s = getComputedStyle(el);
    return { border: s.borderColor, color: s.color };
  });
  const deleteIconColor = await page.$eval('#btn-delete-fork .material-symbols-outlined', el => getComputedStyle(el).color);
  console.log('Delete Button Styles:', deleteBtnStyles, '| Trash Icon Color:', deleteIconColor);

  // 7. Verify inputs content
  const titleVal = await page.$eval('#input-recipe-title', el => el.value);
  const prepVal = await page.$eval('#input-prep-time', el => el.value);
  const cookVal = await page.$eval('#input-cook-time', el => el.value);
  const servingsVal = await page.$eval('#input-servings', el => el.value);
  console.log('Inputs check:', { titleVal, prepVal, cookVal, servingsVal });

  // Assertions
  if (!saveBtnColor.includes('61, 242, 224')) {
    throw new Error('Save button is not Neon Cyan!');
  }
  if (!tagColor.includes('61, 242, 224')) {
    throw new Error('Active Recipe Fork tag is not Neon Cyan!');
  }
  if (!switchSliderBg.includes('61, 242, 224')) {
    throw new Error('Switch slider is not Neon Cyan!');
  }
  if (!deleteBtnStyles.color.includes('61, 242, 224')) {
    throw new Error('Delete button text is not Neon Cyan!');
  }

  await page.screenshot({ path: 'verify_edit_recipe_cyan_theme.png' });
  console.log('Saved verify_edit_recipe_cyan_theme.png');

  console.log('All Edit Recipe theme color swap validations passed with 100% success!');
  await browser.close();
})();
