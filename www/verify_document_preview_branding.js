const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-print.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // 1. Verify Top Right sub-branding text
  const vaultText = await page.$eval('.mockup-vault-text', el => el.textContent.trim());
  console.log('Mockup Vault Text:', vaultText);
  if (vaultText !== 'WOW KITCHEN VAULT') {
    throw new Error(`Expected "WOW KITCHEN VAULT", got "${vaultText}"`);
  }

  // 2. Verify Bottom Left footer text
  const footerPrintedText = await page.$eval('.mockup-footer span:first-child', el => el.textContent.trim());
  console.log('Mockup Footer Printed Text:', footerPrintedText);
  if (footerPrintedText !== 'Printed from wow Kitchen App') {
    throw new Error(`Expected "Printed from wow Kitchen App", got "${footerPrintedText}"`);
  }

  // 3. Verify recipe title and other elements
  const recipeTitle = await page.$eval('#doc-recipe-title', el => el.textContent.trim());
  console.log('Mockup Recipe Title:', recipeTitle);
  if (recipeTitle !== 'Honey Sesame Chicken') {
    throw new Error(`Expected "Honey Sesame Chicken", got "${recipeTitle}"`);
  }

  await page.screenshot({ path: 'verify_document_preview_wow_branding.png' });
  console.log('Saved verify_document_preview_wow_branding.png');

  console.log('All branding text validations passed with 100% success!');
  await browser.close();
})();
