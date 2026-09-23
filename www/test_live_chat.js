const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Trigger click on #card-messaging-action via JS dispatch
  await page.$eval('#card-messaging-action', el => el.click());

  await page.waitForSelector('#view-live-chat.view--active', { timeout: 3000 });

  const isLiveChatVisible = await page.isVisible('#view-live-chat');
  console.log('1. Live Chat Viewport Visible:', isLiveChatVisible);

  // Verify Header Elements
  const headerLogoSrc = await page.$eval('#view-live-chat header img', img => img.getAttribute('src'));
  const headerTitle = await page.$eval('#view-live-chat header h2', h2 => h2.textContent.trim());
  const closeMarker = await page.$eval('#btn-close-live-chat', btn => btn.textContent.trim());

  console.log('2. Header Logo Src:', headerLogoSrc);
  console.log('3. Header Title:', headerTitle);
  console.log('4. Close Marker:', closeMarker);

  // Verify Sub-header Help Banner
  const subBannerText = await page.$eval('#view-live-chat p.text-\\[\\#8E9AA6\\]', p => p.textContent.trim());
  console.log('5. Sub-header Banner Text:', subBannerText);

  // Verify System Welcome Message Interface
  const welcomeMessage = await page.$eval('#live-chat-messages-container p', p => p.textContent.trim());
  const welcomeMeta = await page.$eval('#live-chat-messages-container span', span => span.textContent.trim());
  console.log('6. Welcome Message:', welcomeMessage);
  console.log('7. Welcome Metadata:', welcomeMeta);

  // Verify Fixed Bottom Quick-Action Filter Pills
  const pill1Text = await page.$eval('#pill-lang-english', btn => btn.textContent.trim());
  const pill2Text = await page.$eval('#pill-lang-hindi', btn => btn.textContent.trim());
  console.log('8. Language Pill 1:', pill1Text);
  console.log('9. Language Pill 2:', pill2Text);

  // Test Language Choice Selection Handshake Protocol (Click "English")
  await page.click('#pill-lang-english');
  await page.waitForTimeout(600);

  const isDrawerHidden = await page.$eval('#live-chat-language-drawer', el => el.classList.contains('hidden'));
  const isInputDrawerVisible = await page.$eval('#live-chat-input-drawer', el => !el.classList.contains('hidden'));
  console.log('10. Language Onboarding Drawer Hidden:', isDrawerHidden);
  console.log('11. Interactive Input Drawer Visible:', isInputDrawerVisible);

  // Check printed outgoing user message bubble
  const outgoingMsg = await page.$eval('#live-chat-messages-container div.items-end p', p => p.textContent.trim());
  console.log('12. Outgoing Language Choice Bubble:', outgoingMsg);

  // Check assistant reply in stream
  const botReplies = await page.$$eval('#live-chat-messages-container div.items-start p', els => els.map(e => e.textContent.trim()));
  console.log('13. Assistant Replies in Stream:', botReplies);

  // Test Close Button
  await page.click('#btn-close-live-chat');
  await page.waitForTimeout(300);
  const isLiveChatClosed = await page.$eval('#view-live-chat', el => !el.classList.contains('view--active'));
  console.log('14. Live Chat Viewport Closed Cleanly:', isLiveChatClosed);

  await browser.close();
})();
