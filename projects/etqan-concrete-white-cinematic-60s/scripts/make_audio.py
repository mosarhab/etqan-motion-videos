"""Original instrumental and procedural Foley; no stock recording or samples."""
from pathlib import Path
import numpy as np,wave,json,subprocess
root=Path(__file__).resolve().parents[1];SR=48000;D=60;rng=np.random.default_rng(20261109)
(root/'work').mkdir(exist_ok=True);(root/'renders').mkdir(exist_ok=True)
music=np.zeros((SR*D,2));sfx=np.zeros_like(music)
def add(track,start,x,gain=1,pan=0):
 a=round(start*SR);b=min(len(track),a+len(x));
 if a<0 or b<=a:return
 x=x[:b-a]*gain;track[a:b,0]+=x*np.sqrt((1-pan)/2);track[a:b,1]+=x*np.sqrt((1+pan)/2)
def hz(m):return 440*2**((m-69)/12)
def note(start,dur,m,gain,kind='pad',pan=0):
 t=np.arange(round(dur*SR))/SR;f=hz(m)
 if kind=='pad':
  x=sum(np.sin(2*np.pi*f*(1+d)*t+p)*a for d,p,a in [(-.0017,.2,.36),(.0014,1.4,.36),(0,.6,.28)]);x+=.13*np.sin(2*np.pi*f*2*t)+.035*np.sin(2*np.pi*f*3*t);env=np.minimum(t/1.6,1)*np.minimum((dur-t)/1.8,1)
 elif kind=='pulse':x=np.sin(2*np.pi*f*t)+.17*np.sin(2*np.pi*f*2*t);env=(1-np.exp(-t*80))*np.exp(-t*3.2)
 else:x=np.sin(2*np.pi*f*t)+.10*np.sin(2*np.pi*f*2*t);env=(1-np.exp(-t*7))*np.minimum((dur-t)/.55,1)
 add(music,start,x*env,gain,pan)
chords=[[38,45,50,53],[34,41,46,50],[41,48,53,57],[36,43,48,52],[38,45,50,53],[34,41,46,50],[36,43,48,55],[38,45,50,57]]
for i,c in enumerate(chords):
 start=i*7.5
 for j,m in enumerate(c):note(start,min(9,60-start),m,.037+(.012 if start>=37 else 0),'pad',-.6+j*.4)
 note(start,min(8,60-start),c[0]-12,.055,'bass')
for i in range(112):
 start=7+i*.45
 if start>54.3:break
 c=chords[min(7,int(start/7.5))];note(start,1.2,c[[0,2,1,3,2,3,1,2][i%8]]+24,.019 if start<37 else .034,'pulse',.45 if i%2 else -.45)
for start in np.arange(7.6,53.6,1.8):
 t=np.arange(round(.85*SR))/SR;x=np.sin(2*np.pi*(45*t+2.4*(1-np.exp(-t*20))))*np.exp(-t*5);x+=rng.normal(size=len(t))*.07*np.exp(-t*30);add(music,start,x,.11 if start<37 else .18)
# Original transitions rise through the moving studio; no measurement beeps.
for start in [7,17,27,37,50,53]:
 t=np.arange(round(1.4*SR))/SR;n=rng.normal(size=len(t));n=np.convolve(n,np.ones(28)/28,'same');add(music,start-.9,n*np.sin(np.pi*t/1.4)**2,.11,.1)
# Gravelly concrete flow and soft aggregate contact.
for start,dur,gain in [(4.5,2.4,.10),(17.4,6.2,.075)]:
 t=np.arange(round(dur*SR))/SR;n=np.convolve(rng.normal(size=len(t)),np.ones(17)/17,'same');env=np.minimum(t/.2,1)*np.minimum((dur-t)/.3,1);add(sfx,start,(n+.12*np.sin(2*np.pi*72*t))*env,gain,-.12)
