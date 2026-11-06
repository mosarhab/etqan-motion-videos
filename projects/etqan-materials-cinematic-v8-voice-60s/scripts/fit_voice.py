"""Fit the supplied narration without dropping spoken words; preserve pitch.
Only the quiet centers of measured pauses are shortened. Keep all originals.
"""
from pathlib import Path
import subprocess,json,re,wave,hashlib
import numpy as np
root=Path(__file__).resolve().parents[1]
work=root/'work';work.mkdir(exist_ok=True)
source=root/'public/etqan-voice-original.mp3'
assert hashlib.sha256(source.read_bytes()).hexdigest()=='dbac953004c0bb44fa1464477528c35be158418d07d7c68ea950c8718a54d505', 'Pause cuts are specific to the approved original narration'
sr=48000
raw=subprocess.run(['ffmpeg','-v','error','-i',str(source),'-f','f32le','-ar',str(sr),'-ac','1','-'],capture_output=True,check=True).stdout
x=np.frombuffer(raw,dtype='<f4')
pauses=[(2.419,2.702),(7.838,8.208),(19.254,19.580),(26.726,26.993),(30.641,30.937),(39.235,39.503),(46.533,46.855),(56.426,56.763),(60.640,60.946),(63.382,63.666)]
cuts=[(round((a+.09)*sr),round((b-.09)*sr)) for a,b in pauses]
chunks=[];cursor=0
for a,b in cuts:
 assert a>=cursor and b>a
 chunks.append(x[cursor:a]);cursor=b
chunks.append(x[cursor:]);trimmed=np.concatenate(chunks)
with wave.open(str(work/'voice-pauses-shortened.wav'),'wb') as f:
 f.setnchannels(1);f.setsampwidth(2);f.setframerate(sr);f.writeframes((np.clip(trimmed,-1,1)*32767).astype('<i2').tobytes())
lead=.12;target=59.62;speed=len(trimmed)/sr/target
filt=f'rubberband=tempo={speed:.12f}:pitch=1,apad,atrim=duration={target}'
subprocess.run(['ffmpeg','-v','error','-y','-i',str(work/'voice-pauses-shortened.wav'),'-af',filt,'-ar',str(sr),'-c:a','pcm_s16le',str(work/'voice-retimed.wav')],check=True)
compression='highpass=f=65,acompressor=threshold=0.10:ratio=2.2:attack=10:release=120:makeup=1'
measure=subprocess.run(['ffmpeg','-hide_banner','-i',str(work/'voice-retimed.wav'),'-af',compression+',loudnorm=I=-17:TP=-2:LRA=9:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr
loud=json.loads(measure[measure.rfind('{'):measure.rfind('}')+1])
normal=f"loudnorm=I=-17:TP=-2:LRA=9:measured_I={loud['input_i']}:measured_TP={loud['input_tp']}:measured_LRA={loud['input_lra']}:measured_thresh={loud['input_thresh']}:offset={loud['target_offset']}:linear=true:print_format=json"
result=subprocess.run(['ffmpeg','-v','info','-y','-i',str(work/'voice-retimed.wav'),'-af',compression+','+normal+',aresample=48000,asetpts=N/SR/TB,adelay=120,apad=whole_len=2880000,atrim=end_sample=2880000,asetpts=N/SR/TB','-ar',str(sr),'-c:a','pcm_s16le',str(work/'voice-fitted.wav')],check=True,capture_output=True,text=True)
(work/'voice-normalization.log').write_text(result.stderr)
with wave.open(str(work/'voice-fitted.wav'),'rb') as f:assert f.getnframes()==2880000 and f.getframerate()==48000
manifest={'source_sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'source_seconds':len(x)/sr,'quiet_pause_threshold_dbfs':-38,'pause_centers_removed_seconds':[(a/sr,b/sr) for a,b in cuts],'pause_seconds_removed':(len(x)-len(trimmed))/sr,'speech_words_removed':False,'pitch_preserved':True,'tempo_factor':speed,'lead_seconds':lead,'fitted_speech_window_seconds':target,'output_duration_seconds':60,'normalization_first_pass':loud}
(root/'renders/voice-fit.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(json.dumps(manifest,indent=2))
