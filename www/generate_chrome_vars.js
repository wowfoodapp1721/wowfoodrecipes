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
      <body style="background: #0B0F14; padding: 40px; display: flex; flex-direction: column; gap: 30px;">
        <div id="container"></div>
      </body>
    </html>
  `);

  const results = await page.evaluate(async (base64) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const splits = [135, 142, 148];
        const outputs = [];

        splits.forEach((splitY, idx) => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');

          // Draw original image to get alpha mask
          ctx.drawImage(img, 0, 0);

          const gradCanvas = document.createElement('canvas');
          gradCanvas.width = img.width;
          gradCanvas.height = img.height;
          const gCtx = gradCanvas.getContext('2d');

          // 1. Top half: highly saturated, glossy pink-to-magenta gradient
          const topGrad = gCtx.createLinearGradient(0, 6, 0, splitY);
          topGrad.addColorStop(0.0, '#FFAAE5'); // Specular pink highlight rim
          topGrad.addColorStop(0.12, '#FF2E93'); // Vivid hot neon pink
          topGrad.addColorStop(0.50, '#E10077'); // Glossy saturated magenta
          topGrad.addColorStop(0.85, '#99005A'); // Rich deep fuchsia
          topGrad.addColorStop(1.0, '#540033'); // Dark rich magenta at horizon line

          gCtx.fillStyle = topGrad;
          gCtx.fillRect(0, 0, img.width, splitY);

          // 2. Bottom half: polished neon cyan-to-ice blue gradient
          const btmGrad = gCtx.createLinearGradient(0, splitY, 0, 275);
          btmGrad.addColorStop(0.0, '#FFFFFF'); // Bright white reflection horizon line
          btmGrad.addColorStop(0.06, '#A6FFF7'); // Luminous neon cyan sheen
          btmGrad.addColorStop(0.28, '#3DF2E0'); // Vibrant Signature Neon Cyan (#3DF2E0)
          btmGrad.addColorStop(0.65, '#00C2FF'); // Bright Ice Blue
          btmGrad.addColorStop(1.0, '#005985'); // Polished deep metallic ice blue

          gCtx.fillStyle = btmGrad;
          gCtx.fillRect(0, splitY, img.width, img.height - splitY);

          // 3. Razor-sharp horizontal reflection line directly at middle axis
          gCtx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          gCtx.fillRect(0, splitY - 0.5, img.width, 1.5);

          // Apply mask
          ctx.globalCompositeOperation = 'source-in';
          ctx.drawImage(gradCanvas, 0, 0);

          outputs.push(canvas.toDataURL('image/png').split(',')[1]);
        });

        resolve(outputs);
      };
      img.src = 'data:image/png;base64,' + base64;
    });
  }, imgBase64);

  results.forEach((b64, i) => {
    fs.writeFileSync(path.join(__dirname, 'assets', `wow_chrome_v${i + 1}.png`), Buffer.from(b64, 'base64'));
    console.log(`Saved assets/wow_chrome_v${i + 1}.png`);
  });

  await browser.close();
})();
