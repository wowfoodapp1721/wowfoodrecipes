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

  // Click row to open "Smart Robot Sync"
  console.log('Clicking #btn-open-iot-sheet...');
  await page.click('#btn-open-iot-sheet');
  await page.waitForTimeout(600);

  // Screenshot of the SMART ROBOT SYNC popup modal
  await page.screenshot({ path: 'verify_robot_sync_modal.png' });
  console.log('Saved verify_robot_sync_modal.png');

  // Verify button exists and check style
  const btn = await page.$('#btn-disconnect-sync-action');
  if (btn) {
    const btnText = await btn.innerText();
    console.log('Button text:', btnText);
  } else {
    console.error('Button #btn-disconnect-sync-action not found!');
  }

  // Click the "DISCONNECT HARDWARE SYNC" button
  console.log('Clicking DISCONNECT HARDWARE SYNC button...');
  await page.click('#btn-disconnect-sync-action');
  await page.waitForTimeout(600);

  // Screenshot after transition to Smart Cooking Robot telemetry panel
  await page.screenshot({ path: 'verify_telemetry_drawer_open.png' });
  console.log('Saved verify_telemetry_drawer_open.png');

  // Check if iot-pairing-drawer is open
  const iotDrawerOpen = await page.evaluate(() => {
    const d = document.getElementById('iot-pairing-drawer');
    return d && d.classList.contains('drawer--open');
  });
  console.log('Is Smart Cooking Robot drawer open?', iotDrawerOpen);

  await browser.close();
})();
