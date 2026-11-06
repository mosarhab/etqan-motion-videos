"""Extract representative and transition frames from the actual delivery MP4."""
import subprocess,pathlib,json
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[1]
out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
representative=[(35,'Earth'),(95,'Map approach'),(132,'Riyadh map'),(210,'Borehole'),(318,'Soil classification'),(393,'Both soil labels'),(419,'Both labels held'),(445,'Proctor lift'),(467,'Proctor contact'),(492,'Second Proctor stroke'),(512,'Proctor compacting'),(582,'Field density'),(688,'Soil resistance'),(795,'Slump'),(900,'Concrete temperature'),(1015,'Compression'),(1125,'Ultrasonic UPV'),(1200,'Concrete core'),(1300,'Asphalt composition'),(1425,'Marshall'),(1545,'Binder study'),(1625,'Foundation and road'),(1685,'Engineering connection'),(1710,'Closing handoff'),(1755,'Closing contacts'),(1799,'Final frame')]
transitions=[153,273,423,528,633,738,948,1068,1158,1248,1353,1473,1593,1698]
selected=sorted(set([f for f,_ in representative]+transitions+[0,333,1799]))
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
