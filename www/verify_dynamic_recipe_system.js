const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Verification: Global State Dynamic Parameter System & Recipe DOM Injection Engine...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  const searchUrl = 'file:///' + path.resolve(__dirname, 'search-pantry.html').replace(/\\/g, '/');
  const detailUrl = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 1: Dashboard Universal Card Click & Dynamic Parameter Navigation
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('📄 [Test 1] Loading Home Dashboard & Clicking "Roman Spaghetti Carbonara"...');
  await page.goto(dashboardUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // Check openRecipeDetail function presence
  const isHookPresent = await page.evaluate(() => typeof window.openRecipeDetail === 'function');
  console.log(`   ✓ Unified openRecipeDetail hook exposed globally on window: ${isHookPresent}`);
  if (!isHookPresent) throw new Error('openRecipeDetail is not exposed on window!');

  // Click Carbonara Card
  await page.click('#card-carbonara');
  await page.waitForTimeout(400);

  // Verify navigation and dynamic DOM injection on Screen 3A/3B/3C
  const currentTitle = await page.locator('.recipe-main-title').innerText();
  const currentCalories = await page.locator('.calorie-pill').innerText();
  const currentCategory = await page.locator('.live-category-badge').innerText();
  const currentImg = await page.locator('.media-cover-img').getAttribute('src');

  console.log(`   ✓ Injected Title: "${currentTitle}"`);
  console.log(`   ✓ Injected Calories: "${currentCalories.trim()}"`);
  console.log(`   ✓ Injected Category: "${currentCategory.trim()}"`);
  console.log(`   ✓ Injected Image: "${currentImg}"`);

  if (!currentTitle.includes('Carbonara')) throw new Error('Carbonara title not injected!');
  if (!currentCalories.includes('620')) throw new Error('Carbonara calories not injected!');

  // Check Screen 3A (Ingredients Tab)
  console.log('\n🔍 [Screen 3A: Ingredients Tab Dynamic Injection]');
  const ingredientNames = await page.locator('.ingredient-name').allInnerTexts();
  console.log(`   ✓ Dynamic Ingredients Count: ${ingredientNames.length}`);
  console.log(`   ✓ Sample Ingredients: ${ingredientNames.slice(0, 3).join(', ')}`);
  if (!ingredientNames.some(n => n.includes('Spaghetti') || n.includes('Guanciale') || n.includes('Pecorino'))) {
    throw new Error('Carbonara ingredients were not dynamically rendered!');
  }

  // Switch to Screen 3B (Instructions Tab)
  console.log('\n🔍 [Screen 3B: Instructions Tab Dynamic Injection]');
  await page.click('#tab-btn-1');
  await page.waitForTimeout(200);

  const stepTitles = await page.locator('.step-title').allInnerTexts();
  const totalStepsBadge = await page.locator('#step-count-badge').innerText();
  console.log(`   ✓ Total Steps Badge: "${totalStepsBadge}"`);
  console.log(`   ✓ Injected Step Titles (${stepTitles.length}): ${stepTitles.join(' -> ')}`);
  if (stepTitles.length !== 4 || !stepTitles[0].includes('Guanciale')) {
    throw new Error('Carbonara dynamic instruction steps not populated properly!');
  }

  // Switch to Screen 3C (Health Score Matrix Tab)
  console.log('\n🔍 [Screen 3C: WOW MATRIX Health Score Tab Dynamic Injection]');
  await page.click('#tab-btn-2');
  await page.waitForTimeout(200);

  const scoreLarge = await page.locator('.score-large').innerText();
  const proteinVal = await page.locator('.macro-card:has-text("Protein") .macro-val').innerText();
  const carbsVal = await page.locator('.macro-card:has-text("Carbohydrates") .macro-val').innerText();
  console.log(`   ✓ WOW MATRIX Score: ${scoreLarge}/10`);
  console.log(`   ✓ Macro Protein: ${proteinVal}`);
  console.log(`   ✓ Macro Carbs: ${carbsVal}`);
  if (scoreLarge !== '6.8' || !proteinVal.includes('28.4')) {
    throw new Error('Carbonara Health Score matrix calculations not dynamically rendered!');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 2: Dynamic Custom Recipe Object (Infinite Scroll Simulation)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n📄 [Test 2] Testing Dynamic Custom Recipe Object Injection (Future Infinite Scrolling)...');
  const customGourmetRecipe = {
    id: 'truffle-tagliolini',
    title: 'Piedmontese White Truffle Tagliolini',
    subtitle: 'Hand-cut egg ribbons tossed in mountain butter and shaved Alba white truffles.',
    image: 'assets/carbonara.png',
    category: 'MICHELIN TASTING',
    badge: 'Chef Prestige',
    prepTime: '20 min',
    cookTime: '8 min',
    totalTime: '28 minutes',
    servings: 2,
    calories: 580,
    calorieStr: '580 kcal',
    likes: '499.1k',
    intro: 'Handmade 40-yolk tagliolini ribbons bathed in clarified mountain butter and finished with fresh shavings of Alba white truffles table-side.',
    ingredients: [
      { name: 'Fresh Egg Tagliolini (40 Yolk)', amount: '250g', base: 250, unit: 'g' },
      { name: 'Alba White Truffle (Tuber magnatum)', amount: '25g freshly shaved', base: 25, unit: 'g' },
      { name: 'Mountain Clarified Butter', amount: '60g', base: 60, unit: 'g' },
      { name: 'Parmigiano Reggiano 36-Month', amount: '50g grated', base: 50, unit: 'g' }
    ],
    instructions: [
      { stepNum: 1, title: 'Roll & Cut Fresh Pasta', instruction: 'Laminate 40-yolk pasta dough to setting 6 and cut into fine 2mm ribbons.' },
      { stepNum: 2, title: 'Flash Boil', instruction: 'Boil fresh tagliolini in salted water for exactly 90 seconds.' },
      { stepNum: 3, title: 'Mantecare in Butter', instruction: 'Toss hot pasta in melted mountain butter and Parmigiano until creamy.' },
      { stepNum: 4, title: 'Shave White Truffles', instruction: 'Plate into warm ceramic bowls and shave white truffles lavishly over top.' }
    ],
    healthScore: {
      score: 9.1,
      rating: 'Prestige',
      ratingSub: 'Artisan',
      macros: {
        protein: { val: '26.5g', pct: 60 },
        carbs: { val: '64.0g', pct: 70 },
        fat: { val: '22.0g', pct: 40 },
        fiber: { val: '3.0g', pct: 25 }
      },
      nutritionTable: [
        { name: 'Calories', val: '580 kcal', pct: '(29% DV)' },
        { name: 'Total Fat', val: '22.00g', pct: '(28% DV)' },
        { name: 'Carbohydrates', val: '64.00g', pct: '(23% DV)' },
        { name: 'Sugars', val: '1.20g', pct: '(2% DV)' },
        { name: 'Protein', val: '26.50g', pct: '(53% DV)' },
        { name: 'Sodium', val: '420.00mg', pct: '(18% DV)' },
        { name: 'Dietary Fiber', val: '3.00g', pct: '(11% DV)' }
      ]
    }
  };

  // Invoke openRecipeDetail with custom structured object
  await page.evaluate((customObj) => {
    window.openRecipeDetail(customObj);
  }, customGourmetRecipe);
  await page.waitForTimeout(300);

  const customTitle = await page.locator('.recipe-main-title').innerText();
  const customScore = await page.locator('.score-large').innerText();
  console.log(`   ✓ Custom Injected Title: "${customTitle}"`);
  console.log(`   ✓ Custom Injected Score: "${customScore}"`);
  if (customTitle !== 'Piedmontese White Truffle Tagliolini') throw new Error('Custom recipe object title injection failed!');
  if (customScore !== '9.1') throw new Error('Custom recipe object health score injection failed!');

  // Check custom ingredients
  await page.click('#tab-btn-0');
  await page.waitForTimeout(200);
  const customIngs = await page.locator('.ingredient-name').allInnerTexts();
  console.log(`   ✓ Custom Injected Ingredients (${customIngs.length}): ${customIngs.join(', ')}`);
  if (!customIngs.some(n => n.includes('Alba White Truffle'))) {
    throw new Error('Custom recipe ingredients not rendered!');
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // TEST 3: Search Results Tile Universal Click Hook (search-pantry.html)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n📄 [Test 3] Loading Search Pantry Hub & Clicking "Royal Indian Chicken Biryani"...');
  await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // Click Biryani Match Card
  const biryaniMatchCard = page.locator('.match-card:has-text("Biryani")');
  await biryaniMatchCard.click();
  await page.waitForTimeout(400);

  const biryaniTitle = await page.locator('.recipe-main-title').innerText();
  const biryaniCategory = await page.locator('.live-category-badge').innerText();
  console.log(`   ✓ Navigated from Search to: "${biryaniTitle}"`);
  console.log(`   ✓ Category: "${biryaniCategory.trim()}"`);
  if (!biryaniTitle.includes('Biryani')) throw new Error('Search card click failed to load Biryani detail!');

  // Verify Biryani Ingredients & Steps
  const biryaniIngs = await page.locator('.ingredient-name').allInnerTexts();
  console.log(`   ✓ Biryani Ingredients Count: ${biryaniIngs.length} (${biryaniIngs.slice(0, 3).join(', ')})`);
  if (!biryaniIngs.some(i => i.includes('Basmati'))) throw new Error('Biryani ingredients missing!');

  console.log('\n🎉 ALL GLOBAL STATE DYNAMIC RECIPE INJECTION TESTS PASSED WITH 100% SUCCESS!\n');
  await browser.close();
})();
