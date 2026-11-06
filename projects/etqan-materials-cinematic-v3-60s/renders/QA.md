# Delivery QA — revision 3

Final MP4 SHA-256: `7a4d1118f99acc5cd714c3da8037f5cb569e3950fef58a55d94038044ba040e7`.

## Render, encode and audio

- Exactly 60.000 seconds, 1,800 frames, 1080 × 1920, 30 fps; H.264, yuv420p, limited-range BT.709.
- Full FFmpeg decode passed. The current source/public/lockfile fingerprint matches the renderer's checkpoint fingerprint, recorded in `verification.json`.
- Stereo AAC, 48 kHz, 60.000 seconds. The decoded audio matches the revised original WAV at correlation 0.9997816. Peak −5.73 dBFS; RMS −18.09 dBFS. No clipped peak.
- Original synthesized music retains its moderate arrangement. Transition cues are retimed to the revised scene changes; two quiet original Proctor impacts match the rammer contacts.
- Native Chromium playback sought to twenty positions covering all services, then played the entire video to its end at 2× QA speed. `fullPlaybackEnded=true`, final time 60 seconds, no video error.

## Requested changes and visual review

Forty-one frames were extracted from this exact encoded MP4, including every scene, the first/last frames, and fourteen inter-shot dissolves. The external review sheet captions are outside the movie images and are not part of the advertisement.

- **تصنيف التربة** remains visible after **التدرج الحبيبي** appears. The two callouts have separate positions and specimen anchors. Their shared purpose line is **فهم خصائص التربة وتوزيع حبيباتها**. Manual review and the encoded-frame check confirm both labels through frame 419, the final frame before the Proctor transition. The classification region contains 2,180 bright title pixels at the reference frame, 2,180 at frame 393 and 2,179 at frame 419; the gradation title is present in both late frames. This is a visibility proxy supported by actual Arabic review, not OCR.
- **اختبار البروكتور** is inserted between the soil specimen and field-density scenes. The metal mould/collar, base, fasteners, rammer, soil fill and two lift/drop cycles are genuinely modeled and animated. The cutaway allows the soil to remain visible. Its purpose is **تحديد ظروف الدمك المثلى**.
- The labels are now **جسات التربة** and **مقاومة التربة**, as requested.
- The slump purpose is exactly **تقييم قوام الخرسانة**, without **الطازجة**.
- Twelve individual title/benefit pairs fit their measured Cairo text boxes. The two soil labels share one additional purpose line, reviewed separately. Benefits appear with the name and remain long enough to accompany the action. Short names, one-line benefits and consistent hierarchy preserve scene space.
- Sixteen encoded scene intervals show visible change inside the 3D scene area, supporting the source and visual checks.

The authentic PNG remains byte-identical to the root original. Its user-approved white/gold rendering has no rectangle behind it. The small mark hands off to the large closing logo. Fixed footer: **0535588975** · **حي القادسية، الرياض**. Closing email: **info@etqanelbnaa.com**. These are unchanged user-supplied values.

No fictional numerical result, temperature, moisture content, density, resistivity, strength, pass/fail result, report, measurement table, dashboard, coordinate, preview label or scene number appears in the movie.

## Accurate limits and preservation

This is stylized procedural CGI. Proctor motion, soil settling and the equipment cutaway communicate the service; they are not a calibrated physical simulation, an exact manufacturer's instrument or an operating guide. The UPV pulse and gold traces are graphic elements, not measured data or visible radiation.

The map denotes Riyadh city. The district address is supplied by the user; the previously supplied short link could not be independently resolved. No precise laboratory parcel or invented street address is claimed.

This independent revision leaves all prior tracked projects and the original root logo unchanged. Three earlier MP4 hashes still match their prior versions; see `previous-projects-preserved.json`. No workbook, customer record, raw result or price is included.
