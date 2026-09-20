/**
 * Build Script for Wow Food Recipes Capacitor Output
 * File: build-dist.js
 * 
 * Copies web assets into the target `www` directory for Capacitor Android packaging.
 */

const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const targetDir = path.join(rootDir, 'www');

// Clean or create target `www` directory
if (fs.existsSync(targetDir)) {
  fs.rmSync(targetDir, { recursive: true, force: true });
}
fs.mkdirSync(targetDir, { recursive: true });

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      // Exclude node_modules, android, gradle, .git, scratch
      if (['node_modules', 'android', 'gradle', '.git', '.gradle', '.vscode', 'www', 'scratch'].includes(childItemName)) {
        return;
      }
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('🚀 Copying web assets to "www" directory for Capacitor build...');

// Copy root items
const items = fs.readdirSync(rootDir);
items.forEach(item => {
  if (['node_modules', 'android', 'gradle', '.git', '.gradle', '.vscode', 'www', 'scratch'].includes(item)) {
    return;
  }
  const srcPath = path.join(rootDir, item);
  const destPath = path.join(targetDir, item);
  copyRecursiveSync(srcPath, destPath);
});

console.log('✅ Web assets successfully synced to "www" directory!');
