"""Review actual encoded frames and derive the cover from the final video."""
import subprocess,pathlib,json
import numpy as np
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[1];out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
video=root/'renders/etqan-concrete-cinematic-60s-no-vo.mp4'
representative=[(0,'Opening'),(45,'Macro hook'),(165,'Pour'),(225,'Cone'),(315,'Vertical lift'),(405,'Settle'),(465,'Overhead slump'),(525,'Moulds'),(615,'Fill'),(735,'Screed'),(825,'Lower rack'),(885,'Day agreement'),(945,'Water curing'),(1020,'Qualifier clearance'),(1071,'28-day qualifier'),(1170,'Compression frame'),(1290,'Load contact'),(1368,'Before fracture'),(1395,'Cracking'),(1455,'Restrained fracture'),(1560,'Pullback'),(1620,'Brand reveal'),(1755,'Closing'),(1799,'Last frame')]
transitions=[f for t in [4.5,7,17,27,37,50,53] for f in [round(t*30)-3,round(t*30)+3]]
# Paired frames deliberately sampled in the 3D area, away from bottom title animations.
motion_pairs=[(30,42),(155,167),(300,312),(405,417),(600,612),(720,732),(835,847),(940,952),(1180,1192),(1280,1292),(1380,1392),(1450,1462),(1590,1602),(1750,1762)]
boundary_checks=[f for boundary in [120,300,600,900,1380,1620] for f in [boundary-1,boundary]]
selected=sorted(set([f for f,_ in representative]+transitions+boundary_checks+[f for pair in motion_pairs for f in pair]))
filt='select='+'+'.join(rf'eq(n\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-fps_mode','vfr','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=480,296,3;rows=(len(representative)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*h),'#102038');draw=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
for i,(f,name) in enumerate(representative):
 x=i%cols*w;y=i//cols*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((480,270),Image.Resampling.LANCZOS),(x,y));draw.text((x+9,y+275),f'{f/30:.2f}s  {name}',font=font,fill='#ffffff')
sheet.save(root/'renders/scene-review.jpg',quality=94)
subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',r'select=eq(n\,1674)','-frames:v','1','-y',str(root/'renders/etqan-concrete-cover.png')],check=True)
motion=[]
for a,b in motion_pairs:
 x=np.asarray(Image.open(out/f'frame-{a:04d}.jpg').crop((160,170,1310,850)).resize((575,340)),dtype=float)
 y=np.asarray(Image.open(out/f'frame-{b:04d}.jpg').crop((160,170,1310,850)).resize((575,340)),dtype=float)
 delta=float(np.mean(np.abs(x-y)));motion.append({'frames':[a,b],'mean_pixel_delta':delta,'changed':delta>.03})
assert all(item['changed'] for item in motion),'A sampled 3D section is frozen'
(root/'renders/review-frames.json').write_text(json.dumps({'representative':representative,'transition_frames':transitions,'all_exported_frames':selected,'cover_frame':1674,'checkpoint_boundary_frames':boundary_checks,'motion_evidence':motion,'note':'Frame differences support motion; actual camera and mesh animation also reviewed in source. No film annotations added.'},indent=2)+'\n');print('Exported',len(selected),'actual MP4 frames and cover')
