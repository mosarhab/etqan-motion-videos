"""Check the corrected footer and creator mark through every encoded frame."""
import pathlib,subprocess,json,hashlib
import numpy as np
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1];video=root/'renders/etqan-cinematic-3d-60s.mp4'
provenance=json.loads((root/'renders/composite-provenance.json').read_text());base=root/provenance['base_video_relative']
assert hashlib.sha256(base.read_bytes()).hexdigest()==provenance['base_video_sha256']
def frames(filt,w,h):
 raw=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vf',filt,'-f','rawvideo','-pix_fmt','gray','-'],check=True,capture_output=True).stdout
 out=np.frombuffer(raw,dtype=np.uint8).reshape((-1,h,w));assert len(out)==1800;return out
contacts=frames('crop=904:76:88:1770,scale=452:38:flags=area,format=gray',452,38)
creator=frames('crop=46:30:40:1870,format=gray',46,30)
result={}
for name,a,min_pixels,threshold in [('contacts',contacts,500,180),('creator_logo',creator,120,70)]:
 mae=np.abs(a.astype(np.int16)-a[0].astype(np.int16)).mean(axis=(1,2));bright=(a>threshold).sum(axis=(1,2))
 assert mae.max()<4,(name,float(mae.max()))
 assert int(bright.min())>min_pixels,(name,int(bright.min()))
 result[name]={'frames':len(a),'maximum_mean_absolute_difference_from_frame_zero_0_255':float(mae.max()),'minimum_bright_pixels':int(bright.min())}
# Email, address and single-number sections remain present through the whole file.
cells=[]
for x0,x1 in [(0,150),(150,300),(300,452)]:
 minimum=int((contacts[:,:,x0:x1]>180).sum(axis=(1,2)).min());assert minimum>100;cells.append(minimum)
result['three_contact_sections_minimum_white_pixels']=cells
source=(root/'src/BrandMark.tsx').read_text()
assert provenance['numbers']==['0535588975']
assert all(number not in source for number in ['0575828265','0573870072','0551603205'])
result['extra_numbers_removed']=True
# Genuine transparent cutout: RGB is white throughout the active creator pixels.
logo=np.asarray(Image.open(root/'renders/ms-logo-white-transparent.png').convert('RGBA'))
assert (logo[:,:,3]==0).any() and not logo[0,:,3].any()
assert int(logo[:,:,:3][logo[:,:,3]>200].min())>=254
result['creator_white_cutout_transparent']=True
# The encoded AAC packet payload is preserved exactly, avoiding an audio generation loss.
def audio_hash(file):
 return subprocess.run(['ffmpeg','-v','error','-i',str(file),'-map','0:a:0','-c:a','copy','-f','hash','-hash','sha256','-'],capture_output=True,text=True,check=True).stdout.strip()
assert audio_hash(video)==audio_hash(base)
result['audio_packet_payload_identical_to_base']=True
# Compare representative actual video pictures above the replacement area.
errors=[]
for file in sorted((root/'renders/qa-frames').glob('frame-*.jpg')):
 original=base.parent/'qa-frames'/file.name
 if original.exists():
  a=np.asarray(Image.open(file).crop((0,0,1080,1680)),dtype=np.float32)
  b=np.asarray(Image.open(original).crop((0,0,1080,1680)),dtype=np.float32)
  errors.append(float(np.mean(np.abs(a-b))))
assert len(errors)>=20 and max(errors)<4,(len(errors),max(errors))
result['picture_above_footer']={'frames_compared':len(errors),'maximum_mean_absolute_difference_0_255':max(errors),'average_mean_absolute_difference_0_255':float(np.mean(errors))}
result['numbers']=provenance['numbers'];result['passed']=True
(root/'renders/footer-check.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
