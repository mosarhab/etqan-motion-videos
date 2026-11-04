"""Original cinematic synthesis and mechanical sound design; no borrowed audio."""
import numpy as np,wave,subprocess
from pathlib import Path
sr=48000;n=60*sr;t=np.arange(n)/sr
rng=np.random.default_rng(246828527)
a=np.zeros(n);air=rng.standard_normal(n);air=np.convolve(air,np.ones(55)/55,mode='same')
# Suspended D harmony evolves through the product story and resolves at the brand.
changes=[(0,18,[146.832,220,293.665,349.228]),(18,35,[146.832,220,293.665,440]),(35,45,[116.541,174.614,233.082,349.228]),(45,53,[130.813,195.998,261.626,391.995]),(53,57,[146.832,220,293.665,440]),(57,60,[146.832,220,293.665,369.994])]
for start,end,notes in changes:
 env=np.minimum(1,np.maximum(0,(t-start+1)/1.8))*np.minimum(1,np.maximum(0,(end+1-t)/1.8))
 env*=.65+.18*np.sin(t*.32)
 for j,f in enumerate(notes):
  tone=np.zeros(n)
  for k in range(1,7):tone+=np.sin(2*np.pi*f*k*t+.15*np.sin(t*.25+j))*(1/k**1.7)
  tone+=.24*np.sin(2*np.pi*f*1.0018*t+j)
  a+=tone*env*(.0065 if j<2 else .0045)
# Deep foundation and restrained forward motion.
a+=.017*np.sin(2*np.pi*73.416*t)*(.5+.5*np.sin(t*.11)**2)
for i,start in enumerate(np.arange(7.7,56.5,.681818)):
 u=t-start;env=(u>=0)*(u<.8)*np.exp(-np.maximum(u,0)*7.5)
 a+=.036*env*np.sin(2*np.pi*(58*u+5*(1-np.exp(-np.maximum(u,0)*20))))
 if i%2==0:a+=.008*env*np.sin(2*np.pi*587.33*u)
for start in [8,18,25,35,45,53,57]:
 a+=air*.055*np.exp(-((t-start)/.4)**2)
 u=t-start;env=(u>=0)*np.exp(-np.maximum(u,0)*6.5)
 a+=.034*env*np.sin(2*np.pi*(62*u+6*(1-np.exp(-np.maximum(u,0)*12))))
 # A short original metallic impact; avoids library sound-effect licensing.
 for k,f in enumerate([920,1333,1747]):a+=.004*env*np.sin(2*np.pi*f*u)/(k+1)
# Quiet mechanism cues inside testing scenes.
for start in [28.2,31.4,38.3,41.8,48.2,50.7]:
 u=t-start;env=np.exp(-np.maximum(u,0)*15)*(u>=0)*(u<.5)
 a+=.012*env*np.sin(2*np.pi*350*u)+air*.024*env
fade=np.minimum(1,t/2)*np.minimum(1,(60-t)/1.1)
a=np.tanh(a*2.5)*fade
st=np.column_stack([a+.07*np.roll(a,230),a+.07*np.roll(a,510)])
Path('work/audio').mkdir(exist_ok=False)
with wave.open('work/audio/original-score.wav','wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(st,-1,1)*32767).astype('<i2').tobytes())
subprocess.run(['ffmpeg','-v','error','-n','-i','work/audio/original-score.wav','-af','loudnorm=I=-17:TP=-1.8:LRA=9','-c:a','aac','-b:a','192k','-ar','48000','-t','60','public/assets/original-score.m4a'],check=True)
print('Original 60-second cinematic score created')
