const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  console.log('Loading:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Audit Master Catalog Data Architecture
  console.log('\n--- 1. AUDITING MASTER RECIPE CATALOG INGREDIENTS ARCHITECTURE ---');
  const catalogAudit = await page.evaluate(() => {
    const catalog = window.RECIPE_CATALOG;
    const results = [];

    for (const [key, recipe] of Object.entries(catalog)) {
      const hero = recipe.imageUrl || recipe.image || recipe.img;
      const ingCheck = (recipe.ingredients || []).map(ing => {
        const icon = ing.ingredientIcon || ing.icon || ing.img || ing.imageUrl;
        const matchesHero = icon === hero || icon === `assets/${recipe.slug}.png` || icon === `assets/${key}.png`;
        return {
          name: ing.name,
          qty: ing.qty || ing.amount,
          hasIngredientIcon: !!ing.ingredientIcon,
          iconVal: icon ? icon.substring(0, 40) + '...' : null,
          matchesHero
        };
      });

      results.push({
        key,
        title: recipe.title,
        hero,
        ingredientCount: ingCheck.length,
        ingredients: ingCheck,
        allHaveIcon: ingCheck.every(i => i.hasIngredientIcon),
        noneMatchHero: ingCheck.every(i => !i.matchesHero)
      });
    }

    return results;
  });

  catalogAudit.forEach(r => {
    assert(r.ingredientCount > 0, `${r.title} has ${r.ingredientCount} structured ingredients`);
    assert(r.allHaveIcon, `${r.title}: all ingredients possess unique ingredientIcon key`);
    assert(r.noneMatchHero, `${r.title}: ZERO ingredients duplicate hero photo (${r.hero})`);
  });

  // 2. Test Dynamic DOM Rendering on Screen 3A for All 9 Curated Creations
  console.log('\n--- 2. AUDITING LIVE DOM THUMBNAIL RENDERING ACROSS ALL RECIPES ---');
  const testRecipes = [
    'sesame-chicken',
    'carbonara',
    'ribeye',
    'pad-thai',
    'ceviche',
    'biryani',
    'sushi',
    'birria',
    'bourguignon'
  ];

  for (const recipeKey of testRecipes) {
    await page.evaluate((key) => {
      window.openRecipeDetail(key);
    }, recipeKey);
    await page.waitForTimeout(300);

    const domCheck = await page.evaluate((key) => {
      const recipe = window.RECIPE_CATALOG[key];
      const hero = recipe.imageUrl || recipe.image || recipe.img;
      const coverImgSrc = document.querySelector('.media-cover-img')?.getAttribute('src');

      const cardNodes = Array.from(document.querySelectorAll('.ingredient-card'));
      const cardDetails = cardNodes.map(card => {
        const name = card.querySelector('.ingredient-name')?.textContent.trim();
        const amount = card.querySelector('.ingredient-amount')?.textContent.trim();
        const img = card.querySelector('.ingredient-img-wrapper img');
        const src = img?.getAttribute('src');
        const hasRoundClass = img?.classList.contains('round-shape');
        const duplicatesHero = src === hero || src === coverImgSrc || (src && src.includes(recipe.slug + '.png'));

        return {
          name,
          amount,
          srcPreview: src ? src.substring(0, 40) + '...' : null,
          hasRoundClass,
          duplicatesHero
        };
      });

      return {
        key,
        recipeTitle: recipe.title,
        coverImgSrc,
        renderedCount: cardNodes.length,
        expectedCount: recipe.ingredients.length,
        cards: cardDetails,
        allCardsRendered: cardNodes.length === recipe.ingredients.length,
        allNonDuplicate: cardDetails.every(c => !c.duplicatesHero),
        allHaveAmount: cardDetails.every(c => !!c.amount)
      };
    }, recipeKey);

    assert(domCheck.allCardsRendered, `[${recipeKey}] Rendered ${domCheck.renderedCount}/${domCheck.expectedCount} ingredient rows`);
    assert(domCheck.allNonDuplicate, `[${recipeKey}] Verified NO ingredient thumbnail renders dish cover image (${domCheck.coverImgSrc})`);
    assert(domCheck.allHaveAmount, `[${recipeKey}] All ingredient rows display valid quantities`);
  }

  // 3. Test Smart String Scanner Fallback Engine
  console.log('\n--- 3. TESTING SMART STRING SCANNER FALLBACK ENGINE ---');
  const fallbackTest = await page.evaluate(() => {
    const testCases = [
      { name: 'Bronze-Cut Spaghetti', expectedPattern: 'pasta' },
      { name: 'Thin Rice Noodles', expectedPattern: 'pasta' },
      { name: 'Prime Ribeye Steak', expectedPattern: 'meat' },
      { name: 'Chicken Cutlets', expectedPattern: 'chicken' },
      { name: 'Wild Tiger Prawns', expectedPattern: 'prawn' },
      { name: 'Fresh Atlantic Salmon', expectedPattern: 'fish' },
      { name: 'Koshihikari Sushi Rice', expectedPattern: 'rice' },
      { name: 'Egg Yolks', expectedPattern: 'egg' },
      { name: 'Aged Pecorino Cheese', expectedPattern: 'cheese' },
      { name: 'Minced Garlic Cloves', expectedPattern: 'garlic' },
      { name: 'Red Onion Slices', expectedPattern: 'onion' },
      { name: 'Fresh Rosemary Sprig', expectedPattern: 'herb' },
      { name: 'Aji Limo Chili Pepper', expectedPattern: 'chili' },
      { name: 'Cremini Mushrooms', expectedPattern: 'mush' },
      { name: 'Pure Blossom Honey', expectedPattern: 'honey' },
      { name: 'Dark Soy Sauce', expectedPattern: 'sauce' },
      { name: 'Burgundy Pinot Noir Wine', expectedPattern: 'wine' },
      { name: 'Avocado Cooking Oil', expectedPattern: 'oil' },
      { name: 'Coarsely Cracked Black Pepper', expectedPattern: 'spice' },
      { name: 'Corn Tortillas', expectedPattern: 'bread' },
      { name: 'Fresh Lime Wedges', expectedPattern: 'lime' },
      { name: 'Firm Tofu Cubes', expectedPattern: 'tofu' },
      { name: 'Unidentified Exotic Component', expectedPattern: 'gen' }
    ];

    return testCases.map(tc => {
      const iconUri = window.getFallbackVectorIcon(tc.name);
      const isDataUri = iconUri.startsWith('data:image/svg+xml');
      const containsExpectedPattern = iconUri.includes(tc.expectedPattern);
      return {
        name: tc.name,
        isDataUri,
        containsExpectedPattern,
        pattern: tc.expectedPattern
      };
    });
  });

  fallbackTest.forEach(ft => {
    assert(ft.isDataUri, `Scanner returns valid SVG Data URI for "${ft.name}"`);
    assert(ft.containsExpectedPattern, `Scanner properly matched category pattern "${ft.pattern}" for "${ft.name}"`);
  });

  // 4. Test Dynamic Custom Recipe with Missing Icons
  console.log('\n--- 4. TESTING DYNAMIC CUSTOM RECIPE OBJECT INJECTION ---');
  await page.evaluate(() => {
    window.openRecipeDetail({
      id: 'custom-truffle-tagliatelle',
      title: 'Truffle Butter Tagliatelle',
      imageUrl: 'assets/carbonara.png', // Main dish photo
      ingredients: [
        { name: 'Fresh Tagliatelle Pasta', qty: '300g' }, // No icon provided
        { name: 'Black Summer Truffle Butter', qty: '50g' }, // No icon provided
        { name: 'Parmigiano-Reggiano', qty: '60g' } // No icon provided
      ]
    });
  });
  await page.waitForTimeout(300);

  const customCheck = await page.evaluate(() => {
    const cardNodes = Array.from(document.querySelectorAll('.ingredient-card'));
    const cards = cardNodes.map(c => {
      const name = c.querySelector('.ingredient-name')?.textContent;
      const src = c.querySelector('.ingredient-img-wrapper img')?.getAttribute('src');
      const isDishPhoto = src === 'assets/carbonara.png';
      const isSvgDataUri = src && src.startsWith('data:image/svg+xml');
      return { name, src: src ? src.substring(0, 30) + '...' : null, isDishPhoto, isSvgDataUri };
    });

    return {
      count: cardNodes.length,
      cards,
      noneAreDishPhoto: cards.every(c => !c.isDishPhoto),
      allAreSvgDataUri: cards.every(c => c.isSvgDataUri)
    };
  });

  assert(customCheck.count === 3, 'Custom recipe rendered exactly 3 ingredients');
  assert(customCheck.noneAreDishPhoto, 'Custom recipe ingredients did NOT duplicate the parent cover photo (assets/carbonara.png)');
  assert(customCheck.allAreSvgDataUri, 'Custom recipe ingredients automatically received smart vector category SVG data URIs');

  console.log('\n========================================');
  console.log(`  TOTAL RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) {
    process.exit(1);
  }

  await browser.close();
})();
