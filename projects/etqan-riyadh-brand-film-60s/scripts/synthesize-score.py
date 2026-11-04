"""Original deterministic sound design, no external samples or compositions."""
from pathlib import Path
import numpy as np, wave
sr=48000
n=sr*60
t=np.arange(n,dtype=np.float64)/sr
score=np.zeros(n)
# An original, restrained suspended harmony and a soft sub foundation.
for i,hz in enumerate([55,110,164.8138,220,293.6648]):
 envelope=(.66+.16*np.sin(2*np.pi*(.035+i*.004)*t+i))
 score+=(.016 if i<2 else .009)*envelope*np.sin(2*np.pi*hz*t+.35*np.sin(t*.17+i))
# Quiet, rounded pulses; no client or laboratory recordings.
for start in np.arange(1.5,56,1.5):
 u=t-start
 env=np.exp(-np.maximum(u,0)*8)*(u>=0)*(u<1)
 score+=.027*env*np.sin(2*np.pi*(95*u+8*(1-np.exp(-np.maximum(u,0)*6))))
rng=np.random.default_rng(24829475)
noise=rng.standard_normal(n)
noise=np.convolve(noise,np.ones(45)/45,mode='same')
for start in [7,17,25,34,43,51,56]:
 env=np.exp(-((t-start)/.42)**2)
 score+=noise*env*.035
 score+=.018*np.sin(2*np.pi*880*(t-start))*np.exp(-np.maximum(t-start,0)*10)*(t>=start)*(t<start+.6)
fade=np.minimum(1,t/3)*np.minimum(1,(60-t)/2.5)
score=np.tanh(score*2.3)*fade
stereo=np.column_stack([score,score*.98+np.roll(score,190)*.02])
pcm=(np.clip(stereo,-1,1)*32767).astype('<i2')
with wave.open('public/assets/original-score.wav','wb') as w:
 w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes(pcm.tobytes())
print('Created original 60-second stereo sound design')
