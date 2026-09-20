const { chromium } = require('playwright');
const path = require('path');

async function testHeaderAlignment(fileName) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 450, height: 950 }
  });

  const filePath = `file://${path.resolve(__dirname, fileName)}`;
  await page.goto(filePath);
  await page.waitForLoadState('networkidle');

  console.log(`\n========================================`);
  console.log(`TESTING HEADER ALIGNMENT: ${fileName}`);
  console.log(`========================================`);

  const headerBar = await page.$('.header-bar');
  const pageTitle = await page.$('.header-page-title');
  const brandWow = await page.$('.brand-wow');
  const subTitle = await page.$('.sub-title');
  const filterBtn = await page.$('.header-filter-btn');
  const filterIcon = await page.$('.header-filter-btn .material-symbols-outlined');
  const profileHero = await page.$('.profile-hero-card');

  if (!headerBar || !pageTitle || !filterBtn) {
    console.error('ERROR: Required elements not found!');
    await browser.close();
    process.exit(1);
  }

  const hbBox = await headerBar.boundingBox();
  const titleBox = await pageTitle.boundingBox();
  const brandBox = await brandWow.boundingBox();
  const subBox = await subTitle.boundingBox();
  const btnBox = await filterBtn.boundingBox();
  const iconBox = await filterIcon.boundingBox();
  const heroBox = await profileHero.boundingBox();

  console.log('Header Bar Box:', hbBox);
  console.log('Title Container Box:', titleBox);
  console.log('  - Brand "wow" Box:', brandBox);
  console.log('  - Subtitle "profile & setting" Box:', subBox);
  console.log('Filter Button Box:', btnBox);
  console.log('  - Filter Icon (tune) Box:', iconBox);
  console.log('Profile Hero Card Box:', heroBox);

  const titleCenterY = titleBox.y + titleBox.height / 2;
  const btnCenterY = btnBox.y + btnBox.height / 2;
  const iconCenterY = iconBox.y + iconBox.height / 2;
  const deltaBtn = Math.abs(titleCenterY - btnCenterY);
  const deltaIcon = Math.abs(titleCenterY - iconCenterY);

  console.log(`\n--- ALIGNMENT METRICS ---`);
  console.log(`Title Center Y: ${titleCenterY.toFixed(2)}px`);
  console.log(`Button Center Y: ${btnCenterY.toFixed(2)}px`);
  console.log(`Icon Center Y: ${iconCenterY.toFixed(2)}px`);
  console.log(`Delta (Title vs Button): ${deltaBtn.toFixed(2)}px`);
  console.log(`Delta (Title vs Icon): ${deltaIcon.toFixed(2)}px`);

  // Check computed styles
  const headerStyles = await page.evaluate(() => {
    const hb = document.querySelector('.header-bar');
    const title = document.querySelector('.header-page-title');
    const btn = document.querySelector('.header-filter-btn');
    const hbCs = window.getComputedStyle(hb);
    const titleCs = window.getComputedStyle(title);
    const btnCs = window.getComputedStyle(btn);

    return {
      hb: {
        display: hbCs.display,
        flexDirection: hbCs.flexDirection,
        alignItems: hbCs.alignItems,
        justifyContent: hbCs.justifyContent,
        paddingTop: hbCs.paddingTop,
        paddingRight: hbCs.paddingRight,
        paddingBottom: hbCs.paddingBottom,
        paddingLeft: hbCs.paddingLeft,
        marginTop: hbCs.marginTop
      },
      title: {
        display: titleCs.display,
        whiteSpace: titleCs.whiteSpace,
        alignItems: titleCs.alignItems,
        textTransform: titleCs.textTransform,
        lineHeight: titleCs.lineHeight,
        margin: titleCs.margin,
        padding: titleCs.padding
      },
      btn: {
        display: btnCs.display,
        alignItems: btnCs.alignItems,
        justifyContent: btnCs.justifyContent,
        padding: btnCs.padding,
        margin: btnCs.margin,
        width: btnCs.width,
        height: btnCs.height
      }
    };
  });

  console.log('\n--- COMPUTED CSS STYLES ---');
  console.log('Header Bar:', JSON.stringify(headerStyles.hb, null, 2));
  console.log('Title:', JSON.stringify(headerStyles.title, null, 2));
  console.log('Filter Button:', JSON.stringify(headerStyles.btn, null, 2));

  // Screenshots
  const nameBase = fileName.replace('.html', '');
  await headerBar.screenshot({ path: `verified_vertical_alignment_closeup_${nameBase}.png` });
  const viewport = await page.$('#viewport');
  if (viewport) {
    await viewport.screenshot({ path: `verified_vertical_alignment_full_${nameBase}.png` });
  }

  console.log(`\nScreenshots saved: verified_vertical_alignment_closeup_${nameBase}.png and verified_vertical_alignment_full_${nameBase}.png`);

  if (deltaBtn > 2.0) {
    console.error(`FAIL: Vertical alignment delta ${deltaBtn.toFixed(2)}px is too large!`);
    await browser.close();
    process.exit(1);
  } else {
    console.log(`SUCCESS: Perfectly aligned along center baseline!`);
  }

  await browser.close();
}

async function run() {
  await testHeaderAlignment('profile.html');
  await testHeaderAlignment('iot-settings.html');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
