const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Profile Header Stabilization Verification Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl);
  await page.waitForTimeout(500);

  // 1. Verify existence of structural header wrapper & scrollwrapper
  const isFixedHeaderVisible = await page.isVisible('#profile-fixed-header');
  const isScrollContentVisible = await page.isVisible('#profile-scrollable-content');
  console.log('1. Fixed Header Wrapper Visible:', isFixedHeaderVisible);
  console.log('2. Scrollable Content Wrapper Visible:', isScrollContentVisible);

  if (!isFixedHeaderVisible || !isScrollContentVisible) {
    console.error('❌ Header or scrollable content wrapper missing!');
    process.exit(1);
  }

  // 2. Measure initial bounding box of #profile-fixed-header
  const initialHeaderBox = await page.locator('#profile-fixed-header').boundingBox();
  console.log('Initial Header Box:', initialHeaderBox);

  // 3. Scroll lower content track (#profile-scrollable-content) by 300px
  await page.evaluate(() => {
    const el = document.getElementById('profile-scrollable-content');
    if (el) el.scrollTop = 300;
  });
  await page.waitForTimeout(400);

  // 4. Measure header bounding box after scrolling
  const scrolledHeaderBox = await page.locator('#profile-fixed-header').boundingBox();
  console.log('Scrolled Header Box:', scrolledHeaderBox);

  // 5. Verify header position remains 100% locked/fixed at top
  const currentScrollTop = await page.evaluate(() => {
    return document.getElementById('profile-scrollable-content').scrollTop;
  });
  console.log('Current ScrollTop of lower content:', currentScrollTop);

  const headerYDiff = Math.abs(initialHeaderBox.y - scrolledHeaderBox.y);
  console.log('Header Y Position Difference after scroll:', headerYDiff, 'px');

  if (headerYDiff < 2 && currentScrollTop > 0) {
    console.log('✅ SUCCESS: Header layer remains 100% fixed while lower settings options scroll smoothly!');
  } else {
    console.error('❌ FAILURE: Header moved or lower content did not scroll properly.');
    process.exit(1);
  }

  // 6. Capture verification screenshots
  await page.screenshot({ path: path.resolve(__dirname, 'test_header_stabilization_scrolled.png') });
  console.log('Saved test_header_stabilization_scrolled.png');

  await browser.close();
  console.log('🎉 Verification Test Complete!');
})();
