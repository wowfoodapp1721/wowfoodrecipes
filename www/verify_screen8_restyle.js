const { chromium } = require('playwright');
const path = require('path');

async function testScreen8() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 390, height: 884 }
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'stitch_wow_food_recipes/stitch_wow_food_recipes/screen_8_user_profile_dietary_settings_hub_mobile_2/code.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });

  await page.screenshot({ path: 'verify_screen8_restyle.png', fullPage: true });
  console.log('Saved verify_screen8_restyle.png');

  // Test hover lift on Vegan button
  const veganBtn = page.locator('button:has-text("Vegan")');
  await veganBtn.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'verify_screen8_hover_vegan.png' });
  console.log('Saved verify_screen8_hover_vegan.png');

  // Test hover lift on Mastered Dish
  const dishCard = page.locator('text=Honey Sesame Chicken').locator('..');
  await dishCard.hover();
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'verify_screen8_hover_dish.png' });
  console.log('Saved verify_screen8_hover_dish.png');

  await browser.close();
}

testScreen8().catch(err => {
  console.error(err);
  process.exit(1);
});
