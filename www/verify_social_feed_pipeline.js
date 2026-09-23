const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('=== STARTING SOCIAL FEED & COOKING COMPLETION PIPELINE VERIFICATION ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 } // Pixel 7 standard mobile viewport
  });

  const page = await context.newPage();

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 1: COOKING COMPLETION MILESTONE HOOK (immersive-cooking.html)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 1: Cooking Session "Finish Session" Milestone Hook ---');
  const cookUrl = 'file://' + path.resolve(__dirname, 'immersive-cooking.html').replace(/\\/g, '/') + '?recipe=sesame-chicken';
  
  // Set premium user flag in localStorage before loading
  await page.goto(cookUrl, { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => {
    localStorage.setItem('wow_is_premium', 'true');
    localStorage.setItem('wow_premium_user', 'true');
    if (window.WowAppState) window.WowAppState.setVIPStatus(true);
  });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // Advance steps to final step (Step 4)
  console.log('1.1 Advancing cooking guide to Step 4...');
  for (let i = 0; i < 3; i++) {
    await page.click('#btn-next-step');
    await page.waitForTimeout(250);
  }

  const stepCounter = await page.locator('#step-counter-display').textContent();
  console.log('  - Current Step:', stepCounter.trim());
  assert(stepCounter.includes('4/4'), 'Should be at Step 4/4');

  const nextBtnLabel = await page.locator('#btn-next-label').textContent();
  console.log('  - Finish Button Label:', nextBtnLabel.trim());

  // Click Finish button ("Wow Cooking Done")
  console.log('1.2 Clicking Finish Session to launch milestone flow...');
  await page.click('#btn-next-step');
  await page.waitForTimeout(600);

  // Check if milestone modal prompt appeared
  const isMilestonePromptVisible = await page.evaluate(() => {
    const modal = document.getElementById('wow-cooking-milestone-modal');
    return modal && window.getComputedStyle(modal).opacity === '1';
  });
  console.log('  - Milestone Prompt Modal Visible:', isMilestonePromptVisible);
  assert(isMilestonePromptVisible, 'Milestone prompt modal should be visible');

  // Verify modal content
  const modalDishName = await page.locator('#milestone-dish-name').textContent();
  console.log('  - Modal Dish Title:', modalDishName.trim());
  assert(modalDishName.toLowerCase().includes('sesame chicken'), 'Modal should display active recipe name');

  // Take screenshot of milestone prompt modal
  await page.screenshot({ path: 'verify_milestone_modal_prompt.png', timeout: 5000 }).catch(() => {});
  console.log('  - Screenshot saved: verify_milestone_modal_prompt.png');

  // Confirm publication: Click "Publish to Feed 🚀"
  console.log('1.3 Publishing milestone to feed...');
  await page.click('#btn-confirm-milestone-publish');
  await page.waitForTimeout(400);

  // Verify post stored in WowAppState
  const storedPosts = await page.evaluate(() => {
    return window.WowAppState ? window.WowAppState.getSocialPosts() : [];
  });
  console.log('  - Total Posts in WowAppState:', storedPosts.length);
  const latestPost = storedPosts[0];
  console.log('  - Latest Post Title:', latestPost.recipeName);
  console.log('  - Latest Post Caption:', latestPost.caption);
  assert(latestPost.recipeName.includes('Honey Sesame Chicken'), 'Latest post in state should be Honey Sesame Chicken');
  assert(latestPost.isUserPost === true, 'Latest post should be marked as user post');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 2: SOCIAL FEED TIMELINE HYDRATION & VERIFICATION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 2: Social Feed Timeline Hydration ---');
  const feedUrl = 'file://' + path.resolve(__dirname, 'social-feed.html').replace(/\\/g, '/');
  await page.goto(feedUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  // Verify top post in feed is the published cooking milestone
  const firstPostCard = page.locator('#feed-main .post-card').first();
  const firstPostRecipePill = await firstPostCard.locator('.recipe-made-pill').textContent();
  const firstPostAuthor = await firstPostCard.locator('.author-name').textContent();
  console.log('  - First Post Author:', firstPostAuthor.trim());
  console.log('  - First Post Recipe Pill:', firstPostRecipePill.trim());
  assert(firstPostRecipePill.includes('Honey Sesame Chicken'), 'First feed card should be the published milestone');
  assert(firstPostAuthor.includes('Chef Alex') || firstPostAuthor.includes('You'), 'First feed card author should be Chef Alex');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 3: "SHARE COOK" ACTION TRIGGER & DRAWER INTERACTION
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 3: "Share Cook" Drawer & State Binding ---');
  const shareCookBtn = page.locator('#btn-open-share');
  await shareCookBtn.click();
  await page.waitForTimeout(400);

  // Verify drawer is open
  const isDrawerOpen = await page.evaluate(() => {
    const drawer = document.getElementById('share-cook-drawer');
    return drawer && drawer.classList.contains('drawer--open');
  });
  console.log('  - Share Cook Drawer Open:', isDrawerOpen);
  assert(isDrawerOpen, 'Share Cook drawer should have drawer--open class');

  // Verify planned meals populated in select dropdown
  const selectOptions = await page.locator('#linked-recipe-select option').allTextContents();
  console.log('  - Drawer Recipe Select Options Count:', selectOptions.length);
  console.log('  - Sample Options:', selectOptions.slice(0, 4));
  assert(selectOptions.length >= 4, 'Should have multiple recipes from planned meals / catalog');

  // Select "Spaghetti Carbonara" or "Prime Bone-In Ribeye Cut"
  console.log('3.1 Selecting recipe and writing custom notes...');
  await page.selectOption('#linked-recipe-select', { value: 'carbonara' });
  await page.waitForTimeout(200);

  // Type custom caption
  const customCaptionText = 'Emulsified authentic guanciale with aged Pecorino Romano and hot pasta water. Creamy perfection without cream! 🍝✨';
  await page.fill('#post-caption-input', customCaptionText);

  // Select enhance tag chip
  const tagChip = page.locator('.enhance-tag-chip[data-tag]').first();
  await tagChip.click();
  await page.waitForTimeout(150);

  // Take screenshot of open drawer with data filled
  await page.screenshot({ path: 'verify_share_cook_drawer_active.png', timeout: 5000 }).catch(() => {});
  console.log('  - Screenshot saved: verify_share_cook_drawer_active.png');

  // Click "Publish" button
  console.log('3.2 Clicking Publish...');
  await page.click('#btn-publish-post');
  await page.waitForTimeout(500);

  // Verify drawer closed
  const isDrawerClosed = await page.evaluate(() => {
    const drawer = document.getElementById('share-cook-drawer');
    return drawer && !drawer.classList.contains('drawer--open');
  });
  console.log('  - Share Cook Drawer Closed:', isDrawerClosed);
  assert(isDrawerClosed, 'Share Cook drawer should be closed after publish');

  // Verify newly published post is now at the top of feed
  const newTopPost = page.locator('#feed-main .post-card').first();
  const newTopRecipePill = await newTopPost.locator('.recipe-made-pill').textContent();
  const newTopCaption = await newTopPost.locator('.post-caption-box p').textContent();
  console.log('  - Top Feed Recipe:', newTopRecipePill.trim());
  console.log('  - Top Feed Caption:', newTopCaption.trim());
  assert(newTopRecipePill.includes('Carbonara'), 'Top feed card should be Spaghetti Carbonara');
  assert(newTopCaption.includes('Emulsified authentic guanciale'), 'Top feed caption should match custom input');

  // Dismiss publish success drawer if open
  const successDrawer = page.locator('#publish-success-drawer');
  if (await successDrawer.isVisible()) {
    await page.click('#btn-done-success');
    await page.waitForTimeout(300);
  }

  // Test interactive buttons on newly created card: Like & Bookmark
  console.log('3.3 Testing Like and Bookmark interactions on new card...');
  const topLikeBtn = newTopPost.locator('.like-btn');
  await topLikeBtn.click();
  await page.waitForTimeout(200);
  const isLiked = await topLikeBtn.evaluate(el => el.classList.contains('liked'));
  console.log('  - Like Button Active:', isLiked);
  assert(isLiked, 'Like button should be active');

  const topBookmarkBtn = newTopPost.locator('.bookmark-btn');
  await topBookmarkBtn.click();
  await page.waitForTimeout(200);
  const isBookmarked = await topBookmarkBtn.evaluate(el => el.classList.contains('bookmarked'));
  console.log('  - Bookmark Button Active:', isBookmarked);
  assert(isBookmarked, 'Bookmark button should be active');

  // Test Trending / Following filtering with new card
  console.log('3.4 Testing Tab Switcher with new card...');
  await page.click('#tab-following');
  await page.waitForTimeout(250);
  const isTopVisibleInFollowing = await newTopPost.isVisible();
  console.log('  - Visible in Following tab:', isTopVisibleInFollowing);
  assert(isTopVisibleInFollowing, 'New post should be visible in Following tab');

  await page.click('#tab-trending');
  await page.waitForTimeout(250);
  const isTopVisibleInTrending = await newTopPost.isVisible();
  console.log('  - Visible in Trending tab:', isTopVisibleInTrending);
  assert(isTopVisibleInTrending, 'New post should be visible in Trending tab');

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST 4: RELOAD & PERSISTENCE TEST
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('\n--- TEST 4: Reload & Persistence Test ---');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);

  const reloadedTopPill = await page.locator('#feed-main .post-card').first().locator('.recipe-made-pill').textContent();
  console.log('  - Reloaded Top Feed Recipe:', reloadedTopPill.trim());
  assert(reloadedTopPill.includes('Carbonara'), 'Top card should persist after reload');

  // Take final screenshots
  await page.screenshot({ path: 'verify_social_feed_pipeline_full.png', fullPage: false, timeout: 5000 }).catch(() => {});
  console.log('  - Screenshot saved: verify_social_feed_pipeline_full.png');

  console.log('\n======================================================');
  console.log('🎉 ALL SOCIAL FEED & COOKING PIPELINE TESTS PASSED 100%!');
  console.log('======================================================');

  await browser.close();
})();
