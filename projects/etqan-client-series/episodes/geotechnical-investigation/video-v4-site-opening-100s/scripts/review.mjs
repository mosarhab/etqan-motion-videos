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
const chromiumOptions = { gl: null };
const browser = await openBrowser("chrome", {
  browserExecutable,
  chromiumOptions,
  logLevel: "error",
});
try {
  const composition = await selectComposition({
    serveUrl,
    id: "EtqanSeriesGeotechnicalV4",
    browserExecutable,
    chromiumOptions,
    puppeteerInstance: browser,
    logLevel: "error",
  });
  for (const frame of process.argv.length > 2
    ? process.argv.slice(2).map(Number)
    : [0,30,240,450,750,870,960,1050,1170,1380,1470,1590,1740,1890,2010,2160,2280,2400,2520,2640,2760,2910,2999      ]) {
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
