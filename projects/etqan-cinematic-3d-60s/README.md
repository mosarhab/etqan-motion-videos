# ETQAN · Cinematic 3D · 60 seconds

A fully independent portrait brand film built in Remotion, React Three Fiber and Three.js. No previous project or video is changed. The sole imported image is the byte-identical company logo copied from the repository root.

## Deliverable

`renders/etqan-cinematic-3d-60s.mp4` — 60.000 seconds, 1,800 frames, 1080 × 1920, 30 fps, H.264 / yuv420p, stereo AAC.

## Creative treatment

An atmospheric 3D Earth camera approach becomes an extruded Saudi map and a rising conceptual Riyadh city model. A laboratory dolly leads into a layered soil core extraction rig and triaxial chamber, a hydraulic concrete compression frame, and a Marshall-style asphalt breaking-head machine with rotating sample carousel. A three-shot equipment montage leads to an elegant, light closing with the original navy/yellow logo.

All equipment, architecture, lighting, environment reflections, particles, surface textures and Earth cloud effects are generated in code. Earth material is generated at runtime from vector geographic polygons. The geography is never used as a scene screenshot. Camera position, mechanisms, lights, particles, sample movements and shaders are deterministic functions of Remotion frames.

Arabic uses Noto Sans Arabic, a professional equivalent to Cairo, with local fonts and a render-loading barrier. No voice-over or added English subtitles. The original logo contains its authentic English descriptor; this is intentionally preserved.

## Run

```sh
npm ci
python3 -m pip install -r requirements.txt
python3 scripts/make_audio.py
npm run studio
npm run check
npm run render
python3 scripts/verify.py
```

`npm run render` uses Chromium at `/usr/bin/chromium`, Mesa llvmpipe via ANGLE/EGL, and 60-frame resumable checkpoints. It then joins the video parts and encodes the original soundtrack once as 192 kbps AAC, with MP4 fast-start enabled. On another machine, edit the browser path/backend in `scripts/render-checkpoints.mjs`, or use `npm run render:direct` with an appropriate `--browser-executable` / `--gl` option. `python3 scripts/export_review.py` exports the final scene and transition checks. Python scripts require NumPy and Pillow. Source includes individually registered scene compositions for editing. Select `EtqanCinematic3D` for the full film. The exact duration is set in `src/Root.tsx`.

## Timing

| Seconds | Scene                         |
| ------- | ----------------------------- |
| 0–8     | Earth toward Saudi Arabia     |
| 8–18    | Saudi relief to Riyadh        |
| 18–25   | Laboratory dolly              |
| 25–35   | Soil extraction and testing   |
| 35–45   | Concrete compression          |
| 45–53   | Asphalt and materials         |
| 53–57   | Confidence montage            |
| 57–60   | Authentic ETQAN brand closing |

Scene starts match these boundaries. Fourteen-frame cross-dissolves extend the outgoing shots without extending the 1,800-frame master.

## Audio and rights

The instrumental underscore and synchronized subtle mechanical/transition sound effects are original deterministic synthesis written for this film in `scripts/make_audio.py`. No stock tracks, external samples or unverified third-party music license is used. The WAV source is included. There is no voice-over.

The original company logo is supplied by the repository. Noto fonts are licensed under the SIL Open Font License (see `public/OFL.txt`). Geographic vector boundaries are public-domain Natural Earth data (`ne_110m_admin_0_countries`, retrieved from the Natural Earth vector repository). Code-generated textures contain no photography or AI still images.

## Accurate limitations

This is stylized cinematic 3D motion graphics, not photorealistic laboratory footage or a digital survey of the company's actual premises. Equipment models are illustrative representations of soil, concrete and asphalt testing workflows; they do not assert a particular ETQAN equipment make or model. The soil cross-section is a conceptual material study.

The supplied reference `https://maps.app.goo.gl/YLMm6gFhHy9dxjiV7` could not be verified: the execution environment denied the maps host with HTTP 403. The film therefore shows a broad **Riyadh city marker**, never a claimed precise laboratory pin, street address or street map. The conceptual city is procedurally generated. No coordinates, measurements, result values, dashboards, reports or test certifications appear in the advertisement.

## Verification

The final delivery is checked with `ffprobe`, a complete FFmpeg video/audio decode, representative scene frames, transition checks, Arabic text review, byte comparison of the original logo, and encoded audio loudness/silence checks. See `renders/verification.json` and `renders/QA.md` for the recorded final results.
