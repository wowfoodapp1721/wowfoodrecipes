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

  // Send mail keyword message
  await page.fill('#live-chat-input', 'send support email contact');
  await page.click('#btn-send-live-chat');
  await page.waitForTimeout(600);

  // Inspect Mail Client Button
  const btnText = await page.$eval('#btn-launch-mail-client', el => el.textContent.trim());
  const btnHref = await page.$eval('#btn-launch-mail-client', el => el.getAttribute('href'));
  const btnOnClick = await page.$eval('#btn-launch-mail-client', el => el.getAttribute('onclick'));

  console.log('1. Mail Client Button Text:', btnText);
  console.log('2. Mail Client Href:', btnHref);
  console.log('3. Mail Client OnClick:', btnOnClick);

  const decodedHref = decodeURIComponent(btnHref);
  console.log('4. Decoded Href:', decodedHref);

  const hasAddress = decodedHref.includes('mailto:support@wowfoodrecipes.com');
  const hasSubject = decodedHref.includes('subject=Wow Food Recipes - Customer Support Request');
  const hasBodyHi = decodedHref.includes('Hi Wow Food Recipes Team,');
  const hasBodyOrigin = decodedHref.includes('Origin Node: In-App Chatbot Concierge Link Gateway');

  console.log('5. Target Address Correct:', hasAddress);
  console.log('6. Subject Line Correct:', hasSubject);
  console.log('7. Message Body Hi String Correct:', hasBodyHi);
  console.log('8. Message Body Origin Node Correct:', hasBodyOrigin);

  await browser.close();
})();
