# ETQAN Riyadh · 60-second promotional film

Completed from the existing independent Remotion production. The scene content, eight-chapter timing, original sound design, Arabic copy and coordinate-anchored map are preserved. The authentic root logo was copied byte-for-byte into this project's assets. The original colors are sampled from its opaque pixels: navy `#1D305B`, yellow `#F6C717`.

## Download

The delivery branch is `delivery-etqan-riyadh-60s-final-20261104`.

- [Final branded MP4](https://github.com/mosarhab/etqan-motion-videos/raw/refs/heads/delivery-etqan-riyadh-60s-final-20261104/projects/etqan-riyadh-brand-film-60s/out/etqan-riyadh-brand-film-60s-final.mp4)
- [Verification report](out/final-verification-report.md)
- [Machine-readable render proof](out/final-render-proof.json)
- [Download verification](out/github-download-verification.json)
- [Decoded representative frames](out/final-contact-sheet.jpg)

The earlier review MP4 remains at `out/etqan-riyadh-brand-film-60s.mp4`; it is a historical preview made before the authentic logo was available. It was not overwritten. The final file has its own name. No existing project or root asset was edited, and no branch was merged into main.

## Reproduce

```sh
npm ci --cache work/npm-cache
npm run check
npm run studio
npm run render
python3 scripts/verify-final.py
```

Rendering requires Node.js, Chromium at `/usr/bin/chromium` and FFmpeg at `/usr/bin/ffmpeg`. The project has its own locked dependencies and local assets. `npm run render` renders the existing `EtqanRiyadhBrandFilm60s` composition to the final MP4 and refuses to overwrite it. Persistent final-frame captures use a separate folder from the earlier review render. To perform a newly authorized export, choose a new output and frame folder rather than overwrite an existing deliverable.

The main composition is exactly 1800 frames, 30 FPS, 1080×1920. Standalone scene compositions are also registered. Motion and easing are deterministic by frame number. Cairo Arabic and Latin font subsets are local and preloaded. The eight timing blocks are 0–7, 7–17, 17–25, 25–34, 34–43, 43–51, 51–56 and 56–60 seconds.

The map uses public-domain Natural Earth geography and the exact supplied pin at 24.829475° N, 46.828527° E. Its local grid is labeled illustrative. Testing graphics and report layouts are original illustrations, without invented numeric test results, staff, client documents, accreditation or scale claims. The score is original synthesis without external samples. See [CREDITS.md](CREDITS.md).

Only project sources, licensed assets, selected verification artifacts, the unchanged earlier review MP4 and the final MP4 are committed. Dependencies, caches, browser profiles and intermediate frame sequences are excluded. There is no website deployment.