# Vertical metal lift, table preparation and water immersion.
for start,dur,f in [(8.3,5,125),(23.4,2.3,210),(27.5,2.3,95),(38.1,7.8,88)]:
 t=np.arange(round(dur*SR))/SR;env=np.minimum(t/.45,1)*np.minimum((dur-t)/.5,1);n=np.convolve(rng.normal(size=len(t)),np.ones(36)/36,'same');x=(np.sin(2*np.pi*f*t)*.50+np.sin(2*np.pi*f*2*t)*.07+n*.2)*env;add(sfx,start,x,.027 if f!=88 else .045,.07)
# Water: band-limited air/liquid textures, kept restrained.
start=28;dur=8;t=np.arange(round(dur*SR))/SR;n=np.convolve(rng.normal(size=len(t)),np.ones(22)/22,'same');env=np.minimum(t/.4,1)*np.minimum((dur-t)/.8,1);add(sfx,start,n*env,.045,.25)
for i in range(18):
 start=28.3+i*.4;t=np.arange(round(.12*SR))/SR;f=520+i%5*90;x=np.sin(2*np.pi*(f*t-750*t*t))*np.exp(-t*40);add(sfx,start,x,.004,(-.4 if i%2 else .4))
# Localized fracture crunch rather than an explosion.
t=np.arange(round(.65*SR))/SR;n=rng.normal(size=len(t));n=np.convolve(n,np.ones(6)/6,'same');x=n*np.exp(-t*14)*(1-np.exp(-t*220))+np.sin(2*np.pi*(85*t-18*t*t))*.30*np.exp(-t*17);add(sfx,45.92,x,.27,-.05)
for start in [46.18,46.48,46.91]:
 t=np.arange(round(.14*SR))/SR;add(sfx,start,(rng.normal(size=len(t))*.3+np.sin(2*np.pi*320*t))*np.exp(-t*45),.018,.15)
# Logo resolution and a measured final stop.
for m in [50,57,62,69]:note(53.05,4.7,m,.032,'pad',0)
time=np.arange(SR*D)/SR;fade=np.minimum(time/1.2,1)*np.minimum((60-time)/1.25,1);music*=fade[:,None];sfx*=np.minimum((60-time)/.7,1)[:,None]
track=np.tanh((music+sfx)*1.25);peak=np.max(np.abs(track));track*=min(1,.78/peak)
# Global loudness is subsequently measured; preserve headroom for a future voice.
premaster=root/'work/score-premaster.wav'
with wave.open(str(premaster),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((track*32767).astype('<i2').tobytes())
log=subprocess.run(['ffmpeg','-hide_banner','-i',str(premaster),'-af','loudnorm=I=-18:TP=-2:LRA=9:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr
stats=json.loads(log[log.rfind('{'):log.rfind('}')+1]);gain=min(10**((-18-float(stats['input_i']))/20),.79/max(np.max(np.abs(track)),.001));track*=gain
p=root/'public/etqan-concrete-score.wav'
with wave.open(str(p),'wb') as f:f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((track*32767).astype('<i2').tobytes())
(root/'renders/audio-design.json').write_text(json.dumps({'duration_seconds':60,'sample_rate':SR,'channels':2,'samples_per_channel':SR*D,'original_synthesis':True,'third_party_samples':False,'loudness_target_lufs':-18,'linear_master_gain':float(gain),'pcm_peak_dbfs':float(20*np.log10(np.max(np.abs(track)))),'voiceover_included':False,'voiceover_status':'Professional Arabic TTS unavailable; authorized music/SFX fallback','sound_cues_seconds':{'cone_lift':[8.3,13.3],'preparation_pour':[17.4,23.6],'immersion':[27.5,29.8],'compression_motor':[38.1,45.9],'fracture':45.92,'brand_resolution':53.05}},indent=2)+'\n')
print('Original music/SFX mastered:',p.name,'60 seconds stereo; peak',float(np.max(np.abs(track))))
