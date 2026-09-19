const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('══════════════════════════════════════════════════════════════════════');
  console.log('🚀 TESTING ONBOARDING INTERACTIVE JS ENHANCEMENTS');
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

  const onboardingUrl = 'file:///' + path.resolve(__dirname, 'onboarding.html').replace(/\\/g, '/');
  await page.goto(onboardingUrl, { waitUntil: 'load' });

  // 1. Verify Tactile Utility Classes
  console.log('1️⃣ Auditing Tactile Click Bounce Utility Classes...');
  const dietCards = await page.$$('.diet-card');
  const allergenPills = await page.$$('.allergen-pill');
  const cuisineChips = await page.$$('.cuisine-chip');
  const btnSave = await page.$('#btn-save-cuisines');

  console.log(`   Found ${dietCards.length} diet cards, ${allergenPills.length} allergen pills, ${cuisineChips.length} cuisine chips.`);

  for (const card of dietCards) {
    const cls = await card.getAttribute('class');
    if (!cls.includes('active:scale-95') || !cls.includes('duration-200') || !cls.includes('ease-out')) {
      throw new Error(`Diet card missing tactile classes: ${cls}`);
    }
  }
  console.log('   ✓ All 4 diet cards have "transition-all duration-200 ease-out active:scale-95"');

  for (const pill of allergenPills) {
    const cls = await pill.getAttribute('class');
    if (!cls.includes('active:scale-95') || !cls.includes('duration-200') || !cls.includes('ease-out')) {
      throw new Error(`Allergen pill missing tactile classes: ${cls}`);
    }
  }
  console.log('   ✓ All 4 allergen pills have "transition-all duration-200 ease-out active:scale-95"');

  for (const chip of cuisineChips) {
    const cls = await chip.getAttribute('class');
    if (!cls.includes('active:scale-95') || !cls.includes('duration-200') || !cls.includes('ease-out')) {
      throw new Error(`Cuisine chip missing tactile classes: ${cls}`);
    }
  }
  console.log('   ✓ All 11 cuisine chips have "transition-all duration-200 ease-out active:scale-95"');

  // 2. Verify Dynamic Button Text Summary Engine
  console.log('\n2️⃣ Testing Dynamic Button Text Summary Engine...');
  
  // Initial load check
  let btnText = await page.$eval('#btn-save-label', el => el.textContent.trim());
  console.log(`   Initial CTA text: "${btnText}"`);
  if (btnText !== 'Save & Explore Selection (7)') {
    throw new Error(`Expected "Save & Explore Selection (7)", got "${btnText}"`);
  }
  console.log('   ✓ Initial selection count is 7: "Save & Explore Selection (7)"');

  // Deselect Keto
  console.log('   👉 Clicking Keto card to deselect...');
  await page.click('.diet-card[data-id="keto"]');
  btnText = await page.$eval('#btn-save-label', el => el.textContent.trim());
  console.log(`   CTA text after deselecting Keto: "${btnText}"`);
  if (btnText !== 'Save & Explore Selection (6)') {
    throw new Error(`Expected "Save & Explore Selection (6)", got "${btnText}"`);
  }
  console.log('   ✓ Updated dynamically to 6: "Save & Explore Selection (6)"');

  // Deselect Dairy
  console.log('   👉 Clicking Dairy pill to deselect...');
  await page.click('.allergen-pill[data-id="dairy"]');
  btnText = await page.$eval('#btn-save-label', el => el.textContent.trim());
  console.log(`   CTA text after deselecting Dairy: "${btnText}"`);
  if (btnText !== 'Save & Explore Selection (5)') {
    throw new Error(`Expected "Save & Explore Selection (5)", got "${btnText}"`);
  }
  console.log('   ✓ Updated dynamically to 5: "Save & Explore Selection (5)"');

  // Deselect remaining 5 items (High Protein + Mexican + Indian + Thailand + Greek)
  console.log('   👉 Deselecting all remaining selected items...');
  await page.click('.diet-card[data-id="high-protein"]');
  await page.click('.cuisine-chip[data-id="mexican"]');
  await page.click('.cuisine-chip[data-id="indian"]');
  await page.click('.cuisine-chip[data-id="thailand"]');
  await page.click('.cuisine-chip[data-id="greek"]');

  btnText = await page.$eval('#btn-save-label', el => el.textContent.trim());
  console.log(`   CTA text after 0 items selected: "${btnText}"`);
  if (btnText !== 'Save & Explore Cuisines') {
    throw new Error(`Expected base label "Save & Explore Cuisines", got "${btnText}"`);
  }
  console.log('   ✓ Reverted to base label: "Save & Explore Cuisines"');

  // Select 1 item (Japan)
  console.log('   👉 Selecting 1 item (Japanese)...');
  await page.click('.cuisine-chip[data-id="japanese"]');
  btnText = await page.$eval('#btn-save-label', el => el.textContent.trim());
  console.log(`   CTA text with 1 item: "${btnText}"`);
  if (btnText !== 'Save & Explore Selection (1)') {
    throw new Error(`Expected "Save & Explore Selection (1)", got "${btnText}"`);
  }
  console.log('   ✓ Updated dynamically to 1: "Save & Explore Selection (1)"');

  console.log('\n══════════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL DYNAMIC INTERACTION TESTS PASSED WITH 100% ACCURACY!');
  console.log('══════════════════════════════════════════════════════════════════════\n');

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error('\n❌ TEST FAILED:', err);
  process.exit(1);
});
