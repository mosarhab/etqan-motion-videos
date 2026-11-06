"""Verify the delivery encode and preserve machine-readable evidence."""
import subprocess,json,pathlib,hashlib,wave
import numpy as np
root=pathlib.Path(__file__).resolve().parents[1]
video=root/'renders/etqan-cinematic-3d-60s.mp4'
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True).stdout
meta=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video');a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264'
assert v['pix_fmt']=='yuv420p' and v['color_range']=='tv' and v['color_space']=='bt709'
assert (v['width'],v['height'])==(1080,1920)
assert v['avg_frame_rate']=='30/1'
assert int(v['nb_read_frames'])==1800
assert abs(float(v['duration'])-60)<.001
assert abs(float(meta['format']['duration'])-60)<.01
assert a['codec_name']=='aac' and int(a['sample_rate'])==48000 and a['channels']==2
assert abs(float(a['duration'])-60)<.05
run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'])
fingerprint=hashlib.sha256()
def hash_folder(folder):
 for file in sorted(folder.iterdir()):
  if file.is_dir():hash_folder(file)
  else:
   fingerprint.update(str(file.relative_to(root)).encode())
   fingerprint.update(file.read_bytes())
hash_folder(root/'src');hash_folder(root/'public');fingerprint.update((root/'package-lock.json').read_bytes())
source_sha=fingerprint.hexdigest()
checkpoint=root/'work/checkpoints/source-sha256.txt'
if (root/'renders/composite-provenance.json').exists():expected_source_sha=json.loads((root/'renders/composite-provenance.json').read_text())['source_sha256']
elif checkpoint.exists():expected_source_sha=checkpoint.read_text().strip()
else:expected_source_sha=json.loads((root/'renders/verification.json').read_text())['source_sha256']
assert source_sha==expected_source_sha
logo=root/'public/etqan-logo.png'; original=root.parents[1]/'etqan-logo.png'
assert logo.read_bytes()==original.read_bytes()
decoded=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vn','-f','f32le','-acodec','pcm_f32le','-ac','2','-ar','48000','-'],check=True,capture_output=True).stdout
actual=np.frombuffer(decoded,dtype='<f4')
assert len(actual)//2 >= 59.9*48000
peak=float(np.max(np.abs(actual)));rms=float(np.sqrt(np.mean(actual**2)))
assert .01<peak<1 and rms>.001
with wave.open(str(root/'public/etqan-original-score.wav'),'rb') as w: expected=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
n=min(len(actual),len(expected)); correlation=float(np.corrcoef(actual[:n:8],expected[:n:8])[0,1])
assert correlation>.97, correlation
result={'video':str(video.name),'verified':True,'source_sha256':source_sha,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'bytes':video.stat().st_size,'duration_seconds':float(v['duration']),'frames':int(v['nb_read_frames']),'resolution':[v['width'],v['height']],'fps':v['avg_frame_rate'],'video_codec':v['codec_name'],'pixel_format':v['pix_fmt'],'audio_codec':a['codec_name'],'audio_sample_rate':a['sample_rate'],'audio_channels':a['channels'],'audio_duration_seconds':float(a['duration']),'audio_peak_dbfs':float(20*np.log10(peak)),'audio_rms_dbfs':float(20*np.log10(rms)),'full_decode':'passed','audio_matches_original_score_correlation':correlation,'original_logo_source_identical':True,'logo_rendering':'User-authorized white lettering with original gold, no background panel','location':'Animated Earth to Riyadh city; Al Qadisiyah address supplied by user. City marker only; exact laboratory pin not independently verified.','visual_style':'Procedural cinematic 3D; stylized, not photorealistic footage'}
(root/'renders/verification.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
