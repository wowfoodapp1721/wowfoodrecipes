const fs = require('fs');

const EXPECTED_CSP = `<meta http-equiv="Content-Security-Policy" content="default-src 'self' data: gap: https://gstatic.com 'unsafe-eval'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://googleapis.com; font-src 'self' https://gstatic.com; img-src 'self' data: blob: https://wowfoodrecipes.com https://themealdb.com; connect-src 'self' https://wowfoodrecipes.com;">`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

let successCount = 0;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes(EXPECTED_CSP)) {
    console.log(`✅ ${file}: CSP meta tag verified 100% exact match.`);
    successCount++;
  } else {
    console.error(`❌ ${file}: CSP meta tag mismatch or missing!`);
  }
});

console.log(`\nVerified ${successCount} / ${files.length} HTML files.`);
if (successCount !== files.length) {
  process.exit(1);
}
