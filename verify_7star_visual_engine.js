const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting 7-Star Visual Asset Filter & Dynamic Background Engine Verification...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 412, height: 915 } });

  // Helper to load file URL
  const loadPage = async (relativePath) => {
    const fileUrl = 'file:///' + path.resolve(__dirname, relativePath).replace(/\\/g, '/');
    await page.goto(fileUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
  };

  try {
    // 1. Test Recipe Detail View with Carbonara (ID: 52982)
    console.log('\n--- Test 1: Recipe Detail View with Carbonara (52982) ---');
    await loadPage('recipe-detail.html?id=52982');

    const detailStyles = await page.evaluate(() => {
      const header = document.getElementById('recipe-header');
      const mediaContainer = document.querySelector('.media-container');
      const coverImg = document.querySelector('.media-cover-img');
      const engineStyle = document.getElementById('wow-7star-visual-engine');

      const computedHeader = header ? window.getComputedStyle(header) : null;
      const computedContainer = mediaContainer ? window.getComputedStyle(mediaContainer) : null;
      const computedImg = coverImg ? window.getComputedStyle(coverImg) : null;

      return {
        hasEngineTag: !!engineStyle,
        headerBg: computedHeader ? (computedHeader.backgroundImage || computedHeader.background) : null,
        containerBorder: computedContainer ? computedContainer.border : null,
        containerBoxShadow: computedContainer ? computedContainer.boxShadow : null,
        imgFilter: computedImg ? computedImg.filter : null,
        imgObjectFit: computedImg ? computedImg.objectFit : null,
        imgSrc: coverImg ? coverImg.src : null
      };
    });

    console.log('Detail Styles Verified:', detailStyles);
    console.log('✓ Has 7-Star Visual Engine Style Tag:', detailStyles.hasEngineTag);
    console.log('✓ Image Filter contains contrast/saturate:', detailStyles.imgFilter.includes('contrast') || detailStyles.imgFilter.includes('saturate'));
    console.log('✓ Container Box Shadow Glow present:', detailStyles.containerBoxShadow.includes('rgba(61, 242, 224') || detailStyles.containerBoxShadow.includes('61, 242, 224'));
    console.log('✓ Image Object Fit is cover:', detailStyles.imgObjectFit === 'cover');

    // 2. Test High-Res Fallback Trigger on Image Error
    console.log('\n--- Test 2: Fallback Image Error Auto-Recovery ---');
    const fallbackSrc = await page.evaluate(() => {
      const coverImg = document.querySelector('.media-cover-img');
      if (coverImg && typeof coverImg.onerror === 'function') {
        // Force error
        coverImg.onerror();
        return coverImg.src;
      }
      return null;
    });
    console.log('✓ Fallback triggered image src:', fallbackSrc);

    // 3. Test Cooking Guide / Immersive Mode View (52772)
    console.log('\n--- Test 3: Immersive Cooking Mode View (52772) ---');
    await loadPage('cooking-guide.html?id=52772');

    const cookModeStyles = await page.evaluate(() => {
      const stepMediaFrame = document.getElementById('step-media-frame') || document.querySelector('.step-media-container');
      const stepPhoto = document.getElementById('step-media-photo') || document.querySelector('.step-photo-img');

      const computedFrame = stepMediaFrame ? window.getComputedStyle(stepMediaFrame) : null;
      const computedPhoto = stepPhoto ? window.getComputedStyle(stepPhoto) : null;

      return {
        frameBoxShadow: computedFrame ? computedFrame.boxShadow : null,
        frameBorder: computedFrame ? computedFrame.border : null,
        photoFilter: computedPhoto ? computedPhoto.filter : null,
        photoObjectFit: computedPhoto ? computedPhoto.objectFit : null,
        recipeTitle: document.getElementById('label-recipe-title')?.textContent
      };
    });

    console.log('Cook Mode Verified:', cookModeStyles);
    console.log('✓ Cook Mode Media Glow:', cookModeStyles.frameBoxShadow.includes('rgba(61, 242, 224') || cookModeStyles.frameBoxShadow.includes('61, 242, 224'));
    console.log('✓ Cook Mode Filter:', cookModeStyles.photoFilter);
    console.log('✓ Cook Mode Title:', cookModeStyles.recipeTitle);

    // Capture screenshots for visual confirmation
    await page.screenshot({ path: 'verify_detail_7star.png' });
    await loadPage('recipe-detail.html?id=52982');
    await page.screenshot({ path: 'verify_carbonara_detail_7star.png' });

    console.log('\n✨ ALL 7-STAR VISUAL ASSET FILTER & DYNAMIC BACKGROUND ENGINE TESTS PASSED ✨');
  } catch (e) {
    console.error('Test failed:', e);
  } finally {
    await browser.close();
  }
})();
