"""Extract exact representative and transition frames from the encoded delivery."""
import subprocess,pathlib
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
frames=[120,390,640,900,1215,1485,1640,1760]
transitions=[247,547,757,1057,1357,1597,1717]
selected=sorted(frames+transitions)
filt='select='+ '+'.join(f'eq(n\\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/etqan-cinematic-3d-60s.mp4'),'-vf',filt,'-vsync','0','-q:v','2','-y',str(out/'selected-%02d.jpg')],check=True)
for i,f in enumerate(selected,1):
    (out/f'selected-{i:02d}.jpg').replace(out/f'frame-{f:04d}.jpg')
sheet=Image.new('RGB',(1080,1024),'#07111e');draw=ImageDraw.Draw(sheet)
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
labels=['Earth','Riyadh city','Laboratory','Soil extraction','Concrete compression','Asphalt testing','Confidence montage','Brand closing']
for i,(f,label) in enumerate(zip(frames,labels)):
    x=(i%4)*270;y=(i//4)*512
    im=Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS)
    sheet.paste(im,(x,y));draw.text((x+8,y+486),f'{f/30:.2f}s · {label}',font=font,fill='#e0e9eb')
sheet.save(root/'renders/scene-review.jpg',quality=95)
print('Extracted',len(frames+transitions),'verified delivery frames')
