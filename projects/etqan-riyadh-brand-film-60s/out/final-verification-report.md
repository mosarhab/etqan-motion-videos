# ETQAN Riyadh · final verification

The existing 60-second Remotion film has been completed with the authentic logo. The original scene order, timing, engineering animations, Arabic copy, exact-coordinate map and original sound design are preserved. The film was not recreated from scratch.

## Render

- Final MP4: `etqan-riyadh-brand-film-60s-final.mp4`
- H.264 High; 1080×1920; 30 FPS; exactly 1800 frames and 60.000 seconds
- AAC stereo; 48000 Hz
- File size: 10,696,787 bytes
- SHA-256: `d3bdb1500af9ccc9577cb6f6713b6eadce96598f467466b418475a08fa1bbe88`
- TypeScript passed; every frame rendered; full MP4 decoded with FFmpeg without errors.
- [Machine-readable proof](final-render-proof.json) · [Decoded frame review](final-contact-sheet.jpg)

## Authentic brand

`public/assets/etqan-logo.png` is byte-identical to root `etqan-logo.png` from main commit `567187d949ff260176b68531fd21057eacf0686e`. Git blob SHA: `731714d1fbf04b75278aa277dc697f498af9881d`. The original image retains transparency, proportions, letterforms, colors and its English tagline. It appears in the arrival scene and as a large, uncropped finale. Prominent logo/tagline and Arabic text were inspected visually. The palette uses exact dominant opaque RGB values from the source PNG: navy `#1D305B`, yellow `#F6C717`. Missing-logo preview notices are removed.

The exact Arabic name remains `مختبر اتقان البناء لفحص التربة و المواد` and the tagline remains `الدقة أساس الثقة`. The pin remains at latitude 24.829475 N, longitude 46.828527 E. Public-domain Natural Earth shapes and the labeled illustrative local grid are unchanged. All engineering graphics are illustrative, without invented actual test results or lab footage. Asset licensing is recorded in `CREDITS.md`.

## Preservation and scope

The earlier MP4, `etqan-riyadh-brand-film-60s.mp4`, is preserved unchanged: SHA-256 `bf7b812dae3d0441713baccaad3248e710495290231d88d20f2c04fdc9ef9a0f`. The final MP4 uses a separate filename. No old project, root logo, root README or shared dependency is edited. The delivery commit only adds files under `projects/etqan-riyadh-brand-film-60s/`, based on main commit `567187d949ff260176b68531fd21057eacf0686e`.

Re-rendering was necessary to include the authentic logo, apply the authentic palette throughout and remove preview notices. Separate final output, intermediate frame and QA folders avoid overwriting the earlier video or its verification artifacts. Dependencies and caches are excluded from Git.

## GitHub delivery

Branch: `delivery-etqan-riyadh-60s-final-20261104`. Main is not merged or changed, and no website is deployed.

Remote verification is pending until the branch is pushed and the MP4 is downloaded over public HTTPS. This report will be updated with the verified download receipt before delivery is declared complete.
