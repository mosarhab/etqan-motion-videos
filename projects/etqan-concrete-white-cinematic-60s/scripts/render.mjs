/** Full-resolution, resumable production render; each checkpoint owns its frames. */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import crypto from "node:crypto";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(".");
fs.mkdirSync(path.join(root, "renders"), { recursive: true });
// A source change invalidates checkpoints, so later edits cannot reuse stale frames.
const hash = crypto.createHash("sha256");
function hashFolder(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) hashFolder(file);
    else {
      hash.update(path.relative(root, file));
      hash.update(fs.readFileSync(file));
    }
  }
}
hashFolder(path.join(root, "src"));
hashFolder(path.join(root, "public"));
hash.update(fs.readFileSync(path.join(root, "package-lock.json")));
const fingerprint = hash.digest("hex");
const checkpointDir = path.join(
  root,
  process.env.ETQAN_CHECKPOINT_DIR || "work/checkpoints",
);
const hashFile = path.join(checkpointDir, "source-sha256.txt");
if (
  fs.existsSync(checkpointDir) &&
  (!fs.existsSync(hashFile) ||
    fs.readFileSync(hashFile, "utf8").trim() !== fingerprint)
)
  fs.renameSync(checkpointDir, checkpointDir + "-previous-" + Date.now());
fs.mkdirSync(checkpointDir, { recursive: true });
fs.writeFileSync(hashFile, fingerprint + "\n");
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  outDir: path.join(
    root,
    process.env.ETQAN_BUNDLE_DIR || "work/production-bundle",
  ),
});
const gl = process.env.ETQAN_GL || "angle-egl";
const browser = {
  browserExecutable: "/usr/bin/chromium",
  chromiumOptions: { gl },
  logLevel: "error",
  timeoutInMilliseconds: 120000,
};
const composition = await selectComposition({
  serveUrl,
  id: "EtqanConcrete60",
  ...browser,
});
const dir = checkpointDir;
fs.mkdirSync(dir, { recursive: true });
const step = 60;
const first = Number(process.env.ETQAN_FIRST || 0),
  last = Number(process.env.ETQAN_LAST || 1799);
for (let from = first; from <= last; from += step) {
  const to = Math.min(from + step - 1, last),
    out = path.join(
      dir,
      `frames-${String(from).padStart(4, "0")}-${String(to).padStart(4, "0")}.mp4`,
    );
  if (fs.existsSync(out)) {
    try {
      const count = execFileSync(
        "ffprobe",
        [
          "-v",
          "error",
          "-select_streams",
          "v:0",
          "-count_frames",
          "-show_entries",
          "stream=nb_read_frames",
          "-of",
          "csv=p=0",
          out,
        ],
        { encoding: "utf8" },
      ).trim();
      if (Number.parseInt(count, 10) === to - from + 1) {
        console.log("RESUME", from, to);
        continue;
      }
    } catch {}
  }
  console.log("START", from, to, new Date().toISOString());
  let done = false;
  for (let attempt = 1; attempt <= 2 && !done; attempt++) {
    try {
      let lastLog = -1;
      await renderMedia({
        serveUrl,
        composition,
        codec: "h264",
        outputLocation: out,
        frameRange: [from, to],
        concurrency: 1,
        crf: 18,
        pixelFormat: "yuv420p",
        muted: true,
        jpegQuality: 95,
        x264Preset: "veryfast",
        ...browser,
        onProgress: (p) => {
          const n = Math.floor(p.renderedFrames / 15);
          if (n > lastLog) {
            lastLog = n;
            console.log("PROGRESS", from, p.renderedFrames, "/", to - from + 1);
          }
        },
      });
      done = true;
    } catch (e) {
      console.log("RETRY", from, attempt, e.message);
      if (attempt === 2) throw e;
    }
  }
  console.log("SAVED", from, to, new Date().toISOString());
}
if (first === 0 && last === 1799) {
  const chunks = fs
    .readdirSync(dir)
    .filter((n) => /^frames-\d{4}-\d{4}\.mp4$/.test(n))
    .sort();
  fs.writeFileSync(
    path.join(root, "work/concat.txt"),
    chunks.map((n) => `file '${path.join(dir, n)}'`).join("\n") + "\n",
  );
  execFileSync(
    "ffmpeg",
    [
      "-v",
      "error",
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      path.join(root, "work/concat.txt"),
      "-i",
      path.join(root, "public/etqan-concrete-score.wav"),
      "-map",
      "0:v:0",
      "-map",
      "1:a:0",
      "-vf",
      "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "17",
      "-pix_fmt",
      "yuv420p",
      "-color_range",
      "tv",
      "-colorspace",
      "bt709",
      "-color_primaries",
      "bt709",
      "-color_trc",
      "bt709",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-ar",
      "48000",
      "-t",
      "60",
      "-movflags",
      "+faststart",
      path.join(root, "renders/etqan-concrete-cinematic-60s-no-vo.mp4"),
    ],
    { stdio: "inherit" },
  );
  console.log("MASTER SAVED");
}
