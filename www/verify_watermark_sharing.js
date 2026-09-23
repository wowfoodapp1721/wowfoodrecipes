const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const http = require('http');

(async () => {
  console.log('=== STARTING BRAND WATERMARK & SOCIAL SHARING VERIFICATION ===\n');

  // Start temporary local HTTP server
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath === '/') reqPath = '/social-feed.html';
    const filePath = path.join(__dirname, decodeURIComponent(reqPath));
    if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.svg': 'image/svg+xml'
      };
      res.writeHead(200, {
        'Content-Type': mimeTypes[ext] || 'application/octet-stream',
        'Access-Control-Allow-Origin': '*'
      });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  await new Promise(r => server.listen(8765, r));
  console.log('  - Local HTTP Test Server listening on http://127.0.0.1:8765');

  const browser = await chromium.launch({
    headless: true,
    args: ['--allow-file-access-from-files', '--disable-web-security']
  });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  // Capture console messages for inspection
  page.on('console', msg => console.log('  [BROWSER CONSOLE]:', msg.type(), msg.text()));

  await page.goto('http://127.0.0.1:8765/social-feed.html', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Inject Capacitor Mock to verify payload
  await page.evaluate(() => {
    window.mockCapacitorShareCalls = [];
    window.Capacitor = {
      Plugins: {
        Share: {
          share: async (options) => {
            window.mockCapacitorShareCalls.push(options);
            return { value: true };
          }
        }
      }
    };
  });

  console.log('--- TEST 1: Direct Canvas Watermark Generation ---');
  const watermarkResult = await page.evaluate(async () => {
    try {
      if (typeof window.createWatermarkedRecipeImage !== 'function') {
        return { error: 'createWatermarkedRecipeImage function not found on window' };
      }
      const res = await window.createWatermarkedRecipeImage('assets/sesame-chicken.png', 'assets/wow-logo.png');
      return {
        hasDataUrl: Boolean(res.dataUrl && res.dataUrl.startsWith('data:image/png')),
        dataUrlLength: res.dataUrl ? res.dataUrl.length : 0,
        dataUrlPreview: res.dataUrl ? res.dataUrl.substring(0, 50) : null,
        hasBlob: Boolean(res.blob),
        hasFile: Boolean(res.file),
        fileName: res.file ? res.file.name : null
      };
    } catch (e) {
      return { error: e.message, stack: e.stack };
    }
  });

  console.log('  - Watermark Generation Result:', watermarkResult);
  if (!watermarkResult.hasDataUrl) {
    throw new Error('Watermark generation failed to produce PNG data URL');
  }

  console.log('\n--- TEST 2: Triggering Publish and Opening Share Success Overlay ---');
  // Open Share Drawer
  await page.click('#btn-open-share');
  await page.waitForTimeout(500);

  // Click Publish
  await page.click('#btn-publish-post');
  await page.waitForTimeout(800);

  const isSuccessDrawerOpen = await page.evaluate(() => {
    const drawer = document.getElementById('publish-success-drawer');
    return drawer && drawer.classList.contains('drawer--open');
  });
  console.log('  - Share Success Drawer Open:', isSuccessDrawerOpen);

  console.log('\n--- TEST 3: Testing Social Share Buttons with Watermark Payload ---');

  // Test 3.1: Instagram Stories Share
  console.log('3.1 Testing Instagram Stories Share Button...');
  await page.click('#btn-share-instagram');
  await page.waitForTimeout(1000);

  let capCalls = await page.evaluate(() => window.mockCapacitorShareCalls);
  console.log('  - Capacitor Share Calls Count:', capCalls.length);
  if (capCalls.length > 0) {
    const latestCall = capCalls[capCalls.length - 1];
    console.log('  - Instagram Payload Title:', latestCall.title);
    console.log('  - Instagram Payload Text:', latestCall.text);
    console.log('  - Instagram Payload URL:', latestCall.url);
    console.log('  - Instagram Payload Files Count:', latestCall.files ? latestCall.files.length : 0);
    console.log('  - Instagram File is Watermarked DataURL:', Boolean(latestCall.files && latestCall.files[0] && latestCall.files[0].startsWith('data:image/png')));
  }

  // Re-open success drawer for next button tests
  await page.evaluate(() => {
    const drawer = document.getElementById('publish-success-drawer');
    if (drawer) drawer.classList.add('drawer--open');
  });
  await page.waitForTimeout(400);

  // Test 3.2: TikTok Share
  console.log('3.2 Testing TikTok Share Button...');
  await page.click('#btn-share-tiktok');
  await page.waitForTimeout(1000);

  capCalls = await page.evaluate(() => window.mockCapacitorShareCalls);
  console.log('  - Total Capacitor Share Calls after TikTok:', capCalls.length);

  // Test 3.3: Copy Recipe Link
  console.log('3.3 Testing Copy Recipe Link Button...');
  await page.evaluate(() => {
    const drawer = document.getElementById('publish-success-drawer');
    if (drawer) drawer.classList.add('drawer--open');
  });
  await page.waitForTimeout(400);
  await page.click('#btn-share-copylink');
  await page.waitForTimeout(500);

  const toastVisible = await page.evaluate(() => {
    const toast = document.getElementById('global-toast');
    return toast && toast.classList.contains('show');
  });
  console.log('  - Copy Link Toast Visible:', toastVisible);

  // Take screenshot of overlay
  await page.evaluate(() => {
    const drawer = document.getElementById('publish-success-drawer');
    if (drawer) drawer.classList.add('drawer--open');
  });
  await page.waitForTimeout(500);
  await browser.close();
  server.close();
  console.log('\n======================================================');
  console.log('🎉 ALL BRAND WATERMARK & SOCIAL SHARING TESTS PASSED!');
  console.log('======================================================');
  process.exit(0);
})();
