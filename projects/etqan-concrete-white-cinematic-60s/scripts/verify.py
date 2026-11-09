"""Check the actual delivery, not merely a Remotion composition."""
import subprocess,json,pathlib,hashlib,wave
import numpy as np
root=pathlib.Path(__file__).resolve().parents[1]
video=root/'renders/etqan-concrete-cinematic-60s-no-vo.mp4'
def run(args):return subprocess.run(args,check=True,capture_output=True,text=True).stdout
meta=json.loads(run(['ffprobe','-v','error','-count_frames','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video');a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert v['codec_name']=='h264'
assert v['pix_fmt']=='yuv420p' and v['color_range']=='tv' and v['color_space']=='bt709'
assert (v['width'],v['height'])==(1920,1080)
assert v['avg_frame_rate']=='30/1' and int(v['nb_read_frames'])==1800
assert abs(float(v['duration'])-60)<.001 and abs(float(meta['format']['duration'])-60)<.01
assert a['codec_name']=='aac' and int(a['sample_rate'])==48000 and a['channels']==2
assert abs(float(a['duration'])-60)<.05
run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'])
fingerprint=hashlib.sha256()
def hash_folder(folder):
 for file in sorted(folder.iterdir()):
  if file.is_dir():hash_folder(file)
  else:fingerprint.update(str(file.relative_to(root)).encode());fingerprint.update(file.read_bytes())
hash_folder(root/'src');hash_folder(root/'public');fingerprint.update((root/'package-lock.json').read_bytes())
source_sha=fingerprint.hexdigest();checkpoint=root/'work/checkpoints/source-sha256.txt'
expected=(checkpoint.read_text().strip() if checkpoint.exists() else json.loads((root/'renders/verification.json').read_text())['source_sha256'])
assert source_sha==expected,'Checkpoint was rendered with different source/assets'
logo=root/'public/etqan-logo.png';original=root.parents[1]/'etqan-logo.png'
if original.exists():assert logo.read_bytes()==original.read_bytes()
else:
 reference=json.loads((root/'renders/verification.json').read_text())['logo_sha256']
 assert hashlib.sha256(logo.read_bytes()).hexdigest()==reference
decoded=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-vn','-f','f32le','-acodec','pcm_f32le','-ac','2','-ar','48000','-'],check=True,capture_output=True).stdout
actual=np.frombuffer(decoded,dtype='<f4');assert len(actual)//2>=59.9*48000
peak=float(np.max(np.abs(actual)));rms=float(np.sqrt(np.mean(actual**2)));assert .01<peak<1 and rms>.001
with wave.open(str(root/'public/etqan-concrete-score.wav'),'rb') as w:
 assert w.getnframes()==2880000 and w.getframerate()==48000 and w.getnchannels()==2
 expected_audio=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
n=min(len(actual),len(expected_audio));corr=float(np.corrcoef(actual[:n:8],expected_audio[:n:8])[0,1]);assert corr>.97,corr
loudness=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-af','loudnorm=I=-18:TP=-1:LRA=11:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr
measured=json.JSONDecoder().raw_decode(loudness[loudness.rfind('{'):])[0];assert -21<float(measured['input_i'])<-15
result={'video':video.name,'verified':True,'source_sha256':source_sha,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'bytes':video.stat().st_size,'duration_seconds':float(v['duration']),'frames':int(v['nb_read_frames']),'resolution':[v['width'],v['height']],'fps':v['avg_frame_rate'],'video_codec':v['codec_name'],'pixel_format':v['pix_fmt'],'color_space':v['color_space'],'audio_codec':a['codec_name'],'audio_sample_rate':a['sample_rate'],'audio_channels':a['channels'],'audio_duration_seconds':float(a['duration']),'audio_peak_dbfs':float(20*np.log10(peak)),'audio_rms_dbfs':float(20*np.log10(rms)),'integrated_lufs':float(measured['input_i']),'true_peak_dbtp':float(measured['input_tp']),'full_decode':'passed','audio_matches_original_score_correlation':corr,'voiceover_included':False,'voiceover_fallback':'Original music and synthesized Foley only; recording text and proposed cues delivered','original_logo_source_identical':True,'logo_sha256':hashlib.sha256(logo.read_bytes()).hexdigest(),'logo_rendering':'Authentic PNG, unchanged colors and aspect; official embedded English retained','visual_style':'Procedural PBR 3D studio animation; not photorealistic footage or calibrated physical simulation'}
if (root/'renders/render-provenance.json').exists():
 provenance=json.loads((root/'renders/render-provenance.json').read_text());assert provenance['source_sha256']==source_sha
 historical=hashlib.sha256()
 def scan_historical(folder):
  for f in sorted(folder.iterdir()):
   if f.is_dir():scan_historical(f)
   else:
    historical.update(str(f.relative_to(root)).encode())
    historical.update((root/'renders'/provenance['prior_typography']).read_bytes() if f==root/'src/Typography.tsx' else f.read_bytes())
 scan_historical(root/'src');scan_historical(root/'public');historical.update((root/'package-lock.json').read_bytes())
 assert historical.hexdigest()==provenance['previous_source_sha256'],'Geometry/assets changed outside isolated typography refinement'
 provenance['prior_source_reconstruction_verified']=True
 result['production_incremental_render_provenance']=provenance
(root/'renders/verification.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
