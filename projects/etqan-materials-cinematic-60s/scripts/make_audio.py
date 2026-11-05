"""Original 60-second stereo instrumental and synchronized sound design.
No sampled or third-party music. Deterministic synthesis, 48 kHz PCM.
"""
import numpy as np, wave, os
SR=48000; D=60; rng=np.random.default_rng(20261105)
track=np.zeros((SR*D,2),np.float64)
def add(start,sig,gain=1,pan=0):
    a=int(start*SR); b=min(len(track),a+len(sig)); sig=sig[:b-a]*gain
    if a<0 or b<=a:return
    track[a:b,0]+=sig*np.sqrt((1-pan)/2);track[a:b,1]+=sig*np.sqrt((1+pan)/2)
def tone(start,dur,freq,gain,pan=0,kind='pad'):
    t=np.arange(int(dur*SR))/SR
    if kind=='pad':
        sig=sum(np.sin(2*np.pi*freq*(1+det)*t+phase)*amp for det,phase,amp in [(-.0015,.2,.4),(.0015,1.1,.4),(0,0,.2)])
        sig+=.1*np.sin(2*np.pi*freq*2*t)+.025*np.sin(2*np.pi*freq*3*t)
        env=np.minimum(t/1.5,1)*np.minimum((dur-t)/2.2,1)
    elif kind=='pluck':
        sig=np.sin(2*np.pi*freq*t)+.22*np.sin(2*np.pi*freq*2*t)+.06*np.sin(2*np.pi*freq*4*t)
        env=(1-np.exp(-t*100))*np.exp(-t*3.4)
    else:
        sig=np.sin(2*np.pi*freq*t)+.2*np.sin(2*np.pi*freq*2*t)
        env=(1-np.exp(-t*8))*np.minimum((dur-t)/.7,1)
    add(start,sig*env,gain,pan)
def hz(m):return 440*2**((m-69)/12)
chords=[[50,57,62,65],[46,53,58,62],[53,60,65,69],[48,55,60,64],[50,57,62,65],[46,53,58,62],[48,55,60,64],[50,57,62,69]]
for j,notes in enumerate(chords):
    st=j*7.5
    for k,m in enumerate(notes):tone(st,min(9,60-st),hz(m),.045,-.65+k*.43)
    tone(st,min(7.8,60-st),hz(notes[0]-12),.095,0,'bass')
for i in range(80):
    st=3.0+i*.7142857
    if st>56.7:break
    notes=chords[min(7,int(st/7.5))];m=notes[[0,2,1,3,2,1,3,2][i%8]]+12
    amp=.034 if st<19 else .042
    tone(st,1.5,hz(m),amp,(-.5 if i%2 else .5),'pluck')
    tone(st+.19,1.5,hz(m),amp*.22,(.65 if i%2 else -.65),'pluck')
for st in np.arange(3.0,56.5,2.8571428):
    dur=1.1;t=np.arange(int(dur*SR))/SR
    phase=2*np.pi*(42*t+3.2*(1-np.exp(-t*19)))
    sig=np.sin(phase)*np.exp(-t*5)+rng.normal(0,1,len(t))*.08*np.exp(-t*35)
    add(st,sig,.2 if st%2.5<.01 else .13)
for st in [3,9,14,19,25,30,35,41,46,51,57]:
    t=np.arange(int(1.8*SR))/SR
    n=rng.normal(size=len(t)); n=np.convolve(n,np.ones(16)/16,mode='same')
    sig=n*np.sin(np.pi*t/1.8)**2
    add(st-1.1,sig,.13,-.2)
    tone(st,2.3,110,.06,0,'pluck')
# Quiet hydraulic motion and core extraction texture, with no simulated data cues.
for st,dur in [(20,2.5),(31,2.5),(42,2.5)]:
    t=np.arange(int(dur*SR))/SR;env=np.minimum(t/.25,1)*np.minimum((dur-t)/.35,1)
    sig=(np.sin(2*np.pi*92*t)+.17*np.sin(2*np.pi*184*t))*.018
    sig+=np.convolve(rng.normal(size=len(t)),np.ones(24)/24,mode='same')*.025
    add(st,sig*env,.8,-.15)
t=np.arange(len(track))/SR
fade=np.minimum(t/2,1)*np.minimum((60-t)/1.25,1)
track*=fade[:,None]
track=np.tanh(track*1.25);track*=.88/max(np.max(np.abs(track)),.88)
track*=1.77828
out=(track*32767).astype('<i2')
os.makedirs('public',exist_ok=True)
with wave.open('public/etqan-original-score.wav','wb') as w:w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes(out.tobytes())
print('Original score:',out.shape,'peak',np.max(np.abs(track)))
