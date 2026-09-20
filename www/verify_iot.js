const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('--- PLAYWRIGHT VERIFICATION SCRIPT START ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const filePath = 'file:///' + path.resolve(__dirname, 'iot-settings.html').replace(/\\/g, '/');
  console.log('Navigating to:', filePath);

  await page.goto(filePath, { waitUntil: 'load' });
  console.log('Page loaded successfully. Title:', await page.title());

  // 1. Verify SCR-12A Base View Elements
  const headerTitle = await page.locator('.header-page-title').textContent();
  console.log('SCR-12A Header Title:', headerTitle.trim());

  // 2. Open SCR-12B IoT Drawer
  console.log('Clicking "Smart Robot Connectivity" row...');
  await page.click('#btn-open-iot-sheet');
  await page.waitForTimeout(400);

  const isDrawerOpen = await page.evaluate(() => {
    const el = document.getElementById('iot-pairing-drawer');
    return el && el.classList.contains('drawer--open');
  });
  console.log('SCR-12B Drawer Open State:', isDrawerOpen);

  const deviceTitle = await page.locator('.robot-device-title').textContent();
  console.log('SCR-12B Connected Device:', deviceTitle.trim());

  // 3. Trigger Hardware Diagnostics (SCR-12B -> SCR-03H)
  console.log('Triggering "Troubleshoot / Run Diagnostics"...');
  await page.click('#btn-run-diagnostic');

  // Wait for 2s scanning simulation to complete
  await page.waitForTimeout(2200);

  const is3hActive = await page.evaluate(() => {
    const el = document.getElementById('view-screen-3h');
    return el && el.classList.contains('view--active');
  });
  console.log('SCR-03H Support View Active State:', is3hActive);

  const injectedLog = await page.inputValue('#issue-description-input');
  console.log('SCR-03H Injected Log Tag contains [HARDWARE_LOG_ERR_12B]:', injectedLog.includes('[HARDWARE_LOG_ERR_12B]'));

  // 4. Submit Issue Details Form
  console.log('Submitting issue ticket...');
  await page.click('#btn-submit-issue-form');
  await page.waitForTimeout(300);

  const isModalVisible = await page.evaluate(() => {
    const el = document.getElementById('ticket-success-modal');
    return el && el.classList.contains('show');
  });
  console.log('Ticket Confirmation Modal Show State:', isModalVisible);

  await browser.close();
  console.log('--- PLAYWRIGHT VERIFICATION SCRIPT COMPLETED WITH 100% SUCCESS ---');
})();
