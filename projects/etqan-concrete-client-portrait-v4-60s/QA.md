# Final production checks — portrait v4

## Delivered master

The rendered MP4 is 60 seconds, 1,800 frames, 1080 × 1920 at 30 fps, H.264/yuv420p, BT.709 limited range, AAC stereo 48 kHz. Full FFmpeg decoding passed. Chromium played the complete file to its end at 2× and sought successfully to 20 positions without errors.

SHA-256: `829f10a3ba92c28b2bcf7420896b3fd55066b7b57be5bf9ec17e97e898278725`. Production source fingerprint matches the current source and assets.

## Requested changes

Removed the small subtitle beneath the sample age counter, including the endpoint qualifier. The title “عُمر العينة”, day progression and 28-day endpoint remain. The clock illustrates sample age since casting; 28 days is an example, not a prescribed age for all tests or a record of water-immersion duration.

Added **0551603205** in gold beside “تواصل معنا” in the final scene, with left-to-right digit order and a separate line “لخدمات فحص الخرسانة”. The persistent footer retains **0535588975**. Other previously removed phone numbers do not appear.

## Visual review

Exported 51 frames, including 23 representative scene frames and 15 transition frames. Inspected actual MP4 frames at 41 and 57 seconds: the counter subtitle is absent, the counter remains above the tank, and the closing phone fits beside the contact phrase without collision or clipping. Fixed header/footer comparisons and nine motion comparisons passed.

Only SampleAge.tsx, Closing.tsx and the composition registration ID differ from v3 source. All logo, font and soundtrack assets are byte-identical. Slump and temperature → cylindrical sample preparation → curing → compression remains unchanged. Existing geometry and timing checks passed.

## Audio and scope

Original music/SFX only, with no voiceover, unchanged from v3. Audio correlation with the original score: 1.0; integrated loudness -18.02 LUFS; true peak -3.23 dBTP. These are technical sound checks, not human listening approval.

Animated SVG engineering diagrams are illustrative and not photorealistic equipment footage or a complete testing procedure. No fabricated test results, accreditation badges or standard numbers were added. User-approved calibration/standards wording remains as supplied; it is not an independent compliance audit.

## Preservation

No previous tracked files changed. The prior v3 master retains its SHA-256. The unrelated v5 frame remains untouched and unstaged. The saved series concept remains unchanged. TypeScript checking passed. Source archive excludes dependencies, temporary caches and previous private uploads. Detailed evidence is included under renders/.
