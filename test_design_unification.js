const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Target Element 1
  const cardOnlineChatLabelColor = await page.$eval('#card-online-chat span.text-sm', el => {
    return window.getComputedStyle(el).color;
  });
  const cardOnlineChatLabelText = await page.$eval('#card-online-chat span.text-sm', el => el.textContent.trim());

  // Target Element 2
  const cardFaqLinkLabelColor = await page.$eval('#card-faq-link span.text-xs', el => {
    return window.getComputedStyle(el).color;
  });
  const cardFaqLinkLabelText = await page.$eval('#card-faq-link span.text-xs', el => el.textContent.trim());

  console.log('1. Target 1 Label:', cardOnlineChatLabelText);
  console.log('2. Target 1 Computed Color:', cardOnlineChatLabelColor);

  console.log('3. Target 2 Label:', cardFaqLinkLabelText);
  console.log('4. Target 2 Computed Color:', cardFaqLinkLabelColor);

  // rgb(61, 242, 224) corresponds to #3DF2E0
  const isTarget1Cyan = cardOnlineChatLabelColor.includes('61, 242, 224') || cardOnlineChatLabelColor.includes('61,242,224');
  const isTarget2Cyan = cardFaqLinkLabelColor.includes('61, 242, 224') || cardFaqLinkLabelColor.includes('61,242,224');

  console.log('5. Target 1 is Neon Cyan (#3DF2E0):', isTarget1Cyan);
  console.log('6. Target 2 is Neon Cyan (#3DF2E0):', isTarget2Cyan);

  await browser.close();
})();
