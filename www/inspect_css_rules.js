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
  'meal-planner.html',
  'assets/viewport-controller.css'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const c = fs.readFileSync(f, 'utf8');
    const m = c.match(/#app-nav[\s\S]*?(?=\/\*|@media|<\/style>|\n\s*\n\s*\.[a-z])/gi);
    console.log('=== ' + f + ' ===');
    if (m) console.log(m.join('\n---\n'));
  }
});
