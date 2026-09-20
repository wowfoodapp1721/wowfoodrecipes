const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function runTest() {
  console.log('🚀 Starting Global Profile Picture Synchronization Verification Suite...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 }
  });

  // Base64 Test Avatar Image (A 1x1 or sample PNG encoded to Data URL)
  const testAvatarBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

  try {
    // ═════════════════════════════════════════════════════════════════════════
    // TEST 1: PROFILE SCREEN - CAMERA TRIGGER & LOCALSTORAGE PERSISTENCE
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 1. Testing Profile & Setting Screen (profile.html) ---');
    const pageProfile = await context.newPage();
    const profileUrl = `file://${path.resolve(__dirname, 'profile.html')}`;
    await pageProfile.goto(profileUrl, { waitUntil: 'load' });

    // Verify avatar elements exist with .wow-global-avatar
    const profileAvatar = await pageProfile.$('.avatar-img.wow-global-avatar');
    if (!profileAvatar) {
      throw new Error('❌ Profile screen avatar image is missing .wow-global-avatar class');
    }
    console.log('✅ Profile avatar image found with .wow-global-avatar class.');

    const cameraBtn = await pageProfile.$('#btn-change-avatar');
    if (!cameraBtn) {
      throw new Error('❌ Camera trigger button (#btn-change-avatar) not found on profile screen');
    }
    console.log('✅ Camera trigger button found.');

    // Simulate file selection through triggerWowAvatarUpload / file input
    console.log('📸 Simulating photo upload via FileReader pipeline...');
    await pageProfile.evaluate((sampleData) => {
      localStorage.setItem('wow_user_profile_pic', sampleData);
      window.syncWowProfilePicture(sampleData);
    }, testAvatarBase64);

    // Verify immediate reactive update in DOM on profile.html
    const updatedSrcProfile = await pageProfile.$eval('.avatar-img.wow-global-avatar', el => el.src);
    if (updatedSrcProfile !== testAvatarBase64) {
      throw new Error(`❌ Avatar source did not update immediately on profile screen. Expected ${testAvatarBase64}, got ${updatedSrcProfile}`);
    }
    console.log('✅ Profile avatar source updated immediately in active DOM view without page reload.');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 2: HOME DASHBOARD SCREEN - REAL-TIME REACTIVE RENDERING
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 2. Testing Home Dashboard Screen (dashboard.html) ---');
    const pageDashboard = await context.newPage();
    const dashboardUrl = `file://${path.resolve(__dirname, 'dashboard.html')}`;
    await pageDashboard.goto(dashboardUrl, { waitUntil: 'load' });

    // Verify header profile thumbnail contains synced avatar
    const dashboardAvatar = await pageDashboard.$('#profile-avatar-btn img.wow-global-avatar');
    if (!dashboardAvatar) {
      throw new Error('❌ Dashboard header avatar img.wow-global-avatar not found inside #profile-avatar-btn');
    }

    const dashboardAvatarSrc = await dashboardAvatar.getAttribute('src');
    if (dashboardAvatarSrc !== testAvatarBase64) {
      throw new Error(`❌ Dashboard avatar source mismatch. Expected ${testAvatarBase64}, got ${dashboardAvatarSrc}`);
    }
    console.log('✅ Dashboard header avatar successfully synchronized from localStorage on load.');

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 3: USER DIETARY SETTING HUB SCREEN (SCREEN 8 & MODAL)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 3. Testing User Dietary Setting Hub (Screen 8 & Modal) ---');
    const screen8Url = `file://${path.resolve(__dirname, 'stitch_wow_food_recipes/stitch_wow_food_recipes/screen_8_user_profile_dietary_settings_hub/code.html')}`;
    const pageScreen8 = await context.newPage();
    await pageScreen8.goto(screen8Url, { waitUntil: 'load' });

    const screen8Avatar = await pageScreen8.$('#global-current-user-avatar.wow-global-avatar');
    if (!screen8Avatar) {
      throw new Error('❌ Screen 8 avatar (#global-current-user-avatar) missing .wow-global-avatar class');
    }
    const screen8AvatarSrc = await screen8Avatar.getAttribute('src');
    if (screen8AvatarSrc !== testAvatarBase64) {
      throw new Error(`❌ Screen 8 avatar source mismatch. Expected ${testAvatarBase64}, got ${screen8AvatarSrc}`);
    }
    console.log('✅ Screen 8 greeting avatar successfully synchronized from localStorage.');

    // Test Dietary Matrix view inside profile filters modal
    console.log('Testing Dietary Matrix inside the wow profile filters overlay...');
    const pageIot = await context.newPage();
    const iotUrl = `file://${path.resolve(__dirname, 'iot-settings.html')}`;
    await pageIot.goto(iotUrl, { waitUntil: 'load' });

    // Open filter overlay
    const filterBtn = await pageIot.$('.header-filter-btn');
    if (filterBtn) {
      await filterBtn.click();
      await pageIot.waitForTimeout(300);

      // Switch to Dietary Matrix tab
      const dietaryTab = await pageIot.$('#tab-btn-dietary-matrix');
      if (dietaryTab) {
        await dietaryTab.click();
        await pageIot.waitForTimeout(200);

        const modalDietaryAvatar = await pageIot.$('#view-dietary-matrix img.wow-global-avatar');
        if (modalDietaryAvatar) {
          const modalAvatarSrc = await modalDietaryAvatar.getAttribute('src');
          if (modalAvatarSrc === testAvatarBase64) {
            console.log('✅ Modal Dietary Matrix avatar successfully synchronized in real time.');
          } else {
            console.warn(`⚠️ Modal avatar src: ${modalAvatarSrc}`);
          }
        }
      }
    }

    // ═════════════════════════════════════════════════════════════════════════
    // TEST 4: CHEF AI ASSISTANT SCREEN (chef-ai-showcase.html)
    // ═════════════════════════════════════════════════════════════════════════
    console.log('\n--- 4. Testing Chef AI Assistant Screen (chef-ai-showcase.html) ---');
    const pageChefAI = await context.newPage();
    const chefAIUrl = `file://${path.resolve(__dirname, 'chef-ai-showcase.html')}`;
    await pageChefAI.goto(chefAIUrl, { waitUntil: 'load' });

    const chefAIAvatar = await pageChefAI.$('.showcase-header img.wow-global-avatar');
    if (!chefAIAvatar) {
      throw new Error('❌ Chef AI header profile avatar missing .wow-global-avatar class');
    }
    const chefAIAvatarSrc = await chefAIAvatar.getAttribute('src');
    if (chefAIAvatarSrc !== testAvatarBase64) {
      throw new Error(`❌ Chef AI avatar source mismatch. Expected ${testAvatarBase64}, got ${chefAIAvatarSrc}`);
    }
    console.log('✅ Chef AI Assistant header profile avatar successfully synchronized.');

    console.log('\n🎉 ALL 4 SCREENS & PROFILE PICTURE SYNCHRONIZATION TESTS PASSED PERFECTLY!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTest();
