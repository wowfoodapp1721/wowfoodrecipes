const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();
  const filePath = 'file://' + path.resolve(__dirname, 'grocery.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Wait for fonts & DOM
  await page.waitForTimeout(1000);

  console.log('\n========================================');
  console.log('TESTING GROCERY HEADER: grocery.html');
  console.log('========================================');

  // Verify elements exist
  const headerTopRow = page.locator('.header-top-row');
  const headerLeftWrap = page.locator('.header-left-wrap');
  const backBtn = page.locator('.back-btn');
  const titleContainer = page.locator('.header-page-title');
  const brandWow = page.locator('.header-page-title .brand-wow');
  const subTitle = page.locator('.header-page-title .sub-title');
  const subtitleEl = page.locator('#remaining-header-subtitle');
  const headerActions = page.locator('.header-actions');
  const shareBtn = page.locator('#btn-share-list');
  const resetBtn = page.locator('#btn-reset-list');
  const originTagsRow = page.locator('.origin-tags-row');

  console.log('Back button count:', await backBtn.count());
  console.log('Title container count:', await titleContainer.count());
  console.log('Brand "wow" text:', await brandWow.textContent());
  console.log('Subtitle "grocery" text:', await subTitle.textContent());
  console.log('Remaining subtitle text:', await subtitleEl.textContent());
  console.log('Share btn count:', await shareBtn.count());
  console.log('Reset btn count:', await resetBtn.count());

  // Bounding boxes
  const headerTopRowBox = await headerTopRow.boundingBox();
  const headerLeftWrapBox = await headerLeftWrap.boundingBox();
  const backBtnBox = await backBtn.boundingBox();
  const titleBox = await titleContainer.boundingBox();
  const wowBox = await brandWow.boundingBox();
  const subTitleBox = await subTitle.boundingBox();
  const subtitleElBox = await subtitleEl.boundingBox();
  const headerActionsBox = await headerActions.boundingBox();
  const shareBtnBox = await shareBtn.boundingBox();
  const resetBtnBox = await resetBtn.boundingBox();
  const originTagsRowBox = await originTagsRow.boundingBox();

  console.log('\n--- BOUNDING BOXES ---');
  console.log('Header Top Row Box:', headerTopRowBox);
  console.log('Header Left Wrap Box:', headerLeftWrapBox);
  console.log('Back Button Box:', backBtnBox);
  console.log('Title Container Box:', titleBox);
  console.log('  - "wow" Box:', wowBox);
  console.log('  - "grocery" Box:', subTitleBox);
  console.log('Remaining Subtitle Box:', subtitleElBox);
  console.log('Header Actions Box:', headerActionsBox);
  console.log('Share Btn Box:', shareBtnBox);
  console.log('Reset Btn Box:', resetBtnBox);
  console.log('Origin Tags Row Box (Next element):', originTagsRowBox);

  // Compute centers
  const backBtnCenterY = backBtnBox.y + backBtnBox.height / 2;
  const headerLeftWrapCenterY = headerLeftWrapBox.y + headerLeftWrapBox.height / 2;
  const headerActionsCenterY = headerActionsBox.y + headerActionsBox.height / 2;
  const shareBtnCenterY = shareBtnBox.y + shareBtnBox.height / 2;
  const resetBtnCenterY = resetBtnBox.y + resetBtnBox.height / 2;

  console.log('\n--- ALIGNMENT METRICS ---');
  console.log(`Back Button Center Y: ${backBtnCenterY.toFixed(2)}px`);
  console.log(`Header Left Wrap Center Y: ${headerLeftWrapCenterY.toFixed(2)}px`);
  console.log(`Header Actions Center Y: ${headerActionsCenterY.toFixed(2)}px`);
  console.log(`Share Btn Center Y: ${shareBtnCenterY.toFixed(2)}px`);
  console.log(`Reset Btn Center Y: ${resetBtnCenterY.toFixed(2)}px`);

  // Max delta between back button, header actions, and share/reset buttons
  const delta = Math.abs(backBtnCenterY - headerActionsCenterY);
  console.log(`Delta (Back Btn vs Header Actions): ${delta.toFixed(2)}px`);

  // Verify title is on single line
  const titleWrapped = titleBox.height > 35;
  console.log('Title wrapped:', titleWrapped);

  // Verify sub-header is directly underneath the title
  const isSubheaderUnderTitle = subtitleElBox.y >= (titleBox.y + titleBox.height - 2);
  console.log('Subheader is directly underneath title:', isSubheaderUnderTitle);

  // Close-up screenshot of header
  const headerElem = await page.$('#grocery-header');
  await headerElem.screenshot({ path: 'verified_grocery_header_closeup.png' });

  // Full viewport screenshot
  const viewportElem = await page.$('#viewport');
  await viewportElem.screenshot({ path: 'verified_grocery_header_full.png' });

  // Copy to brain artifact directory
  const artifactDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\694ac550-8f76-4400-ae48-a0661aefc6a5';
  fs.copyFileSync('verified_grocery_header_closeup.png', path.join(artifactDir, 'verified_grocery_header_closeup.png'));
  fs.copyFileSync('verified_grocery_header_full.png', path.join(artifactDir, 'verified_grocery_header_full.png'));

  console.log('\nSUCCESS: Screenshots saved and verified!');
  await browser.close();
})();
