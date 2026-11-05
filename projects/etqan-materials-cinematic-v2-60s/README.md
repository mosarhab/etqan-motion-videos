# ETQAN — Materials in Motion — revised 60-second film

Independent revision in `projects/etqan-materials-cinematic-v2-60s/`. All earlier projects, sources and MP4 files are retained unchanged.

## Delivery

`renders/etqan-cinematic-3d-60s.mp4`

60.000 seconds · 1,800 frames · 1080 × 1920 · 30 fps · H.264 · yuv420p / limited-range BT.709 · stereo AAC · MP4 fast-start.

## Changes requested by the user

- Transparent white ETQAN lettering with the original gold retained, without the previous ivory logo panel. The authentic PNG is unchanged on disk; a composition-time SVG color filter implements the expressly approved recoloring while preserving the alpha silhouette and aspect ratio.
- Cairo typography throughout, including larger, readable contact information. The user rejected the prior typeface.
- A longer, moving Earth-to-Riyadh opening, followed by a procedural city-map composition. The city is marked; no unverified precise laboratory pin is asserted.
- Continuous footer: **0535588975** and **حي القادسية، الرياض**. The closing also shows **info@etqanelbnaa.com**. All three strings were supplied by the user.
- Added borehole drilling and sample extraction; soil classification plus particle-size gradation labels on the moving specimen.
- Added a continuous seven-second fresh-concrete shot: vertical slump-cone lift and specimen settling, followed by temperature measurement using a probe. No measured value is displayed.
- Five-second closing so the email and brand have time to be read.

## Timeline

| Time | Moving scene | Arabic copy |
| --- | --- | --- |
| 0–7 s | Earth approaches Saudi Arabia and dissolves into a moving Riyadh map | من قلب الرياض · الرياض · company name and district |
| 7–11 s | Sampling barrel descends into layered soil, then extracts a sample | الجسات وأخذ العينات |
| 11–16 s | Floating soil monolith forms; two point-linked labels appear sequentially | تصنيف التربة · التدرج الحبيبي |
| 16–19.5 s | Field-density gauge settles onto a modeled soil patch | الكثافة الحقلية |
| 19.5–23 s | Four-electrode Wenner arrangement | مقاومية التربة |
| 23–30 s | Slump cone rises; concrete settles; the camera moves toward the thermometer | اختبار الهبوط · درجة حرارة الخرسانة |
| 30–34 s | Concrete specimen and compression platens | مقاومة الضغط |
| 34–37 s | Opposing UPV probes and a conceptual traveling pulse | الموجات فوق الصوتية |
| 37–40 s | Core barrel engages the slab and extracts a core | الكور الخرساني |
| 40–44 s | Asphalt specimen forms from aggregate particles | مكونات الخلطة |
| 44–48 s | Marshall breaking-head motion | الثبات والانسياب |
| 48–52 s | Binder and aggregate composition study | نسبة البيتومين |
| 52–55 s | Three materials in one continuous camera movement | نتائج تدعم القرار الهندسي |
| 55–60 s | Large white/gold authentic logo, official Arabic name, email | الدقة أساس الثقة |

Twelve-frame dissolves connect the shots. Camera movements, mechanical operations, specimen formation, particles and moving 3D-linked annotations are driven by the Remotion frame clock. No still scene is zoomed or panned. The only imported image is the authentic logo.

## Run and render

```sh
npm ci
python3 -m pip install -r requirements.txt
npm run studio
npm run check
node scripts/review-source.mjs
npm run render
npm run verify
python3 scripts/export_review.py
python3 scripts/check-motion.py
node scripts/check-playback.mjs
```

The production renderer uses Chromium at `/usr/bin/chromium` and Mesa/ANGLE EGL. Adjust the browser executable and GL backend for other systems. Sixty-frame checkpoints are source-hashed and verified before reuse; source changes invalidate stale checkpoints. `npm run render:direct` is available as a conventional Remotion CLI alternative. All substantial scenes are separately registered in Studio.

Source-review images are saved under ignored `work/`. Final-review images are extracted from the delivered MP4 and saved under `renders/`. The verification report checks frame count, duration, codecs, color metadata, complete decoding, original-logo file identity and the audio match to the original synthesized soundtrack. Native playback checks the opening, every service and the closing.

## Accurate limitations

The film uses stylized cinematic procedural CGI. It is not filmed laboratory footage and does not claim photorealistic simulation or an exact manufacturer's instrument. Equipment movement and material behavior communicate each service; they are not a training procedure, a calibrated physical simulation or actual ETQAN results. No strength, temperature, density, resistivity, percentage, slump dimension or pass/fail value is fabricated. The gold light traces are graphic identity elements.

The original Google Maps short link could not be independently opened or resolved. The geographic marker therefore denotes **Riyadh city**, not the laboratory parcel. The district name is the address expressly supplied by the user. The procedural city blocks are an abstract urban texture, not surveyed buildings, streets or a fabricated exact district map. Natural Earth supplies the real country geometry.

No photographs, stock footage, generated still scenes, reports, dashboards or measurement tables are included. The user's private monthly workbook and its customer records, prices and raw test data are excluded. Only the discussed generic service names appear.

See `ASSETS.md` for asset provenance and licenses.
