# ETQAN — Arabic narration edition — revision 8

Independent project in `projects/etqan-materials-cinematic-v8-voice-60s/`. Every earlier project and movie remains preserved.

Delivery: `renders/etqan-cinematic-3d-60s.mp4` — 60 seconds, 1080 × 1920, 30 fps, H.264 / BT.709, stereo AAC and MP4 fast-start.

## Narration and synchronization

The user's supplied ElevenLabs MP3 is retained unchanged locally as `public/etqan-voice-original.mp3`. This raw recording and the standalone narration/music WAV are private local inputs/outputs, excluded from public Git history. Only the authorized finished video contains the voice in the public delivery. Its decoded duration is 64.679 seconds. `public/voiceover-script.txt` records the approved Arabic script, including Riyadh/Al Qadisiyah, service in the Saudi market since 2021, boreholes and foundation conditions before classification/gradation, Proctor, field density, soil resistance, concrete and asphalt tests, and the brand closing.

To fit the exact 60-second film, ten measured quiet pauses retain 180 ms each; only their low-energy centers are shortened. This removes 1.259 seconds. Rubber Band then applies a pitch-preserving tempo factor of 1.063740, with no voice re-synthesis or intentional word removal. The fitted speech window is 59.62 seconds, beginning at 0.12 seconds, with room for its ending before the film finishes. Moderate compression and loudness normalization keep narration clear.

The original procedural 3D scenes are rendered again from source with revised durations in `src/voice-timeline.json`. The opening is longer to accommodate the recorded introduction. Boreholes, soil classification, Proctor and the following tests retain their order. Slump and temperature have separately aligned phases within the same continuous concrete scene. Cameras and mechanical movement are frame driven at the revised timing; the video is not an optical-flow stretch of the old MP4.

The original synthesized score is regenerated with transition/Proctor cues aligned to this timeline. A smooth speech-driven envelope lowers the music beneath the voice. The final 48 kHz stereo PCM mix is `public/etqan-voice-mix.wav`; the render and Studio both use this same mix.

The green Saudi map, persistent corporate header, smaller lower footer, lower explanatory captions and foundation/road context shot retain the revision-7 design. The footer still contains only **0535588975**, **info@etqanelbnaa.com** and **حي القادسية، الرياض**, with the small authorized white creator mark.

## Reproduce and check

```sh
npm ci
python3 -m pip install -r requirements.txt
cp /path/to/the-supplied-narration.mp3 public/etqan-voice-original.mp3
python3 scripts/fit_voice.py
python3 scripts/make_audio.py
python3 scripts/mix_voice.py
npm run studio -- --port=3009
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
python3 scripts/check-narration.py
node scripts/check-playback.mjs
```

Audio fitting requires FFmpeg with Rubber Band, compressor and loudnorm filters. The pause cuts are specific to the supplied recording and are guarded by its SHA-256. To use another narration, measure new pauses and phrase cues first. Rendering uses Chromium at `/usr/bin/chromium`, Mesa/ANGLE EGL and source/public/lockfile fingerprints with sixty-frame resumable checkpoints. Adjust browser/backend paths on another system.

The fixed phrase timeline was guided by local Arabic speech recognition, quiet-pause analysis and visual scene review. Approximate phrase alignment is intended; this is not word-perfect lip synchronization. Raw recognition scratch files and model weights are not distributed. There was no direct listening pass in this runtime; signal checks, decoded-audio comparisons and native browser playback support the technical verification.

Source, approved brand assets and final video are published; the original narration and standalone mix are retained privately in the local project and are deliberately excluded from Git. The user already has the supplied original MP3; copying it into the ignored asset path and running the audio scripts reconstructs the mix. Intermediate WAVs, runtime dependencies, local ASR models and working files are ignored. Representative frames and verification evidence are under `renders/`; review-sheet labels are outside the extracted film images.

## Accurate visual limits

The film is stylized procedural CGI, not recorded laboratory footage or calibrated physical simulation. The construction section is illustrative and is not a dimensioned design. No measurements, results, dashboards or reports are fabricated.

The map denotes Riyadh city. Al Qadisiyah was user supplied; the original short Maps link could not be independently resolved, so no exact laboratory parcel or invented street address is asserted. No photograph, generated scene still, private monthly workbook or customer record is included. See `ASSETS.md` for provenance.
