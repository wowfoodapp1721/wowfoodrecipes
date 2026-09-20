const fs = require("fs");
const readline = require("readline");

async function checkSteps36() {
  const fileStream = fs.createReadStream("C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain\\944823a2-a495-41a0-887a-3a8f3cff1520\\.system_generated\\logs\\transcript_full.jsonl");
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if ([35, 36, 37, 75, 90, 91].includes(obj.step_index)) {
        console.log(`Step ${obj.step_index}: type=${obj.type}, source=${obj.source}`);
        if (obj.tool_calls) {
          console.log("  tool_calls:", JSON.stringify(obj.tool_calls, null, 2));
        }
      }
    } catch(e) {}
  }
}

checkSteps36().catch(console.error);
