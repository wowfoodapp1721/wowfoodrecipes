const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Unhide view-live-chat and input drawer directly
  await page.$eval('#view-live-chat', el => {
    el.classList.add('view--active');
    el.setAttribute('aria-hidden', 'false');
  });
  await page.$eval('#live-chat-language-drawer', el => el.classList.add('hidden'));
  await page.$eval('#live-chat-input-drawer', el => el.classList.remove('hidden'));

  await page.waitForSelector('#view-live-chat.view--active', { timeout: 3000 });

  // Test Route 3: Greeting ("hello")
  await page.fill('#live-chat-input', 'hello there');
  await page.click('#btn-send-live-chat');
  await page.waitForTimeout(600);

  let assistantReplies = await page.$$eval('#live-chat-messages-container div.items-start p', els => els.map(e => e.textContent.trim()));
  console.log('1. Greeting Route Response:', assistantReplies[assistantReplies.length - 1]);

  // Test Route 2: Help ("need help with recipe")
  await page.fill('#live-chat-input', 'I have an issue with a recipe query');
  await page.click('#btn-send-live-chat');
  await page.waitForTimeout(600);

  assistantReplies = await page.$$eval('#live-chat-messages-container div.items-start p', els => els.map(e => e.textContent.trim()));
  console.log('2. Help Route Response:', assistantReplies[assistantReplies.length - 1]);

  // Test Route 1: Mail ("contact support email")
  await page.fill('#live-chat-input', 'please give me your support email address');
  await page.click('#btn-send-live-chat');
  await page.waitForTimeout(600);

  assistantReplies = await page.$$eval('#live-chat-messages-container div.items-start p', els => els.map(e => e.textContent.trim()));
  const mailBtnText = await page.$eval('#live-chat-messages-container a', a => a.textContent.trim());
  const mailHref = await page.$eval('#live-chat-messages-container a', a => a.getAttribute('href'));

  console.log('3. Mail Route Response:', assistantReplies[assistantReplies.length - 1]);
  console.log('4. Mail Button Text:', mailBtnText);
  console.log('5. Mail Href:', mailHref);

  // Test Route 4: Fallback ("custom unhandled phrase")
  await page.fill('#live-chat-input', 'xyz unknown string 999');
  await page.click('#btn-send-live-chat');
  await page.waitForTimeout(600);

  assistantReplies = await page.$$eval('#live-chat-messages-container div.items-start p', els => els.map(e => e.textContent.trim()));
  console.log('6. Fallback Route Response:', assistantReplies[assistantReplies.length - 1]);

  await browser.close();
})();
