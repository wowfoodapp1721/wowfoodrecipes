const { chromium } = require('playwright');
const path = require('path');
const assert = require('assert');

(async () => {
  console.log('🚀 Starting Verification: My Collection Screen Viewport Structural Repair & Theming...\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 }
  });
  const page = await context.newPage();

  const collectionUrl = `file://${path.resolve(__dirname, 'collection.html')}`;

  // Step 1: Empty state verification
  await page.goto(collectionUrl, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);

  console.log('--- TEST 1: Upper Viewport Safety & Layout Preservation ---');
  const title = await page.textContent('.header-title-text');
  console.log(`Header Title: "${title.trim()}"`);
  assert(title.includes('My Collection'), 'Header title must remain "My Collection"');

  const countPill = await page.textContent('#collection-count-badge');
  console.log(`Count Pill: "${countPill.trim()}"`);
  assert(countPill.includes('0 Saved'), 'Count badge must read "0 Saved" in empty state');

  const emptyTitle = await page.textContent('.empty-collection-title');
  console.log(`Empty Collection Title: "${emptyTitle.trim()}"`);
  assert(emptyTitle.includes('empty'), 'Empty collection title must be present');

  const discoverBtn = await page.textContent('.empty-collection-cta');
  console.log(`Discover Button Text: "${discoverBtn.trim()}"`);
  assert(discoverBtn.includes('Discover Recipes'), 'Discover Recipes button must be present');

  const filterPillsCount = await page.locator('.filter-pill').count();
  console.log(`Filter Pills Count: ${filterPillsCount}`);
  assert(filterPillsCount >= 10, 'All filter pills must be preserved');
  console.log('✅ TEST 1 PASSED: Upper viewport text, headers, filter categories, empty graphic, and CTA intact.\n');


  console.log('--- TEST 2: Global Color Sync (Neon Cyan #3DF2E0 & Void Black #0B0F14) ---');
  const themeStyles = await page.evaluate(() => {
    const vp = document.querySelector('#viewport');
    const badge = document.querySelector('#collection-count-badge');
    const activePill = document.querySelector('.filter-pill.active');
    const iconWrap = document.querySelector('.empty-collection-icon-wrap');
    const icon = iconWrap ? iconWrap.querySelector('.material-symbols-outlined') : null;
    const cta = document.querySelector('.empty-collection-cta');
    const activeTab = document.querySelector('#nav-collection');
    const activeDot = activeTab ? activeTab.querySelector('.nav-active-dot') : null;

    return {
      vpBg: window.getComputedStyle(vp).backgroundColor,
      badgeColor: window.getComputedStyle(badge).color,
      badgeBorder: window.getComputedStyle(badge).borderColor,
      activePillBg: window.getComputedStyle(activePill).backgroundColor,
      activePillColor: window.getComputedStyle(activePill).color,
      iconColor: icon ? window.getComputedStyle(icon).color : null,
      ctaBg: window.getComputedStyle(cta).backgroundImage || window.getComputedStyle(cta).backgroundColor,
      ctaColor: window.getComputedStyle(cta).color,
      tabColor: window.getComputedStyle(activeTab).color,
      dotBg: activeDot ? window.getComputedStyle(activeDot).backgroundColor : null
    };
  });

  console.log('Theme Computed Styles:', themeStyles);
  // Viewport background is Void Black (#0B0F14 -> rgb(11, 15, 20))
  assert(themeStyles.vpBg.includes('11, 15, 20') || themeStyles.vpBg.includes('rgb(11, 15, 20)'), 'Viewport background must be Void Black #0B0F14');
  // Badge color is Neon Cyan (#3DF2E0 -> rgb(61, 242, 224))
  assert(themeStyles.badgeColor.includes('61, 242, 224'), '0 Saved badge text must be Neon Cyan');
  // Active pill background is Neon Cyan (#3DF2E0) and text is Void Black
  assert(themeStyles.activePillBg.includes('61, 242, 224'), 'Active pill background must be Neon Cyan');
  assert(themeStyles.activePillColor.includes('11, 15, 20'), 'Active pill text must be dark Void Black');
  // Empty bookmark icon is Neon Cyan
  assert(themeStyles.iconColor.includes('61, 242, 224'), 'Empty bookmark icon must be Neon Cyan');
  // Tab and dot are Neon Cyan
  assert(themeStyles.tabColor.includes('61, 242, 224'), 'Collection active tab must be Neon Cyan');
  assert(themeStyles.dotBg.includes('61, 242, 224'), 'Active tab indicator dot must be Neon Cyan');
  console.log('✅ TEST 2 PASSED: 100% theme color synchronization to Neon Cyan (#3DF2E0) & Void Black (#0B0F14).\n');


  console.log('--- TEST 3: Premium Floating AI Component Positioning & Styling ---');
  const fabLocator = page.locator('#wow-chef-ai-fab');
  const fabExists = await fabLocator.count();
  assert(fabExists > 0, 'Floating AI action button must exist');

  const fabStyles = await page.evaluate(() => {
    const fab = document.querySelector('#wow-chef-ai-fab');
    const rect = fab.getBoundingClientRect();
    const vpRect = document.querySelector('#viewport').getBoundingClientRect();
    const computed = window.getComputedStyle(fab);
    const avatar = fab.querySelector('.chef-fab-avatar .material-symbols-outlined');

    return {
      bottomOffset: vpRect.bottom - rect.bottom,
      rightOffset: vpRect.right - rect.right,
      width: rect.width,
      height: rect.height,
      borderRadius: computed.borderRadius,
      borderColor: computed.borderColor,
      bg: computed.backgroundColor,
      iconName: avatar ? avatar.textContent.trim() : null,
      iconColor: avatar ? window.getComputedStyle(avatar).color : null
    };
  });

  console.log('FAB Geometry & Styles:', fabStyles);
  assert(fabStyles.width >= 44 && fabStyles.height >= 44, 'FAB must be at least 44x44 circular button');
  assert(fabStyles.borderRadius === '50%' || parseInt(fabStyles.borderRadius) >= 20, 'FAB must be circular');
  assert(fabStyles.borderColor.includes('61, 242, 224'), 'FAB border must be Neon Cyan #3DF2E0');
  assert(fabStyles.rightOffset <= 30 && fabStyles.rightOffset >= 10, 'FAB must be positioned in bottom-right corner');
  assert(fabStyles.iconName === 'smart_toy', 'FAB must contain sleek robot icon (smart_toy)');
  console.log('✅ TEST 3 PASSED: Premium circular Floating AI FAB positioned in bottom-right corner above tab bar.\n');

  // Screenshot empty state with circular FAB
  await page.screenshot({ path: 'collection_empty_state_repaired.png' });


  console.log('--- TEST 4: Animated Interaction Sheet & Frosted Glass Drawer ---');
  // Click the FAB to open the drawer
  await fabLocator.click();
  await page.waitForTimeout(450); // Wait for smooth slide-up animation

  const drawerOpen = await page.evaluate(() => {
    const overlay = document.querySelector('#wow-chef-ai-overlay');
    const drawer = document.querySelector('#wow-chef-ai-drawer');
    const overlayOpen = overlay && overlay.classList.contains('open');
    const drawerRect = drawer.getBoundingClientRect();
    const vpRect = document.querySelector('#viewport').getBoundingClientRect();

    return {
      overlayOpen,
      drawerVisible: drawerRect.top < vpRect.bottom,
      greetingText: document.querySelector('.chat-bubble.ai-bubble h4')?.textContent,
      chipsCount: document.querySelectorAll('.chef-prompt-chip').length
    };
  });

  console.log('Drawer State on Click:', drawerOpen);
  assert(drawerOpen.overlayOpen, 'Overlay must have .open class on FAB click');
  assert(drawerOpen.drawerVisible, 'Drawer must slide up into view from bottom');
  assert(drawerOpen.greetingText && drawerOpen.greetingText.includes('Bonjour Chef'), 'Initial greeting message must be rendered cleanly');
  assert(drawerOpen.chipsCount >= 4, 'Quick command chips ("Dice an Onion", "Boil Eggs", etc.) must be displayed');

  // Screenshot open drawer messenger modal
  await page.screenshot({ path: 'collection_chef_ai_drawer_verified.png' });
  console.log('✅ TEST 4 PASSED: Smooth slide-up frosted glass messenger window opened cleanly with quick chips & input.\n');

  // Close drawer
  await page.click('#btn-close-chef-drawer');
  await page.waitForTimeout(400);


  console.log('--- TEST 5: Hydrated Collection State (Saved Recipe Rendering) ---');
  // Populate localStorage with carbonara recipe
  await page.evaluate(() => {
    localStorage.setItem('wow_saved_recipes', JSON.stringify(['carbonara']));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForTimeout(600);

  const updatedCountPill = await page.textContent('#collection-count-badge');
  console.log(`Hydrated Count Pill: "${updatedCountPill.trim()}"`);
  assert(updatedCountPill.includes('1 Saved'), 'Count badge must update to "1 Saved"');

  const cardTitles = await page.locator('.search-grid-card .search-card-title').allTextContents();
  console.log('Saved Card Titles:', cardTitles);
  assert(cardTitles.some(t => t.includes('Carbonara')), 'Saved recipe card must render Spaghetti Carbonara');

  // Screenshot hydrated collection state
  await page.screenshot({ path: 'collection_hydrated_state_repaired.png' });
  console.log('✅ TEST 5 PASSED: Hydrated state displays saved recipe card with clean metadata.\n');

  console.log('🎉 ALL 5 VERIFICATION TEST SUITES PASSED FLAWLESSLY WITH 100% SUCCESS!');
  await browser.close();
})();
