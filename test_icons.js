const { chromium } = require('playwright');
const path = require('path');

// Test generating SVGs and loading in browser
const svgTest = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { background: #000; color: #fff; font-family: sans-serif; padding: 20px; display: flex; flex-wrap: wrap; gap: 16px; }
    .item { display: flex; flex-direction: column; align-items: center; gap: 6px; width: 100px; }
    .img-wrap { width: 44px; height: 44px; border-radius: 50%; overflow: hidden; background: #16181C; border: 1px solid rgba(255,255,255,0.2); }
    img { width: 100%; height: 100%; object-fit: cover; }
    span { font-size: 11px; text-align: center; color: #ccc; }
  </style>
</head>
<body>
  <h2>Ingredient Vector Icons Preview</h2>
  <div id="container" style="display: flex; flex-wrap: wrap; gap: 16px; width: 100%;"></div>
  <script src="assets/recipe-system.js"></script>
</body>
</html>
`;

console.log('Script template ready.');
