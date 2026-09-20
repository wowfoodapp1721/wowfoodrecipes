const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 AUDIT: PSYCHOLOGICAL FILTER BAR & HIGH-ATTRACTION AI MATCH ENGINE');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log(`Navigating to Dashboard: ${dashboardUrl}`);
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(400);

  // 1. Audit Filter Pill Container & 7 High-Attraction Category Trigger Buttons
  console.log('\n1️⃣ Auditing Filter Pill Container & 7 High-Attraction Category Buttons...');
  const container = await page.$('#filter-pill-container');
  if (!container) throw new Error('#filter-pill-container element not found');

  const bg = await page.$('#filter-active-bg');
  if (!bg) throw new Error('#filter-active-bg element not found');

  const pills = await page.$$('.category-pill');
  console.log(`   Found ${pills.length} category pills (Expected: 7)`);
  if (pills.length !== 7) {
    throw new Error(`Expected exactly 7 category pills, got ${pills.length}`);
  }

  const expectedButtons = [
    { target: 'all', text: 'ALL EXPLORE' },
    { target: 'dinner', text: 'DINNER • 98% MATCH' },
    { target: 'healthy', text: 'HEALTHY • 95% MATCH' },
    { target: 'keto', text: 'KETO • AI FIT' },
    { target: 'vegan', text: 'PURE VEGAN' },
    { target: 'seafood', text: 'GOURMET SEAFOOD' },
    { target: 'dessert', text: '7-STAR LUXE DESSERT' }
  ];

  for (let i = 0; i < expectedButtons.length; i++) {
    const pill = pills[i];
    const target = await pill.getAttribute('data-target');
    const text = (await pill.textContent()).trim();
    const cls = await pill.getAttribute('class');

    console.log(`   Pill ${i + 1}: data-target="${target}", label="${text}"`);
    if (target !== expectedButtons[i].target) {
      throw new Error(`Pill ${i + 1} data-target mismatch: expected "${expectedButtons[i].target}", got "${target}"`);
    }
    if (text !== expectedButtons[i].text) {
      throw new Error(`Pill ${i + 1} label mismatch: expected "${expectedButtons[i].text}", got "${text}"`);
    }
    if (!cls.includes('shrink-0') || !cls.includes('z-10') || !cls.includes('cursor-pointer')) {
      throw new Error(`Pill ${i + 1} missing required utility classes (shrink-0, z-10, cursor-pointer)`);
    }
  }
  console.log('   ✓ All 7 psychological AI match triggers verified with exact text & attributes');

  // 2. Test Sliding Capsule Physics and Dynamic Width Adaptation
  console.log('\n2️⃣ Testing Sliding Capsule Physics & Dynamic Width Adaptation...');
  for (let i = 0; i < expectedButtons.length; i++) {
    const pill = pills[i];
    const exp = expectedButtons[i];

    console.log(`\n👉 Tapping "${exp.text}" [${exp.target}]...`);
    await pill.click();
    await page.waitForTimeout(300);

    const pillGeom = await pill.evaluate(el => ({
      offsetLeft: el.offsetLeft,
      offsetWidth: el.offsetWidth,
      isWhite: el.classList.contains('text-white'),
      isMuted: el.classList.contains('text-neutral-400')
    }));

    const bgGeom = await bg.evaluate(el => ({
      left: el.style.left,
      width: el.style.width
    }));

    console.log(`   Button: offsetLeft=${pillGeom.offsetLeft}px, offsetWidth=${pillGeom.offsetWidth}px | Active: ${pillGeom.isWhite}`);
    console.log(`   Capsule: left=${bgGeom.left}, width=${bgGeom.width}`);

    if (bgGeom.left !== pillGeom.offsetLeft + 'px') {
      throw new Error(`Capsule left (${bgGeom.left}) mismatch with button offsetLeft (${pillGeom.offsetLeft}px)`);
    }
    if (bgGeom.width !== pillGeom.offsetWidth + 'px') {
      throw new Error(`Capsule width (${bgGeom.width}) mismatch with button offsetWidth (${pillGeom.offsetWidth}px)`);
    }
    if (!pillGeom.isWhite || pillGeom.isMuted) {
      throw new Error(`Active pill should have text-white class`);
    }

    // Verify rendered cards in feed container
    const cards = await page.$$('#recipe-feed-container .recipe-card');
    console.log(`   Feed count for ${exp.target}: ${cards.length} cards`);
    if (cards.length === 0) {
      throw new Error(`No cards rendered for category "${exp.target}"`);
    }
  }

  // 3. Restore ALL State
  console.log('\n👉 Restoring "ALL EXPLORE"...');
  await pills[0].click();
  await page.waitForTimeout(300);

  const finalCards = await page.$$('#recipe-feed-container .recipe-card');
  console.log(`   Restored ALL feed count: ${finalCards.length} cards`);
  if (finalCards.length !== 2) throw new Error('Expected 2 cards restored under ALL');

  // Screenshot
  const screenshotPath = path.resolve(__dirname, 'screenshot_psychological_filter_strip.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`\n📸 Captured screenshot: ${path.basename(screenshotPath)}`);

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🏆 VERIFICATION RESULT: 100% OF PSYCHOLOGICAL FILTER CHECKS PASSED!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
})();
