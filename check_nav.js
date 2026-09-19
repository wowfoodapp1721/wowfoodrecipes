const fs = require('fs');
const files = [
  'dashboard.html',
  'collection.html',
  'search-pantry.html',
  'chef-ai-showcase.html',
  'social-feed.html',
  'search-results.html',
  'profile.html',
  'iot-settings.html',
  'meal_planner.html',
  'meal-planner.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const navMatch = content.match(/<nav id="app-nav"[\s\S]*?<\/nav>/i);
    const styleMatch = content.match(/\.nav-tab[\s\S]*?<\/style>/i);
    console.log('=== ' + f + ' ===');
    if (navMatch) console.log('NAV HTML:', navMatch[0].replace(/\s+/g, ' '));
  }
});
