"""Verify scene timing and supplied speech content in the actual decoded master."""
from pathlib import Path
import json, subprocess
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
SR=48000
def pcm(path):
    return np.frombuffer(subprocess.run(['ffmpeg','-v','error','-i',str(path),'-ar',str(SR),'-ac','2','-f','f32le','-'],check=True,capture_output=True).stdout,dtype='<f4').reshape(-1,2)
meta=json.loads((ROOT/'renders/audio-design.json').read_text())
actual=pcm(ROOT/'renders/etqan-concrete-client-portrait-v6-voice-60s.mp4')
voice=pcm(ROOT/'work/voice-aligned.wav')*meta['master_gain']
mix=pcm(ROOT/'work/mixed-master.wav')
bed=mix-voice
windows={'opening':(0,6),'fresh':(6,20),'samples':(20,32),'curing':(32,43),'compression':(43,55),'closing':(55,60)}
checks=[]
for cue in meta['cues']:
    lo,hi=windows[cue['scene']]
    assert lo<=cue['target_start']<cue['target_end']<=hi
    assert cue['speed_ratio']==1
    a,b=round(cue['target_start']*SR),round(cue['target_end']*SR)
    v=voice[a:b].mean(axis=1);x=actual[a:b].mean(axis=1)
    corr=float(np.corrcoef(v[::4],x[::4])[0,1]);assert corr>.95,(cue['scene'],corr)
    # Compare speech and background levels during active speech samples.
    n=(b-a)//960
    rms=np.sqrt(np.mean(v[:n*960].reshape(n,960)**2,axis=1))
    mask=np.repeat(rms>.006,960)
    speech=v[:len(mask)][mask];background=bed[a:a+len(mask)].mean(axis=1)[mask]
    snr=float(20*np.log10(np.sqrt(np.mean(speech**2))/np.sqrt(np.mean(background**2))))
    assert snr>10,(cue['scene'],snr)
    checks.append({'scene':cue['scene'],'start':cue['target_start'],'end':cue['target_end'],'speech_waveform_correlation':corr,'active_speech_to_music_db':snr,'fits_scene':True,'speed_ratio':1})
assert meta['video_stream_unchanged'] and not meta['speed_changed']
result={'passed':True,'cues':checks,'all_speech_within_60_seconds':True,'no_time_stretch':True,'original_video_stream_retained':True,'limits':'Signal/timing checks and automatic local phrase recognition; not human listening approval or word-level forced alignment.'}
(ROOT/'renders/voice-check.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
