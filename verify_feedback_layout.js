const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  console.log('Loading:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'load' });
  await page.waitForTimeout(500);

  // 1. Inspect Community Feedback elements
  const feedbackCard = await page.$('.community-rating-card');
  if (!feedbackCard) {
    console.error('FAIL: .community-rating-card not found');
    process.exit(1);
  }

  const rowStyles = await page.evaluate(() => {
    const row = document.querySelector('.like-dislike-row');
    const computed = window.getComputedStyle(row);
    return {
      display: computed.display,
      gap: computed.gap,
      alignItems: computed.alignItems
    };
  });
  console.log('Row Computed Styles:', rowStyles);

  const metrics = await page.evaluate(() => {
    const greenIcon = document.querySelector('.feedback-icon-box.green .material-symbols-outlined')?.textContent.trim();
    const redIcon = document.querySelector('.feedback-icon-box.red .material-symbols-outlined')?.textContent.trim();
    const likedText = document.getElementById('liked-count-text')?.textContent.trim();
    const dislikedText = document.getElementById('disliked-count-text')?.textContent.trim();
    const likedColor = window.getComputedStyle(document.getElementById('liked-count-text')).color;
    const dislikedColor = window.getComputedStyle(document.getElementById('disliked-count-text')).color;

    // Check bounding boxes for collision
    const likedPill = document.querySelector('.feedback-pill.liked').getBoundingClientRect();
    const dislikedPill = document.querySelector('.feedback-pill.disliked').getBoundingClientRect();
    const isOverlapping = !(
      likedPill.right <= dislikedPill.left ||
      likedPill.left >= dislikedPill.right ||
      likedPill.bottom <= dislikedPill.top ||
      likedPill.top >= dislikedPill.bottom
    );

    return {
      greenIcon,
      redIcon,
      likedText,
      dislikedText,
      likedColor,
      dislikedColor,
      likedBox: { x: likedPill.x, width: likedPill.width },
      dislikedBox: { x: dislikedPill.x, width: dislikedPill.width },
      distanceBetween: dislikedPill.left - likedPill.right,
      isOverlapping
    };
  });

  console.log('Feedback Metrics State:', metrics);

  if (metrics.greenIcon !== 'thumb_up') {
    console.error(`FAIL: greenIcon is "${metrics.greenIcon}", expected "thumb_up"`);
    process.exit(1);
  }
  if (metrics.redIcon !== 'thumb_down') {
    console.error(`FAIL: redIcon is "${metrics.redIcon}", expected "thumb_down"`);
    process.exit(1);
  }
  if (!metrics.likedText.includes('liked')) {
    console.error(`FAIL: likedText is "${metrics.likedText}"`);
    process.exit(1);
  }
  if (!metrics.dislikedText.includes('disliked')) {
    console.error(`FAIL: dislikedText is "${metrics.dislikedText}"`);
    process.exit(1);
  }
  if (metrics.isOverlapping) {
    console.error('FAIL: liked and disliked pills are overlapping!');
    process.exit(1);
  }
  if (metrics.distanceBetween < 10) {
    console.error(`FAIL: Distance between pills is too small: ${metrics.distanceBetween}px`);
    process.exit(1);
  }

  // 2. Test switching tabs across 3A, 3B, 3C
  console.log('Testing Tab switching...');
  for (let tabIndex = 0; tabIndex < 3; tabIndex++) {
    await page.evaluate((idx) => window.switchRecipeTab(idx), tabIndex);
    await page.waitForTimeout(200);
    const isVisible = await page.evaluate(() => {
      const card = document.querySelector('.community-rating-card');
      const rect = card.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    console.log(`Tab ${tabIndex} Community Card Visible:`, isVisible);
    if (!isVisible) {
      console.error(`FAIL: Community card not visible on tab ${tabIndex}`);
      process.exit(1);
    }
  }

  // 3. Test dynamic recipe loading (e.g. recipe ID 5 - Pad Thai)
  console.log('Testing dynamic recipe parameter injection...');
  await page.evaluate(() => {
    window.openRecipeDetail('pad-thai');
  });
  await page.waitForTimeout(300);

  const dynamicMetrics = await page.evaluate(() => {
    return {
      greenIcon: document.querySelector('.feedback-icon-box.green .material-symbols-outlined')?.textContent.trim(),
      redIcon: document.querySelector('.feedback-icon-box.red .material-symbols-outlined')?.textContent.trim(),
      likedText: document.getElementById('liked-count-text')?.textContent.trim(),
      dislikedText: document.getElementById('disliked-count-text')?.textContent.trim()
    };
  });
  console.log('Dynamic Pad Thai Feedback Metrics:', dynamicMetrics);

  if (dynamicMetrics.greenIcon !== 'thumb_up' || dynamicMetrics.redIcon !== 'thumb_down') {
    console.error('FAIL: Dynamic injection corrupted icons!');
    process.exit(1);
  }

  // Take screenshot of Community Feedback section
  await page.screenshot({ path: 'test_feedback_card.png', fullPage: false });
  console.log('PASS: All Community Feedback tests completed successfully!');

  await browser.close();
})();
