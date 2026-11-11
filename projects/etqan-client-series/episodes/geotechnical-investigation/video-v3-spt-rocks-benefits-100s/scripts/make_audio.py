"""Original restrained electronic score and synthesized Foley; no external samples."""
from pathlib import Path
import numpy as np,wave,subprocess,json
root=Path(__file__).resolve().parents[1];(root/'work').mkdir(exist_ok=True);(root/'renders').mkdir(exist_ok=True)
SR=48000;D=100;rng=np.random.default_rng(202611115);music=np.zeros((D*SR,2));fx=np.zeros_like(music)
def add(track,start,x,gain=1,pan=0):
 a=round(start*SR);b=min(len(track),a+len(x))
 if a<0 or b<=a:return
 x=x[:b-a]*gain;track[a:b,0]+=x*np.sqrt((1-pan)/2);track[a:b,1]+=x*np.sqrt((1+pan)/2)
def note(start,dur,m,gain=.03,pan=0,pluck=False):
 t=np.arange(round(dur*SR))/SR;f=440*2**((m-69)/12)
 x=.6*np.sin(2*np.pi*f*t)+.25*np.sin(2*np.pi*f*1.0013*t+.6)+.12*np.sin(2*np.pi*f*2*t+.2)
 env=(1-np.exp(-t*(70 if pluck else 2)))*np.exp(-t*(2.7 if pluck else .08))*np.minimum((dur-t)/(.4 if pluck else 1.4),1)
 add(music,start,x*env,gain,pan)
chords=[[38,45,50,53],[34,41,46,50],[41,48,53,57],[36,43,48,52],[38,45,50,53],[34,41,46,50],[36,43,48,55],[38,45,50,57]]
for i in range(14):
 c=chords[i%len(chords)];start=i*7.2
 for j,m in enumerate(c):note(start,min(9,100-start),m,.033,-.6+j*.4)
 note(start,min(8,100-start),c[0]-12,.05)
for i,start in enumerate(np.arange(5.5,94,.72)):
 c=chords[int(start/7.2)%len(chords)];note(start,1.4,c[[0,2,1,3,2,1][i%6]]+24,.018,(-.45 if i%2 else .45),True)
for start in np.arange(6,94,2.88):
 t=np.arange(round(.65*SR))/SR;add(music,start,np.sin(2*np.pi*(46*t+.9*(1-np.exp(-t*20))))*np.exp(-t*7),.07)
for start in [12,22,43,51,60,69,78,86,94]:
 t=np.arange(round(.95*SR))/SR;n=np.convolve(rng.normal(size=len(t)),np.ones(35)/35,'same');add(fx,start-.45,n*np.sin(np.pi*t/.95)**2,.07)
for start,dur,gain,f in [(0,11.9,.027,85),(31.5,2.9,.020,100),(44.8,5.1,.012,80),(53.2,6.2,.014,115),(69.8,6.6,.018,74),(78.5,6.9,.009,100)]:
 t=np.arange(round(dur*SR))/SR;n=np.convolve(rng.normal(size=len(t)),np.ones(22)/22,'same');env=np.minimum(t/.35,1)*np.minimum((dur-t)/.45,1);add(fx,start,(n+.12*np.sin(2*np.pi*f*t))*env,gain)
for start in np.arange(23.2,31.3,1):
 t=np.arange(round(.13*SR))/SR;n=rng.normal(size=len(t));add(fx,start,(.65*np.sin(2*np.pi*140*t)+.14*n)*np.exp(-t*42),.032)
for start in np.arange(60.36,66.9,.5):
 t=np.arange(round(.045*SR))/SR;n=rng.normal(size=len(t));add(fx,start,(.65*np.sin(2*np.pi*380*t)+.15*n)*np.exp(-t*115),.014)
for m in [50,57,62,69]:note(94,5.7,m,.027)
time=np.arange(D*SR)/SR;fade=np.minimum(time/1,1)*np.minimum((100-time)/1,1);track=np.tanh((music+fx)*1.2)*fade[:,None]
pre=root/'work/score-premaster.wav'
def wav(path,x):
 with wave.open(str(path),'wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype('<i2').tobytes())
wav(pre,track)
log=subprocess.run(['ffmpeg','-hide_banner','-i',str(pre),'-af','loudnorm=I=-18:TP=-2:LRA=9:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr
stats=json.JSONDecoder().raw_decode(log[log.rfind('{'):])[0];gain=min(10**((-18-float(stats['input_i']))/20),.78/np.max(np.abs(track)));track*=gain
wav(root/'work/original-score.wav',track)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(root/'work/original-score.wav'),'-c:a','aac','-b:a','192k','-t','100','-movflags','+faststart',str(root/'public/score.m4a')],check=True)
(root/'renders/audio-design.json').write_text(json.dumps({'original_composition':True,'external_samples':False,'duration_seconds':100,'sample_rate':SR,'channels':2,'master_gain':float(gain),'pcm_peak_dbfs':float(20*np.log10(np.max(np.abs(track)))),'voiceover_included':False,'voiceover_status':'User will add narration later; no human speech generated or included','cues':{'drilling':[0,11.9],'rock_types':[12,22],'SPT_impacts':[23.2,31.2],'sampler_withdrawal':[31.5,34.4],'sample_preservation':[34.4,43],'moisture':[43,51],'sieving':[51,60],'liquid_limit':[60,69],'direct_shear':[69,78],'piezometer':[78,86],'report':[86,94],'brand_close':94,'transitions':[12,22,43,51,60,69,78,86,94]}},indent=2)+'\n');print('Original 100-second music/SFX exported.')
