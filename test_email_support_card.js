const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);
  await page.goto(filePath);

  // Unhide view-help-support directly
  await page.$eval('#view-help-support', el => {
    el.classList.add('view--active');
    el.setAttribute('aria-hidden', 'false');
  });

  await page.waitForSelector('#view-help-support.view--active', { timeout: 3000 });

  // Check the function source code and DOM script setup
  const fileContent = await page.content();
  const hasCardListener = fileContent.includes('cardEmailSupport.addEventListener');
  const hasSubject = fileContent.includes("Wow Food Recipes - Mobile Customer Support Request");
  const hasFramework = fileContent.includes("• Distribution Framework: Android Mobile Client Application");
  const hasPlatform = fileContent.includes("• Platform Architecture: Core Web-Tech Infrastructure (HTML/CSS/JS)");
  const hasLogGen = fileContent.includes("• Log Generated:");

  console.log('1. Card Listener Present:', hasCardListener);
  console.log('2. Subject Matrix Correct:', hasSubject);
  console.log('3. Framework String Correct:', hasFramework);
  console.log('4. Platform Architecture String Correct:', hasPlatform);
  console.log('5. Log Generated String Correct:', hasLogGen);

  await browser.close();
})();
