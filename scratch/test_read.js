const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, '..', 'dashboard.html');
let html = fs.readFileSync(dashboardPath, 'utf8');

console.log('HTML size:', html.length);
