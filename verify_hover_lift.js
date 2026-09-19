const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const fileUrl = 'file://' + path.resolve(__dirname, 'profile.html').replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);
  await page.goto(fileUrl);
  await page.waitForTimeout(500);

  // Open Smart Robot Sync
  await page.click('#btn-open-iot-sheet');
  await page.waitForTimeout(400);

  // Click ENTER DEVICE CONTROL to open Smart Cooking Robot drawer
  await page.click('#btn-disconnect-sync-action');
  await page.waitForTimeout(600);

  // Hover over the first sensor card (Induction Temp)
  const sensorCards = await page.$$('.sensor-item-card');
  console.log('Found sensor cards:', sensorCards.length);
  if (sensorCards.length > 0) {
    await sensorCards[0].hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'verify_sensor_card_hover.png' });
    console.log('Saved verify_sensor_card_hover.png');
  }

  // Hover over Troubleshoot / Run Diagnostics button
  const runDiagBtn = await page.$('#btn-run-diagnostic');
  if (runDiagBtn) {
    await runDiagBtn.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'verify_run_diag_btn_hover.png' });
    console.log('Saved verify_run_diag_btn_hover.png');
  }

  // Hover over Unpair button
  const unpairBtn = await page.$('#btn-unpair-device');
  if (unpairBtn) {
    await unpairBtn.hover();
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'verify_unpair_btn_hover.png' });
    console.log('Saved verify_unpair_btn_hover.png');
  }

  await browser.close();
})();
