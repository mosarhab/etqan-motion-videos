"""Check visible change inside the rendered 3D scene area, away from fixed branding.
This supports the source/visual review; it is not a claim of physical simulation.
"""
import json,pathlib,subprocess
import numpy as np
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
pairs=[('Earth',20,50),('Riyadh map',90,140),('Borehole and sample',170,250),('Soil specimen',305,405),('Proctor rammer',444,465),('Field density',545,605),('Soil resistance',650,710),('Slump cone',765,825),('Temperature probe',855,925),('Compression',970,1040),('Ultrasonic',1085,1145),('Core extraction',1170,1230),('Asphalt formation',1270,1330),('Marshall',1370,1450),('Binder composition',1490,1570),('Materials together',1600,1640)]
frames=sorted({f for _,a,b in pairs for f in (a,b)})
out=root/'work/motion-check';out.mkdir(parents=True,exist_ok=True)
filt='select='+'+'.join(f'eq(n\\,{f})' for f in frames)
subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/etqan-cinematic-3d-60s.mp4'),'-vf',filt,'-vsync','0','-q:v','2','-y',str(out/'image-%03d.jpg')],check=True)
images={f:np.asarray(Image.open(out/f'image-{i:03d}.jpg').crop((100,650,980,1550)),dtype=np.float32) for i,f in enumerate(frames,1)}
result=[]
for name,a,b in pairs:
 mae=float(np.mean(np.abs(images[a]-images[b])))
 assert mae>.1,(name,mae)
 result.append({'shot':name,'frames':[a,b],'scene_area_mean_absolute_difference_0_255':round(mae,4)})
(root/'renders/motion-check.json').write_text(json.dumps({'passed':True,'note':'Visible change in the scene area; exclude fixed logo, header and contact footer. Read with source and manual frame review.','shots':result},indent=2)+'\n')
print('Visible scene-area motion checked in',len(pairs),'shot intervals')
