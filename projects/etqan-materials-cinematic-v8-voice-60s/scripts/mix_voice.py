"""Deterministic sample-counted stereo mix, with a speech-driven music envelope."""
from pathlib import Path
import subprocess,json,hashlib,wave,math
import numpy as np
root=Path(__file__).resolve().parents[1]
voice=root/'work/voice-fitted.wav';music=root/'public/etqan-original-score.wav';out=root/'public/etqan-voice-mix.wav'
def read(p):
 with wave.open(str(p),'rb') as f:
  assert f.getframerate()==48000 and f.getsampwidth()==2
  channels=f.getnchannels();n=f.getnframes();x=np.frombuffer(f.readframes(n),dtype='<i2').astype(np.float64)/32768
  assert n==2880000,(p,n)
  return x.reshape(n,channels)
v=read(voice)[:,0];m=read(music);block=480
rms=np.sqrt((v.reshape(-1,block)**2).mean(axis=1))
activity=np.clip((rms-.006)/(.035-.006),0,1);activity=activity*activity*(3-2*activity)
env=[];state=0
for value in activity:
 c=math.exp(-.01/(.015 if value>state else .250));state=c*state+(1-c)*value;env.append(state)
curve=np.interp(np.arange(len(v)),np.arange(len(env))*block+block/2,env)
gain=.20*(1-.40*curve)
mix=m*gain[:,None]+v[:,None]/math.sqrt(2)
peak=float(np.max(np.abs(mix)));safety_gain=min(1,.84/peak);mix*=safety_gain
with wave.open(str(out),'wb') as f:
 f.setnchannels(2);f.setsampwidth(2);f.setframerate(48000);f.writeframes((mix*32767).astype('<i2').tobytes())
log=subprocess.run(['ffmpeg','-hide_banner','-i',str(out),'-af','loudnorm=I=-17:TP=-1.5:LRA=9:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr
measure=json.loads(log[log.rfind('{'):log.rfind('}')+1])
evidence={'mix_sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'voice_normalization_lufs_target':-17,'music_gain_range':[float(gain.min()),float(gain.max())],'ducking':{'rms_window_ms':10,'rms_lower':.006,'rms_upper':.035,'attack_ms':15,'release_ms':250},'safety_peak_ceiling':.84,'safety_gain_applied':safety_gain,'duration_seconds':60,'sample_count_per_channel':len(v),'channels':2,'sample_rate':48000,'measured_mix':measure,'note':'User narration is constant-power panned to stereo. Music ducks smoothly below speech. Quiet pause centers shortened and pitch-preserving tempo fitting retain every spoken phrase. All processing stays local.'}
(root/'renders/audio-mix.json').write_text(json.dumps(evidence,indent=2)+'\n');print(json.dumps(evidence,indent=2))
