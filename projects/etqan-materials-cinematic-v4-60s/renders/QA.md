# Delivery QA — revision 4

MP4 SHA-256: `8831eaf210c819d8c9eccb0c26462a6ab89ef3c9f1b6c049d83324a5a620a8f2`.

- Exactly 60.000 seconds, 1,800 frames, 1080 × 1920 at 30 fps; H.264 / yuv420p / limited-range BT.709.
- Complete FFmpeg decode passed. Stereo AAC is 48 kHz / 60.000 seconds. The encoded AAC packet payload is identical to the preserved revision-3 master; decoded audio matches the source WAV at correlation 0.9997816. Peak −5.73 dBFS, RMS −18.09 dBFS.
- Native Chromium playback sought through all services and played the entire file to its end at 2× QA speed, final time 60, no error.
- All 1,800 encoded footer regions were checked. Every number cell remains present, and the entire two-row contact area stays consistent with frame zero (maximum mean grayscale difference 0.71 / 255). Minimum bright pixels in the four cells are 594, 580, 543 and 559.
- All 1,800 creator-mark regions were checked: the small white mark remains present throughout, maximum mean grayscale difference 1.86 / 255, minimum 2,707 bright pixels. No background rectangle surrounds it.
- The reusable creator PNG has transparent exterior pixels and white RGB throughout its active interior. The unsuitable earlier image-processing attempts are excluded from the project and the movie.
- Forty-one actual delivery frames cover every scene, transitions and endpoints. The retained moving picture above the corrected footer was compared with the corresponding revision-3 frames: average RGB mean absolute difference 1.395 / 255, maximum 1.609 / 255, consistent with the additional encode and color conversion. The original 3D scenes/timeline remain the compositing base, with no still-scene replacement.

The fixed numbers are exactly **0535588975**, **0575828265**, **0573870072**, **0551603205**. The two-row number box is lower than the preceding contact baseline and remains fixed throughout all scenes. The address is **حي القادسية، الرياض**, above the grid. The creator MS mark is 104 px wide, lower left, with a 64 px left margin and 38 px bottom margin. ETQAN branding and the closing email are retained.

The original Arabic service labels, shared soil purpose line, Proctor scene and test-benefit captions are preserved from the verified revision-3 picture. No fictional measurement, report, dashboard, coordinate, preview label or scene number is added. Review-sheet captions are outside the extracted movie images and are not in the advertisement.

This is stylized procedural 3D, not laboratory footage or a calibrated physical simulation. The map still denotes Riyadh city; the supplied short link was not independently resolved, and no precise laboratory parcel is claimed. Earlier project directories, root logo and prior video hashes remain unchanged. Only this independent revision directory is added. See the machine-readable verification, footer checks, composition provenance and preservation report beside this file.
