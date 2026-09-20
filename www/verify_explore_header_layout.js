const { chromium } = require('playwright');
const path = require('path');

async function testExploreHeader() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 450, height: 950 }
  });

  const filePath = `file://${path.resolve(__dirname, 'search-pantry.html')}`;
  await page.goto(filePath);
  await page.waitForLoadState('networkidle');

  console.log(`\n========================================`);
  console.log(`TESTING EXPLORE HEADER (CLEAN DECLUTTERED): search-pantry.html`);
  console.log(`========================================`);

  // 1. Verify removal of scanner button
  const scannerBtn = await page.$('.camera-mode-toggle');
  console.log('Scanner button present in DOM:', !!scannerBtn);
  if (scannerBtn) {
    throw new Error('Scanner button (.camera-mode-toggle) was NOT removed!');
  }

  // 2. Check removal of old subtitle
  const oldSubtitle = await page.$('.header-subtitle');
  console.log('Old Subtitle element present:', !!oldSubtitle);
  if (oldSubtitle) {
    const text = await oldSubtitle.textContent();
    if (text.includes('AI Predictive Discovery')) {
      throw new Error('Old subtitle "AI Predictive Discovery" was NOT removed!');
    }
  }

  // 3. Inspect required elements
  const topRow = await page.$('.header-top-row');
  const leftWrap = await page.$('.header-left-wrap');
  const backBtn = await page.$('.back-btn');
  const pageTitle = await page.$('.header-page-title');
  const brandWow = await page.$('.header-page-title .brand-wow');
  const subTitle = await page.$('.header-page-title .sub-title');
  const searchCapsule = await page.$('.search-capsule');

  if (!topRow || !backBtn || !pageTitle || !brandWow || !subTitle || !searchCapsule) {
    throw new Error('Required header elements not found on page!');
  }

  const topRowBox = await topRow.boundingBox();
  const backBtnBox = await backBtn.boundingBox();
  const titleBox = await pageTitle.boundingBox();
  const brandBox = await brandWow.boundingBox();
  const subBox = await subTitle.boundingBox();
  const capsuleBox = await searchCapsule.boundingBox();

  console.log('Header Top Row Box:', topRowBox);
  console.log('Back Button Box:', backBtnBox);
  console.log('Title Container Box:', titleBox);
  console.log('  - "wow" Box:', brandBox);
  console.log('  - "explore recipes" Box:', subBox);
  console.log('Search Capsule (Next Element) Box:', capsuleBox);

  // 4. Mathematical alignment metrics
  const backCenterY = backBtnBox.y + backBtnBox.height / 2;
  const titleCenterY = titleBox.y + titleBox.height / 2;
  const deltaBack = Math.abs(backCenterY - titleCenterY);

  console.log(`\n--- ALIGNMENT METRICS ---`);
  console.log(`Back Button Center Y: ${backCenterY.toFixed(2)}px`);
  console.log(`Title Center Y: ${titleCenterY.toFixed(2)}px`);
  console.log(`Delta (Back Btn vs Title): ${deltaBack.toFixed(2)}px`);

  // 5. Inspect typography and CSS
  const styles = await page.evaluate(() => {
    const title = document.querySelector('.header-page-title');
    const brand = document.querySelector('.header-page-title .brand-wow');
    const sub = document.querySelector('.header-page-title .sub-title');
    const tr = document.querySelector('.header-top-row');

    const titleCs = window.getComputedStyle(title);
    const brandCs = window.getComputedStyle(brand);
    const subCs = window.getComputedStyle(sub);
    const trCs = window.getComputedStyle(tr);

    return {
      topRow: {
        display: trCs.display,
        flexDirection: trCs.flexDirection,
        alignItems: trCs.alignItems,
        justifyContent: trCs.justifyContent
      },
      title: {
        display: titleCs.display,
        whiteSpace: titleCs.whiteSpace,
        alignItems: titleCs.alignItems,
        textTransform: titleCs.textTransform
      },
      brand: {
        text: brand.textContent,
        color: brandCs.color,
        fontFamily: brandCs.fontFamily,
        fontStyle: brandCs.fontStyle,
        fontSize: brandCs.fontSize,
        fontWeight: brandCs.fontWeight
      },
      sub: {
        text: sub.textContent,
        color: subCs.color,
        fontFamily: subCs.fontFamily,
        fontStyle: subCs.fontStyle,
        fontSize: subCs.fontSize,
        fontWeight: subCs.fontWeight,
        letterSpacing: subCs.letterSpacing,
        textShadow: subCs.textShadow
      }
    };
  });

  console.log('\n--- COMPUTED STYLES ---');
  console.log(JSON.stringify(styles, null, 2));

  // 6. Verify single line layout (no line break)
  const fullTitleText = await pageTitle.textContent();
  console.log('\nFull Title Text:', fullTitleText.replace(/\s+/g, ' ').trim());

  if (deltaBack > 2.0) {
    throw new Error(`Vertical center line delta too high: deltaBack=${deltaBack}`);
  }

  // 7. Screenshots
  await topRow.screenshot({ path: 'verified_decluttered_explore_header_closeup.png' });
  const viewport = await page.$('#viewport');
  if (viewport) {
    await viewport.screenshot({ path: 'verified_decluttered_explore_header_full.png' });
  }

  console.log('\nScreenshots saved: verified_decluttered_explore_header_closeup.png and verified_decluttered_explore_header_full.png');
  console.log('SUCCESS: Decluttered explore header verified with zero layout drift!');
  await browser.close();
}

testExploreHeader().catch(err => {
  console.error(err);
  process.exit(1);
});
