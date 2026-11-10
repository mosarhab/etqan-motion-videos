"""Export full portrait frames and compare fixed branding throughout the delivery."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,subprocess
root=Path(__file__).resolve().parents[1];video=root/'renders/etqan-concrete-client-portrait-v6-voice-60s.mp4';out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(0,'First frame'),(75,'Revised opening'),(210,'Slump and temperature'),(330,'Lift and probe'),(525,'Cone smoothly removed'),(630,'Cylindrical moulds'),(720,'Sample preparation'),(840,'Rodding'),(915,'New sample copy'),(990,'Curing follows preparation'),(1080,'Immersion'),(1098,'One day'),(1104,'Two days'),(1110,'Three days'),(1170,'Age advances'),(1230,'28 days example'),(1260,'Age endpoint held'),(1200,'Curing before strength'),(1320,'Compression'),(1410,'Loading'),(1530,'Progressive cracks'),(1710,'Closing'),(1799,'Final held frame')]
transitions=[f for t in [6,20,32,43,55] for f in [round(t*30)-1,round(t*30)+9,round(t*30)+19]]
pairs=[(75,90),(300,315),(315,330),(495,525),(690,705),(825,837),(1020,1035),(1380,1395),(1510,1530)]
selected=sorted(set([f for f,_ in representative]+transitions+[f for p in pairs for f in p]))
filt='select='+'+'.join(rf'eq(n\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-fps_mode','vfr','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=270,506,4;rows=(len(representative)+cols-1)//cols;sheet=Image.new('RGB',(cols*w,rows*h),'#071b2c');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
for i,(f,label) in enumerate(representative):
 x=i%cols*w;y=i//cols*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));d.text((x+7,y+486),f'{f/30:.2f}s {label}',font=font,fill='white')
sheet.save(root/'renders/scene-review.jpg',quality=94)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',r'select=eq(n\,1710)','-frames:v','1','-y',str(root/'renders/etqan-concrete-portrait-v6-voice-cover.png')],check=True)
motion=[]
for a,b in pairs:
 x=np.asarray(Image.open(out/f'frame-{a:04d}.jpg').crop((70,680,1010,1440)),dtype=float);y=np.asarray(Image.open(out/f'frame-{b:04d}.jpg').crop((70,680,1010,1440)),dtype=float);delta=float(np.abs(x-y).mean());assert delta>.005,(a,b,delta);motion.append({'frames':[a,b],'diagram_mean_rgb_delta':delta})
reference=np.asarray(Image.open(out/'frame-0075.jpg').convert('RGB'),dtype=float);stability=[]
for f,_ in representative:
 a=np.asarray(Image.open(out/f'frame-{f:04d}.jpg').convert('RGB'),dtype=float);header=float(np.abs(reference[:202]-a[:202]).mean());footer=float(np.abs(reference[1808:]-a[1808:]).mean());assert header<3 and footer<3,(f,header,footer);stability.append({'frame':f,'header_mean_delta':header,'footer_mean_delta':footer})
(root/'renders/review-frames.json').write_text(json.dumps({'representative':representative,'all_exported_frames':selected,'transition_frames':transitions,'motion_evidence':motion,'persistent_branding':stability,'cover_frame':1710,'review_labels':'Outside the film on this QA contact sheet only'},indent=2)+'\n');print('Exported',len(selected),'portrait MP4 frames and cover.')
