const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function createTestServer(port) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqUrl = req.url.split('?')[0];
      let filePath = path.join(__dirname, reqUrl === '/' ? 'recipe-detail.html' : reqUrl);
      fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404');
          return;
        }
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        fs.createReadStream(filePath).pipe(res);
      });
    });
    server.listen(port, () => resolve(server));
  });
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }
  });
  const page = await context.newPage();

  // -------------------------------------------------------------
  // Test 1: Local file preview (file:// protocol)
  // -------------------------------------------------------------
  console.log('--- Test 1: Local file preview (file:// protocol) ---');
  let alertDialogMsg = null;
  page.on('dialog', async (dialog) => {
    alertDialogMsg = dialog.message();
    console.log('Intercepted alert dialog in file:// mode:', alertDialogMsg);
    await dialog.accept();
  });

  const fileUrl = 'file:///' + path.resolve(__dirname, 'recipe-detail.html').replace(/\\/g, '/');
  await page.goto(fileUrl + '?recipe=spaghetti-carbonara', { waitUntil: 'domcontentloaded' });

  // Expose indicator to check if navigator.share was called
  await page.evaluate(() => {
    window.__shareCalled = false;
    if (navigator.share) {
      const origShare = navigator.share;
      navigator.share = async (...args) => {
        window.__shareCalled = true;
        return origShare(...args);
      };
    } else {
      navigator.share = async () => {
        window.__shareCalled = true;
      };
    }
  });

  // Open share sheet
  await page.click('#btn-share-recipe');
  await page.waitForSelector('#share-sheet-overlay.open');

  // Click More Options on file:// protocol
  await page.click('#share-btn-more');
  await page.waitForTimeout(500);

  const didCallShareOnFile = await page.evaluate(() => window.__shareCalled);
  console.log('navigator.share executed on file:// protocol:', didCallShareOnFile);

  if (didCallShareOnFile) {
    throw new Error('Test 1 Failed: navigator.share was called on file:// protocol!');
  }

  if (alertDialogMsg !== 'Recipe link successfully copied to clipboard!') {
    throw new Error(`Test 1 Failed: expected alert "Recipe link successfully copied to clipboard!", got "${alertDialogMsg}"`);
  }

  // -------------------------------------------------------------
  // Test 2: Localhost server (Secure Context: localhost)
  // -------------------------------------------------------------
  console.log('--- Test 2: Localhost server execution (isSecureContext = true) ---');
  const server = await createTestServer(3888);
  const page2 = await context.newPage();

  let capturedSharePayload = null;
  await page2.exposeFunction('reportSharePayload', (payload) => {
    capturedSharePayload = payload;
  });

  await page2.goto('http://localhost:3888/recipe-detail.html?recipe=spaghetti-carbonara', { waitUntil: 'domcontentloaded' });

  await page2.evaluate(() => {
    navigator.share = async (data) => {
      window.reportSharePayload(data);
      return Promise.resolve();
    };
  });

  // Open share sheet
  await page2.click('#btn-share-recipe');
  await page2.waitForSelector('#share-sheet-overlay.open');

  // Click More Options on localhost
  await page2.click('#share-btn-more');
  await page2.waitForTimeout(500);

  console.log('Captured native share payload on localhost:', capturedSharePayload);

  if (!capturedSharePayload) {
    throw new Error('Test 2 Failed: navigator.share was NOT called on localhost!');
  }
  if (capturedSharePayload.title !== 'Spaghetti Carbonara | wow Chef AI' || capturedSharePayload.text !== 'Check out this predictive recipe!') {
    throw new Error('Test 2 Failed: payload mismatch on localhost');
  }

  await browser.close();
  server.close();
  console.log('All tests passed 100% successfully!');
})();
