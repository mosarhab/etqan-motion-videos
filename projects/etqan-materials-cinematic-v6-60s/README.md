# ETQAN — unified corporate frame — revision 6

Independent 60-second project in `projects/etqan-materials-cinematic-v6-60s/`. All earlier project directories and movies are preserved.

Delivery: `renders/etqan-cinematic-3d-60s.mp4` — exactly 60 seconds, 1080 × 1920, 30 fps, H.264 / BT.709, stereo AAC, MP4 fast-start.

## Requested overall structure

The user's latest reference establishes a fixed corporate header and footer around the animated content:

- Authentic ETQAN logo at the upper left, preserving the source design/proportions and the earlier user-approved white/gold rendering.
- Official Arabic name at the upper right, on two lines: **مختبر اتقان البناء** / **لفحص التربة و المواد**.
- Thin inset gold rule under the header. A subtle dark gradient keeps the identity readable over all scenes.
- Scene category titles moved below the header and resized to keep clear of specimen labels. The soil labels, Proctor and short test-benefit lines are retained.
- Fixed footer with a gold top rule, small creator MS mark, separators, email, district/city, phone and gold outline symbols, following the reference's arrangement.
- The only phone is **0535588975**. Email: **info@etqanelbnaa.com**. Address: **حي القادسية، الرياض**. Additional phone numbers remain removed.
- The creator mark stays small (46 px wide, 70% opacity) and sits inline at the far left of the footer as an authorship credit.

The corporate frame is present throughout every scene, transition and the closing. The header/footer reference's illustrative body, new service example, scene counter and progress labels are not copied into the advertisement. Existing animated Earth/Riyadh, soil, concrete, asphalt and closing content remain the film's subjects.

## Production

This revision is rendered completely from the included Three.js / Remotion source. It does not paint a new header over an old title area. `src/BrandMark.tsx` defines the corporate header and footer; `src/Type.tsx` reserves space beneath the header for category names. Major scenes and a separate `BrandFrame` composition are available in Studio.

```sh
npm ci
python3 -m pip install -r requirements.txt
npm run studio -- --port=3007
npm run check
node scripts/check-frame-layout.mjs
node scripts/review-source.mjs
npm run render
npm run verify
python3 scripts/export_review.py
python3 scripts/check-brand-frame.py
python3 scripts/check-soil-labels.py
python3 scripts/check-motion.py
node scripts/check-playback.mjs
```

The production renderer uses Chromium at `/usr/bin/chromium` and Mesa/ANGLE EGL with sixty-frame resumable checkpoints. Source/public/lockfile hashes invalidate stale frames. Adjust browser/backend settings for another system. The browser layout audit records actual identity and contact boxes in `renders/frame-layout.json`; the encoded-frame audit checks their continued presence through all 1,800 frames.

Working files stay in ignored `work/`. Delivery verification and representative frames are stored under `renders/`. Review-sheet frame labels sit outside the extracted images and are not part of the video.

## Accurate limits and assets

The content remains stylized procedural cinematic CGI, not recorded laboratory footage or calibrated physical simulation. No measured result, strength, density, moisture, temperature, report or dashboard is fabricated. Gold traces and the UPV pulse are illustrative graphics.

The geographic marker denotes Riyadh city. The district address was supplied by the user; the original short Maps link could not be independently resolved. No exact laboratory parcel, invented street address or raw coordinates are asserted. City blocks are illustrative geometry.

Imported brand imagery is limited to the authentic ETQAN PNG and the user's authorized creator-logo mask. The latter is a cutout derivative of the user's monogram, rendered white at composition time. There is no photography, stock footage or generated still scene. The private monthly workbook, customer records, prices and raw test results are excluded. See `ASSETS.md` for provenance and licenses.
