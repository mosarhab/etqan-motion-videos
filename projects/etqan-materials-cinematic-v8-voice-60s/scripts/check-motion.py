"""Check visible change inside the rendered 3D scene area, away from fixed branding.
This supports the source/visual review; it is not a claim of physical simulation.
"""
import json,pathlib,subprocess
import numpy as np
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
shots=json.loads((root/'src/voice-timeline.json').read_text())['scenes']
def at(k,q):return shots[k]['startFrame']+round(shots[k]['durationFrames']*q)
pairs=[('Earth',30,78),('Riyadh map',138,207)]+[(k,at(k,.20),at(k,.76)) for k in ['borehole','soil','proctor','density','resistance','compression','ultrasonic','core','asphalt','marshall','binder','overview']]+[('Slump',880,930),('Temperature',960,1006)]
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
