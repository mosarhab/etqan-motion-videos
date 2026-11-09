"""Measure logo interiors in an actual decoded MP4 frame, including codec color conversion."""
from pathlib import Path
import subprocess,json
import numpy as np
from PIL import Image,ImageFilter
root=Path(__file__).resolve().parents[1];frame=root/'work/logo-check-frame.png'
subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/etqan-concrete-cinematic-60s-no-vo.mp4'),'-vf',r'select=eq(n\,1755)','-frames:v','1','-y',str(frame)],check=True)
original=Image.open(root/'public/etqan-logo.png').convert('RGBA').resize((750,202),Image.Resampling.LANCZOS)
source=np.asarray(original);actual=np.asarray(Image.open(frame).convert('RGB'))[150:352,1050:1800]
assert actual.shape==(202,750,3)
# Opaque interiors exclude anti-aliasing, alpha edges, and tiny tagline glyphs.
opaque=(source[:,:,3]>253)
navy=opaque&(source[:,:,2]>65)&(source[:,:,0]<60)&(source[:,:,1]<75)
gold=opaque&(source[:,:,0]>210)&(source[:,:,1]>140)&(source[:,:,2]<85)
colors={}
for name,mask in [('navy',navy),('gold',gold)]:
 mask=np.asarray(Image.fromarray((mask*255).astype('uint8')).filter(ImageFilter.MinFilter(5)))>250
 assert mask.sum()>100,name
 error=float(np.abs(actual[mask].astype(float)-source[:,:,:3][mask].astype(float)).mean())
 assert error<10,(name,error)
 colors[name]={'interior_pixels':int(mask.sum()),'mean_absolute_rgb_error':error,'source_rgb_mean':source[:,:,:3][mask].mean(axis=0).tolist(),'delivery_rgb_mean':actual[mask].mean(axis=0).tolist()}
result={'passed':True,'decoded_video_frame':1755,'official_png_css_size':[750,750*552/2048],'original_aspect_preserved':True,'original_png_unchanged':'Also checked byte-for-byte by verify.py','codec_color_comparison':colors,'note':'Tolerance covers H.264 4:2:0 compression and subpixel resize. All comparisons use fully opaque logo interiors.'}
(root/'renders/brand-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
