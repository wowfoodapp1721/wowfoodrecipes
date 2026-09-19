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

  // Trigger opening the paywall modal
  await page.evaluate(() => {
    if (window.openGoProCheckoutModal) {
      window.openGoProCheckoutModal();
    } else {
      document.getElementById('premium-plan-modal').classList.remove('hidden');
    }
  });

  await page.waitForTimeout(500);

  // Take screenshot of the open modal
  await page.screenshot({ path: 'paywall_neon_cyan_verified.png' });
  console.log('Screenshot saved to paywall_neon_cyan_verified.png');

  // Verify elements in DOM
  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('premium-plan-modal');
    const inviteLink = modal.querySelector('span:contains("Campaign Invite Link"), span');
    const bestValueBadge = modal.querySelector('span:has-text("Best Value"), span.absolute');
    const activeTier = modal.querySelector('.paywall-tier-label input:checked')?.closest('label');
    const activateBtn = document.getElementById('btn-activate-premium-plan');

    return {
      modalBg: modal ? getComputedStyle(modal).background : null,
      inviteLinkColor: inviteLink ? getComputedStyle(inviteLink).color : null,
      inviteLinkBg: inviteLink ? getComputedStyle(inviteLink).backgroundColor : null,
      activateBtnBg: activateBtn ? getComputedStyle(activateBtn).backgroundImage || getComputedStyle(activateBtn).backgroundColor : null,
      activateBtnColor: activateBtn ? getComputedStyle(activateBtn).color : null,
      activeTierBorder: activeTier ? getComputedStyle(activeTier).borderColor : null,
    };
  });

  console.log('Modal elements info:', modalInfo);
  await browser.close();
})();
