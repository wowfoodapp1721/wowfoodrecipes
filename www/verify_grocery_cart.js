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

  const filePath = 'file:///' + path.resolve(__dirname, 'grocery.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle' });

  // 1. Check initial price and item count
  const initialData = await page.evaluate(() => {
    return {
      priceCheckout: document.querySelector('.checkout-btn-right span:first-child')?.innerText,
      priceSummary: document.getElementById('delivery-items-summary')?.innerText,
      subtitle: document.getElementById('remaining-header-subtitle')?.innerText,
      ribeyeQty: document.getElementById('qty-ribeye')?.innerText
    };
  });
  console.log('Initial state:', initialData);

  // 2. Test Quantity Increment on Ribeye
  await page.evaluate(() => {
    window.adjustQty('ribeye', 1);
  });
  const afterInc = await page.evaluate(() => {
    return {
      ribeyeQty: document.getElementById('qty-ribeye')?.innerText,
      priceCheckout: document.querySelector('.checkout-btn-right span:first-child')?.innerText,
      priceSummary: document.getElementById('delivery-items-summary')?.innerText
    };
  });
  console.log('After incrementing ribeye by +1:', afterInc);

  // 3. Test Quantity Decrement on Ribeye
  await page.evaluate(() => {
    window.adjustQty('ribeye', -1);
  });
  const afterDec = await page.evaluate(() => {
    return {
      ribeyeQty: document.getElementById('qty-ribeye')?.innerText,
      priceCheckout: document.querySelector('.checkout-btn-right span:first-child')?.innerText
    };
  });
  console.log('After decrementing ribeye by -1:', afterDec);

  // 4. Test Recipe Filter on "🍗 Honey Sesame"
  await page.click('button[data-recipe="chicken"]');
  const chickenFilterState = await page.evaluate(() => {
    const visibleCards = Array.from(document.querySelectorAll('.grocery-card:not(.hidden):not([style*="display: none"])'));
    return {
      visibleCount: visibleCards.length,
      visibleTitles: visibleCards.map(c => c.querySelector('.item-title')?.innerText),
      priceCheckout: document.querySelector('.checkout-btn-right span:first-child')?.innerText
    };
  });
  console.log('Chicken filter state:', chickenFilterState);

  // 5. Test Resetting to All
  await page.click('button[data-recipe="all"]');
  const allFilterState = await page.evaluate(() => {
    const visibleCards = Array.from(document.querySelectorAll('.grocery-card:not(.hidden):not([style*="display: none"])'));
    return {
      visibleCount: visibleCards.length,
      priceCheckout: document.querySelector('.checkout-btn-right span:first-child')?.innerText
    };
  });
  console.log('All filter state:', allFilterState);

  // Take screenshot of grocery smart cart view
  await page.screenshot({ path: path.join(__dirname, 'grocery_smart_cart_verified.png') });

  console.log('Console / runtime errors:', errors);
  await browser.close();
})();
