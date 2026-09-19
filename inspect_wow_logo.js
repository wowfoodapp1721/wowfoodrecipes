const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const imgPath = path.join(__dirname, 'assets', 'wow.png');
  const imgBase64 = fs.readFileSync(imgPath).toString('base64');

  await page.setContent(`
    <html>
      <body>
        <canvas id="c"></canvas>
      </body>
    </html>
  `);

  const info = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('c');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        
        let minY = img.height, maxY = 0;
        let minX = img.width, maxX = 0;
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const alpha = imgData.data[(y * img.width + x) * 4 + 3];
            if (alpha > 10) {
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
            }
          }
        }
        resolve({
          width: img.width,
          height: img.height,
          bounds: { minX, maxX, minY, maxY, strokeHeight: maxY - minY }
        });
      };
      img.src = 'data:image/png;base64,' + base64;
    });
  }, imgBase64);

  console.log('Image dimensions and bounds:', info);
  await browser.close();
})();
