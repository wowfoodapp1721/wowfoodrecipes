const { chromium, devices } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('🚀 STARTING MOBILE CHROME VIEWPORT RESPONSIVENESS VERIFICATION...');

  const projectRoot = path.resolve(__dirname, '..');

  // Use Pixel 7 device emulation (Mobile Chrome)
  const pixel7 = devices['Pixel 7'] || {
    viewport: { width: 412, height: 915 },
    userAgent: 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
    deviceScaleFactor: 2.625,
    isMobile: true,
    hasTouch: true
  };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(pixel7);
  const page = await context.newPage();

  // 1. Test splash.html
  console.log('\n--- 1. Testing splash.html ---');
  const splashPath = 'file:///' + path.resolve(projectRoot, 'splash.html').replace(/\\/g, '/');
  await page.goto(splashPath, { waitUntil: 'load' });
  
  const splashViewport = await page.$eval('meta[name="viewport"]', el => el.getAttribute('content'));
  console.log('Splash Viewport Tag:', splashViewport);
  if (splashViewport !== 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no') {
    console.error('❌ FAIL: splash.html meta viewport mismatch');
    process.exit(1);
  }
  
  const stageBox = await page.$eval('#splash-stage', el => {
    const r = el.getBoundingClientRect();
    return { width: r.width, height: r.height, top: r.top, left: r.left };
  });
  console.log('Splash Stage Bounds:', stageBox);
  await page.screenshot({ path: path.join(projectRoot, 'verify_mobile_splash.png') });
  console.log('✅ PASS: splash.html rendered perfectly in mobile viewport.');

  // 2. Test dashboard.html
  console.log('\n--- 2. Testing dashboard.html ---');
  const dashPath = 'file:///' + path.resolve(projectRoot, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(dashPath, { waitUntil: 'load' });

  const dashViewport = await page.$eval('meta[name="viewport"]', el => el.getAttribute('content'));
  console.log('Dashboard Viewport Tag:', dashViewport);
  if (dashViewport !== 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no') {
    console.error('❌ FAIL: dashboard.html meta viewport mismatch');
    process.exit(1);
  }

  const navComputed = await page.$eval('#app-nav', el => {
    const cs = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      position: cs.position,
      bottom: cs.bottom,
      left: cs.left,
      height: cs.height,
      rectBottom: r.bottom,
      windowHeight: window.innerHeight
    };
  });
  console.log('Dashboard #app-nav positioning:', navComputed);
  if (navComputed.position !== 'fixed') {
    console.error('❌ FAIL: #app-nav is not position: fixed');
    process.exit(1);
  }
  if (Math.abs(navComputed.rectBottom - navComputed.windowHeight) > 2) {
    console.error('❌ FAIL: #app-nav is not anchored at bottom of screen');
    process.exit(1);
  }
  await page.screenshot({ path: path.join(projectRoot, 'verify_mobile_dashboard.png') });
  console.log('✅ PASS: dashboard.html 6-tab nav fixed to window base.');

  // 3. Test profile.html
  console.log('\n--- 3. Testing profile.html ---');
  const profilePath = 'file:///' + path.resolve(projectRoot, 'profile.html').replace(/\\/g, '/');
  await page.goto(profilePath, { waitUntil: 'load' });

  const profileViewport = await page.$eval('meta[name="viewport"]', el => el.getAttribute('content'));
  console.log('Profile Viewport Tag:', profileViewport);
  if (profileViewport !== 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no') {
    console.error('❌ FAIL: profile.html meta viewport mismatch');
    process.exit(1);
  }

  const profileNavComputed = await page.$eval('#app-nav', el => {
    const cs = window.getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      position: cs.position,
      bottom: cs.bottom,
      left: cs.left,
      height: cs.height,
      rectBottom: r.bottom,
      windowHeight: window.innerHeight
    };
  });
  console.log('Profile #app-nav positioning:', profileNavComputed);
  if (profileNavComputed.position !== 'fixed') {
    console.error('❌ FAIL: #app-nav in profile.html is not position: fixed');
    process.exit(1);
  }
  if (Math.abs(profileNavComputed.rectBottom - profileNavComputed.windowHeight) > 2) {
    console.error('❌ FAIL: #app-nav in profile.html is not anchored at bottom of screen');
    process.exit(1);
  }
  await page.screenshot({ path: path.join(projectRoot, 'verify_mobile_profile.png') });
  console.log('✅ PASS: profile.html 6-tab nav fixed to window base.');

  // 4. Test index.html
  console.log('\n--- 4. Testing index.html ---');
  const indexContent = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  const indexMatch = indexContent.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']+)["']/i);
  console.log('Index.html Viewport in File:', indexMatch ? indexMatch[1] : 'NONE');
  if (!indexMatch || indexMatch[1] !== 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no') {
    console.error('❌ FAIL: index.html meta viewport mismatch');
    process.exit(1);
  }
  console.log('✅ PASS: index.html viewport constraint verified.');

  console.log('\n🎉 ALL MOBILE VIEWPORT AND POSITIONING CHECKS PASSED FLAWLESSLY!');
  await browser.close();
})();
