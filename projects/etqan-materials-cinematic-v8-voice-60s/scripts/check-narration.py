"""Verify the delivered speech/music signal and quiet-pause fitting evidence."""
from pathlib import Path
import subprocess,json,hashlib,wave
import numpy as np
root=Path(__file__).resolve().parents[1]
def pcm(p,channels):
 raw=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ar','48000','-ac',str(channels),'-'],capture_output=True,check=True).stdout
 return np.frombuffer(raw,dtype='<f4').reshape(-1,channels)
fit=json.loads((root/'renders/voice-fit.json').read_text())
original=root/'public/etqan-voice-original.mp3';assert hashlib.sha256(original.read_bytes()).hexdigest()==fit['source_sha256']
x=pcm(original,1)[:,0]
quiet=[]
for a,b in fit['pause_centers_removed_seconds']:
 peak=float(np.max(np.abs(x[round(a*48000):round(b*48000)])))
 assert peak<.014,(a,b,peak)
 quiet.append(peak)
v=pcm(root/'work/voice-fitted.wav',1)[:,0];m=pcm(root/'public/etqan-voice-mix.wav',2)
assert len(v)==2880000 and len(m)==2880000
assert np.sqrt(np.mean(v[-4800:]**2))<.0001
assert np.sqrt(np.mean(v[-48000:-9600]**2))>.01
encoded=pcm(root/'renders/etqan-cinematic-3d-60s.mp4',2)[:2880000]
assert len(encoded)==2880000
voice_correlation=float(np.corrcoef(encoded.mean(axis=1)[::8],v[::8])[0,1]);assert voice_correlation>.97,voice_correlation
residual=m-v[:,None]/np.sqrt(2)
voice_rms=float(np.sqrt(np.mean((v/np.sqrt(2))**2)));music_rms=float(np.sqrt(np.mean(residual**2)))
assert music_rms>.001 and voice_rms>music_rms*3
peak=float(np.max(np.abs(encoded)));assert peak<.95
result={'passed':True,'source_voice_identical_to_user_upload_sha256':fit['source_sha256'],'quiet_centers_removed_count':len(quiet),'quiet_center_maximum_peak_dbfs':float(20*np.log10(max(quiet))),'spoken_words_intentionally_removed':False,'pitch_preserving_tempo_factor':fit['tempo_factor'],'encoded_mix_to_fitted_voice_correlation':voice_correlation,'speech_rms_dbfs_per_channel':float(20*np.log10(voice_rms)),'background_music_rms_dbfs_per_channel':float(20*np.log10(music_rms)),'speech_above_music_rms_db':float(20*np.log10(voice_rms/music_rms)),'encoded_peak_dbfs':float(20*np.log10(peak)),'closing_speech_energy_present_in_last_second':True,'last_100ms_of_isolated_voice_is_quiet':True,'note':'Signal verification and ASR-assisted phrase timing; this is not a subjective listening assessment. The supplied voice is fitted using low-energy pauses and pitch-preserving time stretch, with no re-synthesis.'}
(root/'renders/narration-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
