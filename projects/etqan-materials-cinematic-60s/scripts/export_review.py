"""Review frames come from the final MP4, never from concept illustrations."""
import subprocess,pathlib
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
frames=[45,195,345,495,675,825,1020,1155,1350,1500,1635,1760]
transitions=[97,277,427,577,757,907,1057,1237,1387,1537,1717]
selected=sorted(frames+transitions)
filt='select='+ '+'.join(f'eq(n\\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/etqan-materials-cinematic-60s.mp4'),'-vf',filt,'-vsync','0','-q:v','2','-y',str(out/'selected-%02d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:02d}.jpg').replace(out/f'frame-{f:04d}.jpg')
s=Image.new('RGB',(1080,1536),'#071426');draw=ImageDraw.Draw(s);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',17)
names=['Riyadh','Soil formation','Field density','Resistivity','Compression','Ultrasonic UPV','Concrete core','Asphalt formation','Marshall','Binder study','Materials together','ETQAN closing']
for i,(f,name) in enumerate(zip(frames,names)):
 x=(i%4)*270;y=(i//4)*512;s.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));draw.text((x+9,y+487),f'{f/30:.1f}s - {name}',font=font,fill='#e8e6da')
s.save(root/'renders/scene-review.jpg',quality=95)
print('Exported',len(selected),'frames from the delivery MP4')
