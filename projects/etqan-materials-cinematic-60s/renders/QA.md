# Final delivery review

Delivery: `etqan-materials-cinematic-60s.mp4`

- Exact duration: **60.000 seconds**, **1,800 frames**, **1080 × 1920**, **30 fps**.
- H.264 High, yuv420p, limited-range BT.709; stereo AAC 48 kHz / 192 kbps; MP4 fast-start.
- Full video and audio decoding passed without FFmpeg errors.
- Native Chromium playback advanced normally; twelve seeks across every shot succeeded with readyState 4 and no media error. See `playback-check.json`.
- Encoded soundtrack correlation with the original WAV: **0.999814686**. Integrated loudness **−17.38 LUFS**, true peak **−5.27 dBTP**; no clipping or unintended silent passage.
- Original score has a moderate 84 BPM pulse, with sparse percussion, sustained pads and restrained synchronized sound effects.
- Equal service time: soil **16 seconds**, concrete **16 seconds**, asphalt **16 seconds**. Main material shots last six seconds; supporting tests last five. There is no rapid-cut montage.
- Reviewed twelve representative delivery frames, one per shot, plus eleven transition midpoints. See `scene-review.jpg` and `qa-frames/`.
- Arabic shaping, text alignment and visibility checked. IBM Plex Sans Arabic Medium and SemiBold replace the previous font treatment. Callout leaders are projected from specimen points and follow the camera/object transforms.
- Specimen formation is animated in 3D using moving instanced grains and a material-reveal plane. The gold trace draws across the specimen. It is not a still-image pan or zoom.
- Authentic company logo verified byte-identical to the repository-root original. Only this PNG is imported as a scene image.
- All other geometry, textures, environmental reflections, lights, camera movements, test fixtures and particles are procedural. The concept illustrations are not used in the render.
- Reviewed the core sequence: the core is hidden until the drilling engagement and emerges with the sleeve. No preloaded core is shown descending into the slab.
- No raw coordinates, precise site marker, scene numbers, fake results, charts, reports, technical dashboards, preview labels or added English subtitles appear. The English descriptor already present in the authentic logo is preserved.
- Private workbook contents, client information, reports, quantities and prices are excluded from the project.

## Limits

The style is illustrative cinematic CGI, not actual laboratory footage or a photorealistic reproduction of the concept still. Instruments are generic procedural models. The UPV pulse is an illustrative cutaway path, not a measured waveform. Gold graphics are branding elements, not visible nuclear radiation. The binder shot is a conceptual material separation. No measured result is claimed. The opening identifies Riyadh generally; no exact laboratory street location is asserted.

All earlier projects and videos remain unchanged. Exact file size and SHA-256 are recorded in `verification.json`.
