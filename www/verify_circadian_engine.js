const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 AUDIT: ADVANCED JAVASCRIPT CIRCADIAN CONTEXTUAL ENGINE');
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

  // 1. Audit DOM Element ID Bindings
  console.log('1️⃣ Auditing DOM Element ID Bindings...');
  const badge = await page.$('#ai-context-badge');
  const greeting = await page.$('#dashboard-greeting-text');

  if (!badge) throw new Error('#ai-context-badge element not found');
  if (!greeting) throw new Error('#dashboard-greeting-text element not found');

  const initialBadgeText = await badge.textContent();
  const initialGreetingText = await greeting.textContent();
  console.log(`   ✓ Found #ai-context-badge (Current: "${initialBadgeText}")`);
  console.log(`   ✓ Found #dashboard-greeting-text (Current: "${initialGreetingText}")`);

  // 2. Audit Morning Sequence (8:30 AM)
  console.log('\n2️⃣ Testing Morning Sequence (8:30 AM)...');
  const morningRes = await page.evaluate(() => {
    const morningDate = new Date('2026-09-16T08:30:00');
    window.applyCircadianEngine(morningDate);
    return {
      badge: document.getElementById('ai-context-badge').textContent.trim(),
      greeting: document.getElementById('dashboard-greeting-text').textContent.trim()
    };
  });
  console.log(`   Result: Badge="${morningRes.badge}", Greeting="${morningRes.greeting}"`);
  if (morningRes.badge !== '✨ Morning Ritual • Energy Boost' || morningRes.greeting !== 'Good Morning, Sarah!') {
    throw new Error(`Morning sequence mismatch: ${JSON.stringify(morningRes)}`);
  }
  console.log('   ✓ Morning sequence verified: "✨ Morning Ritual • Energy Boost" / "Good Morning, Sarah!"');

  // 3. Audit Afternoon Sequence (Weekday vs Weekend)
  console.log('\n3️⃣ Testing Afternoon Sequence...');
  // 3a. Weekday Afternoon (Wednesday 2:00 PM)
  const weekdayAfternoonRes = await page.evaluate(() => {
    const d = new Date('2026-09-16T14:00:00'); // Wednesday
    window.applyCircadianEngine(d);
    return {
      badge: document.getElementById('ai-context-badge').textContent.trim(),
      greeting: document.getElementById('dashboard-greeting-text').textContent.trim()
    };
  });
  console.log(`   Weekday Afternoon (Wed 2 PM): Badge="${weekdayAfternoonRes.badge}", Greeting="${weekdayAfternoonRes.greeting}"`);
  if (weekdayAfternoonRes.badge !== '✨ Midday Boost • High-Protein Pick' || weekdayAfternoonRes.greeting !== 'Good Afternoon, Sarah!') {
    throw new Error(`Weekday afternoon sequence mismatch: ${JSON.stringify(weekdayAfternoonRes)}`);
  }
  console.log('   ✓ Weekday afternoon verified: "✨ Midday Boost • High-Protein Pick" / "Good Afternoon, Sarah!"');

  // 3b. Weekend Afternoon (Saturday 1:30 PM)
  const weekendAfternoonRes = await page.evaluate(() => {
    const d = new Date('2026-09-19T13:30:00'); // Saturday
    window.applyCircadianEngine(d);
    return {
      badge: document.getElementById('ai-context-badge').textContent.trim(),
      greeting: document.getElementById('dashboard-greeting-text').textContent.trim()
    };
  });
  console.log(`   Weekend Afternoon (Sat 1:30 PM): Badge="${weekendAfternoonRes.badge}", Greeting="${weekendAfternoonRes.greeting}"`);
  if (weekendAfternoonRes.badge !== '✨ Weekend Mode • Mindful Lunch' || weekendAfternoonRes.greeting !== 'Good Afternoon, Sarah!') {
    throw new Error(`Weekend afternoon sequence mismatch: ${JSON.stringify(weekendAfternoonRes)}`);
  }
  console.log('   ✓ Weekend afternoon verified: "✨ Weekend Mode • Mindful Lunch" / "Good Afternoon, Sarah!"');

  // 4. Audit Evening/Night Sequence (Tuesday vs Other Nights vs Late Night)
  console.log('\n4️⃣ Testing Evening/Night Sequence...');
  // 4a. Tuesday Night (Tuesday 8:00 PM)
  const tuesdayNightRes = await page.evaluate(() => {
    const d = new Date('2026-09-15T20:00:00'); // Tuesday
    window.applyCircadianEngine(d);
    return {
      badge: document.getElementById('ai-context-badge').textContent.trim(),
      greeting: document.getElementById('dashboard-greeting-text').textContent.trim()
    };
  });
  console.log(`   Tuesday Night (Tue 8 PM): Badge="${tuesdayNightRes.badge}", Greeting="${tuesdayNightRes.greeting}"`);
  if (tuesdayNightRes.badge !== '✨ Quick Tuesday Night Focus' || tuesdayNightRes.greeting !== 'Good Evening, Sarah!') {
    throw new Error(`Tuesday night sequence mismatch: ${JSON.stringify(tuesdayNightRes)}`);
  }
  console.log('   ✓ Tuesday night verified: "✨ Quick Tuesday Night Focus" / "Good Evening, Sarah!"');

  // 4b. Friday Night (Friday 7:30 PM)
  const fridayNightRes = await page.evaluate(() => {
    const d = new Date('2026-09-18T19:30:00'); // Friday
    window.applyCircadianEngine(d);
    return {
      badge: document.getElementById('ai-context-badge').textContent.trim(),
      greeting: document.getElementById('dashboard-greeting-text').textContent.trim()
    };
  });
  console.log(`   Friday Night (Fri 7:30 PM): Badge="${fridayNightRes.badge}", Greeting="${fridayNightRes.greeting}"`);
  if (fridayNightRes.badge !== '✨ Wind Down • Comfort Dinner' || fridayNightRes.greeting !== 'Good Evening, Sarah!') {
    throw new Error(`Friday night sequence mismatch: ${JSON.stringify(fridayNightRes)}`);
  }
  console.log('   ✓ Other nights verified: "✨ Wind Down • Comfort Dinner" / "Good Evening, Sarah!"');

  // 4c. Late Night (2:00 AM)
  const lateNightRes = await page.evaluate(() => {
    const d = new Date('2026-09-16T02:00:00');
    window.applyCircadianEngine(d);
    return {
      badge: document.getElementById('ai-context-badge').textContent.trim(),
      greeting: document.getElementById('dashboard-greeting-text').textContent.trim()
    };
  });
  console.log(`   Late Night (2 AM): Badge="${lateNightRes.badge}", Greeting="${lateNightRes.greeting}"`);
  if (lateNightRes.badge !== '✨ Wind Down • Comfort Dinner' || lateNightRes.greeting !== 'Good Evening, Sarah!') {
    throw new Error(`Late night sequence mismatch: ${JSON.stringify(lateNightRes)}`);
  }
  console.log('   ✓ Late night verified: "✨ Wind Down • Comfort Dinner" / "Good Evening, Sarah!"');

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL CIRCADIAN CONTEXTUAL ENGINE TESTS PASSED WITH 100% ACCURACY!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('\n❌ AUDIT FAILED:', err);
  process.exit(1);
});
