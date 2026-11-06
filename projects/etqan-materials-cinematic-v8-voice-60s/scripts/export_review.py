"""Export actual delivery frames using the narration-aligned source timeline."""
import subprocess,pathlib,json
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[1];out=root/'renders/qa-frames';out.mkdir(exist_ok=True)
scenes=json.loads((root/'src/voice-timeline.json').read_text())['scenes']
def at(k,q):return scenes[k]['startFrame']+round(scenes[k]['durationFrames']*q)
reference=at('soil',.30);both=at('soil',.70);held=scenes['soil']['startFrame']+scenes['soil']['durationFrames']-1
representative=[(48,'Earth'),(138,'Map approach'),(190,'Riyadh map'),(at('borehole',.55),'Borehole'),(at('soil',.16),'Classification'),(both,'Both soil labels'),(held,'Both labels held'),(at('proctor',.23),'Proctor lift'),(at('proctor',1.25/3.5),'Proctor contact'),(at('proctor',2.5/3.5),'Second contact'),(at('density',.6),'Field density'),(at('resistance',.6),'Soil resistance'),(919,'Slump'),(982,'Temperature'),(at('compression',.65),'Compression'),(at('ultrasonic',.60),'Ultrasonic'),(at('core',.58),'Concrete core'),(at('asphalt',.6),'Asphalt formation'),(at('marshall',.6),'Marshall'),(at('binder',.6),'Binder'),(at('overview',.4),'Foundation and road'),(at('overview',.87),'Engineering connection'),(at('closing',.25),'Brand closing'),(at('closing',.7),'Closing contacts'),(1799,'Final frame')]
transitions=[v['startFrame']+3 for k,v in scenes.items() if k!='opening']
selected=sorted(set([f for f,_ in representative]+transitions+[0,reference,both,held,1799]))
filt='select='+'+'.join(f'eq(n\\,{f})' for f in selected)
subprocess.run(['ffmpeg','-v','error','-i',str(root/'renders/etqan-cinematic-3d-60s.mp4'),'-vf',filt,'-vsync','0','-q:v','2','-y',str(out/'selected-%03d.jpg')],check=True)
for i,f in enumerate(selected,1):(out/f'selected-{i:03d}.jpg').replace(out/f'frame-{f:04d}.jpg')
w,h,cols=270,512,4;rows=(len(representative)+cols-1)//cols
sheet=Image.new('RGB',(cols*w,rows*h),'#071426');draw=ImageDraw.Draw(sheet);font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',15)
for i,(f,name) in enumerate(representative):
 x=(i%cols)*w;y=(i//cols)*h;sheet.paste(Image.open(out/f'frame-{f:04d}.jpg').resize((270,480),Image.Resampling.LANCZOS),(x,y));draw.text((x+7,y+487),f'{f/30:.2f}s - {name}',font=font,fill='#e8e6da')
sheet.save(root/'renders/scene-review.jpg',quality=94)
(root/'renders/review-frames.json').write_text(json.dumps({'representative':representative,'transition_frames':transitions,'all_exported_frames':selected,'soil_label_frames':{'reference':reference,'checked':[both,held]}},indent=2)+'\n');print('Exported',len(selected),'frames from the delivery MP4')
