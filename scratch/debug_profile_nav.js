const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext(devices['Pixel 7']);
  const page = await context.newPage();

  const profilePath = 'file:///' + path.resolve('profile.html').replace(/\\/g, '/');
  await page.goto(profilePath, { waitUntil: 'load' });

  const info = await page.evaluate(() => {
    const nav = document.getElementById('app-nav');
    let parent = nav.parentElement;
    const hierarchy = [];
    while (parent) {
      const cs = window.getComputedStyle(parent);
      hierarchy.push({
        tag: parent.tagName,
        id: parent.id,
        className: parent.className,
        transform: cs.transform,
        filter: cs.filter,
        perspective: cs.perspective,
        contain: cs.contain,
        position: cs.position
      });
      parent = parent.parentElement;
    }
    return {
      navRect: nav.getBoundingClientRect(),
      hierarchy
    };
  });

  console.log('Hierarchy of #app-nav:', JSON.stringify(info, null, 2));
  await browser.close();
})();
