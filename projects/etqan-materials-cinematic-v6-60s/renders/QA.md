# Revision 6 delivery review

Verified on 2026-11-06. The supplied design reference is applied to the persistent corporate header and footer; the procedural animated scenes and timing are retained.

- Delivery: `etqan-cinematic-3d-60s.mp4`, 23,870,347 bytes.
- SHA-256: `8c3a58584e5d7ea0dc4baee2349e05e13ae32cd555c81e617b800464f2104fcf`.
- Exactly 60.000 seconds, 1,800 frames, 1080 × 1920, 30 fps, H.264, yuv420p / BT.709, AAC stereo at 48 kHz.
- Complete FFmpeg decode passes. The encoded audio matches the original score at correlation 0.999782; peak −5.73 dBFS, RMS −18.09 dBFS.
- Native Chromium playback advances, seeks successfully to 20 representative points and plays the complete file to 60 seconds at 2× with no media error. This browser check is muted; audio content is independently verified from decoded PCM.
- TypeScript check passes. Source/public/lockfile fingerprint matches the rendered checkpoints.
- Authentic source ETQAN PNG is byte-identical to the repository original, rendered with user-approved white lettering and retained gold.
- Browser-measured corporate logo/name and all footer fields fit their reserved frame areas. Encoded-frame visibility checks cover all 1,800 frames: company logo, two company-name lines, creator credit, email, address and phone remain present throughout.
- The footer contains only `0535588975`, `info@etqanelbnaa.com` and `حي القادسية، الرياض`. The small creator mark is inline at the left. No scene counter or progress labels are included.
- Forty-one frames were extracted from the actual delivery MP4. Manual review of representative frames covers the opening, city approach, each test group, transitions and closing. Arabic text remains readable and clear of the corporate header/footer.
- Soil classification remains visible with particle gradation through the last frame before Proctor. Motion checks pass in 16 shot intervals. These pixel checks supplement source and visual review; they do not certify laboratory test accuracy.
- `etqan-full-frame-soil.png` is an uncropped 1080 × 1920 frame extracted at 13.1 seconds from this exact MP4, including header and footer.
- Prior tracked projects are unchanged from commit `05925767d69983b928669fa768477b9a79b3bf64`; prior v4/v5 movie hashes are recorded in `previous-projects-preserved.json`.

The visuals are stylized procedural CGI, not recorded footage or calibrated physical simulation. The location animation denotes Riyadh city; the district is user supplied and the exact laboratory pin remains unverified. No private monthly workbook, customer data, fabricated measurements, reports or dashboards are included.

Machine-readable evidence: `verification.json`, `frame-layout.json`, `brand-frame-check.json`, `playback-check.json`, `motion-check.json`, `soil-labels-check.json` and `review-frames.json`.
