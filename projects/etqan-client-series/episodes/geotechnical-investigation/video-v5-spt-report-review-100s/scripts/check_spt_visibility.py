"""Regression check against the encoded MP4: the drive rod must remain visible.

The old vertical SVG gradient stroke disappeared despite valid motion geometry.
This checks a continuous shaft below the ground surface, away from the sampler.
"""
from pathlib import Path
import hashlib
import json
import numpy as np
from PIL import Image

root = Path(__file__).resolve().parents[1]
video = root / 'renders/etqan-series-geotechnical-v5-100s.mp4'
checks = []
for frame in [750, 870]:
    pixels = np.asarray(Image.open(root / f'renders/qa-frames/frame-{frame:04d}.jpg').convert('RGB'), dtype=float)
    assert pixels.shape == (1920, 1080, 3)
    shaft = pixels[1230:1275, 535:545].mean(axis=(1, 2))
    background = pixels[1230:1275, 515:523].mean(axis=(1, 2))
    contrast = shaft - background
    fraction = float(np.mean(contrast > 40))
    assert fraction > .95, (frame, fraction, float(contrast.min()))
    checks.append({'frame': frame, 'visible_shaft_row_fraction': fraction,
                   'minimum_shaft_background_difference': float(contrast.min())})
result = {'passed': True, 'video_sha256': hashlib.sha256(video.read_bytes()).hexdigest(),
          'source': 'Frames decoded from the delivered MP4, not source preview stills',
          'checks': checks, 'shaft_crop_xywh': [535, 1230, 10, 45],
          'scope': 'Encoded rod visibility regression; mechanical geometry is checked separately.'}
(root / 'renders/spt-visibility-check.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
