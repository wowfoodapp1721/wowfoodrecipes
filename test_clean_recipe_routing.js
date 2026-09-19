const { chromium } = require('playwright');
const assert = require('assert');
const path = require('path');
const fileBase = 'file:///' + path.resolve(__dirname).replace(/\\/g, '/');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 }
  });

  console.log('1. Loading dashboard.html...');
  await page.goto(`${fileBase}/dashboard.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(600);

  // Verify dashboard has "wow Chef AI SPARKLES" badge
  const sparklesBadge = page.locator('text=SPARKLES').first();
  const hasSparkles = await sparklesBadge.isVisible();
  console.log('2. Dashboard contains "wow Chef AI SPARKLES":', hasSparkles);
  assert(hasSparkles, 'Dashboard must feature "wow Chef AI SPARKLES" badge');

  // Locate "Curated Pasta Creation" recipe card
  const pastaCard = page.locator('article:has-text("Curated Pasta Creation"), #card-carbonara, #card-curated-pasta-creation').first();
  const pastaCardExists = await pastaCard.count();
  console.log('3. Curated Pasta card found:', pastaCardExists > 0);
  assert(pastaCardExists > 0, 'Spaghetti Carbonara / Curated Pasta card must exist');

  // Click on the Curated Pasta card
  console.log('4. Clicking Curated Pasta Creation card...');
  await Promise.all([
    page.waitForURL(/recipe-detail\.html/),
    pastaCard.click()
  ]);

  console.log('5. Navigated successfully to:', page.url());
  assert(page.url().includes('recipe-detail.html'), 'Clicking must directly navigate to recipe-detail.html');

  // Verify elements on recipe-detail.html
  await page.waitForTimeout(500);

  // 1. Deep space-black layout
  const bodyBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  console.log('6. Body background color:', bodyBg);
  assert(bodyBg === 'rgb(0, 0, 0)' || bodyBg === 'rgb(11, 15, 20)', 'Page background must be AMOLED space-black / Void Black #0B0F14');

  // 2. Big red 'Start Cooking Session' button
  const startBtn = page.locator('#start-cooking-action-btn');
  const startBtnVisible = await startBtn.isVisible();
  const startBtnText = await startBtn.innerText();
  console.log('7. Start Cooking Action button:', { visible: startBtnVisible, text: startBtnText.trim() });
  assert(startBtnVisible, 'Start Cooking button must be visible');
  assert(startBtnText.includes('Start Cooking Session'), 'Button must state "Start Cooking Session"');

  // 3. Verify no obsolete brown modal (#recipe-details-modal)
  const obsoleteModal = await page.$('#recipe-details-modal');
  console.log('8. Obsolete #recipe-details-modal present:', !!obsoleteModal);
  assert(!obsoleteModal, 'Obsolete #recipe-details-modal must NOT exist in the DOM');

  // Take screenshot as proof
  await page.screenshot({ path: 'verified_original_recipe_detail.png' });
  console.log('✅ ALL VERIFICATION CHECKS PASSED!');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
