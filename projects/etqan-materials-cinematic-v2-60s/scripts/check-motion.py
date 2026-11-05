"""Check visible change inside the rendered 3D scene area, away from fixed branding.
This supports the source/visual review; it is not a claim of physical simulation.
"""
import json,pathlib,subprocess
import numpy as np
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
pairs=[('Earth',30,90),('Riyadh map',135,195),('Borehole and sample',235,295),('Soil specimen',360,450),('Field density',500,560),('Soil resistivity',610,670),('Slump cone',720,780),('Temperature probe',810,870),('Compression',920,1000),('Ultrasonic',1040,1090),('Core extraction',1130,1180),('Asphalt formation',1220,1300),('Marshall',1340,1420),('Binder composition',1460,1540),('Materials together',1580,1630)]
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
