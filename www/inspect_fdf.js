const fs = require("fs");

const content = fs.readFileSync("dashboard.html", "utf8");
const sIdx = content.indexOf("function filterDashboardFeed");
if (sIdx !== -1) {
  console.log(content.substring(sIdx, sIdx + 1500));
}
