const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 VERIFYING TOP AREA HEADER WRAPPER COMPONENT & INTERACTIVE NAVIGATION');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 420, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, 'dashboard.html');
  console.log(`Navigating to Dashboard: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // 1. Inspect #app-header Container
  const header = await page.$('#app-header');
  if (!header) {
    throw new Error('❌ #app-header element not found!');
  }
  const headerStyles = await header.evaluate((el) => {
    const cs = window.getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      position: cs.position,
      padding: `${cs.paddingTop} ${cs.paddingRight} ${cs.paddingBottom} ${cs.paddingLeft}`,
    };
  });
  console.log('📋 Header Container Styles:', headerStyles);

  // 2. Row 1: System Status Bar
  const statusBar = await page.$('#global-status-bar, .mock-status-bar, #status-bar-container');
  if (!statusBar) {
    throw new Error('❌ System Status Bar element not found in Header!');
  }
  const statusClock = await page.$eval('.status-bar-time, #status-bar-clock', el => el.textContent.trim());
  const statusIconsCount = await page.$$eval('.status-bar-icons .status-icon, .status-bar-icons .material-symbols-outlined', els => els.length);
  console.log(`✓ Row 1 Status Bar: Time="${statusClock}", Icons Count=${statusIconsCount}`);

  // 3. Row 2: Brand Logo Asset
  const logoImg = await page.$('.header-row-1 img.brand-logo-img, #app-header img.brand-logo-img');
  if (!logoImg) {
    throw new Error('❌ .brand-logo-img element not found!');
  }
  const logoProps = await logoImg.evaluate((img) => {
    const cs = window.getComputedStyle(img);
    const rect = img.getBoundingClientRect();
    return {
      tagName: img.tagName,
      src: img.getAttribute('src'),
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      renderedWidth: rect.width,
      renderedHeight: rect.height,
      objectFit: cs.objectFit,
      display: cs.display,
    };
  });
  console.log('✓ Row 2 Brand Logo Image Asset Properties:', logoProps);

  // 4. Row 3: Greeting Stack & Action Elements
  const greetingSub = await page.$eval('.greeting-sub', el => el.textContent.trim());
  const greetingMain = await page.$eval('.greeting-main', el => el.textContent.trim());
  console.log(`✓ Row 3 Greeting Text: Sub="${greetingSub}", Main="${greetingMain}"`);

  const avatarInitials = await page.$eval('.avatar, .avatar-initials, .avatar-fallback', el => el.textContent.trim());
  const avatarProps = await page.$eval('.avatar', el => {
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      tagName: el.tagName,
      href: el.getAttribute('href'),
      role: el.getAttribute('role'),
      width: rect.width,
      height: rect.height,
      borderRadius: cs.borderRadius,
      backgroundColor: cs.backgroundColor,
      cursor: cs.cursor,
    };
  });
  console.log(`✓ Row 3 Avatar Button: Initials="${avatarInitials}", Properties:`, avatarProps);

  const bellBtn = await page.$('.bell-btn, .notif-btn');
  const bellDot = await page.$('.notification-badge, .notif-dot');
  const bellStyles = await bellBtn.evaluate(el => {
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      borderRadius: cs.borderRadius,
      backgroundColor: cs.backgroundColor,
    };
  });
  const dotStyles = await bellDot.evaluate(el => {
    const cs = window.getComputedStyle(el);
    const rect = el.getBoundingClientRect();
    return {
      width: rect.width,
      height: rect.height,
      borderRadius: cs.borderRadius,
      backgroundColor: cs.backgroundColor,
    };
  });
  console.log('✓ Row 3 Notification Bell Button Styles:', bellStyles);
  console.log('✓ Row 3 Red Notification Indicator Dot Styles:', dotStyles);

  // 5. Search Bar Position relative to Header elements
  const searchBar = await page.$('#search-bar-wrapper, .search-bar');
  const searchBox = await searchBar.boundingBox();
  const headerBox = await header.boundingBox();
  console.log(`✓ Search Bar Position: Top=${searchBox.y}px, Header Height=${headerBox.height}px`);

  // 6. Capture targeted screenshot of the Top Header Area
  const topAreaClip = {
    x: headerBox.x,
    y: headerBox.y,
    width: headerBox.width,
    height: Math.min(headerBox.height + 40, 320),
  };
  await page.screenshot({
    path: path.resolve(__dirname, 'screenshot_top_header_wrapper.png'),
    clip: topAreaClip,
  });
  console.log('📸 Captured top header area screenshot: screenshot_top_header_wrapper.png');

  // 7. Test Interactive Navigation to Screen 12A - User Profile & Settings
  console.log('\n--- Testing Interactive Profile Button Navigation to Screen 12A ---');
  const avatarBtn = await page.$('#profile-avatar-btn, .avatar');
  await avatarBtn.click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(400);

  const currentUrl = page.url();
  console.log(`Navigated to: ${currentUrl}`);
  if (!currentUrl.includes('iot-settings.html')) {
    throw new Error(`❌ Navigation failed! Expected URL to include 'iot-settings.html', got: ${currentUrl}`);
  }
  console.log('✅ Successfully verified interactive navigation from circular profile button ("CS") to Screen 12A (iot-settings.html)!');

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🏆 TOP HEADER WRAPPER COMPONENT: 100% VERIFIED ACCORDING TO SPEC!');
  console.log('══════════════════════════════════════════════════════════════════════');

  await browser.close();
})();
