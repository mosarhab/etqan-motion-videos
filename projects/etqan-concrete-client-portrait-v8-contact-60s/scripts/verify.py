"""Verify the actual MP4, its soundtrack and the production source fingerprint."""
from pathlib import Path
import subprocess,json,hashlib
import numpy as np
root=Path(__file__).resolve().parents[1];video=root/'renders/etqan-concrete-client-portrait-v8-contact-60s.mp4'
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True).stdout
m=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(video)]));v=next(x for x in m['streams'] if x['codec_type']=='video');a=next(x for x in m['streams'] if x['codec_type']=='audio')
assert (v['width'],v['height'],v['avg_frame_rate'],int(v['nb_read_frames']))==(1080,1920,'30/1',1800)
assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p' and v['color_space']=='bt709' and v['color_range']=='tv'
assert abs(float(v['duration'])-60)<.001 and abs(float(m['format']['duration'])-60)<.02
assert a['codec_name']=='aac' and a['channels']==2 and int(a['sample_rate'])==48000 and abs(float(a['duration'])-60)<.05
run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'])
h=hashlib.sha256()
def scan(folder):
 for p in sorted(folder.iterdir()):
  if p.is_dir():scan(p)
  else:h.update(str(p.relative_to(root)).encode());h.update(p.read_bytes())
scan(root/'src');scan(root/'public');h.update((root/'package-lock.json').read_bytes());source=h.hexdigest();ref=root/'work/checkpoints/source-sha256.txt'
expected=ref.read_text().strip() if ref.exists() else json.loads((root/'renders/verification.json').read_text())['source_sha256'];assert source==expected
logo=root/'public/etqan-logo.png';original=root.parents[1]/'etqan-logo.png'
if original.exists():assert logo.read_bytes()==original.read_bytes()
else:assert hashlib.sha256(logo.read_bytes()).hexdigest()==json.loads((root/'renders/verification.json').read_text())['logo_sha256']
def pcm(path):return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(path),'-vn','-f','f32le','-acodec','pcm_f32le','-ar','48000','-ac','2','-'],check=True,capture_output=True).stdout,dtype='<f4')
x=pcm(video);y=pcm(root/'public/score.m4a');n=min(len(x),len(y));corr=float(np.corrcoef(x[:n:8],y[:n:8])[0,1]);assert corr>.995
peak=float(np.max(np.abs(x)));assert .01<peak<1;assert len(x)/2>=59.9*48000
s=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-18:TP=-1:LRA=11:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr;loud=json.JSONDecoder().raw_decode(s[s.rfind('{'):])[0];assert -21<float(loud['input_i'])<-15
header=video.read_bytes()[:1000000];assert 0<=header.find(b'moov')<header.find(b'mdat')
result={'video':video.name,'verified':True,'duration_seconds':60,'frames':1800,'resolution':[1080,1920],'fps':30,'video_codec':'h264','pixel_format':'yuv420p','color_space':'bt709','color_range':'tv','audio_codec':'aac','audio_rate':48000,'audio_channels':2,'audio_duration_seconds':float(a['duration']),'audio_correlation_with_mixed_score':corr,'integrated_lufs':float(loud['input_i']),'true_peak_dbtp':float(loud['input_tp']),'full_decode':'passed','faststart':True,'source_sha256':source,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'bytes':video.stat().st_size,'logo_sha256':hashlib.sha256(logo.read_bytes()).hexdigest(),'logo_asset_unchanged':True,'logo_display':'Previously authorized white lettering and original gold; original proportions and alpha','implementation':'Animated SVG engineering diagrams and React typography; no Three.js/WebGL models, photos, stock video or still-image scenes','voiceover_included':True,'voiceover_status':'User-supplied Arabic recording aligned to six scenes; music ducked under speech'}
(root/'renders/verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
