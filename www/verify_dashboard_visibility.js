const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', err => errors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  const filePath = 'file:///' + path.resolve(__dirname, 'dashboard.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle' });

  const viewportVisible = await page.$eval('#viewport', el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      width: rect.width,
      height: rect.height,
      display: style.display,
      visibility: style.visibility,
      opacity: style.opacity
    };
  });

  const modalState = await page.$eval('#recipe-details-modal', el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      classList: Array.from(el.classList),
      display: style.display,
      height: rect.height
    };
  });

  const recipeCardsCount = await page.$$eval('.recipe-card', els => els.length);

  console.log('Errors:', errors);
  console.log('Viewport metrics:', viewportVisible);
  console.log('Modal default state:', modalState);
  console.log('Recipe cards count:', recipeCardsCount);

  // Test opening modal
  await page.evaluate(() => {
    window.openRecipeDetails('ribeye');
  });

  const modalOpenState = await page.$eval('#recipe-details-modal', el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return {
      classList: Array.from(el.classList),
      display: style.display,
      height: rect.height,
      title: document.getElementById('modal-recipe-title')?.innerText
    };
  });

  console.log('Modal opened state:', modalOpenState);

  // Take screenshot of opened modal
  await page.screenshot({ path: path.join(__dirname, 'clean_init_modal_verified.png') });

  await browser.close();
})();
