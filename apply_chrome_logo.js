const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'assets', 'wow_chrome_v2.png');
const targets = [
  path.join(__dirname, 'assets', 'wow.png'),
  path.join(__dirname, 'assets', 'images', 'wow.png'),
  path.join(__dirname, 'assets', 'brand-logo.png'),
  path.join(__dirname, 'assets', 'brand logo.png'),
  path.join(__dirname, 'assets', 'brand-logo.png.png')
];

targets.forEach(target => {
  fs.copyFileSync(src, target);
  console.log('Copied to', target);
});
