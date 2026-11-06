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
contacts=frames('crop=796:108:220:1780,scale=398:54:flags=area,format=gray',398,54)
creator=frames('crop=104:64:64:1820,format=gray',104,64)
result={}
for name,a,min_pixels in [('contacts',contacts,500),('creator_logo',creator,500)]:
 mae=np.abs(a.astype(np.int16)-a[0].astype(np.int16)).mean(axis=(1,2));bright=(a>150).sum(axis=(1,2))
 assert mae.max()<3,(name,float(mae.max()))
 assert int(bright.min())>min_pixels,(name,int(bright.min()))
 result[name]={'frames':len(a),'maximum_mean_absolute_difference_from_frame_zero_0_255':float(mae.max()),'minimum_bright_pixels':int(bright.min())}
# Every one of the four fixed number cells stays visibly present in every frame.
cells=[]
for y0,y1,x0,x1 in [(0,26,0,193),(0,26,205,398),(28,54,0,193),(28,54,205,398)]:
 minimum=int((contacts[:,y0:y1,x0:x1]>150).sum(axis=(1,2)).min());assert minimum>100;cells.append(minimum)
result['four_number_cells_minimum_bright_pixels']=cells
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
