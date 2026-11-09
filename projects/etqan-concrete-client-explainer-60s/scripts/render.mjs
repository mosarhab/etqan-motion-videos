/** Frame-driven vector explainer. Resumable full-HD H.264 export. */
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
const root = path.resolve(".");
fs.mkdirSync("renders", { recursive: true });
fs.mkdirSync("work", { recursive: true });
const hash = crypto.createHash("sha256");
function scan(dir) {
  for (const n of fs.readdirSync(dir).sort()) {
    const p = path.join(dir, n);
    if (fs.statSync(p).isDirectory()) scan(p);
    else {
      hash.update(path.relative(root, p));
      hash.update(fs.readFileSync(p));
    }
  }
}
scan(path.join(root, "src"));
scan(path.join(root, "public"));
hash.update(fs.readFileSync("package-lock.json"));
const source = hash.digest("hex");
const cache = "work/checkpoints",
  signature = cache + "/source-sha256.txt";
if (
  fs.existsSync(cache) &&
  (!fs.existsSync(signature) ||
    fs.readFileSync(signature, "utf8").trim() !== source)
)
  fs.renameSync(cache, cache + "-previous-" + Date.now());
fs.mkdirSync(cache, { recursive: true });
fs.writeFileSync(signature, source + "\n");
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  outDir: path.join(root, "work/render-bundle"),
});
const browser = {
  browserExecutable: "/usr/bin/chromium",
  chromiumOptions: { gl: null },
  logLevel: "error",
  timeoutInMilliseconds: 120000,
};
const composition = await selectComposition({
  serveUrl,
  id: "EtqanConcreteExplain60",
  ...browser,
});
for (let start = 0; start < 1800; start += 300) {
  const end = Math.min(start + 299, 1799),
    file = `${cache}/frames-${String(start).padStart(4, "0")}-${String(end).padStart(4, "0")}.mp4`;
  let valid = false;
  if (fs.existsSync(file)) {
    try {
      valid =
        Number(
          execFileSync(
            "ffprobe",
            [
              "-v",
              "error",
              "-count_frames",
              "-select_streams",
              "v:0",
              "-show_entries",
              "stream=nb_read_frames",
              "-of",
              "csv=p=0",
              file,
            ],
            { encoding: "utf8" },
          ).trim(),
        ) ===
        end - start + 1;
    } catch {}
  }
  if (valid) {
    console.log("RESUME", start, end);
    continue;
  }
  console.log("START", start, end, new Date().toISOString());
  let last = -1;
  await renderMedia({
    serveUrl,
    composition,
    codec: "h264",
    outputLocation: file,
    frameRange: [start, end],
    concurrency: 2,
    crf: 18,
    jpegQuality: 98,
    pixelFormat: "yuv420p",
    muted: true,
    x264Preset: "veryfast",
    ...browser,
    onProgress: (p) => {
      const k = Math.floor(p.renderedFrames / 60);
      if (k > last) {
        last = k;
        console.log("PROGRESS", start, p.renderedFrames, "/", end - start + 1);
      }
    },
  });
  console.log("SAVED", start, end, new Date().toISOString());
}
const chunks = fs
  .readdirSync(cache)
  .filter((n) => /^frames-\d{4}-\d{4}\.mp4$/.test(n))
  .sort();
fs.writeFileSync(
  "work/concat.txt",
  chunks.map((n) => `file '${path.join(root, cache, n)}'`).join("\n") + "\n",
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
    "work/concat.txt",
    "-i",
    "public/score.m4a",
    "-map",
    "0:v:0",
    "-map",
    "1:a:0",
    "-vf",
    "scale=in_range=pc:out_range=tv:in_color_matrix=bt601:out_color_matrix=bt709",
    "-c:v",
    "libx264",
    "-crf",
    "17",
    "-preset",
    "veryfast",
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
    "copy",
    "-t",
    "60",
    "-movflags",
    "+faststart",
    "renders/etqan-concrete-client-explainer-60s.mp4",
  ],
  { stdio: "inherit" },
);
console.log("MASTER SAVED", source);
