const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 412, height: 915 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  const filePath = path.join(__dirname, 'profile.html');
  await page.goto(`file://${filePath}`);
  await page.waitForTimeout(1000);

  // 1. Click Help & Support to open Screen 3H (Submit Issue Details)
  console.log('Opening Submit Issue Details view...');
  await page.click('#btn-support-direct');
  await page.waitForTimeout(500);

  // Take screenshot of Screen 3H
  await page.screenshot({ path: 'screen_3h_view_verified.png' });
  console.log('Saved screen_3h_view_verified.png');

  // Verify Screen 3H is active
  const is3hActive = await page.evaluate(() => {
    const el = document.getElementById('view-screen-3h');
    return el && el.classList.contains('view--active');
  });
  console.log('Screen 3H is active:', is3hActive);

  // 2. Click the back arrow on Screen 3H
  console.log('Clicking back arrow on Screen 3H (#btn-back-from-3h)...');
  await page.click('#btn-back-from-3h');
  await page.waitForTimeout(500);

  // Take screenshot after back arrow click
  await page.screenshot({ path: 'settings_directory_after_back_verified.png' });
  console.log('Saved settings_directory_after_back_verified.png');

  // Verify state after clicking back arrow
  const stateAfterBack = await page.evaluate(() => {
    const s3h = document.getElementById('view-screen-3h');
    const iotDrawer = document.getElementById('iot-pairing-drawer');
    const actionDrawer = document.getElementById('settings-action-drawer');
    const ticketModal = document.getElementById('ticket-success-modal');

    return {
      s3hActive: s3h ? s3h.classList.contains('view--active') : false,
      s3hHidden: s3h ? s3h.getAttribute('aria-hidden') : null,
      iotDrawerOpen: iotDrawer ? iotDrawer.classList.contains('drawer--open') : false,
      actionDrawerOpen: actionDrawer ? actionDrawer.classList.contains('drawer--open') : false,
      ticketModalOpen: ticketModal ? ticketModal.classList.contains('show') : false
    };
  });

  console.log('State after clicking back arrow:', stateAfterBack);

  if (!stateAfterBack.s3hActive && !stateAfterBack.iotDrawerOpen && !stateAfterBack.actionDrawerOpen) {
    console.log('SUCCESS: Back arrow cleanly restored Profile & Settings list container without displaying the Smart Robot panel!');
  } else {
    console.error('FAILURE: Unexpected overlay state remains open:', stateAfterBack);
  }

  await browser.close();
})();
