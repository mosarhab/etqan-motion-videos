# Final production checks — portrait v6 with supplied voice

## Delivery

60 seconds, 1,800 frames, 1080 × 1920 at 30 fps. H.264/yuv420p BT.709 limited-range video with 48 kHz stereo AAC. SHA-256: `38355ec160676d5b43691a7938c31e6db4c65eb71556b5b76734875bf38244b4`. Full FFmpeg decoding passed. Native Chromium played the complete film to the end at 2× and sought successfully to 20 positions.

## Recording alignment

The user-supplied recording is 48.27429 seconds. Six paragraph excerpts were placed at scene cues using inter-phrase silence boundaries and 10 ms edge fades. No time stretching or pitch shift was applied. All six cues fit wholly inside their matching scene; the last ends at 59.52429 seconds.

Speech segments in the decoded MP4 correlate 0.972–0.986 with their aligned speech references, despite the background bed and AAC encoding. Speech/background ratios during active speech are approximately 13.9–16.0 dB. Music is lowered before each spoken paragraph and restored gradually afterwards. No invented spoken content, new TTS or spoken telephone number was added.

Integrated final loudness is -20.14 LUFS; true peak -1.92 dBTP. The final AAC matches the supplied mixed score with correlation 1.0. No clipping was found.

## Images and preservation

This is an audio edit: the v5 H.264 video stream was copied without recompression. Its elementary stream hash matches the new master exactly. Visual source is unchanged except for the new composition ID; source assets, mixed score and production fingerprint match the delivered master. TypeScript checking passed.

Fifty-one frames were extracted from the final MP4; persistent branding and nine motion comparisons passed. The closing cover is extracted from second 57. Logo, typography, samples, age counter, header/footer, 0551603205 and its telephone icon remain unchanged from v5. Previous files and the previous movie hash remain unchanged.

## Review limits

Local automatic Arabic speech recognition was used to identify paragraphs; silence boundaries and waveform checks establish timing and signal preservation. Recognition has spelling errors and is not a pronunciation assessment. No human listening approval is claimed. The film remains an illustrative animated SVG explainer, not a complete test procedure or a photorealistic laboratory film. Existing user-approved business statements are not independently audited.

The original uploaded MP3 is excluded from the public repository/source archive. The final mixed score and original music are included for reproduction. See JSON reports in renders/ and narration/recording-alignment.json.
