"""Extract representative, transition and motion frames from the actual delivery."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,subprocess
root=Path(__file__).resolve().parents[1];video=root/'renders/etqan-concrete-client-explainer-60s.mp4';out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(0,'First frame'),(75,'Opening hook'),(210,'Slump and temperature'),(330,'Vertical lift and probe'),(450,'Settled concrete'),(630,'Cylindrical moulds'),(720,'Sample filling'),(840,'Compaction'),(915,'Surface preparation'),(990,'Curing after demoulding'),(1080,'Immersion'),(1200,'Fully submerged cylinders'),(1320,'Compression introduction'),(1410,'Load contact'),(1530,'Controlled cracking'),(1710,'Brand and CTA'),(1799,'Final held frame')]
transitions=[f for t in [6,20,32,43,55] for f in [round(t*30)-3,round(t*30)+3,round(t*30)+15]]
pairs=[(75,90),(300,315),(315,330),(690,705),(825,837),(1020,1035),(1380,1395),(1510,1530)]
selected=sorted(set([f for f,_ in representative]+transitions+[f for p in pairs for f in p]))
filt='select='+'+'.join(rf'eq(n\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-fps_mode','vfr','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
rows=(len(representative)+2)//3;sheet=Image.new('RGB',(1440,rows*296),'#071b2c');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
for i,(f,label) in enumerate(representative):
 x=i%3*480;y=i//3*296;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((480,270),Image.Resampling.LANCZOS),(x,y));d.text((x+8,y+275),f'{f/30:.2f}s  {label}',font=font,fill='white')
sheet.save(root/'renders/scene-review.jpg',quality=94)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',r'select=eq(n\,1515)','-frames:v','1','-y',str(root/'renders/etqan-concrete-explainer-cover.png')],check=True)
motion=[]
for a,b in pairs:
 x=np.asarray(Image.open(out/f'frame-{a:04d}.jpg').crop((100,240,1000,900)),dtype=float);y=np.asarray(Image.open(out/f'frame-{b:04d}.jpg').crop((100,240,1000,900)),dtype=float);delta=float(np.abs(x-y).mean());assert delta>.005,(a,b,delta);motion.append({'frames':[a,b],'mean_rgb_delta_in_diagram':delta})
reference=np.asarray(Image.open(out/'frame-0075.jpg').convert('RGB'),dtype=float);stability=[]
for f,_ in representative:
 a=np.asarray(Image.open(out/f'frame-{f:04d}.jpg').convert('RGB'),dtype=float)
 header=float(np.abs(reference[:165]-a[:165]).mean());footer=float(np.abs(reference[992:]-a[992:]).mean());assert header<3 and footer<3,(f,header,footer);stability.append({'frame':f,'header_mean_delta':header,'footer_mean_delta':footer})
(root/'renders/review-frames.json').write_text(json.dumps({'representative':representative,'transition_frames':transitions,'all_exported_frames':selected,'motion_evidence':motion,'persistent_branding':stability,'cover_frame':1515,'note':'English review labels appear only on this QA sheet, never in the video.'},indent=2)+'\n');print('Exported',len(selected),'actual MP4 frames, contact sheet and cover.')
