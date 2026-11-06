# ETQAN — clearer captions and engineering context — revision 7

Independent source and delivery in `projects/etqan-materials-cinematic-v7-60s/`. Every previous project and movie is preserved.

Delivery: `renders/etqan-cinematic-3d-60s.mp4` — 60 seconds, 1080 × 1920, 30 fps, H.264 / BT.709, stereo AAC, MP4 fast-start.

## Requested changes

- The persistent footer moves down: its top rule is at y=1812 instead of 1685. The panel is now 108 px high instead of 235 px, with the contact row at y=1843 and approximately 33 px below its text. The corporate header is retained.
- Saudi Arabia is Saudi flag green (`#006C35`) in the procedurally generated globe texture and extruded country map. Riyadh's marker stays gold.
- Every test-purpose sentence uses one consistent, centered lower position at y=1642, below the equipment and above the footer. Cairo increases from 32 px to 38 px. The benefit is separated from the test title and its leader line.
- The test camera viewport is reframed to reserve space for the upper labels and lower captions. The same viewport dimensions feed the 3D-to-screen projection, so leader endpoints remain attached to their modeled subjects. The compression title clears its metal plate/piston.
- The disconnected three-sample overview is replaced by a connected construction cutaway: soil supporting concrete footings and a structural bay, beside a road with subbase, base and asphalt courses. A gold light trace links the materials while the camera gently retreats.
- The new context scene runs from 53 to 56.5 seconds. The brand closing follows from 56.5 to 60 seconds, keeping the total at exactly 60 seconds and giving the new section time to read.

The footer contains only **0535588975**, **info@etqanelbnaa.com** and **حي القادسية، الرياض**, with the small authorized white MS creator mark inline at the left. All earlier services and wording corrections remain, including classification held alongside gradation, Proctor, boreholes, slump, temperature and the user's preferred label **مقاومة التربة**.

## Reproduce and verify

```sh
npm ci
python3 -m pip install -r requirements.txt
npm run studio -- --port=3008
npm run check
node scripts/check-frame-layout.mjs
node scripts/check-copy-layout.mjs
LIBGL_ALWAYS_SOFTWARE=1 EGL_PLATFORM=surfaceless node scripts/review-source.mjs
npm run render
npm run verify
python3 scripts/export_review.py
python3 scripts/check-brand-frame.py
python3 scripts/check-soil-labels.py
python3 scripts/check-motion.py
node scripts/check-playback.mjs
```

Production uses Chromium at `/usr/bin/chromium` with Mesa/ANGLE EGL and full-resolution, sixty-frame resumable checkpoints. Source, public assets and lockfile fingerprints invalidate old checkpoints. Adjust browser/backend settings on another system. Working files and runtime dependencies are ignored; source, delivery and evidence are retained.

`renders/frame-layout.json` measures the actual branded frame in Studio. `renders/copy-layout.json` measures the actual Cairo title and benefit elements in all twelve standalone test compositions. Encoded-frame checks and representative-frame visual review supplement those layout measurements. Contact-sheet labels are outside the extracted images and are not part of the video.

## Accurate limits

This is stylized procedural CGI, not recorded laboratory footage or calibrated physical simulation. The construction section is an illustrative relationship between tested materials and their application, not a dimensioned design or a test result. No measurement, strength, density, temperature, report or dashboard is fabricated.

The geographic marker denotes Riyadh city. The district is supplied by the user; the original short Maps link could not be independently resolved. No exact laboratory parcel or invented street address is asserted. City blocks are illustrative.

The authentic ETQAN PNG and the user's authorized creator mark are the only imported brand images. All scenes, textures, lights and movements are procedural. No photograph, generated scene still or private monthly workbook is included. The original synthesized instrumental and subtle sound effects are retained. See `ASSETS.md` for provenance and licenses.
