# Delivery QA — material-led revision

The delivered file is `etqan-cinematic-3d-60s.mp4`, SHA-256 `8e7d1761fe8e74a3217b245badbbfbf6038f59e3130821bfe26a13bad5d6c624`.

## Encode and playback

- Complete FFmpeg decode passed, with no errors.
- Exactly 60.000 seconds, 1,800 frames, 1080 × 1920, 30 fps, H.264, yuv420p, limited-range BT.709.
- Stereo AAC at 48 kHz, 60.000 seconds. Decoded audio matches the original score at correlation 0.9998147; peak −5.34 dBFS, RMS −18.12 dBFS.
- Native Chromium playback advanced normally, sought successfully to nineteen positions covering the opening, all services and closing, and played the entire file to its end at 2× QA speed. `fullPlaybackEnded` is true, final time 60 seconds, no video error.
- Fifteen intervals show visible pixel change inside the central 3D scene area. This is supporting evidence, read with the animated source and manual review; it is not a physics validation.

## Visual and Arabic review

Thirty-eight frames were extracted from this exact MP4, including every shot, all thirteen inter-shot dissolves, and the first and last frames. The review sheet is supplementary evidence; its English captions and frame labels sit outside the video images and are not part of the advertisement.

The transparent white/gold logo is visible from frame zero and hands off to the large closing logo. Its prior ivory rectangle is removed. Original PNG file identity is verified; the composition filter implements the user's explicit recoloring request and preserves the source proportions. Brand marks remain separate from headers and contact information.

Cairo is used for the Arabic text and contacts. The following additions were visually checked: الجسات وأخذ العينات، تصنيف التربة، التدرج الحبيبي، اختبار الهبوط، درجة حرارة الخرسانة. The two soil annotations appear in sequence on the specimen. The fresh-concrete camera widens for the vertical mould lift, then pushes toward the thermometer. No numeric instrument value is shown.

The fixed phone reads **0535588975**; the fixed address reads **حي القادسية، الرياض**. The five-second closing email reads **info@etqanelbnaa.com**. All are as supplied by the user. No fictional results, measurement tables, dashboards, coordinates, preview labels or scene numbers appear in the movie.

## Location and visual limits

The opening now moves from Earth into Saudi Arabia and then to a modeled Riyadh city composition. The geographic marker denotes Riyadh city. The Google short link could not be independently resolved, so this is not a verified precise laboratory pin. The district name was supplied by the user; urban blocks are illustrative geometry, not surveyed buildings or streets.

The film is stylized procedural CGI, including illustrative test movement and material deformation. It does not claim recorded laboratory footage, instrument-specific engineering dimensions, calibrated physical simulation or real test results. Gold traces are motion-graphics elements, not a depiction of visible radiation.

## Preservation

This revision is wholly within its own new directory. Earlier tracked projects and the original root logo are unchanged. The preceding branded and unbranded movies retain their prior SHA-256 values; see `previous-projects-preserved.json`. No workbook, client record, price or private test data is included.
