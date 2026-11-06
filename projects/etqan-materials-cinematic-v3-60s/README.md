# ETQAN — Materials in Motion — revision 3

An independent 60-second revision in `projects/etqan-materials-cinematic-v3-60s/`. All preceding project directories and videos are retained unchanged.

Delivery: `renders/etqan-cinematic-3d-60s.mp4` — 1080 × 1920, 30 fps, 1,800 frames, H.264 / limited-range BT.709, stereo AAC, MP4 fast-start.

## Requested changes

- **تصنيف التربة** remains visible when **التدرج الحبيبي** appears. Two separate point-linked labels remain together until the soil-specimen shot transitions out. They share the purpose line **فهم خصائص التربة وتوزيع حبيباتها**.
- A new **اختبار البروكتور** shot sits between gradation and field density. A modeled metal mould, collar, base, fasteners, soil fill and guided rammer perform two lift/drop cycles. A front cutaway makes the soil visible. The geometry, motion, lighting and shadows are rendered procedurally.
- **الجسات وأخذ العينات** is replaced with the requested **جسات التربة**.
- **مقاومية التربة** is replaced with the user-requested display name **مقاومة التربة**. Its purpose line makes the electrical context clear.
- A short benefit line appears beneath each service label. The slump benefit is exactly **تقييم قوام الخرسانة**, without **الطازجة**.

The transparent white/gold logo, Cairo typography and persistent phone/address remain. The email is held in the five-second closing. The opening, asphalt formation and materials overview are slightly shorter to make space for Proctor while retaining all services and exactly sixty seconds. Test-purpose labels appear early enough to be read alongside the action.

## Timeline and Arabic copy

| Time | Scene | Label / purpose |
| --- | --- | --- |
| 0–5 s | Earth moves into Saudi Arabia and a procedural Riyadh map | من قلب الرياض · الرياض · official company name |
| 5–9 s | Borehole and sample extraction | جسات التربة — فهم طبقات التربة وظروف التأسيس |
| 9–14 s | Animated soil specimen | تصنيف التربة + التدرج الحبيبي — فهم خصائص التربة وتوزيع حبيباتها |
| 14–17.5 s | Proctor mould and guided rammer | اختبار البروكتور — تحديد ظروف الدمك المثلى |
| 17.5–21 s | Field density gauge | الكثافة الحقلية — التحقق من كفاءة الدمك بالموقع |
| 21–24.5 s | Four-electrode arrangement | مقاومة التربة — دعم تصميم أنظمة التأريض |
| 24.5–31.5 s | Slump cone lift and thermometer, one continuous shot | اختبار الهبوط — تقييم قوام الخرسانة · درجة حرارة الخرسانة — متابعة حرارة الخرسانة قبل الصب |
| 31.5–35.5 s | Compression platens and specimen | مقاومة الضغط — تقييم تحمل الخرسانة للضغط |
| 35.5–38.5 s | Opposed UPV probes and conceptual pulse | الموجات فوق الصوتية — تقييم تجانس الخرسانة وجودتها الداخلية |
| 38.5–41.5 s | Core barrel and extracted specimen | الكور الخرساني — تقييم الخرسانة المنفذة بعينات فعلية |
| 41.5–45 s | Aggregate forms an asphalt specimen | مكونات الخلطة — فهم توزيع مكونات الخلطة |
| 45–49 s | Marshall breaking heads | الثبات والانسياب — تقييم ثبات الخلطة تحت الأحمال |
| 49–53 s | Binder / aggregate composition study | نسبة البيتومين — دعم ضبط مكونات الخلطة |
| 53–55 s | Three materials in a continuous camera move | نتائج تدعم القرار الهندسي |
| 55–60 s | Brand closing and contact email | official Arabic company name · الدقة أساس الثقة |

Persistent footer: **0535588975** · **حي القادسية، الرياض**. Closing email: **info@etqanelbnaa.com**. These values were supplied by the user.

## Run, render and verify

```sh
npm ci
python3 -m pip install -r requirements.txt
npm run studio
npm run check
node scripts/check-copy-layout.mjs
node scripts/review-source.mjs
python3 scripts/make_audio.py
npm run render
npm run verify
python3 scripts/export_review.py
python3 scripts/check-soil-labels.py
python3 scripts/check-motion.py
node scripts/check-playback.mjs
```

The production renderer uses Chromium at `/usr/bin/chromium` with Mesa/ANGLE EGL. Adjust the browser/backend paths for other systems. Sixty-frame source-hashed checkpoints support resumption; source/public/lockfile changes invalidate prior checkpoints. Each major shot has its own Studio composition. The original synthesized musical arrangement is retained, with transition textures retimed and two restrained original Proctor impacts aligned to the rammer contacts.

Source previews and working files stay in ignored `work/`. Delivered-frame reviews and verification evidence are saved under `renders/`. The Cairo font audit measures actual browser text widths before export. The soil-label check examines the encoded movie to confirm the first label remains when the second appears, supported by manual frame review. Native playback seeks through all shots and plays the file to its end.

## Accurate visual and location limits

This is stylized procedural CGI, not recorded laboratory footage or a calibrated physical simulation. The sectioned Proctor mould and compaction movement are visual explanations, not an instrument-specific operating procedure or a measured result. No density, moisture, temperature, strength, resistivity, pass/fail result or numerical measurement is asserted. The UPV pulse and gold traces are motion-graphics elements; they do not represent a measured waveform or visible radiation.

The geographic marker denotes **Riyadh city**. The original Google Maps short link could not be independently resolved in the earlier revision. The district address is as supplied by the user; no exact laboratory parcel, coordinates or fabricated street address is displayed. The city blocks are illustrative geometry, not surveyed buildings or a detailed district map.

All scenes are animated geometry, materials, lights, particles and cameras. The only imported image is the authentic logo PNG. There are no photographs, generated still scenes, stock footage, reports or technical dashboards. The original PNG is unchanged on disk; the user's expressly approved white/gold recoloring is applied in the composition.

The private monthly workbook, client records, quantities, prices and raw results are excluded. See `ASSETS.md` for provenance and licenses.
