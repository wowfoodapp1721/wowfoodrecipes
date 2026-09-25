const fs = require('fs');
const path = require('path');

const CSP_TAG = '  <meta http-equiv="Content-Security-Policy" content="default-src \'self\' data: gap: https://gstatic.com \'unsafe-eval\'; script-src \'self\' \'unsafe-inline\' \'unsafe-eval\'; style-src \'self\' \'unsafe-inline\' https://googleapis.com; font-src \'self\' https://gstatic.com; img-src \'self\' data: blob: https://wowfoodrecipes.com https://themealdb.com; connect-src \'self\' https://wowfoodrecipes.com;">';

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

console.log(`Processing ${files.length} HTML files for CSP tag injection...`);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Skip if already contains Content-Security-Policy
  if (content.includes('Content-Security-Policy')) {
    console.log(`- ${file}: Already has CSP tag, skipping.`);
    return;
  }

  // Inject right after <meta charset="UTF-8" /> or <meta charset="UTF-8">
  if (content.includes('<meta charset="UTF-8" />')) {
    content = content.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n${CSP_TAG}`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}: Injected CSP tag after <meta charset="UTF-8" />`);
  } else if (content.includes('<meta charset="UTF-8">')) {
    content = content.replace('<meta charset="UTF-8">', `<meta charset="UTF-8">\n${CSP_TAG}`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}: Injected CSP tag after <meta charset="UTF-8">`);
  } else if (content.includes('<head>')) {
    content = content.replace('<head>', `<head>\n${CSP_TAG}`);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ ${file}: Injected CSP tag after <head>`);
  } else {
    console.warn(`⚠️ ${file}: Could not find <head> or charset tag!`);
  }
});

console.log('\nFinished CSP tag injection.');
