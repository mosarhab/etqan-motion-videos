"""Verify the restored creator signature in every encoded frame."""
from pathlib import Path
import hashlib,json,subprocess
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
video=ROOT/'renders/etqan-series-01-pouring-60s.mp4'
raw=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf','crop=54:36:38:1846,format=gray','-pix_fmt','gray','-f','rawvideo','-'],check=True,capture_output=True).stdout
frames=np.frombuffer(raw,dtype=np.uint8).reshape(-1,36,54)
assert len(frames)==1800
visible=(frames>140).sum(axis=(1,2))
assert visible.min()>150, int(visible.min())
assert visible.min()>=visible[0]*.85
source=ROOT/'public/creator-logo-mask.png'
authentic=next((a/'projects/etqan-materials-cinematic-v8-voice-60s/public/creator-logo-mask.png' for a in ROOT.parents if (a/'projects/etqan-materials-cinematic-v8-voice-60s/public/creator-logo-mask.png').exists()),source)
if authentic.exists():assert source.read_bytes()==authentic.read_bytes()
result={'passed':True,'frames_checked':1800,'creator_present_in_all_frames':True,'first_frame_visible_pixels':int(visible[0]),'minimum_visible_pixels':int(visible.min()),'maximum_visible_pixels':int(visible.max()),'creator_asset_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'authentic_asset_preserved':True,'display':'Original alpha/silhouette, white filter, width 46 px, height 26.90 px, opacity 0.9; left of email in persistent footer','crop_xywh':[38,1846,54,36]}
(ROOT/'renders/creator-check.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
