const fs = require('fs');
const path = require('path');

const files = [
  'dashboard.html',
  'collection.html',
  'search-pantry.html',
  'chef-ai-showcase.html',
  'social-feed.html',
  'search-results.html',
  'profile.html',
  'iot-settings.html',
  'meal-planner.html'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Update Pro Chef AI -> Pro Chef in nav labels
  content = content.replace(/<span class="nav-label">Pro Chef AI<\/span>/g, '<span class="nav-label">Pro Chef</span>');
  content = content.replace(/<!-- Tab 6: Pro Chef AI(.*?)-->/g, '<!-- Tab 6: Pro Chef$1-->');

  // 2. Ensure .nav-active-dot is absolute positioned and .nav-label has line-height/white-space
  if (content.includes('.nav-active-dot {') && !content.includes('.nav-active-dot {\n      position: absolute;')) {
    content = content.replace(
      /\.nav-active-dot\s*\{[^}]*\}/g,
      `.nav-active-dot {
      position: absolute;
      bottom: 2px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background-color: var(--crimson, var(--neon-cyan, var(--cyan, #3DF2E0)));
      box-shadow: 0 0 6px var(--crimson, var(--neon-cyan, var(--cyan, #3DF2E0)));
    }`
    );
  }

  // Ensure .nav-label has margin-top and white-space nowrap
  content = content.replace(
    /\.nav-label\s*\{[^}]*\}/g,
    `.nav-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.2;
      margin-top: 3px;
      white-space: nowrap;
      text-align: center;
    }`
  );

  // Ensure .nav-tab has fixed height and centering
  content = content.replace(
    /\.nav-tab\s*\{[^}]*\}/g,
    `.nav-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 52px;
      padding: 2px 2px;
      flex: 1;
      min-width: 0;
      color: #6D6D72;
      transition: color 0.2s, transform 0.15s;
      position: relative;
      cursor: pointer;
      text-decoration: none;
    }`
  );

  // Ensure #app-nav has height: 76px and align-items: center
  content = content.replace(
    /#app-nav\s*\{[^}]*\}/g,
    `#app-nav {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 76px;
      z-index: 50;
      background-color: rgba(11, 15, 20, 0.96);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid var(--border-soft, rgba(255, 255, 255, 0.1));
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 4px 12px;
      box-sizing: border-box;
    }`
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
