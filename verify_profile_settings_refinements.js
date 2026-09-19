const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('=== VERIFYING PROFILE & SETTINGS REFINEMENTS ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 450, height: 950 } });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'iot-settings.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // 1. Verify Pulse Element
  const pulseHalo = page.locator('#btn-open-iot-sheet .animate-ping');
  const pulseCount = await pulseHalo.count();
  console.log('1. BLE Pulse Halo Element Count:', pulseCount);

  // 1a. Verify Camera Action Button on Avatar
  const cameraBtn = page.locator('#btn-change-avatar');
  console.log('1a. Camera Button Count:', await cameraBtn.count());
  console.log('    Camera Button Classes:', await cameraBtn.getAttribute('class'));
  const cameraIcon = cameraBtn.locator('span:has-text("photo_camera")');
  console.log('    Camera Icon Count:', await cameraIcon.count());

  // Test Camera Button Click Dialog
  let alertMessage = '';
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.dismiss();
  });
  await cameraBtn.click();
  console.log('    Camera Button Alert Message:', alertMessage);

  // 1b. Verify Rebuilt Dietary Blueprint Metrics Card Layout
  const dietaryHeader = page.locator('.w-full.flex.flex-row.items-center.justify-between.py-2.px-1');
  console.log('1b. Rebuilt Dietary Header Count:', await dietaryHeader.count());

  const calorieRow = page.locator('span:has-text("Daily Calorie Cap")');
  console.log('    Calorie Row Count:', await calorieRow.count());

  const progressBar = page.locator('.bg-gradient-to-r.from-orange-600.to-orange-500');
  console.log('    Orange Progress Bar Count:', await progressBar.count());

  const macroCards = page.locator('.grid.grid-cols-3.gap-2 > div');
  console.log('    3 Floating Macro Cards Count:', await macroCards.count());

  const proteinCard = page.locator('span:has-text("Protein")');
  const carbsCard = page.locator('span:has-text("Carbs")');
  const fatsCard = page.locator('span:has-text("Fats")');
  console.log('    Protein / Carbs / Fats:', await proteinCard.count(), await carbsCard.count(), await fatsCard.count());

  // 2. Verify All 5 Settings Rows in Glass Card
  const settingsCard = page.locator('.rounded-3xl.p-4.flex.flex-col');
  console.log('2. Settings Glass Card Count:', await settingsCard.count());

  const row1 = page.locator('span:has-text("Smart Robot Connectivity (Chef Magic)")');
  const row2 = page.locator('span:has-text("Voice Assistant Calibration")');
  const row3 = page.locator('span:has-text("Dietary Preferences & Allergies")');
  const row4 = page.locator('span:has-text("Notification Preferences")');
  const row5 = page.locator('span:has-text("Help & Support")');

  console.log('   - Row 1 (Smart Robot):', await row1.count());
  console.log('   - Row 2 (Voice Assistant):', await row2.count());
  console.log('   - Row 3 (Dietary Preferences):', await row3.count());
  console.log('   - Row 4 (Notification Preferences):', await row4.count());
  console.log('   - Row 5 (Help & Support):', await row5.count());

  // Check pb-28
  const mainClasses = await page.locator('#view-settings-base').getAttribute('class');
  console.log('   - Main Container Classes (pb-28 check):', mainClasses);

  // 5. Verify Hover Lift Classes on the 3 Container Cards
  const dietaryCard = page.locator('.dietary-card');
  const dietaryClasses = await dietaryCard.getAttribute('class');
  console.log('5a. Dietary Card Classes:', dietaryClasses);
  console.log('    Has Hover Lift:', dietaryClasses.includes('hover:-translate-y-1') && dietaryClasses.includes('hover:shadow-[0_12px_24px_rgba(255,153,0,0.15)]'));

  const proBanner = page.locator('.pro-banner');
  const proBannerClasses = await proBanner.getAttribute('class');
  console.log('5b. Pro Banner Classes:', proBannerClasses);
  console.log('    Has Hover Lift:', proBannerClasses.includes('hover:-translate-y-1') && proBannerClasses.includes('hover:shadow-[0_12px_30px_rgba(239,54,54,0.2)]'));

  const settingsCardClasses = await settingsCard.getAttribute('class');
  console.log('5c. Settings Card Classes:', settingsCardClasses);
  console.log('    Has Hover Lift:', settingsCardClasses.includes('hover:-translate-y-1') && settingsCardClasses.includes('hover:shadow-[0_12px_24px_rgba(255,255,255,0.06)]'));

  // Hover test on dietary card
  await dietaryCard.hover();
  await page.waitForTimeout(350);
  const hoveredDietaryPath = path.resolve(__dirname, 'dietary_card_hovered.png');
  await dietaryCard.screenshot({ path: hoveredDietaryPath });
  console.log('Dietary card hovered screenshot saved to:', hoveredDietaryPath);

  // Hover test on pro banner
  await proBanner.hover();
  await page.waitForTimeout(350);
  const hoveredProPath = path.resolve(__dirname, 'pro_banner_hovered.png');
  await proBanner.screenshot({ path: hoveredProPath });
  console.log('Pro banner hovered screenshot saved to:', hoveredProPath);

  // Hover test on settings card
  await settingsCard.hover();
  await page.waitForTimeout(350);
  const hoveredSettingsPath = path.resolve(__dirname, 'settings_card_hovered.png');
  await settingsCard.screenshot({ path: hoveredSettingsPath });
  // 6. Verify Sign Out Button & Build Version String
  const signOutBtn = page.locator('button:has-text("Sign Out of Account")');
  console.log('6a. Sign Out Button Count:', await signOutBtn.count());
  console.log('    Sign Out Classes:', await signOutBtn.getAttribute('class'));
  console.log('    Sign Out OnClick:', await signOutBtn.getAttribute('onclick'));

  const versionText = page.locator('span:has-text("WOW FOOD RECIPES • V4.2.0 (BUILD 2026)")');
  console.log('6b. Build Version Count:', await versionText.count());
  console.log('    Build Version Text:', (await versionText.textContent()).trim());
  console.log('    Build Version Classes:', await versionText.getAttribute('class'));

  // Take screenshot of settings screen scrolled to top
  await page.evaluate(() => {
    const el = document.getElementById('view-settings-base');
    if (el) el.scrollTop = 0;
  });
  await page.waitForTimeout(300);
  const screenshotTopPath = path.resolve(__dirname, 'profile_dietary_header_verified.png');
  await page.locator('#viewport').screenshot({ path: screenshotTopPath });
  console.log('Top screenshot saved to:', screenshotTopPath);

  // Take screenshot of avatar hero card directly
  const avatarPath = path.resolve(__dirname, 'profile_avatar_verified.png');
  await page.locator('.profile-hero-card').screenshot({ path: avatarPath });
  console.log('Avatar hero card screenshot saved to:', avatarPath);

  // Take screenshot of dietary-card directly
  const dietaryCardPath = path.resolve(__dirname, 'dietary_card_exact.png');
  await page.locator('.dietary-card').screenshot({ path: dietaryCardPath });
  console.log('Dietary card exact screenshot saved to:', dietaryCardPath);

  // Scroll down inside #view-settings-base to capture full bottom view
  await page.evaluate(() => {
    const el = document.getElementById('view-settings-base');
    if (el) el.scrollTop = el.scrollHeight;
  });
  await page.waitForTimeout(400);

  // Take screenshot of settings screen scrolled to bottom
  const screenshotPath = path.resolve(__dirname, 'profile_settings_bottom_verified.png');
  await page.locator('#viewport').screenshot({ path: screenshotPath });
  console.log('Screenshot saved to:', screenshotPath);

  // 7. Test Cinematic Settings Contextual Action Drawer for All 4 Modes
  const actionDrawer = page.locator('#settings-action-drawer');
  const actionTitle = page.locator('#drawer-action-title');
  const actionCloseBtn = page.locator('#btn-close-action-drawer');

  console.log('7. Testing Contextual Drawer Actions:');

  // 7a. Mode: Robot Sync
  await row1.click();
  await page.waitForTimeout(300);
  console.log('   - Robot Action Title:', await actionTitle.textContent());
  console.log('   - Robot Slot Content:', (await page.locator('#drawer-action-content-slot').textContent()).includes('ChefBot Pro 4L Detected'));
  const robotDrawerPath = path.resolve(__dirname, 'drawer_robot_verified.png');
  await page.locator('#viewport').screenshot({ path: robotDrawerPath });
  console.log('   - Robot drawer screenshot saved to:', robotDrawerPath);
  await actionCloseBtn.click();
  await page.waitForTimeout(350);

  // 7b. Mode: Voice Calibration
  await row2.click();
  await page.waitForTimeout(300);
  console.log('   - Voice Action Title:', await actionTitle.textContent());
  console.log('   - Voice Slot Content:', (await page.locator('#drawer-action-content-slot').textContent()).includes('Mic Sensitivity Gain'));
  const voiceDrawerPath = path.resolve(__dirname, 'drawer_voice_verified.png');
  await page.locator('#viewport').screenshot({ path: voiceDrawerPath });
  console.log('   - Voice drawer screenshot saved to:', voiceDrawerPath);
  await actionCloseBtn.click();
  await page.waitForTimeout(350);

  // 7c. Mode: Dietary Profile Selection
  await row3.click();
  await page.waitForTimeout(300);
  console.log('   - Diet Action Title:', await actionTitle.textContent());
  console.log('   - Diet Slot Content:', (await page.locator('#drawer-action-content-slot').textContent()).includes('NUT-FREE'));
  const dietDrawerPath = path.resolve(__dirname, 'drawer_diet_verified.png');
  await page.locator('#viewport').screenshot({ path: dietDrawerPath });
  console.log('   - Diet drawer screenshot saved to:', dietDrawerPath);
  await actionCloseBtn.click();
  await page.waitForTimeout(350);

  // 7d. Mode: Notification Nodes
  await row4.click();
  await page.waitForTimeout(300);
  console.log('   - Notif Action Title:', await actionTitle.textContent());
  console.log('   - Notif Slot Content:', (await page.locator('#drawer-action-content-slot').textContent()).includes('Kitchen Prep Alerts'));
  const notifDrawerPath = path.resolve(__dirname, 'drawer_notif_verified.png');
  await page.locator('#viewport').screenshot({ path: notifDrawerPath });
  console.log('   - Notif drawer screenshot saved to:', notifDrawerPath);
  await actionCloseBtn.click();
  await page.waitForTimeout(350);

  // 8. Test Ultra-Premium Subscription Paywall Modal (#premium-plan-modal)
  console.log('8. Testing Subscription Paywall Modal:');
  const proBannerBtn = page.locator('#btn-go-pro');
  const premiumModal = page.locator('#premium-plan-modal');
  const closePremiumBtn = page.locator('#btn-close-premium');

  await proBannerBtn.click();
  await page.waitForTimeout(300);

  const isModalVisible = !(await premiumModal.getAttribute('class')).includes('hidden');
  console.log('   - Paywall Modal Visible:', isModalVisible);

  const headlineText = await page.locator('#premium-plan-modal h3').textContent();
  console.log('   - Headline Text:', headlineText.replace(/\s+/g, ' ').trim());

  const tier1 = page.locator('#premium-plan-modal label:has-text("Monthly Pass")');
  const tier2 = page.locator('#premium-plan-modal label:has-text("6-Month Bundle")');
  const tier3 = page.locator('#premium-plan-modal label:has-text("Premium Pro Annual")');
  console.log('   - Tier 1 (₹129):', await tier1.count());
  console.log('   - Tier 2 (₹449):', await tier2.count());
  console.log('   - Tier 3 (₹699):', await tier3.count());

  const bestValueBadge = page.locator('#premium-plan-modal span:has-text("Best Value — Only ₹58/mo")');
  console.log('   - Best Value Badge Count:', await bestValueBadge.count());

  const activateBtn = page.locator('#btn-activate-premium-plan');
  console.log('   - Activate Button Count:', await activateBtn.count());

  const paywallScreenshotPath = path.resolve(__dirname, 'premium_paywall_modal_verified.png');
  await page.locator('#viewport').screenshot({ path: paywallScreenshotPath });
  console.log('   - Paywall modal screenshot saved to:', paywallScreenshotPath);

  await closePremiumBtn.click();
  await page.waitForTimeout(300);
  const isModalClosed = (await premiumModal.getAttribute('class')).includes('hidden');
  console.log('   - Modal closed after close button click:', isModalClosed);

  console.log('Errors logged:', errors);
  if (errors.length === 0 && (await row1.count()) > 0 && (await row2.count()) > 0 && (await row3.count()) > 0 && (await row4.count()) > 0 && (await row5.count()) > 0 && (await signOutBtn.count()) > 0 && (await versionText.count()) > 0 && (await actionDrawer.count()) > 0 && isModalVisible && isModalClosed) {
    console.log('=== ALL PROFILE & SETTINGS REFINEMENTS VERIFIED SUCCESSFULLY ===');
  } else {
    console.log('=== WARNING / FAILURE ENCOUNTERED ===');
  }

  await browser.close();
})();
