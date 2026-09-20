const fs = require("fs");
const path = require("path");
const readline = require("readline");

const brainDir = "C:\\Users\\Lenovo\\.gemini\\antigravity-ide\\brain";

async function findSetContent() {
  const dirs = fs.readdirSync(brainDir);

  for (const dir of dirs) {
    const transcriptPath = path.join(brainDir, dir, ".system_generated", "logs", "transcript_full.jsonl");
    if (!fs.existsSync(transcriptPath)) continue;

    const fileStream = fs.createReadStream(transcriptPath);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      if (!line.includes("dashboard.html")) continue;
      try {
        const obj = JSON.parse(line);
        if (obj.tool_calls) {
          for (const tc of obj.tool_calls) {
            const cmd = (tc.args && tc.args.CommandLine) || "";
            if (cmd.includes("dashboard.html")) {
              console.log(`[${dir}] [${obj.created_at}] step ${obj.step_index}: run_command: ${cmd.substring(0, 100)}`);
              if (cmd.includes("Set-Content") || cmd.includes("Out-File") || cmd.includes(">") || cmd.includes("write")) {
                const fname = `cmd_dashboard_${dir}_${obj.step_index}.txt`;
                fs.writeFileSync(fname, cmd, "utf8");
                console.log(`  -> Wrote ${fname} (${cmd.length} chars)`);
              }
            }
          }
        }
      } catch (e) {}
    }
  }
}

findSetContent().catch(console.error);
