const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 Starting FHD Real-Image Asset Pipeline Verification Suite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // Load recipe-system.js in page context to test core functions
  const recipeSystemPath = path.resolve(__dirname, 'assets', 'recipe-system.js');
  const recipeDetailUrl = 'file://' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');

  await page.goto(recipeDetailUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  console.log('\n--- 1. Testing String Sanitizer Engine (sanitizeIngredientName) ---');
  const sanitizerTests = [
    { input: '800g marinated Bone-In Chicken Thighs', expectedPattern: /chicken\s+thighs?/i },
    { input: '200g cubed', expectedPattern: /cubed/i },
    { input: '4 large yolks + 1 whole', expectedPattern: /yolks?/i },
    { input: '100g finely grated Pecorino Romano', expectedPattern: /pecorino\s+romano/i },
    { input: '2 tsp freshly toasted cracked pepper', expectedPattern: /pepper/i },
    { input: 'USDA Prime Bone-In Ribeye (16 oz)', expectedPattern: /ribeye/i },
    { input: 'Fresh Key Lime Juice (Leche de Tigre)', expectedPattern: /lime\s+juice/i },
    { input: 'Aged Long-Grain Basmati Rice', expectedPattern: /basmati\s+rice/i },
    { input: 'Sashimi-Grade Atlantic Salmon Fillet', expectedPattern: /salmon/i },
    { input: 'Dried Guajillo & Ancho Chilies (6 pcs)', expectedPattern: /guajillo.*ancho/i }
  ];

  for (const t of sanitizerTests) {
    const output = await page.evaluate((name) => window.sanitizeIngredientName(name), t.input);
    const passed = t.expectedPattern.test(output);
    console.log(`  ${passed ? '✅ PASS' : '❌ FAIL'}: "${t.input}" -> "${output}"`);
    if (!passed) throw new Error(`Sanitizer failed for "${t.input}"`);
  }

  console.log('\n--- 2. Testing FHD Dynamic Image Resolver (getFHDIngredientPhoto) ---');
  const resolverTests = [
    'Bone-In Chicken Thighs',
    'USDA Prime Bone-In Ribeye',
    'Fresh Farm Egg Yolks',
    'Bronze-Cut Spaghetti',
    'Wild Tiger Prawns',
    'Fresh Sea Bass / Corvina Fillet',
    'Aged Long-Grain Basmati Rice',
    'Sashimi-Grade Atlantic Salmon',
    'Dried Guajillo & Ancho Chilies',
    'Burgundy Pinot Noir Red Wine'
  ];

  for (const item of resolverTests) {
    const photoUrl = await page.evaluate((name) => window.getFHDIngredientPhoto(name), item);
    const isValid = photoUrl && photoUrl.startsWith('http') && !photoUrl.startsWith('data:image/svg+xml');
    console.log(`  ${isValid ? '✅ PASS' : '❌ FAIL'}: "${item}" -> ${photoUrl.substring(0, 65)}...`);
    if (!isValid) throw new Error(`Resolver failed for "${item}"`);
  }

  console.log('\n--- 3. Testing Screen 3A (Ingredients Tab) Across All 9 Core Recipes ---');
  const recipesToTest = [
    { slug: 'sesame-chicken', name: 'Honey Sesame Chicken' },
    { slug: 'carbonara', name: 'Roman Spaghetti Carbonara' },
    { slug: 'ribeye', name: 'Prime Pan-Seared Ribeye' },
    { slug: 'pad-thai', name: 'Authentic Thai Pad Thai' },
    { slug: 'ceviche', name: 'Classic Peruvian Ceviche' },
    { slug: 'biryani', name: 'Royal Indian Chicken Biryani' },
    { slug: 'sushi', name: 'Japanese Premium Sushi Platter' },
    { slug: 'birria', name: 'Authentic Mexican Birria Tacos' },
    { slug: 'bourguignon', name: 'Classic French Beef Bourguignon' }
  ];

  let totalIngredientsChecked = 0;

  for (const r of recipesToTest) {
    await page.goto(`${recipeDetailUrl}?recipe=${r.slug}`, { waitUntil: 'load' });
    await page.waitForTimeout(300);

    const recipeTitle = await page.evaluate(() => document.querySelector('.recipe-main-title')?.textContent?.trim());
    const heroSrc = await page.evaluate(() => document.querySelector('.media-cover-img')?.getAttribute('src'));
    const ingredientCards = await page.$$('.ingredients-stack .ingredient-card');

    console.log(`\n  Testing [${r.slug}] "${recipeTitle}": Found ${ingredientCards.length} ingredients`);

    for (let i = 0; i < ingredientCards.length; i++) {
      const card = ingredientCards[i];
      const name = await card.$eval('.ingredient-name', el => el.textContent.trim());
      const amount = await card.$eval('.ingredient-amount', el => el.textContent.trim());
      const imgInfo = await card.$eval('.ingredient-img-wrapper img', el => ({
        src: el.src,
        rawSrcAttr: el.getAttribute('src'),
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        complete: el.complete,
        className: el.className
      }));

      // Assertions
      const isHttp = imgInfo.src.startsWith('http://') || imgInfo.src.startsWith('https://');
      const isNotSvgData = !imgInfo.src.startsWith('data:image/svg+xml');
      const isNotCover = imgInfo.src !== heroSrc && imgInfo.rawSrcAttr !== heroSrc;

      if (!isHttp || !isNotSvgData || !isNotCover) {
        console.error(`    ❌ FAILED ingredient check: "${name}" (${amount})`);
        console.error(`       Src: ${imgInfo.src}`);
        console.error(`       Hero: ${heroSrc}`);
        throw new Error(`Ingredient photo violation for "${name}" in recipe "${r.slug}"`);
      }

      console.log(`    ✅ Ingredient [${i + 1}]: "${name}" (${amount}) -> FHD Photo (${imgInfo.src.substring(0, 50)}...)`);
      totalIngredientsChecked++;
    }
  }

  console.log(`\n--- 4. Capturing High-Res Artifact Screenshots for User Walkthrough ---`);
  
  // Screenshot 1: Sesame Chicken (Screen 3A Ingredients Tab)
  await page.goto(`${recipeDetailUrl}?recipe=sesame-chicken`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const screenshot1Path = path.resolve(__dirname, 'screenshot_fhd_sesame_chicken_ingredients.png');
  await page.screenshot({ path: screenshot1Path, fullPage: false });
  console.log(`  📸 Saved screenshot: ${screenshot1Path}`);

  // Screenshot 2: Roman Spaghetti Carbonara (Screen 3A Ingredients Tab)
  await page.goto(`${recipeDetailUrl}?recipe=carbonara`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const screenshot2Path = path.resolve(__dirname, 'screenshot_fhd_carbonara_ingredients.png');
  await page.screenshot({ path: screenshot2Path, fullPage: false });
  console.log(`  📸 Saved screenshot: ${screenshot2Path}`);

  // Screenshot 3: Mexican Birria Tacos (Screen 3A Ingredients Tab)
  await page.goto(`${recipeDetailUrl}?recipe=birria`, { waitUntil: 'load' });
  await page.waitForTimeout(400);
  const screenshot3Path = path.resolve(__dirname, 'screenshot_fhd_birria_ingredients.png');
  await page.screenshot({ path: screenshot3Path, fullPage: false });
  console.log(`  📸 Saved screenshot: ${screenshot3Path}`);

  console.log(`\n🎉 ALL VERIFICATION CHECKS PASSED! (${totalIngredientsChecked} ingredient thumbnails verified across all 9 recipes)`);

  await browser.close();
})();
