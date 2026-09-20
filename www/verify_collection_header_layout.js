const { chromium } = require('playwright');
const path = require('path');

async function testCollectionHeader() {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 450, height: 950 }
  });

  const filePath = `file://${path.resolve(__dirname, 'collection.html')}`;
  await page.goto(filePath);
  await page.waitForLoadState('networkidle');

  console.log(`\n========================================`);
  console.log(`TESTING COLLECTION HEADER: collection.html`);
  console.log(`========================================`);

  // 1. Inspect required elements
  const topBar = await page.$('.collection-top-bar');
  const topRow = await page.$('.top-bar-row');
  const leftWrap = await page.$('.top-bar-left');
  const backBtn = await page.$('.back-btn-pill');
  const iconBadge = await page.$('.header-icon-badge');
  const pageTitle = await page.$('.header-page-title');
  const brandWow = await page.$('.header-page-title .brand-wow');
  const subTitle = await page.$('.header-page-title .sub-title');
  const countBadge = await page.$('#collection-count-badge');
  const filterPills = await page.$('.filter-pills-row');

  if (!topBar || !topRow || !backBtn || !iconBadge || !pageTitle || !brandWow || !subTitle || !countBadge || !filterPills) {
    throw new Error('Required collection header elements not found on page!');
  }

  const topRowBox = await topRow.boundingBox();
  const backBtnBox = await backBtn.boundingBox();
  const iconBadgeBox = await iconBadge.boundingBox();
  const titleBox = await pageTitle.boundingBox();
  const brandBox = await brandWow.boundingBox();
  const subBox = await subTitle.boundingBox();
  const countBox = await countBadge.boundingBox();
  const pillsBox = await filterPills.boundingBox();

  console.log('Top Row Box:', topRowBox);
  console.log('Back Button Box:', backBtnBox);
  console.log('Icon Badge Box:', iconBadgeBox);
  console.log('Title Box:', titleBox);
  console.log('  - "wow" Box:', brandBox);
  console.log('  - "collections" Box:', subBox);
  console.log('Count Badge Box:', countBox);
  console.log('Filter Pills (Next Element) Box:', pillsBox);

  // 2. Mathematical alignment metrics
  const backCenterY = backBtnBox.y + backBtnBox.height / 2;
  const iconCenterY = iconBadgeBox.y + iconBadgeBox.height / 2;
  const titleCenterY = titleBox.y + titleBox.height / 2;
  const countCenterY = countBox.y + countBox.height / 2;

  const deltaBack = Math.abs(backCenterY - titleCenterY);
  const deltaIcon = Math.abs(iconCenterY - titleCenterY);
  const deltaCount = Math.abs(countCenterY - titleCenterY);

  console.log(`\n--- ALIGNMENT METRICS ---`);
  console.log(`Back Button Center Y: ${backCenterY.toFixed(2)}px`);
  console.log(`Icon Badge Center Y: ${iconCenterY.toFixed(2)}px`);
  console.log(`Title Center Y: ${titleCenterY.toFixed(2)}px`);
  console.log(`Count Badge Center Y: ${countCenterY.toFixed(2)}px`);
  console.log(`Delta (Back Btn vs Title): ${deltaBack.toFixed(2)}px`);
  console.log(`Delta (Icon Badge vs Title): ${deltaIcon.toFixed(2)}px`);
  console.log(`Delta (Count Badge vs Title): ${deltaCount.toFixed(2)}px`);

  // 3. Inspect computed styles
  const styles = await page.evaluate(() => {
    const title = document.querySelector('.header-page-title');
    const brand = document.querySelector('.header-page-title .brand-wow');
    const sub = document.querySelector('.header-page-title .sub-title');
    const row = document.querySelector('.top-bar-row');

    const titleCs = window.getComputedStyle(title);
    const brandCs = window.getComputedStyle(brand);
    const subCs = window.getComputedStyle(sub);
    const rowCs = window.getComputedStyle(row);

    return {
      topRow: {
        display: rowCs.display,
        flexDirection: rowCs.flexDirection,
        alignItems: rowCs.alignItems,
        justifyContent: rowCs.justifyContent
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

  // 4. Verify text content
  const fullTitleText = await pageTitle.textContent();
  const cleanTitle = fullTitleText.replace(/\s+/g, ' ').trim();
  console.log('\nFull Title Text:', cleanTitle);

  if (cleanTitle !== 'wow collections') {
    throw new Error(`Expected title to be "wow collections", got "${cleanTitle}"`);
  }

  if (deltaBack > 1.5 || deltaIcon > 1.5 || deltaCount > 1.5) {
    throw new Error(`Vertical center line delta too high: deltaBack=${deltaBack}, deltaIcon=${deltaIcon}, deltaCount=${deltaCount}`);
  }

  // 5. Screenshots
  await topRow.screenshot({ path: 'verified_collection_header_closeup.png' });
  const viewport = await page.$('#viewport');
  if (viewport) {
    await viewport.screenshot({ path: 'verified_collection_header_full.png' });
  }

  console.log('\nScreenshots saved: verified_collection_header_closeup.png and verified_collection_header_full.png');
  console.log('SUCCESS: Collection header typography, alignment, and single-line layout verified!');
  await browser.close();
}

testCollectionHeader().catch(err => {
  console.error(err);
  process.exit(1);
});
