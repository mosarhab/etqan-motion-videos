# Final encode and visual review

Verified delivery: `etqan-cinematic-3d-60s.mp4`

- Exactly **60.000 seconds**, **1,800 frames**, **1080 × 1920**, **30 fps**.
- H.264 High, yuv420p, limited-range BT.709; MP4 fast-start.
- Stereo AAC, 48 kHz, 192 kbps. Original synthesized instrumental and mechanical/transition effects.
- Complete video and audio decode passed with FFmpeg.
- Native Chromium video playback advanced normally, with no media error. Seeking to 4, 13, 21, 30, 40, 49, 55 and 59 seconds passed, all with readyState 4.
- Encoded audio correlates **0.999680757** with the supplied original score. Integrated loudness **−16.74 LUFS**, true peak **−2.47 dBTP**; no unintended silence detected. Final color conversion copied the same AAC audio packets unchanged.
- Authentic logo file is byte-identical to the repository-root original.
- Representative frames from all eight scenes and seven transition midpoints extracted from the final encoded MP4 and visually reviewed. See `scene-review.jpg` and `qa-frames/`.
- Reviewed Arabic spelling, shaping, center alignment, legibility and the exact official company name. Noto Sans Arabic bold/regular used locally.
- No scene numbers, coordinates, exact address, dashboards, fake measurements, fabricated reports, watermarks, preview labels, extra English subtitles or placeholder copy appear.
- The only imported image asset is the authentic company logo. All scene imagery is animated procedural 3D. The original English descriptor inside the authentic logo is intentionally retained.
- First-frame continuity was checked; adjacent opening-frame RGB differences were small, with no initial camera jump.
- Previous project paths are unchanged. All authored source and delivery files are confined to `projects/etqan-cinematic-3d-60s/`.

## Limitations

The style is designed cinematic 3D, not photorealistic footage or a survey of ETQAN's actual premises. Equipment is illustrative; the film makes no equipment model or test-result claim. The map reference could not be verified because the environment denied the Maps host with HTTP 403. The marker identifies Riyadh at city level, not a precise laboratory street location. No address is invented.

Machine-readable encode evidence, exact byte size and SHA-256 are recorded in `verification.json`. Native playback evidence is in `playback-check.json`.
