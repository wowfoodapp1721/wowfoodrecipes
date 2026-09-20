const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-fork-edit.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // 1. Verify Resting State
  const restingStyles = await page.$eval('#btn-delete-fork', el => {
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      border: s.borderColor,
      color: s.color
    };
  });
  const restingIconColor = await page.$eval('#btn-delete-fork .material-symbols-outlined', el => getComputedStyle(el).color);
  console.log('Resting Delete Button Styles:', restingStyles, '| Icon Color:', restingIconColor);

  await page.screenshot({ path: 'verify_delete_button_resting.png' });

  // 2. Verify Hover State
  await page.hover('#btn-delete-fork');
  await page.waitForTimeout(350);

  const hoverStyles = await page.$eval('#btn-delete-fork', el => {
    const s = getComputedStyle(el);
    return {
      bg: s.backgroundColor,
      border: s.borderColor,
      color: s.color,
      transform: s.transform,
      boxShadow: s.boxShadow
    };
  });
  const hoverIconColor = await page.$eval('#btn-delete-fork .material-symbols-outlined', el => getComputedStyle(el).color);
  console.log('Hover Delete Button Styles:', hoverStyles, '| Icon Color:', hoverIconColor);

  await page.screenshot({ path: 'verify_delete_button_hover.png' });
  console.log('Saved verify_delete_button_hover.png');

  // Assertions
  if (!restingStyles.border.includes('61, 242, 224')) {
    throw new Error('Resting border is not Neon Cyan!');
  }
  if (!restingStyles.color.includes('61, 242, 224')) {
    throw new Error('Resting text is not Neon Cyan!');
  }
  if (!hoverStyles.bg.includes('61, 242, 224')) {
    throw new Error('Hover background is not Neon Cyan!');
  }
  if (!hoverStyles.color.includes('11, 15, 20')) {
    throw new Error('Hover text color is not Void Black #0B0F14!');
  }
  if (!hoverIconColor.includes('11, 15, 20')) {
    throw new Error('Hover icon color is not Void Black #0B0F14!');
  }
  if (!hoverStyles.transform.includes('-2')) {
    throw new Error('Hover transform is not translateY(-2px)!');
  }

  console.log('Delete button hover animation verified 100% successfully!');
  await browser.close();
})();
