# ETQAN — Materials in Motion — 60 seconds

A new, independent portrait film following the approved material-led concept, with a moderate pace. Earlier projects and videos are preserved unchanged.

## Delivery

`renders/etqan-materials-cinematic-60s.mp4`

60.000 seconds · 1,800 frames · 1080 × 1920 · 30 fps · H.264 High · yuv420p / BT.709 · stereo AAC · MP4 fast-start.

## Creative direction

The materials are the focus: a suspended soil monolith forms from moving grains, its surface is revealed, a yellow light trace travels over it, and an Arabic annotation draws from a point attached to the moving specimen. Concrete and asphalt receive the same visual attention, with different specimen shapes, movements and test details.

No laboratory room, benches, interior architecture, dashboards, reports or numerical results are shown. Equipment appears only as the specimen-specific parts needed to communicate a test. The review concept illustrations are **not** included in the video; every shot is rendered from procedural 3D geometry, particles, lighting and materials. The only imported image is the authentic ETQAN logo.

The three services each receive exactly sixteen seconds. Primary shots last six seconds; supporting test shots last five seconds. Fourteen-frame soft dissolves link shots. The final six-second materials composition is a continuous camera movement, not a rapid-cut montage. An original moderate-tempo synthesized score supports the movement.

## Timeline

| Time | Subject | On-screen information |
| --- | --- | --- |
| 0–3 s | Earth toward Saudi Arabia | من قلب الرياض |
| 3–9 s | Soil material formation | التدرج الحبيبي |
| 9–14 s | Field density gauge on a soil patch | الكثافة الحقلية |
| 14–19 s | Four-electrode Wenner arrangement | مقاومية التربة |
| 19–25 s | Concrete specimen under isolated platens | مقاومة الضغط |
| 25–30 s | Concrete UPV, illustrative cutaway | الموجات فوق الصوتية |
| 30–35 s | Core extraction, specimen and drill sleeve | الكور الخرساني |
| 35–41 s | Asphalt material formation | مكونات الخلطة |
| 41–46 s | Marshall breaking heads | الثبات والانسياب |
| 46–51 s | Illustrative binder/aggregate separation | نسبة البيتومين |
| 51–57 s | Three materials together | نتائج تدعم القرار الهندسي |
| 57–60 s | Authentic logo and official name | الدقة أساس الثقة |

The parent timeline holds the category headings across each sixteen-second section. Moving annotations are projected from 3D specimen points into the frame; their positions follow the camera and specimen transformations. Arabic uses IBM Plex Sans Arabic Medium and SemiBold, loaded locally and checked before capture.

## Run

```sh
npm ci
python3 -m pip install -r requirements.txt
python3 scripts/make_audio.py
npm run studio
npm run check
npm run render
python3 scripts/verify.py
python3 scripts/export_review.py
node scripts/check-playback.mjs
```

The production renderer uses Chromium at `/usr/bin/chromium` with Mesa/ANGLE EGL and source-hashed, resumable sixty-frame checkpoints. It joins and converts the final video to limited-range BT.709 and encodes the soundtrack once. Adjust the executable/backend in `scripts/render-checkpoints.mjs` for other systems, or use `render:direct` with suitable CLI options. The composition and all substantial shots are registered independently in Remotion Studio.

## Accurate limitations

This is stylized procedural cinematic CGI. The approved concept images established art direction; their photorealistic still-image detail is not claimed as actual filmed footage or as a frame-for-frame match to the procedural models. All motion in the delivery is genuinely generated from animated 3D scenes; no concept still is zoomed, panned or used as footage.

Instrument models are brand-neutral illustrative models, not claims about ETQAN's exact inventory or a specific manufacturer's dimensions. The UPV pulse is a conceptual propagation illustration through a cutaway, not a measured waveform or a simulated result. The gold trace is a visual identity device, not visible ionizing radiation from the density gauge. The binder separation is a material-composition study, not a literal laboratory operating procedure. No strength, density, resistivity, percentage or pass/fail result is asserted.

The opening refers to Riyadh generally. No exact laboratory pin, coordinates, street address, or geospatial survey is shown. The previous Maps reference could not be verified in this environment.

The user's monthly workbook is not part of the project. No client names, records, prices, quantities, raw test data, or workbook files are included or published. Only generic service names, discussed and confirmed with the user, inform the scenes.

## Assets and verification

See `ASSETS.md` for provenance. Final encode, playback and visual-review evidence is stored under `renders/` after verification.
