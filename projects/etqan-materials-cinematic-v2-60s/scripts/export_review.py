"""Extract representative and transition frames from the actual delivery MP4."""
import subprocess,pathlib,json
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(45,'Earth'),(102,'Saudi approach'),(160,'Riyadh map'),(205,'Map endpoint'),(255,'Bore drilling'),(292,'Sample extraction'),(365,'Soil classification'),(445,'Gradation'),(535,'Field density'),(635,'Resistivity'),(730,'Slump lift'),(780,'Slump settling'),(850,'Concrete temperature'),(970,'Compression'),(1075,'Ultrasonic UPV'),(1165,'Concrete core'),(1280,'Asphalt composition'),(1400,'Marshall'),(1520,'Binder study'),(1610,'Materials together'),(1665,'Closing handoff'),(1725,'Closing contacts'),(1785,'Final frame area')]
transitions=[213,333,483,588,693,903,1023,1113,1203,1323,1443,1563,1653]
selected=sorted(set([f for f,_ in representative]+transitions+[0,1799]))
filt='select='+'+'.join(f'eq(n\\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/etqan-cinematic-3d-60s.mp4'),'-vf',filt,'-vsync','0','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=270,512,4;rows=(len(representative)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*h),'#071426');draw=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
for i,(f,name) in enumerate(representative):
 x=(i%cols)*w;y=(i//cols)*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));draw.text((x+7,y+487),f'{f/30:.2f}s - {name}',font=font,fill='#e8e6da')
sheet.save(root/'renders/scene-review.jpg',quality=94)
(root/'renders/review-frames.json').write_text(json.dumps({'representative':representative,'transition_frames':transitions,'all_exported_frames':selected},indent=2)+'\n')
print('Exported',len(selected),'frames from the delivery MP4')
