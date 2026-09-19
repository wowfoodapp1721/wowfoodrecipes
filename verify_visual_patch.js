const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 AUDIT: SEARCH INPUT VISUAL CLEANUP & FLOATING ASSISTANT WIDGET DEPTH');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  const dashboardUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(dashboardUrl, { waitUntil: 'load' });
  await page.waitForTimeout(300);

  // 1. Audit Search Bar Input Visual Cleanup
  console.log('1️⃣ Auditing Search Bar Input Visual Cleanup Utility Classes...');
  const searchInput = await page.$('#recipe-search');
  if (!searchInput) throw new Error('#recipe-search input not found');

  const inputClasses = await searchInput.getAttribute('class');
  console.log(`   Search input classes: "${inputClasses}"`);

  const requiredInputClasses = [
    'bg-transparent',
    'bg-opacity-0',
    'outline-none',
    'border-none',
    'border-transparent',
    'focus:bg-transparent',
    'focus:outline-none',
    'focus:ring-0'
  ];

  for (const reqClass of requiredInputClasses) {
    if (!inputClasses.includes(reqClass)) {
      throw new Error(`Search input missing required class: "${reqClass}". Full class list: "${inputClasses}"`);
    }
  }
  console.log('   ✓ All 8 search input visual cleanup utility classes confirmed present.');

  const inputStyles = await searchInput.evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      borderTopWidth: cs.borderTopWidth,
      outlineStyle: cs.outlineStyle
    };
  });
  console.log('   ✓ Search input computed rendering:', inputStyles);
  if (inputStyles.backgroundColor !== 'rgba(0, 0, 0, 0)' && inputStyles.backgroundColor !== 'transparent') {
    throw new Error(`Search input background is not transparent: ${inputStyles.backgroundColor}`);
  }

  // 2. Audit Floating Assistant Widget Depth Z-Index Fix
  console.log('\n2️⃣ Auditing Floating Widget Depth Z-Index Fix...');
  const fab = await page.$('#wow-chef-ai-fab');
  if (!fab) throw new Error('#wow-chef-ai-fab not found');

  const fabClasses = await fab.getAttribute('class');
  console.log(`   FAB classes: "${fabClasses}"`);

  const requiredFabClasses = [
    'z-30',
    'shadow-[0_4px_24px_rgba(255,0,0,0.25)]',
    'relative',
    'sm:absolute'
  ];

  for (const reqClass of requiredFabClasses) {
    if (!fabClasses.includes(reqClass)) {
      throw new Error(`FAB missing required depth class: "${reqClass}". Full class list: "${fabClasses}"`);
    }
  }
  console.log('   ✓ All floating widget depth classes confirmed present: "z-30 shadow-[0_4px_24px_rgba(255,0,0,0.25)] relative sm:absolute"');

  // 3. Audit Micro-Animation Assistant Engagement
  console.log('\n3️⃣ Auditing Micro-Animation Assistant Engagement...');
  const pulseMarker = await page.$('#wow-chef-ai-fab .chef-fab-pulse');
  if (!pulseMarker) throw new Error('.chef-fab-pulse not found inside FAB');

  const pulseClasses = await pulseMarker.getAttribute('class');
  console.log(`   Pulse marker classes: "${pulseClasses}"`);
  if (!pulseClasses.includes('animate-pulse')) {
    throw new Error(`Pulse marker missing "animate-pulse" class. Full class: "${pulseClasses}"`);
  }
  console.log('   ✓ Status marker contains "animate-pulse" utility class.');

  const pulseStyles = await pulseMarker.evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      backgroundColor: cs.backgroundColor,
      borderRadius: cs.borderRadius,
      animationName: cs.animationName
    };
  });
  console.log('   ✓ Red status marker computed styles:', pulseStyles);
  if (!pulseStyles.backgroundColor.includes('255, 59, 48')) {
    throw new Error(`Pulse marker background is not red: ${pulseStyles.backgroundColor}`);
  }

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL VISUAL ASSET CORRECTION PATCH AUDITS PASSED WITH 100% SUCCESS!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err);
  process.exit(1);
});
