const { chromium } = require('playwright');
const path = require('path');

const filesToTest = [
  'dashboard.html',
  'meal_planner.html',
  'collection.html',
  'chef-ai-showcase.html',
  'search-pantry.html',
  'social-feed.html',
  'profile.html',
  'iot-settings.html',
  'search-results.html',
  'meal-planner.html'
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 400, height: 850 }
  });
  const page = await context.newPage();

  console.log('--- STARTING NAV BAR HOVER GLOW & INDICATOR SHIFT VERIFICATION ---');

  for (const file of filesToTest) {
    const filePath = 'file://' + path.resolve(__dirname, file).replace(/\\/g, '/');
    await page.goto(filePath, { waitUntil: 'load' });
    await page.waitForTimeout(300);

    // Verify tabs exist
    const tabs = page.locator('#app-nav .nav-tab');
    const tabCount = await tabs.count();
    console.log(`\nFile: ${file} (found ${tabCount} tabs)`);

    if (tabCount === 0) {
      throw new Error(`No tabs found in ${file}`);
    }

    // Check resting state of unselected tabs vs active tab
    for (let i = 0; i < tabCount; i++) {
      const tab = tabs.nth(i);
      const isActive = await tab.evaluate(el => el.classList.contains('nav-tab--active') || el.classList.contains('active'));
      const text = await tab.locator('.nav-label').innerText();
      
      const styles = await tab.evaluate(el => {
        const cs = window.getComputedStyle(el);
        const icon = el.querySelector('.material-symbols-outlined');
        const iconCs = icon ? window.getComputedStyle(icon) : null;
        const label = el.querySelector('.nav-label');
        const labelCs = label ? window.getComputedStyle(label) : null;
        const pseudoAfter = window.getComputedStyle(el, '::after');

        return {
          transition: cs.transition,
          color: cs.color,
          iconColor: iconCs ? iconCs.color : null,
          labelColor: labelCs ? labelCs.color : null,
          dotOpacity: pseudoAfter.opacity,
          dotBg: pseudoAfter.backgroundColor,
          dotWidth: pseudoAfter.width,
          dotHeight: pseudoAfter.height,
          dotBoxShadow: pseudoAfter.boxShadow
        };
      });

      if (isActive) {
        console.log(`  [Active Tab] '${text}': color=${styles.color}, iconColor=${styles.iconColor}`);
      }
    }

    // Test Hover on an unselected tab (e.g. 2nd or 3rd tab if not active)
    let unselectedIdx = 0;
    for (let i = 0; i < tabCount; i++) {
      const isActive = await tabs.nth(i).evaluate(el => el.classList.contains('nav-tab--active') || el.classList.contains('active'));
      if (!isActive) {
        unselectedIdx = i;
        break;
      }
    }

    const testTab = tabs.nth(unselectedIdx);
    const testLabel = await testTab.locator('.nav-label').innerText();
    
    // Hover on the unselected tab
    await testTab.hover();
    await page.waitForTimeout(300); // Allow 0.25s transition to complete

    const hoverStyles = await testTab.evaluate(el => {
      const cs = window.getComputedStyle(el);
      const icon = el.querySelector('.material-symbols-outlined');
      const iconCs = icon ? window.getComputedStyle(icon) : null;
      const label = el.querySelector('.nav-label');
      const labelCs = label ? window.getComputedStyle(label) : null;
      const pseudoAfter = window.getComputedStyle(el, '::after');

      return {
        tabColor: cs.color,
        iconColor: iconCs ? iconCs.color : null,
        iconFilter: iconCs ? iconCs.filter : null,
        labelColor: labelCs ? labelCs.color : null,
        labelTextShadow: labelCs ? labelCs.textShadow : null,
        dotOpacity: pseudoAfter.opacity,
        dotBg: pseudoAfter.backgroundColor,
        dotWidth: pseudoAfter.width,
        dotHeight: pseudoAfter.height,
        dotBoxShadow: pseudoAfter.boxShadow
      };
    });

    console.log(`  [Hover Test on '${testLabel}']:`);
    console.log(`    Icon Color on hover: ${hoverStyles.iconColor} (filter: ${hoverStyles.iconFilter})`);
    console.log(`    Label Color on hover: ${hoverStyles.labelColor} (textShadow: ${hoverStyles.labelTextShadow})`);
    console.log(`    Dot Pseudo ::after: size=${hoverStyles.dotWidth}x${hoverStyles.dotHeight}, opacity=${hoverStyles.dotOpacity}, bg=${hoverStyles.dotBg}, boxShadow=${hoverStyles.dotBoxShadow}`);
  }

  // Take high resolution screenshots on key pages
  console.log('\n--- CAPTURING VISUAL SCREENSHOTS ---');

  // 1. Dashboard resting vs hovered
  await page.goto('file://' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'verify_dashboard_nav_resting.png' });

  await page.locator('#app-nav #nav-explore').hover();
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'verify_dashboard_nav_hover_explore.png' });

  // 2. Meal Planner resting vs hovered
  await page.goto('file://' + path.resolve(__dirname, 'meal_planner.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.locator('#app-nav #nav-collection').hover();
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'verify_meal_planner_nav_hover_collection.png' });

  // 3. Collection resting vs hovered
  await page.goto('file://' + path.resolve(__dirname, 'collection.html').replace(/\\/g, '/'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await page.locator('#app-nav #nav-chef-ai').hover();
  await page.waitForTimeout(350);
  await page.screenshot({ path: 'verify_collection_nav_hover_chef_ai.png' });

  console.log('Screenshots saved successfully.');
  await browser.close();
  console.log('--- VERIFICATION COMPLETED SUCCESSFULLY ---');
}

run().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
