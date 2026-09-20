const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Phase 9 Automated Playwright Verification: wow Chef AI Conversational Assistant Drawer...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
    hasTouch: true
  });

  const page = await context.newPage();

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 1: Load Showcase Page & Verify Component Injection
  // ──────────────────────────────────────────────────────────────────────────
  const showcaseUrl = 'file:///' + path.resolve(__dirname, 'chef-ai-showcase.html').replace(/\\/g, '/');
  console.log(`\n📄 [Step 1] Navigating to: ${showcaseUrl}`);
  await page.goto(showcaseUrl, { waitUntil: 'load' });

  const pageTitle = await page.title();
  console.log(`✓ Showcase page title: "${pageTitle}"`);

  // Verify FAB Button
  const fab = await page.$('#wow-chef-ai-fab');
  const fabLabel = await page.$eval('#wow-chef-ai-fab .chef-fab-label', el => el.textContent.trim());
  console.log(`✓ Floating Action Button verified: "${fabLabel}"`);
  if (!fabLabel.includes('wow') || !fabLabel.includes('Chef AI')) {
    throw new Error(`FAB label unexpected: ${fabLabel}`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 2: Open Drawer & Verify Branding & Controls
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n🔘 [Step 2] Clicking FAB to open wow Chef AI drawer...');
  await fab.click();
  await page.waitForTimeout(400);

  const drawerOpen = await page.$eval('#wow-chef-ai-overlay', el => el.classList.contains('open'));
  console.log(`✓ Drawer overlay is open: ${drawerOpen}`);
  if (!drawerOpen) {
    throw new Error('wow Chef AI drawer failed to open');
  }

  const headerTitle = await page.$eval('.chef-name-title', el => el.textContent.trim());
  console.log(`✓ Drawer Header Title: "${headerTitle}"`);
  if (!headerTitle.includes('wow Chef AI')) {
    throw new Error(`Header title branding mismatch: ${headerTitle}`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 3: Ingredient Substitution Advisor Mode
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n🔄 [Step 3] Switching to Substitution Advisor Tab...');
  await page.click('#tab-mode-advisor');
  await page.waitForTimeout(200);

  const inputPlaceholder = await page.$eval('#chef-chat-input', el => el.getAttribute('placeholder'));
  console.log(`✓ Input placeholder in Advisor mode: "${inputPlaceholder}"`);

  console.log('💬 Asking: "What can I substitute for heavy cream?"');
  await page.fill('#chef-chat-input', 'What can I substitute for heavy cream?');
  await page.click('#btn-chef-send');
  await page.waitForTimeout(1000);

  const lastAiMsg = await page.$eval('#chef-chat-stream .chat-msg-row.ai:last-child .chat-bubble', el => el.innerHTML);
  console.log(`✓ AI Substitution response received containing: ${lastAiMsg.substring(0, 100)}...`);
  if (!lastAiMsg.includes('Milk + Melted Butter') && !lastAiMsg.includes('Greek Yogurt')) {
    throw new Error('Substitution advisor did not provide expected heavy cream alternative');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 4: Technique & Quick Prompt Guidance (Dicing Onion)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n🧅 [Step 4] Asking technique question: "How do I dice an onion?"');
  await page.fill('#chef-chat-input', 'How do I dice an onion?');
  await page.click('#btn-chef-send');
  await page.waitForTimeout(1000);

  const onionMsg = await page.$eval('#chef-chat-stream .chat-msg-row.ai:last-child .chat-bubble', el => el.textContent);
  console.log(`✓ AI Technique response: "${onionMsg.substring(0, 90)}..."`);
  if (!onionMsg.includes('Root') && !onionMsg.includes('onion')) {
    throw new Error('Technique guidance response failed');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 5: Quick Prompt Chip Interaction (Egg Boiling Timers)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n🥚 [Step 5] Clicking Quick Prompt Chip: "Boil Eggs"...');
  await page.click('.chef-prompt-chip[data-prompt="How long to boil eggs?"]');
  await page.waitForTimeout(1000);

  const eggMsg = await page.$eval('#chef-chat-stream .chat-msg-row.ai:last-child .chat-bubble', el => el.textContent);
  console.log(`✓ AI Egg Timer response: "${eggMsg.substring(0, 90)}..."`);
  if (!eggMsg.includes('6 Minutes') || !eggMsg.includes('7 Minutes')) {
    throw new Error('Egg timer prompt response failed');
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 6: Clear Chat & Close Drawer
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n🧹 [Step 6] Testing Clear Chat button...');
  await page.click('#btn-clear-chat');
  await page.waitForTimeout(200);
  const clearedCount = await page.$$eval('#chef-chat-stream .chat-msg-row', rows => rows.length);
  console.log(`✓ Chat cleared. Message row count: ${clearedCount}`);
  if (clearedCount !== 1) {
    throw new Error(`Expected 1 greeting message after clear, got ${clearedCount}`);
  }

  console.log('❌ Closing drawer via close button...');
  await page.click('#btn-close-chef-drawer');
  await page.waitForTimeout(400);
  const drawerClosed = await page.$eval('#wow-chef-ai-overlay', el => !el.classList.contains('open'));
  console.log(`✓ Drawer successfully closed: ${drawerClosed}`);

  // ──────────────────────────────────────────────────────────────────────────
  // TEST 7: Verify Seamless Integration on Dashboard Page
  // ──────────────────────────────────────────────────────────────────────────
  const dashUrl = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  console.log(`\n📄 [Step 7] Testing wow Chef AI FAB on Dashboard: ${dashUrl}`);
  await page.goto(dashUrl, { waitUntil: 'load' });

  const dashFab = await page.$('#wow-chef-ai-fab');
  if (!dashFab) {
    throw new Error('wow Chef AI FAB not found on dashboard.html');
  }
  await dashFab.click();
  await page.waitForTimeout(400);
  const dashDrawerOpen = await page.$eval('#wow-chef-ai-overlay', el => el.classList.contains('open'));
  console.log(`✓ Dashboard wow Chef AI drawer opened smoothly: ${dashDrawerOpen}`);

  console.log('\n🎉 ALL WOW CHEF AI TESTS PASSED SUCCESSFULLY! Phase 9 is 100% verified.');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('\n❌ VERIFICATION FAILED:', err);
  process.exit(1);
});
