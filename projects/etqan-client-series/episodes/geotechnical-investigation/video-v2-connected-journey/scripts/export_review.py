"""Export full portrait frames and compare fixed branding throughout the delivery."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,subprocess,hashlib
root=Path(__file__).resolve().parents[1];video=root/'renders/etqan-series-geotechnical-v2-60s.mp4';out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(0,'Drilling from first frame'),(30,'Opening and active drill'),(180,'Empty site investigation'),(360,'Sampler withdrawal'),(450,'Sample clears ground'),(480,'Connected sample transfer'),(570,'Preserved sample'),(645,'Sample enters laboratory'),(795,'Grading and classification'),(930,'Liquid limit cup'),(1050,'Groove closure'),(1170,'Direct shear normal loading'),(1305,'Horizontal shear displacement'),(1380,'Field and lab information'),(1515,'Geotechnical report'),(1710,'Identity and contacts'),(1799,'Final frame')]
transitions=[f for t in [21,29,37,45,54] for f in [round(t*30)-1,round(t*30)+9,round(t*30)+19]]
pairs=[(0,30),(180,210),(360,420),(450,480),(480,510),(540,570),(645,675),(735,780),(930,938),(990,1000),(1170,1260),(1380,1425),(1485,1515),(1650,1680)]
selected=sorted(set([f for f,_ in representative]+transitions+[f for p in pairs for f in p]))
filt='select='+'+'.join(rf'eq(n\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-fps_mode','vfr','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=270,506,4;rows=(len(representative)+cols-1)//cols;sheet=Image.new('RGB',(cols*w,rows*h),'#071b2c');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
for i,(f,label) in enumerate(representative):
 x=i%cols*w;y=i//cols*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));d.text((x+7,y+486),f'{f/30:.2f}s {label}',font=font,fill='white')
sheet.save(root/'renders/scene-review.jpg',quality=94)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',r'select=eq(n\,30)','-frames:v','1','-y',str(root/'renders/etqan-series-geotechnical-v2-cover.png')],check=True)
motion=[]
for a,b in pairs:
 x=np.asarray(Image.open(out/f'frame-{a:04d}.jpg').crop((70,680,1010,1440)),dtype=float);y=np.asarray(Image.open(out/f'frame-{b:04d}.jpg').crop((70,680,1010,1440)),dtype=float);delta=float(np.abs(x-y).mean());assert delta>.005,(a,b,delta);motion.append({'frames':[a,b],'diagram_mean_rgb_delta':delta})
reference=np.asarray(Image.open(out/'frame-0030.jpg').convert('RGB'),dtype=float);stability=[]
for f,_ in representative:
 a=np.asarray(Image.open(out/f'frame-{f:04d}.jpg').convert('RGB'),dtype=float);header=float(np.abs(reference[:202]-a[:202]).mean());footer=float(np.abs(reference[1808:]-a[1808:]).mean());assert header<3 and footer<3,(f,header,footer);stability.append({'frame':f,'header_mean_delta':header,'footer_mean_delta':footer})
(root/'renders/review-frames.json').write_text(json.dumps({'video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'representative':representative,'all_exported_frames':selected,'transition_frames':transitions,'motion_evidence':motion,'persistent_branding':stability,'cover_frame':30,'review_labels':'Outside the film on this QA contact sheet only'},indent=2)+'\n');print('Exported',len(selected),'portrait MP4 frames and cover.')
