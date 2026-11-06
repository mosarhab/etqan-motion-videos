# Revision 8 — narrated delivery review

Verified on 2026-11-07 (Asia/Riyadh).

- Delivery: `etqan-cinematic-3d-60s.mp4`, 21,262,826 bytes.
- SHA-256: `fae43509937bfb97983ab25317276ae7863cfdf526090bfbba9ef2aae71af080`.
- Exactly 60.000 seconds, 1,800 frames, 1080 × 1920, 30 fps, H.264, yuv420p / BT.709, AAC stereo at 48 kHz. Complete FFmpeg decode passes.
- The uploaded original voice MP3 is preserved byte-for-byte: SHA-256 `dbac953004c0bb44fa1464477528c35be158418d07d7c68ea950c8718a54d505`.
- Ten quiet-pause centers remove 1.259 seconds; their maximum decoded peak is −43.40 dBFS. No words are intentionally removed. Remaining pauses retain 180 ms before time fitting. Rubber Band applies a pitch-preserving tempo factor of 1.063740, with no voice re-synthesis.
- The fitted narration occupies a 59.62-second window starting at 0.12 seconds. Isolated speech energy remains in the last second, with a quiet ending before the final 100 ms. Local recognition checks retain the original introduction and closing phrase; scratch recognition text is not displayed or distributed.
- Narration is leveled toward −17 LUFS. The sample-counted stereo mix measures −17.05 LUFS integrated and −4.52 dBTP before AAC encoding. The original synthesized music ducks smoothly under speech; its transition and Proctor cues use the revised timeline.
- The encoded AAC matches the prepared narration/music PCM mix at correlation 0.999858. Encoded mono-downmix correlation to the fitted voice is 0.989794. Narration RMS is 16.82 dB above the music residual. Encoded peak is −4.53 dBFS, with no sample clipping.
- Native Chromium playback advances, seeks to 20 points and plays the complete file through 60 seconds at 2× with no media error. This browser check is muted; audio presence/content is independently checked from decoded PCM and local speech recognition.
- TypeScript check passes. Rendered checkpoints match the final source/public/lockfile fingerprint.
- The film is rendered again from the procedural source at its new timings, rather than stretching the encoded old video. Approximate phrase boundaries come from local Arabic recognition and pause analysis. The source timeline preserves every service and separates borehole/foundation conditions from classification/gradation, and slump from temperature within their continuous scene.
- Opening: 0–7.47 s; boreholes: 7.47–11.57 s; soil classification/gradation: 11.57–18.03 s; Proctor: 18.03–20.80 s; density: 20.80–24.90 s; soil resistance: 24.90–28.50 s; slump/temperature: 28.50–33.90 s; compression: 33.90–36.50 s; UPV: 36.50–39.67 s; core: 39.67–43.27 s; asphalt formation: 43.27–46.67 s; Marshall: 46.67–49.50 s; binder: 49.50–52.43 s; construction context: 52.43–56.23 s; brand closing: 56.23–60 s.
- Forty-one frames were extracted from the actual delivery. Manual visual review covers each service, revised transitions and closing. Classification remains present alongside gradation through the last frame before Proctor. Visible scene-area motion checks pass in sixteen intervals.
- The authentic ETQAN source PNG remains identical to the repository original. Corporate header/logo and every footer field pass visibility checks in all 1,800 frames. The footer still contains only `0535588975`, `info@etqanelbnaa.com` and `حي القادسية، الرياض`, with the authorized small white creator mark. Caption positions and the approved revision-7 visual design are retained.
- `etqan-full-frame-soil.png` is an uncropped 1080 × 1920 frame at 16.1 seconds, extracted from this exact final MP4.
- Prior tracked projects are unchanged from commit `8da730323e08bca0bafa9b9dc2d337d00c045352`. The prior v7/v6 movie hashes are preserved in `previous-projects-preserved.json`.

There was no direct listening pass in this runtime. Timing is an ASR-assisted phrase alignment, with visual and signal verification; subjective vocal performance and exact word-level timing were not certified. The visuals remain stylized procedural CGI, not recorded footage or calibrated simulation. Riyadh is a city marker and the district was user supplied; the exact laboratory pin remains unverified. No private workbook, customer records, invented measurements, reports or dashboards are included.

Evidence: `verification.json`, `voice-fit.json`, `audio-mix.json`, `narration-check.json`, `frame-layout.json`, `brand-frame-check.json`, `playback-check.json`, `motion-check.json`, `soil-labels-check.json` and `review-frames.json`. The source timing manifest is `src/voice-timeline.json`.

Publication scope: raw narration and the standalone mixed WAV are retained locally and excluded from public Git history. The public delivery is the authorized final MP4, source code, approved brand/music assets and verification evidence. Audio scripts reconstruct the ignored mix after the user supplies their original MP3.
