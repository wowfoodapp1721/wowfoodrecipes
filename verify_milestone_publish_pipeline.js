const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('=== STARTING MILESTONE PUBLISH POP-UP & PIPELINE VERIFICATION ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 } // Pixel 7 standard mobile viewport
  });

  const page = await context.newPage();

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1: MAYBE LATER DISMISSAL WITH ZERO DATA TRANSMISSION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: "Maybe Later" Dismissal & Zero Data Transmission ---');
  const cookUrl = 'file://' + path.resolve(__dirname, 'immersive-cooking.html').replace(/\\/g, '/') + '?recipe=52772';
  
  await page.goto(cookUrl);
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('wow_is_premium', 'true');
    localStorage.setItem('wow_premium_user', 'true');
  });
  await page.reload();
  await page.waitForTimeout(400);

  // Trigger milestone prompt
  console.log('1.1 Triggering milestone pop-up...');
  await page.evaluate(() => {
    if (window.triggerCookingMilestonePrompt) {
      window.triggerCookingMilestonePrompt({
        recipeId: '52772',
        recipeName: 'Teriyaki Chicken Casserole',
        badge: 'Mastered',
        xpMetric: '+150 Culinary XP',
        recipeIcon: '🍲',
        photo: 'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg'
      });
    }
  });
  await page.waitForTimeout(400);

  // Verify modal is visible
  const isModalVisibleBefore = await page.evaluate(() => {
    const modal = document.getElementById('wow-cooking-milestone-modal');
    return modal && window.getComputedStyle(modal).opacity === '1';
  });
  console.log('  - Milestone Pop-up Visible:', isModalVisibleBefore);
  assert(isModalVisibleBefore, 'Milestone pop-up should be visible');

  // Verify initial post count
  const initialPostCount = await page.evaluate(() => {
    return window.WowAppState ? window.WowAppState.getSocialPosts().length : 0;
  });
  console.log('  - Initial Posts in State:', initialPostCount);

  // Click "Maybe Later"
  console.log('1.2 Clicking "Maybe Later" (#btn-dismiss-milestone-publish)...');
  await page.click('#btn-dismiss-milestone-publish');
  await page.waitForTimeout(400);

  // Verify modal is closed after 300ms transition
  const isModalClosed = await page.evaluate(() => {
    const modal = document.getElementById('wow-cooking-milestone-modal');
    return modal && (window.getComputedStyle(modal).opacity === '0' || modal.style.pointerEvents === 'none');
  });
  console.log('  - Milestone Pop-up Closed after transition:', isModalClosed);
  assert(isModalClosed, 'Milestone pop-up should be closed after 300ms fade-out');

  // Verify post count remains completely unchanged
  const postCountAfterDismiss = await page.evaluate(() => {
    return window.WowAppState ? window.WowAppState.getSocialPosts().length : 0;
  });
  console.log('  - Posts in State After Dismiss:', postCountAfterDismiss);
  assert(initialPostCount === postCountAfterDismiss, 'Zero data transmission should occur on Maybe Later');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 2: EXTRACTION CONTEXT & PUBLISH TO FEED INTERACTION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Extraction Context & "Publish to Feed 🚀" Interaction ---');
  
  // Re-open milestone modal for Teriyaki Chicken Casserole
  console.log('2.1 Re-opening modal for Teriyaki Chicken Casserole...');
  await page.evaluate(() => {
    if (window.triggerCookingMilestonePrompt) {
      window.triggerCookingMilestonePrompt();
    }
  });
  await page.waitForTimeout(400);

  // Verify extracted data in modal DOM
  const modalDishTitle = await page.locator('#milestone-dish-name').textContent();
  const modalDishXP = await page.locator('#milestone-dish-xp').textContent();
  const modalDishThumb = await page.locator('#milestone-dish-thumb').getAttribute('src');

  console.log('  - Extracted Dish Title:', modalDishTitle.trim());
  console.log('  - Extracted Dish XP & Badge:', modalDishXP.trim());
  console.log('  - Extracted Dish Photo URL:', modalDishThumb);

  assert(modalDishTitle.includes('Teriyaki Chicken Casserole'), 'Dish title should be Teriyaki Chicken Casserole');
  assert(modalDishXP.includes('+150 Culinary XP'), 'XP metric should be +150 Culinary XP');
  assert(modalDishXP.includes('Mastered'), 'Badge should be Mastered');

  // Screenshot open modal
  await page.screenshot({ path: 'verify_milestone_publish_modal.png' });
  console.log('  - Screenshot saved: verify_milestone_publish_modal.png');

  // Click "Publish to Feed 🚀"
  console.log('2.2 Clicking glowing "Publish to Feed 🚀" button (#btn-confirm-milestone-publish)...');
  await page.click('#btn-confirm-milestone-publish');
  
  // Wait for 300ms fade-out and navigation router transition
  await page.waitForTimeout(800);

  // Verify navigation switched directly to social-feed.html
  const currentUrl = page.url();
  console.log('  - Current URL after publication navigation:', currentUrl);
  assert(currentUrl.includes('social-feed.html'), 'Router should navigate directly to social-feed.html');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3: VERIFY PREPENDED TIMELINE DATA ON SOCIAL FEED SCREEN
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 3: Verifying Prepended Timeline Slot #1 on Social Feed ---');
  
  // Verify top post in feed
  const topCard = page.locator('#feed-main .post-card').first();
  const topRecipePill = await topCard.locator('.recipe-made-pill').textContent();
  const topAuthor = await topCard.locator('.author-name').textContent();
  const topCaption = await topCard.locator('.post-caption-box p').textContent();

  console.log('  - Top Post Author:', topAuthor.trim());
  console.log('  - Top Post Recipe Pill:', topRecipePill.trim());
  console.log('  - Top Post Caption:', topCaption.trim());

  assert(topRecipePill.includes('Teriyaki Chicken Casserole'), 'Top feed post should be Teriyaki Chicken Casserole');
  assert(topCaption.includes('Teriyaki Chicken Casserole'), 'Caption should reference Teriyaki Chicken Casserole');
  assert(topCaption.includes('+150 Culinary XP'), 'Caption should include +150 Culinary XP metric');

  // Test interactive buttons on prepended post
  const likeBtn = topCard.locator('.like-btn');
  await likeBtn.click();
  await page.waitForTimeout(200);
  const isLiked = await likeBtn.evaluate(el => el.classList.contains('liked'));
  console.log('  - Like Button Toggle Active:', isLiked);
  assert(isLiked, 'Like button should toggle active');

  const bookmarkBtn = topCard.locator('.bookmark-btn');
  await bookmarkBtn.click();
  await page.waitForTimeout(200);
  const isBookmarked = await bookmarkBtn.evaluate(el => el.classList.contains('bookmarked'));
  console.log('  - Bookmark Button Toggle Active:', isBookmarked);
  assert(isBookmarked, 'Bookmark button should toggle active');

  // Capture final social feed verification screenshot
  await page.screenshot({ path: 'verify_milestone_published_timeline.png' });
  console.log('  - Screenshot saved: verify_milestone_published_timeline.png');

  console.log('\n=============================================================');
  console.log('🎉 ALL MILESTONE PUBLISH POP-UP & PIPELINE TESTS PASSED 100%!');
  console.log('=============================================================');

  await browser.close();
})();
