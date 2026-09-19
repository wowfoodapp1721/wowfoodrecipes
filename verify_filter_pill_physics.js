const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🧪 AUDIT: CATEGORY FILTER STRIP HIERARCHY, PHYSICS & CLICK HANDLERS');
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

  // 1. Audit Container Layout Depth & Hierarchy
  console.log('\n1️⃣ Auditing Filter Pill Container Layout & Hierarchy...');
  const container = await page.$('#filter-pill-container');
  if (!container) throw new Error('#filter-pill-container element not found');

  const containerCls = await container.getAttribute('class');
  console.log(`   Container classes: "${containerCls}"`);
  if (!containerCls.includes('relative') || !containerCls.includes('z-20') || !containerCls.includes('pointer-events-auto')) {
    throw new Error('Container must include relative z-20 pointer-events-auto depth hierarchy');
  }
  console.log('   ✓ Container depth verified: "relative z-20 pointer-events-auto"');

  // 2. Audit Absolute Sliding Background Capsule
  console.log('\n2️⃣ Auditing Sliding Background Capsule (#filter-active-bg)...');
  const bg = await page.$('#filter-active-bg');
  if (!bg) throw new Error('#filter-active-bg element not found');

  const bgCls = await bg.getAttribute('class');
  console.log(`   Capsule classes: "${bgCls}"`);
  if (!bgCls.includes('absolute') || !bgCls.includes('bg-red-600') || !bgCls.includes('pointer-events-none') || !bgCls.includes('z-0')) {
    throw new Error('Capsule missing required classes: absolute bg-red-600 pointer-events-none z-0');
  }
  console.log('   ✓ Sliding capsule layer verified with absolute positioning behind text (z-0)');

  // 3. Audit Category Pills Markup & Text
  console.log('\n3️⃣ Auditing Category Action Buttons...');
  const pills = await page.$$('.category-pill');
  if (pills.length !== 4) {
    throw new Error(`Expected exactly 4 category pills, found ${pills.length}`);
  }

  const expectedPills = [
    { target: 'all', text: 'ALL (24)' },
    { target: 'dinner', text: 'DINNER (12)' },
    { target: 'healthy', text: 'HEALTHY (8)' },
    { target: 'keto', text: 'KETO (4)' }
  ];

  for (let i = 0; i < expectedPills.length; i++) {
    const pill = pills[i];
    const target = await pill.getAttribute('data-target');
    const text = (await pill.textContent()).trim();
    const pillCls = await pill.getAttribute('class');

    console.log(`   Button ${i + 1}: target="${target}", text="${text}"`);
    if (target !== expectedPills[i].target) {
      throw new Error(`Button ${i + 1} data-target mismatch: expected ${expectedPills[i].target}, got ${target}`);
    }
    if (text !== expectedPills[i].text) {
      throw new Error(`Button ${i + 1} text mismatch: expected ${expectedPills[i].text}, got ${text}`);
    }
    if (!pillCls.includes('z-10') || !pillCls.includes('cursor-pointer')) {
      throw new Error(`Button ${i + 1} missing z-10 or cursor-pointer`);
    }
  }
  console.log('   ✓ All 4 category pills verified with exact data-target, labels, and z-10 layout');

  // 4. Test Initial Sliding Capsule Geometry Alignment
  console.log('\n4️⃣ Testing Sliding Capsule Physics & Click Interaction Transitions...');
  const initialBgGeom = await bg.evaluate(el => ({
    left: el.style.left,
    width: el.style.width,
    offsetLeft: el.offsetLeft,
    offsetWidth: el.offsetWidth
  }));
  const firstPillGeom = await pills[0].evaluate(el => ({
    offsetLeft: el.offsetLeft,
    offsetWidth: el.offsetWidth
  }));
  console.log('   Initial Capsule Geometry:', initialBgGeom);
  console.log('   First Pill (ALL) Geometry:', firstPillGeom);
  if (parseInt(initialBgGeom.width) !== firstPillGeom.offsetWidth) {
    throw new Error(`Initial capsule width (${initialBgGeom.width}) should match ALL pill (${firstPillGeom.offsetWidth}px)`);
  }
  console.log('   ✓ Initial active frame aligned perfectly with "ALL (24)"');

  // 5. Click DINNER Pill & Verify Transition
  console.log('\n👉 Tapping "DINNER (12)" pill...');
  await pills[1].click();
  await page.waitForTimeout(350); // Allow physics animation

  const dinnerPillGeom = await pills[1].evaluate(el => ({
    offsetLeft: el.offsetLeft,
    offsetWidth: el.offsetWidth,
    hasWhiteText: el.classList.contains('text-white'),
    hasMutedText: el.classList.contains('text-neutral-400')
  }));
  const dinnerBgGeom = await bg.evaluate(el => ({
    left: el.style.left,
    width: el.style.width
  }));
  console.log(`   Dinner Capsule pos: left=${dinnerBgGeom.left}, width=${dinnerBgGeom.width}`);
  console.log(`   Dinner Pill offset: offsetLeft=${dinnerPillGeom.offsetLeft}px, offsetWidth=${dinnerPillGeom.offsetWidth}px`);

  if (dinnerBgGeom.left !== dinnerPillGeom.offsetLeft + 'px') {
    throw new Error(`Capsule left (${dinnerBgGeom.left}) did not match DINNER pill offsetLeft (${dinnerPillGeom.offsetLeft}px)`);
  }
  if (!dinnerPillGeom.hasWhiteText || dinnerPillGeom.hasMutedText) {
    throw new Error('DINNER pill should have text-white class after click');
  }
  console.log('   ✓ Capsule dynamically slid to DINNER pill position with active text color');

  // 6. Click HEALTHY Pill & Verify
  console.log('\n👉 Tapping "HEALTHY (8)" pill...');
  await pills[2].click();
  await page.waitForTimeout(350);

  const healthyBgGeom = await bg.evaluate(el => ({ left: el.style.left, width: el.style.width }));
  const healthyPillOffset = await pills[2].evaluate(el => el.offsetLeft + 'px');
  if (healthyBgGeom.left !== healthyPillOffset) {
    throw new Error(`Capsule left (${healthyBgGeom.left}) did not match HEALTHY pill offsetLeft (${healthyPillOffset})`);
  }
  console.log('   ✓ Capsule dynamically slid to HEALTHY pill position');

  // 7. Click KETO Pill & Verify
  console.log('\n👉 Tapping "KETO (4)" pill...');
  await pills[3].click();
  await page.waitForTimeout(350);

  const ketoBgGeom = await bg.evaluate(el => ({ left: el.style.left, width: el.style.width }));
  const ketoPillOffset = await pills[3].evaluate(el => el.offsetLeft + 'px');
  if (ketoBgGeom.left !== ketoPillOffset) {
    throw new Error(`Capsule left (${ketoBgGeom.left}) did not match KETO pill offsetLeft (${ketoPillOffset})`);
  }
  console.log('   ✓ Capsule dynamically slid to KETO pill position');

  // 8. Restore ALL Pill
  console.log('\n👉 Restoring "ALL (24)" pill...');
  await pills[0].click();
  await page.waitForTimeout(350);

  const allRestoredBg = await bg.evaluate(el => ({ left: el.style.left, width: el.style.width }));
  const allOffset = await pills[0].evaluate(el => el.offsetLeft + 'px');
  if (allRestoredBg.left !== allOffset) {
    throw new Error(`Capsule left did not return to ALL pill position`);
  }
  console.log('   ✓ Capsule returned cleanly to ALL pill position');

  // Take screenshot of interactive strip
  const screenshotPath = path.resolve(__dirname, 'screenshot_filter_physics_strip.png');
  await page.screenshot({ path: screenshotPath });
  console.log(`\n📸 Captured screenshot: ${path.basename(screenshotPath)}`);

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🏆 VERIFICATION RESULT: ALL FILTER PHYSICS & HIERARCHY CHECKS PASSED!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
})();
