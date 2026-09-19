const { chromium } = require('playwright');

(async () => {
  console.log('--- AUDITING INSTRUCTIONS STEP 3 & STEP 4 IMAGE ISOLATION ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage({ viewport: { width: 393, height: 852 } });

  await page.goto('http://localhost:3000/recipe-detail.html?recipe=carbonara');
  await page.waitForTimeout(300);

  // Switch to Instructions Tab (#tab-btn-1)
  await page.click('#tab-btn-1');
  await page.waitForTimeout(300);

  const images = await page.evaluate(() => {
    const panel = document.getElementById('tab-panel-1');
    const stepCards = panel.querySelectorAll('.instruction-step-card');
    const results = [];
    stepCards.forEach((card, idx) => {
      const title = card.querySelector('.step-title')?.textContent?.trim() || '';
      const img = card.querySelector('img');
      results.push({
        step: idx + 1,
        title,
        imgSrc: img ? img.getAttribute('src') : 'NO_IMAGE',
        imgVisible: img ? (window.getComputedStyle(img).display !== 'none') : false
      });
    });
    return results;
  });

  console.log('\nInstructions Tab Cards Inspection:');
  images.forEach(s => console.log(`  - Step ${s.step} [${s.title}]: ${s.imgSrc} (visible: ${s.imgVisible})`));

  const step3 = images.find(s => s.step === 3);
  const step4 = images.find(s => s.step === 4);

  if (!step3 || !step3.imgSrc.includes('pasta-emulsify.jpg')) {
    throw new Error('Step 3 image must point to assets/images/pasta-emulsify.jpg');
  }

  if (!step4 || !step4.imgSrc.includes('carbonara.png')) {
    throw new Error('Step 4 image must point to assets/carbonara.png');
  }

  if (step3.imgSrc === step4.imgSrc) {
    throw new Error('Step 3 image must be distinct from Step 4 final plate image');
  }

  console.log('\n✅ Step 3 correctly displays distinct pasta tossing photo (assets/images/pasta-emulsify.jpg).');
  console.log('✅ Step 4 correctly displays the final plate presentation (assets/carbonara.png).');
  console.log('✅ No duplicate plate image between Step 3 and Step 4.');

  await browser.close();
})();
