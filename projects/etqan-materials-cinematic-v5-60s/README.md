# ETQAN — single-line contact footer — revision 5

Independent revision in `projects/etqan-materials-cinematic-v5-60s/`. All earlier project directories and videos remain unchanged.

Delivery: `renders/etqan-cinematic-3d-60s.mp4` — exactly 60 seconds, 1080 × 1920, 30 fps, H.264 / yuv420p / BT.709, stereo AAC, MP4 fast-start.

## Requested changes

The footer matches the supplied reference's contact strip: dark navy, thin gold top rule, one horizontal line, white contact text, small gold outline icons and slim vertical dividers. From left to right:

**info@etqanelbnaa.com** · **حي القادسية، الرياض** · **0535588975**

The three additional numbers from revision 4 are removed from the new footer. The email now appears throughout the film as part of the requested strip. The supplied reference's scene counter/progress area is not part of this footer and is not reproduced in the advertisement.

The user's white creator mark is now a discreet authorship signature: **46 px wide**, compared with 104 px before, with **50% opacity**, 40 px from the left and 22 px above the bottom. It remains separate from the main ETQAN logo and does not occupy a contact column. The authentic ETQAN branding, 3D scenes, all tests, service-benefit captions, timing and music remain as in the verified material-led film.

## Render and verification

`src/BrandMark.tsx` contains the reusable contact strip and creator mark. `FooterOnly` exports the exact correction overlay. The complete animated Three.js / Remotion source is also retained and can produce a full render.

The delivered movie is composited over the verified revision-3 animated master rather than adding another generation to revision 4. The base movie hash is verified first, and its AAC packet payload is copied unchanged. The correction affects the footer area; it does not replace any scene with an image. Source and compositing hashes are in `renders/composite-provenance.json`.

```sh
npm ci
python3 -m pip install -r requirements.txt
npm run studio
npm run check
npm run render:footer
npm run verify
python3 scripts/export_review.py
python3 scripts/check-footer.py
node scripts/check-playback.mjs
```

The fast route expects the preserved revision-3 sibling movie at the recorded path. `npm run render` is the full-source alternative. Chromium is configured at `/usr/bin/chromium`; adjust the browser/backend paths for another system. Working files stay under ignored `work/`; delivery evidence is saved under `renders/`.

Verification checks the footer and small creator mark across all 1,800 encoded frames, every contact section, the removal of the extra numbers, the retained audio payload and representative images above the corrected area. Native playback seeks through the scenes and plays to the end.

## Accurate limitations

The material-led film uses stylized procedural CGI, not recorded laboratory footage or calibrated physical simulation. No measured result, report, table or dashboard is fabricated. The map denotes Riyadh city; the district address is as supplied by the user. The original short location link could not be independently resolved, so no exact laboratory parcel or invented street address is asserted.

The authentic ETQAN PNG and the user's authorized creator-logo mask are the only imported brand images. The personal mark is a cutout derivative of the supplied monogram and is rendered white in the composition. There is no photography, stock footage or generated still scene. No private workbook, customer record, price or raw result is included. See `ASSETS.md` for provenance.
