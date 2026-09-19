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
      <body style="background: #0B0F14; padding: 20px;">
        <canvas id="c"></canvas>
      </body>
    </html>
  `);

  const renderedPngBase64 = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.getElementById('c');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw original image first
        ctx.drawImage(img, 0, 0);

        // Get bounds
        const imgData = ctx.getImageData(0, 0, img.width, img.height);
        let minY = img.height, maxY = 0;
        for (let y = 0; y < img.height; y++) {
          for (let x = 0; x < img.width; x++) {
            const alpha = imgData.data[(y * img.width + x) * 4 + 3];
            if (alpha > 20) {
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        // Split horizon line is at the middle axis
        const splitY = Math.round(minY + (maxY - minY) * 0.48); // ~134px

        // Create an offscreen canvas for the 80s chrome gradient
        const gradCanvas = document.createElement('canvas');
        gradCanvas.width = img.width;
        gradCanvas.height = img.height;
        const gCtx = gradCanvas.getContext('2d');

        // 1. Top half: Saturated, glossy Pink-to-Magenta gradient (from minY to splitY)
        const topGrad = gCtx.createLinearGradient(0, minY, 0, splitY);
        topGrad.addColorStop(0.0, '#FFD6F0'); // Glossy light pink specular rim at top
        topGrad.addColorStop(0.15, '#FF3399'); // Electric hot pink
        topGrad.addColorStop(0.55, '#E6007A'); // Deep vibrant magenta
        topGrad.addColorStop(0.92, '#8A0052'); // Deep fuchsia
        topGrad.addColorStop(1.0, '#4A0030'); // Dark magenta right at horizon

        gCtx.fillStyle = topGrad;
        gCtx.fillRect(0, 0, img.width, splitY);

        // 2. Bottom half: Polished Neon Cyan to Ice Blue gradient (from splitY to maxY)
        const btmGrad = gCtx.createLinearGradient(0, splitY, 0, maxY + 10);
        btmGrad.addColorStop(0.0, '#FFFFFF'); // Razor-sharp chrome reflection horizon line
        btmGrad.addColorStop(0.08, '#70FFF3'); // Ultra-bright neon cyan
        btmGrad.addColorStop(0.35, '#3DF2E0'); // Signature Neon Cyan
        btmGrad.addColorStop(0.70, '#00B4D8'); // Ice blue
        btmGrad.addColorStop(1.0, '#005F73'); // Deep metallic ice blue/cyan base

        gCtx.fillStyle = btmGrad;
        gCtx.fillRect(0, splitY, img.width, img.height - splitY);

        // 3. Add razor-sharp horizon white sheen line right across the split
        gCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        gCtx.fillRect(0, splitY, img.width, 1.5);

        // Now composite using source-in so the original silhouette and alpha are preserved 100%
        ctx.globalCompositeOperation = 'source-in';
        ctx.drawImage(gradCanvas, 0, 0);

        // Return new PNG data url
        resolve(canvas.toDataURL('image/png').split(',')[1]);
      };
      img.src = 'data:image/png;base64,' + base64;
    });
  }, imgBase64);

  const outBuffer = Buffer.from(renderedPngBase64, 'base64');
  fs.writeFileSync(path.join(__dirname, 'assets', 'wow_chrome_test.png'), outBuffer);
  console.log('Saved assets/wow_chrome_test.png');

  await browser.close();
})();
