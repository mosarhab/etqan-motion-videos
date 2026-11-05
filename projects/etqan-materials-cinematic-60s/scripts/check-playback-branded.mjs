// Native Chromium playback and seeking, independent of the Remotion player.
import { openBrowser } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
const file = path.resolve("renders/etqan-materials-cinematic-60s-branded.mp4");
const size = fs.statSync(file).size;
const server = http.createServer((req, res) => {
  if (req.url !== "/video.mp4") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(
      '<!doctype html><video controls playsinline preload="auto" src="/video.mp4"></video>',
    );
    return;
  }
  const range = req.headers.range;
  if (range) {
    const match = /bytes=(\d+)-(\d*)/.exec(range);
    const start = Number(match[1]),
      end = match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    res.writeHead(206, {
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": end - start + 1,
    });
    fs.createReadStream(file, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
      "Content-Length": size,
    });
    fs.createReadStream(file).pipe(res);
  }
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const videoUrl = `http://127.0.0.1:${server.address().port}/`;
const browser = await openBrowser("chrome", {
  browserExecutable: "/usr/bin/chromium",
  logLevel: "error",
  chromiumOptions: { gl: "swangle" },
});
try {
  const page = await browser.newPage({
    context: () => null,
    logLevel: "error",
    indent: false,
    pageIndex: 0,
    onBrowserLog: null,
    onLog: () => {},
  });
  await page.goto({
    url: videoUrl,
    timeout: 30000,
  });
  const result = await page.evaluate(async () => {
    const video = document.querySelector("video");
    if (!video) throw new Error("Native video player missing");
    video.muted = true;
    await new Promise((resolve, reject) => {
      if (video.readyState >= 2) return resolve();
      video.addEventListener("loadeddata", resolve, { once: true });
      video.addEventListener(
        "error",
        () => reject(new Error("Video load error")),
        { once: true },
      );
      setTimeout(() => reject(new Error("Metadata timeout")), 15000);
    });
    await video.play();
    await new Promise((r) => setTimeout(r, 2000));
    const advanced = video.currentTime;
    video.pause();
    if (advanced < 0.5) throw new Error("Playback clock did not advance");
    const seeks = [];
    for (const time of [1.5, 6.5, 11.5, 16.5, 22.5, 27.5, 32.5, 38.5, 43.5, 48.5, 54.5, 59]) {
      await new Promise((resolve, reject) => {
        video.addEventListener("seeked", resolve, { once: true });
        video.currentTime = time;
        setTimeout(() => reject(new Error("Seek timeout")), 10000);
      });
      seeks.push({
        requested: time,
        actual: video.currentTime,
        readyState: video.readyState,
      });
    }
    return {
      duration: video.duration,
      width: video.videoWidth,
      height: video.videoHeight,
      playbackAdvanced: advanced,
      seeks,
      error: video.error,
    };
  });
  fs.writeFileSync(
    "renders/branded/playback-check.json",
    JSON.stringify(result, null, 2) + "\n",
  );
  console.log(JSON.stringify(result, null, 2));
} finally {
  await browser.close({ silent: true });
  server.close();
}
