# Final production checks — portrait v3

The rendered master is `renders/etqan-concrete-client-portrait-v3-60s.mp4`: 60 seconds, 1,800 frames, 1080 × 1920, 30 fps, H.264/yuv420p, BT.709 limited range, AAC stereo 48 kHz. Full FFmpeg decoding passed. Native Chromium played to the end at 2× and successfully sought to 20 positions without playback errors.

## Requested additions

The actual age function was checked over 348 frames: every age from 1 to 28 appears, monotonically. The counter denotes sample age since casting, not duration of immersion. It reaches 28 at film second 41 and holds before fading. The endpoint reads “أحد أعمار اختبار المقاومة الشائعة”; the film does not prescribe 28 days for every test.

Curing copy: “معالجة العينات وفق متطلبات المواصفات القياسية.” Closing copy: “أجهزة مُعايرة… واختبارات وفق المواصفات القياسية.” These are user-approved business statements, not an independent audit of calibration or compliance. No invented standard numbers, certifications, measurements or test results appear.

## Visual and structural review

Exported 51 frames from the actual MP4, including 23 representative frames covering every scene and 15 transition frames. Reviewed counter placement, one-day/three-day/28-day wording, explanatory copy and closing. The counter sits above the curing tank without colliding with the immersed cylindrical samples. The calibration statement fits between the closing heading and samples. Nine diagram motion comparisons passed. Persistent header/footer comparisons passed across representative frames.

The explanatory sequence remains slump and temperature → cylindrical sample preparation → curing → compression. Geometry/timing checks passed for cylindrical proportions, immersion before loading, platen contact before cracking, probe placement and schematic slump volume. This is a simplified animated engineering illustration, not a complete testing procedure or photorealistic laboratory recording.

## Sound and branding

The original music/SFX soundtrack remains unchanged. AAC decoded audio correlates 1.0 with the source score; integrated loudness is −18.02 LUFS, true peak −3.23 dBTP. No spoken voiceover is included. Script and proposed recording cues remain supplied separately. These checks establish stream integrity and level, not human listening approval.

The official source logo is byte-identical to the repository asset, displayed with the previously authorized white lettering and original gold treatment. Header and footer remain fixed, with the approved phone, email and Riyadh address. Arabic copy was visually checked in exported frames.

## Preservation and reproducibility

TypeScript checking passed. The production source fingerprint matches the verified render. The previous portrait master retains its SHA-256; no tracked preexisting files changed. The unrelated v5 frame remains untouched and unstaged. The saved series concept remains unchanged. Source packaging excludes dependencies, temporary caches and previous private uploads. See JSON evidence under `renders/`.
