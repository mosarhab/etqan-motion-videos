# ETQAN · Cinematic 3D · 60 seconds

An independent Remotion/Three.js production, created in `projects/etqan-cinematic-3d-60s/`. Earlier ETQAN projects and videos are preserved. This production uses real procedural 3D scenes and moving perspective cameras; it does not reuse the earlier film's illustration or layout system.

## Output

[Download MP4 from GitHub](https://github.com/mosarhab/etqan-motion-videos/raw/refs/heads/delivery-etqan-cinematic-3d-60s-20261104/projects/etqan-cinematic-3d-60s/out/etqan-cinematic-3d-60s.mp4) · [Verification report](out/verification-report.md)

`out/etqan-cinematic-3d-60s.mp4` — 1080×1920, portrait, 30 FPS, exactly 1800 frames / 60 seconds, H.264 with AAC stereo. Final verification and public download evidence are recorded in `out/verification-report.md`, `out/render-proof.json` and `out/github-download-verification.json` once complete.

The delivery branch is `delivery-etqan-cinematic-3d-60s-20261104`. Main is not merged and no public website is deployed.

## Reproduce

```sh
npm ci --cache work/npm-cache
npm run check
python3 scripts/create-score.py
npm run studio
npm run render
python3 scripts/verify.py
```

If the original score already exists, retain it and skip its generation step. Node.js, Chromium (`/usr/bin/chromium`), FFmpeg/FFprobe and Python with NumPy/Pillow are required. Rendering refuses to overwrite the named final MP4. It stores frame captures in a separate take folder and can resume missing frame numbers only if the source fingerprint matches. `RENDER_TAKE` can select a fresh intermediate take folder for an explicitly authorized re-render.

All animation derives from the Remotion frame number. No `useFrame()`, wall-clock simulation, random runtime animation, remote image assets or CSS animation is used. A `<ThreeCanvas>` hosts the WebGL renderer. The world is rendered to depth-aware targets and composited with a filmic response, restrained bloom, depth of field and deterministic grain. The title layer remains native 1080p HTML/Arabic.

## Timeline

| Time | Scene |
|---|---|
| 00–08 | 3D Earth, atmospheric rim, original particles and movement toward Saudi Arabia |
| 08–18 | Extruded Saudi outline, original abstract city massing and supplied laboratory-point beacon |
| 18–25 | Traveling camera inside a virtual engineering laboratory |
| 25–35 | Soil strata, hydraulic sample extraction and a modeled triaxial cell |
| 35–45 | Four-column compression machine, moving piston/platen and concrete specimen |
| 45–53 | Marshall-style asphalt loading frame, sample, sieve stack and aggregates |
| 53–57 | New moving camera angles connecting the three testing environments |
| 57–60 | Clean brand reveal using the unchanged authentic logo |

No scene numbers, coordinates, dashboards, tables, results, preview labels, invented addresses or explanatory paragraphs are rendered. Only the requested Arabic advertising copy is shown, plus the authentic logo's original English tagline.

## Limits and attribution

This is cinematic procedural CG, not actual laboratory footage or a claim of photorealistic reconstruction. The internal 3D render pass is 720×1280 before full-resolution text/logo compositing and 1080×1920 export. The exact point comes from the user's earlier brief; the Google short link could not be independently resolved. The procedural city is not a surveyed street map. See `CREDITS.md` for full provenance and limitations.

Benchmark scripts are retained as development source; Blender was evaluated but is not part of the final rendering pipeline. No files from older projects are used as dependencies or changed by this project.
