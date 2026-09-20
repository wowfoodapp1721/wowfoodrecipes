const { chromium } = require('playwright');
const path = require('path');

(async () => {
  console.log('🚀 Starting Verification: Screen 5 Input Text Field Interactivity & Visibility...\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2
  });

  const authUrl = 'file:///' + path.resolve(__dirname, 'auth.html').replace(/\\/g, '/');
  console.log(`📄 Loading Auth Gate: ${authUrl}`);
  await page.goto(authUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(300);

  // 1. Verify Input Accessibility & Styling on Step 1
  console.log('\n🔍 [Step 1 Inputs: Full Name, Email, Password]');
  
  const nameInput = page.locator('#auth-name-input');
  const emailInput = page.locator('#auth-email-input');
  const pwdInput = page.locator('#auth-password-input');

  // Check attributes
  const isNameDisabled = await nameInput.getAttribute('disabled');
  const isNameReadonly = await nameInput.getAttribute('readonly');
  console.log(`   ✓ Full Name Input Attributes: disabled=${isNameDisabled}, readonly=${isNameReadonly}`);

  // Test typing in Full Name
  await nameInput.click();
  await nameInput.fill('');
  await nameInput.type('Chef Marcus Vance');
  const nameVal = await nameInput.inputValue();
  console.log(`   ✓ Full Name typed value: "${nameVal}"`);
  if (nameVal !== 'Chef Marcus Vance') throw new Error('Full Name input failed typing!');

  // Test typing in Email Address
  await emailInput.click();
  await emailInput.fill('');
  await emailInput.type('marcus.vance@gourmet.io');
  const emailVal = await emailInput.inputValue();
  console.log(`   ✓ Email Address typed value: "${emailVal}"`);
  if (emailVal !== 'marcus.vance@gourmet.io') throw new Error('Email input failed typing!');

  // Test typing in Password
  await pwdInput.click();
  await pwdInput.fill('');
  await pwdInput.type('EpicureanSecret2026!');
  const pwdVal = await pwdInput.inputValue();
  console.log(`   ✓ Password typed value: "${pwdVal}"`);
  if (pwdVal !== 'EpicureanSecret2026!') throw new Error('Password input failed typing!');

  // Check computed CSS styles (Text Color, Caret Color, Pointer Events)
  const nameStyles = await nameInput.evaluate(el => {
    const s = window.getComputedStyle(el);
    return {
      color: s.color,
      caretColor: s.caretColor,
      pointerEvents: s.pointerEvents,
      cursor: s.cursor
    };
  });
  console.log(`   ✓ Full Name computed style: color=${nameStyles.color}, caretColor=${nameStyles.caretColor}, pointerEvents=${nameStyles.pointerEvents}`);
  if (nameStyles.pointerEvents === 'none') throw new Error('Pointer events blocked on Full Name!');

  // 2. Test Step 1 to Step 2 Toggle
  console.log('\n🔄 [Step 1 -> Step 2 Dynamic Toggle]');
  const btnCta = page.locator('#btn-activate-account');
  await btnCta.click();
  await page.waitForTimeout(200);

  const step2Badge = await page.locator('#auth-step-badge').innerText();
  console.log(`   ✓ Active Step Badge: "${step2Badge}"`);
  if (!step2Badge.includes('STEP 2 OF 2')) throw new Error('Failed to toggle to Step 2!');

  // 3. Verify Step 2 Inputs: Mobile Number & OTP
  console.log('\n🔍 [Step 2 Inputs: Mobile Number & OTP Grid]');
  const phoneInput = page.locator('#auth-phone-input');
  await phoneInput.click();
  await phoneInput.fill('');
  await phoneInput.type('91234 56789');
  const phoneVal = await phoneInput.inputValue();
  console.log(`   ✓ Mobile Number typed value: "${phoneVal}"`);
  if (phoneVal !== '91234 56789') throw new Error('Phone input failed typing!');

  // Test OTP input grid
  const otpFirst = page.locator('.otp-input').first();
  await otpFirst.click();
  await page.keyboard.type('123456');
  const firstOtpVal = await otpFirst.inputValue();
  console.log(`   ✓ First OTP box typed value: "${firstOtpVal}"`);

  // 4. Complete Auth & Navigate
  console.log('\n🚀 [Complete Authentication]');
  await btnCta.click();
  await page.waitForTimeout(500);

  const currentUrl = page.url();
  console.log(`   ✓ Destination reached: ${currentUrl}`);
  if (!currentUrl.includes('onboarding.html')) throw new Error('Redirection failed!');

  console.log('\n🎉 ALL SCREEN 5 INPUT INTERACTIVITY CHECKS PASSED WITH 100% SUCCESS!\n');
  await browser.close();
})();
