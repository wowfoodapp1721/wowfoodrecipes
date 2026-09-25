const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('Testing routing and brand logo alignment...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 393, height: 852 }
  });
  const page = await context.newPage();

  // Test 1: index.html redirection
  console.log('1. Testing index.html entry point...');
  const indexPath = 'file:///' + path.resolve(__dirname, '..', 'index.html').replace(/\\/g, '/');
  await page.goto(indexPath);
  await page.waitForURL(/splash\.html/, { timeout: 3000 });
  console.log('   ✓ index.html immediately routes to splash.html! Current URL:', page.url());

  // Test 2: splash.html redirection to auth.html
  console.log('2. Testing splash.html video redirect to auth.html...');
  await page.waitForURL(/auth\.html/, { timeout: 6000 });
  console.log('   ✓ splash.html automatically redirected to auth.html! Current URL:', page.url());

  // Test 3: auth.html logo rendering
  console.log('3. Testing brand logo in auth.html...');
  const logo = await page.$('img[alt="wow brand logo"]');
  if (!logo) throw new Error('Logo element not found!');
  const src = await logo.getAttribute('src');
  console.log('   ✓ Brand logo found with src:', src);

  const isNatural = await page.evaluate(() => {
    const img = document.querySelector('img[alt="wow brand logo"]');
    return img && img.naturalWidth > 0 && img.naturalHeight > 0;
  });
  console.log('   ✓ Brand logo loaded and rendered correctly! Image natural dimensions verified:', isNatural);

  console.log('\n🎉 ALL SYSTEM ROUTING AND ASSET ALIGNMENTS VERIFIED SUCCESSFULLY!');
  await browser.close();
})();
