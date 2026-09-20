const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 500, height: 950 }
  });
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll to community feedback card
  await page.evaluate(() => {
    const feedbackCard = document.getElementById('community-feedback-card');
    if (feedbackCard) feedbackCard.scrollIntoView();
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'recipe_detail_cyan_feedback_card.png' });
  console.log('Saved recipe_detail_cyan_feedback_card.png');

  await browser.close();
})();
