const fs = require("fs");
const path = require("path");
const readline = require("readline");

const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain";

async function findCreation() {
  const dirs = [
    "d7c0359c-f055-41f1-a030-9a28bd729f67",
    "5be18604-8714-4490-8422-946ecd3afc42",
    "4deba7e6-4a49-4e95-885f-f68efa37d0ce",
    "3ca8cefe-80d6-4241-b0c5-b8442fa5a41e",
    "4d1c80c2-87d9-44a4-bf2e-84f660f4cd4b"
  ];

  for (const dir of dirs) {
    const transcriptPath = path.join(brainDir, dir, ".system_generated", "logs", "transcript_full.jsonl");
    if (!fs.existsSync(transcriptPath)) continue;

    console.log(`Checking ${dir}...`);
    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      if (!line.includes("dashboard.html")) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            if (tc.name === "write_to_file" && tc.arguments && tc.arguments.TargetFile && tc.arguments.TargetFile.endsWith("dashboard.html")) {
              const fname = `recovered_${dir}_step${obj.step_index}.html`;
              fs.writeFileSync(fname, tc.arguments.CodeContent, "utf8");
              console.log(`  -> FOUND WRITE: ${fname} (${tc.arguments.CodeContent.length} bytes) at ${obj.created_at}`);
            }
          }
        }
      } catch (e) {}
    }
  }
}

findCreation().catch(console.error);
