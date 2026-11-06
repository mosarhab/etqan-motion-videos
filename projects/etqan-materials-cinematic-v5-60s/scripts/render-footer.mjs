import { bundle } from "@remotion/bundler";
import {
  selectComposition,
  renderStill,
  openBrowser,
} from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
const root = process.cwd();
fs.mkdirSync("renders", { recursive: true });
fs.mkdirSync("work", { recursive: true });
const base = path.resolve(
  "../etqan-materials-cinematic-v3-60s/renders/etqan-cinematic-3d-60s.mp4",
);
const digest = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const baseSha =
  "7a4d1118f99acc5cd714c3da8037f5cb569e3950fef58a55d94038044ba040e7";
if (digest(base) !== baseSha)
  throw new Error(
    "Unexpected base movie; preserving previously verified revision is required",
  );
const serveUrl = await bundle({
  entryPoint: path.join(root, "src/index.ts"),
  outDir: path.join(root, "work/footer-bundle"),
});
const opts = {
  browserExecutable: "/usr/bin/chromium",
  chromiumOptions: { gl: "angle-egl" },
  logLevel: "error",
};
const browser = await openBrowser("chrome", opts);
try {
  for (const [id, out] of [
    ["FooterOnly", "renders/footer-overlay.png"],
    ["CreatorLogoWhite", "renders/ms-logo-white-transparent.png"],
  ]) {
    const composition = await selectComposition({
      serveUrl,
      id,
      ...opts,
      puppeteerInstance: browser,
    });
    await renderStill({
      serveUrl,
      composition,
      frame: 0,
      imageFormat: "png",
      output: path.resolve(out),
      ...opts,
      puppeteerInstance: browser,
    });
    console.log("EXPORTED", id, out);
  }
} finally {
  await browser.close({ silent: true });
}
const h = crypto.createHash("sha256");
function hashFolder(dir) {
  for (const name of fs.readdirSync(dir).sort()) {
    const file = path.join(dir, name);
    if (fs.statSync(file).isDirectory()) hashFolder(file);
    else {
      h.update(path.relative(root, file));
      h.update(fs.readFileSync(file));
    }
  }
}
hashFolder(path.join(root, "src"));
hashFolder(path.join(root, "public"));
h.update(fs.readFileSync("package-lock.json"));
fs.writeFileSync(
  "renders/composite-provenance.json",
  JSON.stringify(
    {
      method:
        "Constant lower-third and user-authorized creator logo composited over the previously verified procedural 3D film; original audio copied",
      base_video_relative: path.relative(root, base),
      base_video_sha256: baseSha,
      source_sha256: h.digest("hex"),
      overlay_sha256: digest("renders/footer-overlay.png"),
      creator_mask_sha256: digest("public/creator-logo-mask.png"),
      creator_white_png_sha256: digest("renders/ms-logo-white-transparent.png"),
      numbers: ["0535588975"],
      contact_scope: "all 1800 frames",
      footer_layout: {
        left: 88,
        right: 88,
        bottom: 94,
        rows: 1,
        email: "info@etqanelbnaa.com",
        address: "حي القادسية، الرياض",
        number: "0535588975",
        emailFontSize: 26,
        addressFontSize: 28,
        phoneFontSize: 31.5,
        goldOutlineIcons: true,
      },
      creator_position: { left: 40, bottom: 22, width: 46, opacity: 0.5 },
    },
    null,
    2,
  ) + "\n",
);
