// Inspect the same pure camera path used by the composition at every delivered frame.
import ts from "typescript";
import fs from "node:fs";
const source = fs.readFileSync("src/Math.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2020,
  },
}).outputText;
const { shot } = await import(
  "data:text/javascript;base64," + Buffer.from(compiled).toString("base64")
);
const distance = (a, b) => Math.hypot(...a.map((v, i) => v - b[i]));
const views = Array.from({ length: 1800 }, (_, i) => shot(i / 30));
const translations = views
  .slice(1)
  .map((v, i) => distance(v.position, views[i].position));
const targets = views
  .slice(1)
  .map((v, i) => distance(v.target, views[i].target));
if (
  views.some((v) => ![...v.position, ...v.target, v.fov].every(Number.isFinite))
)
  throw new Error("Invalid camera");
if (Math.max(...translations) > 0.35 || Math.max(...targets) > 0.26)
  throw new Error("Unexpected camera discontinuity");
if (translations.some((v) => v === 0))
  throw new Error("A camera frame is identical");
const stage = fs.readFileSync("src/Stage.tsx", "utf8");
if (/^\s*\{t\s*[<>]\s*\d[^\n]*&&/m.test(stage))
  throw new Error("Time-gated scene presence may pop on camera");
const result = {
  passed: true,
  framesChecked: 1800,
  maxCameraTranslationPerFrame: Math.max(...translations),
  maxTargetTranslationPerFrame: Math.max(...targets),
  allCameraFramesMove: true,
  stationPresence:
    "Persistent geometry; camera reveals objects without timeline mount/unmount switches",
  deterministic:
    "Frame-derived camera and mesh poses; seeded procedural textures",
  limits:
    "Smooth keyframe path; this is not optical-flow or subjective motion-quality certification",
};
fs.writeFileSync(
  "renders/camera-check.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result, null, 2));
