"""Export full portrait frames and compare fixed branding throughout the delivery."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,subprocess,hashlib
root=Path(__file__).resolve().parents[1];video=root/'renders/etqan-series-geotechnical-60s.mp4';out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(0,'First frame'),(90,'Episode title and rig'),(210,'Single upright mast'),(330,'Drilling begins'),(510,'Soil investigation'),(660,'Sample withdrawal'),(780,'Preserved soil sample'),(855,'Sealed sample'),(960,'Laboratory sieves'),(1080,'Gradation and classification'),(1200,'Selected lab tests'),(1320,'Integrated report'),(1455,'Foundation recommendations'),(1620,'Series identity'),(1710,'Contact and creator'),(1799,'Final frame')]
transitions=[f for t in [8,24,30,42,52] for f in [round(t*30)-1,round(t*30)+9,round(t*30)+19]]
pairs=[(45,75),(330,390),(510,570),(660,700),(750,780),(960,990),(1020,1050),(1275,1290),(1650,1680)]
selected=sorted(set([f for f,_ in representative]+transitions+[f for p in pairs for f in p]))
filt='select='+'+'.join(rf'eq(n\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-fps_mode','vfr','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=270,506,4;rows=(len(representative)+cols-1)//cols;sheet=Image.new('RGB',(cols*w,rows*h),'#071b2c');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
for i,(f,label) in enumerate(representative):
 x=i%cols*w;y=i//cols*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));d.text((x+7,y+486),f'{f/30:.2f}s {label}',font=font,fill='white')
sheet.save(root/'renders/scene-review.jpg',quality=94)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',r'select=eq(n\,90)','-frames:v','1','-y',str(root/'renders/etqan-series-geotechnical-cover.png')],check=True)
motion=[]
for a,b in pairs:
 x=np.asarray(Image.open(out/f'frame-{a:04d}.jpg').crop((70,680,1010,1440)),dtype=float);y=np.asarray(Image.open(out/f'frame-{b:04d}.jpg').crop((70,680,1010,1440)),dtype=float);delta=float(np.abs(x-y).mean());assert delta>.005,(a,b,delta);motion.append({'frames':[a,b],'diagram_mean_rgb_delta':delta})
reference=np.asarray(Image.open(out/'frame-0075.jpg').convert('RGB'),dtype=float);stability=[]
for f,_ in representative:
 a=np.asarray(Image.open(out/f'frame-{f:04d}.jpg').convert('RGB'),dtype=float);header=float(np.abs(reference[:202]-a[:202]).mean());footer=float(np.abs(reference[1808:]-a[1808:]).mean());assert header<3 and footer<3,(f,header,footer);stability.append({'frame':f,'header_mean_delta':header,'footer_mean_delta':footer})
(root/'renders/review-frames.json').write_text(json.dumps({'video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'representative':representative,'all_exported_frames':selected,'transition_frames':transitions,'motion_evidence':motion,'persistent_branding':stability,'cover_frame':90,'review_labels':'Outside the film on this QA contact sheet only'},indent=2)+'\n');print('Exported',len(selected),'portrait MP4 frames and cover.')
