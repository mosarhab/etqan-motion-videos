"""Export full portrait frames and compare fixed branding throughout the delivery."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
import numpy as np,json,subprocess,hashlib
root=Path(__file__).resolve().parents[1];video=root/'renders/etqan-series-geotechnical-v6-100s.mp4';out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(0,'Vacant site opening'),(15,'Boundary starts'),(30,'Site perimeter'),(45,'Perspective change'),(60,'Soil layers revealed'),(75,'Cutaway continues'),(90,'Full soil section'),(105,'Terrain handoff'),(120,'Rig reveal'),(135,'Approved rig and title'),(150,'Drilling begins'),(180,'Continuous drilling'),(225,'Title handoff'),(240,'Site investigation'),(450,'Sedimentary igneous metamorphic'),(690,'Mounted detail reveal'),(750,'Mounted guided hammer'),(780,'Hammer lift'),(789,'Hammer contacts anvil'),(870,'SPT drive at borehole base'),(960,'Sampler withdrawal'),(1020,'Sampler clears soil'),(1032,'Transfer begins'),(1050,'Recovered sample transfer'),(1080,'Container transition'),(1170,'Sample preservation'),(1290,'Laboratory transition'),(1380,'Natural water content'),(1470,'Drying'),(1515,'Reweighing dried sample'),(1590,'Grading preparation'),(1740,'Soil grading and classification'),(1890,'Liquid limit cup'),(2010,'Local groove closure'),(2160,'Rock core platen approach'),(2247,'Rock core under load'),(2280,'Rock core cracking'),(2400,'Chemical extract preparation'),(2490,'Acidity probe submerged'),(2520,'Chemical tests and durability'),(2640,'Field and laboratory integration'),(2760,'Geotechnical recommendations'),(2910,'Brand and contact'),(2999,'Final frame')]
transitions=[f for t in [12,22,43,51,60,69,78,86,94] for f in [round(t*30)-1,round(t*30)+9,round(t*30)+19]]
pairs=[(0,15),(15,30),(30,60),(60,90),(90,120),(120,135),(135,180),(180,240),(390,420),(720,738),(840,852),(960,1020),(1050,1110),(1170,1200),(1320,1380),(1392,1416),(1605,1680),(1900,1908),(2160,2250),(2400,2460),(2640,2690),(2910,2940)]
selected=sorted(set([f for f,_ in representative]+transitions+[f for p in pairs for f in p]))
filt='select='+'+'.join(rf'eq(n\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-fps_mode','vfr','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=270,506,4;rows=(len(representative)+cols-1)//cols;sheet=Image.new('RGB',(cols*w,rows*h),'#071b2c');d=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',12)
for i,(f,label) in enumerate(representative):
 x=i%cols*w;y=i//cols*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));d.text((x+7,y+486),f'{f/30:.2f}s {label}',font=font,fill='white')
sheet.save(root/'renders/scene-review.jpg',quality=94)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',r'select=eq(n\,750)','-frames:v','1','-y',str(root/'renders/etqan-series-geotechnical-v6-cover.png')],check=True)
motion=[]
for a,b in pairs:
 x=np.asarray(Image.open(out/f'frame-{a:04d}.jpg').crop((70,680,1010,1440)),dtype=float);y=np.asarray(Image.open(out/f'frame-{b:04d}.jpg').crop((70,680,1010,1440)),dtype=float);delta=float(np.abs(x-y).mean());assert delta>.005,(a,b,delta);motion.append({'frames':[a,b],'diagram_mean_rgb_delta':delta})
reference=np.asarray(Image.open(out/'frame-0030.jpg').convert('RGB'),dtype=float);stability=[]
for f,_ in representative:
 a=np.asarray(Image.open(out/f'frame-{f:04d}.jpg').convert('RGB'),dtype=float);header=float(np.abs(reference[:202]-a[:202]).mean());footer=float(np.abs(reference[1808:]-a[1808:]).mean());assert header<3 and footer<3,(f,header,footer);stability.append({'frame':f,'header_mean_delta':header,'footer_mean_delta':footer})
(root/'renders/review-frames.json').write_text(json.dumps({'video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'representative':representative,'all_exported_frames':selected,'transition_frames':transitions,'motion_evidence':motion,'persistent_branding':stability,'cover_frame':750,'review_labels':'Outside the film on this QA contact sheet only'},indent=2)+'\n');print('Exported',len(selected),'portrait MP4 frames and cover.')
