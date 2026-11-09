// Optional independent tail worker. Each worker owns a separate cache and bundle.
// Atomically link only completed, fingerprint-matching files; never overwrite main output.
import fs from "node:fs";
process.env.ETQAN_FIRST = "1500";
process.env.ETQAN_LAST = "1799";
process.env.ETQAN_CHECKPOINT_DIR = "work/tail-checkpoints";
process.env.ETQAN_BUNDLE_DIR = "work/tail-production-bundle";
await import("./render.mjs");
const tail = "work/tail-checkpoints",
  main = "work/checkpoints";
if (
  fs.readFileSync(tail + "/source-sha256.txt", "utf8") !==
  fs.readFileSync(main + "/source-sha256.txt", "utf8")
)
  throw new Error("Worker sources differ");
for (const n of fs
  .readdirSync(tail)
  .filter((n) => /^frames-\d{4}-\d{4}\.mp4$/.test(n))) {
  try {
    fs.linkSync(tail + "/" + n, main + "/" + n);
    console.log("TAIL LINKED", n);
  } catch (e) {
    if (e.code !== "EEXIST") throw e;
    console.log("MAIN ALREADY OWNS", n);
  }
}
