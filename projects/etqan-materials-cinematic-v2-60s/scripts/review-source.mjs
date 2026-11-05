import { bundle } from "@remotion/bundler";
import {
  selectComposition,
  renderStill,
  openBrowser,
} from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
const root = process.cwd();
fs.mkdirSync("work/source-review", { recursive: true });
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  outDir: path.join(root, "work/review-bundle"),
});
const browserExecutable = "/usr/bin/chromium";
const chromiumOptions = { gl: "angle-egl" };
const browser = await openBrowser("chrome", {
  browserExecutable,
  chromiumOptions,
  logLevel: "error",
});
try {
  const composition = await selectComposition({
    serveUrl,
    id: "EtqanCinematicRevision60",
    browserExecutable,
    chromiumOptions,
    puppeteerInstance: browser,
    logLevel: "error",
  });
  for (const frame of process.argv.length > 2
    ? process.argv.slice(2).map(Number)
    : [
        45, 102, 160, 292, 365, 445, 535, 635, 755, 850, 970, 1075, 1165, 1280,
        1400, 1520, 1610, 1725, 1785,
      ]) {
    await renderStill({
      serveUrl,
      composition,
      frame,
      output: path.join(
        root,
        `work/source-review/frame-${String(frame).padStart(4, "0")}.jpg`,
      ),
      imageFormat: "jpeg",
      jpegQuality: 95,
      browserExecutable,
      chromiumOptions,
      puppeteerInstance: browser,
      logLevel: "error",
      timeoutInMilliseconds: 120000,
    });
    console.log("REVIEW", frame);
  }
} finally {
  await browser.close({ silent: true });
}
