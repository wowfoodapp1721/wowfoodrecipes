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
  const c = fs.readFileSync(f, 'utf8');
  const startIdx = c.indexOf('.nav-tab {');
  if (startIdx !== -1) {
    const endIdx = c.indexOf('</style>', startIdx);
    console.log('=== ' + f + ' ===');
    console.log(c.slice(startIdx, Math.min(startIdx + 800, endIdx)));
  }
});
