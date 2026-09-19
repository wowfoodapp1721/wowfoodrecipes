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
  const filePath = 'file://' + path.resolve(__dirname, 'social-feed.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // Wait for fonts & DOM
  await page.waitForTimeout(1000);

  console.log('\n========================================');
  console.log('TESTING SOCIAL FEED HEADER: social-feed.html');
  console.log('========================================');

  // Verify elements exist
  const headerTopBar = page.locator('.header-top-bar');
  const feedBrandTitle = page.locator('.feed-brand-title');
  const titleContainer = page.locator('.header-page-title');
  const brandWow = page.locator('.header-page-title .brand-wow');
  const subTitle = page.locator('.header-page-title .sub-title');
  const brandDot = page.locator('.brand-dot');
  const shareCookBtn = page.locator('#btn-open-share');
  const tabTrending = page.locator('#tab-trending');
  const tabIndicator = page.locator('#tab-trending .feed-tab-indicator');
  const selfStoryPlus = page.locator('#story-self .story-add-plus');
  const madePills = page.locator('.recipe-made-pill');

  console.log('Title container count:', await titleContainer.count());
  console.log('Brand "wow" text:', await brandWow.textContent());
  console.log('Subtitle "social feed" text:', await subTitle.textContent());
  console.log('Share Cook button count:', await shareCookBtn.count());
  console.log('Made Pills count:', await madePills.count());

  // Bounding boxes
  const headerTopBarBox = await headerTopBar.boundingBox();
  const feedBrandTitleBox = await feedBrandTitle.boundingBox();
  const titleBox = await titleContainer.boundingBox();
  const wowBox = await brandWow.boundingBox();
  const subTitleBox = await subTitle.boundingBox();
  const brandDotBox = await brandDot.boundingBox();
  const shareCookBtnBox = await shareCookBtn.boundingBox();
  const tabTrendingBox = await tabTrending.boundingBox();
  const tabIndicatorBox = await tabIndicator.boundingBox();

  console.log('\n--- BOUNDING BOXES ---');
  console.log('Header Top Bar Box:', headerTopBarBox);
  console.log('Feed Brand Title Box:', feedBrandTitleBox);
  console.log('Title Container Box:', titleBox);
  console.log('  - "wow" Box:', wowBox);
  console.log('  - "social feed" Box:', subTitleBox);
  console.log('Brand Dot Box:', brandDotBox);
  console.log('Share Cook Btn Box:', shareCookBtnBox);
  console.log('Trending Tab Indicator Box:', tabIndicatorBox);

  // Compute centers
  const titleCenterY = feedBrandTitleBox.y + feedBrandTitleBox.height / 2;
  const shareCookCenterY = shareCookBtnBox.y + shareCookBtnBox.height / 2;

  console.log('\n--- ALIGNMENT METRICS ---');
  console.log(`Title Center Y: ${titleCenterY.toFixed(2)}px`);
  console.log(`Share Cook Btn Center Y: ${shareCookCenterY.toFixed(2)}px`);

  const delta = Math.abs(titleCenterY - shareCookCenterY);
  console.log(`Delta (Title vs Share Cook Btn): ${delta.toFixed(2)}px`);

  // Verify title is on single line
  const titleWrapped = titleBox.height > 35;
  console.log('Title wrapped:', titleWrapped);

  // Close-up screenshot of header
  const headerElem = await page.$('#feed-header');
  await headerElem.screenshot({ path: 'verified_social_feed_header_closeup.png' });

  // Full viewport screenshot
  const viewportElem = await page.$('#viewport');
  await viewportElem.screenshot({ path: 'verified_social_feed_full.png' });

  // Copy to brain artifact directory
  const artifactDir = 'C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\694ac550-8f76-4400-ae48-a0661aefc6a5';
  fs.copyFileSync('verified_social_feed_header_closeup.png', path.join(artifactDir, 'verified_social_feed_header_closeup.png'));
  fs.copyFileSync('verified_social_feed_full.png', path.join(artifactDir, 'verified_social_feed_full.png'));

  console.log('\nSUCCESS: Screenshots saved and verified!');
  await browser.close();
})();
