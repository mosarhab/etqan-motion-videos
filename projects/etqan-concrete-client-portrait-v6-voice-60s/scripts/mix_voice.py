"""Place the supplied recording at scene cues, duck music and remux unchanged video."""
from pathlib import Path
import argparse, hashlib, json, subprocess, wave
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SR = 48000
parser = argparse.ArgumentParser()
parser.add_argument('--voice', required=True, type=Path)
parser.add_argument('--base-project', type=Path, default=ROOT.parent/'etqan-concrete-client-portrait-v5-60s')
args = parser.parse_args()
base = args.base_project.resolve()
video = base/'renders/etqan-concrete-client-portrait-v5-60s.mp4'
work = ROOT/'work'; work.mkdir(exist_ok=True)
out = ROOT/'renders'; out.mkdir(exist_ok=True)

def cmd(parts):
    return subprocess.run(parts, check=True, capture_output=True).stdout

def decode(path, channels):
    return np.frombuffer(cmd(['ffmpeg','-v','error','-i',str(path),'-ar',str(SR),'-ac',str(channels),'-f','f32le','-']), dtype='<f4').reshape(-1, channels)

def wav(path, data):
    assert np.max(np.abs(data)) < 1
    with wave.open(str(path),'wb') as f:
        f.setnchannels(data.shape[1]); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes((data*32767).astype('<i2').tobytes())

def loudness(path):
    r = subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-af','loudnorm=I=-18:TP=-1.5:LRA=11:print_format=json','-f','null','-'],check=True,capture_output=True,text=True).stderr
    return json.JSONDecoder().raw_decode(r[r.rfind('{'):])[0]

# Prove that retaining the existing video stream is valid for this audio-only edit.
for file in (ROOT/'src').iterdir():
    if file.is_file():
        expected=(base/'src'/file.name).read_text()
        if file.name=='Root.tsx': expected=expected.replace('PortraitV5','PortraitV6Voice')
        assert file.read_text()==expected, file
assert (ROOT/'public/music.m4a').read_bytes()==(base/'public/score.m4a').read_bytes()

raw=decode(args.voice,1)[:,0]
cues=[
    {'scene':'opening','source_start':0.,'source_end':2.8,'target_start':.6},
    {'scene':'fresh','source_start':3.,'source_end':14.4,'target_start':6.45},
    {'scene':'samples','source_start':14.4,'source_end':23.,'target_start':20.55},
    {'scene':'curing','source_start':23.,'source_end':33.4,'target_start':32.4},
    {'scene':'compression','source_start':33.4,'source_end':44.5,'target_start':43.45},
    {'scene':'closing','source_start':44.5,'source_end':len(raw)/SR,'target_start':55.75},
]
voice=np.zeros(60*SR,dtype=np.float64)
for cue in cues:
    a,b=round(cue['source_start']*SR),round(cue['source_end']*SR)
    clip=raw[a:b].astype(np.float64).copy()
    # Ten-millisecond edge fades lie in the detected inter-phrase silences.
    n=round(.01*SR); clip[:n]*=np.linspace(0,1,n);clip[-n:]*=np.linspace(1,0,n)
    dst=round(cue['target_start']*SR); assert dst+len(clip)<=len(voice)
    voice[dst:dst+len(clip)]+=clip
    cue['target_end']=cue['target_start']+len(clip)/SR
    cue['speed_ratio']=1.0
stereo=np.column_stack([voice,voice])
wav(work/'voice-aligned-premaster.wav',stereo)
stats=loudness(work/'voice-aligned-premaster.wav')
gain=min(10**((-18.5-float(stats['input_i']))/20),.78/np.max(np.abs(stereo)))
stereo*=gain
wav(work/'voice-aligned.wav',stereo)

music=decode(ROOT/'public/music.m4a',2)[:60*SR].astype(np.float64)
assert len(music)==60*SR
time=np.arange(len(music))/SR
duck=np.ones(len(music))
for cue in cues:
    a=cue['target_start'];b=cue['target_end']
    envelope=np.minimum(np.clip((time-(a-.12))/.12,0,1),np.clip((b+.38-time)/.38,0,1))
    duck=np.minimum(duck,1-.82*envelope)
bed=music*(.65*duck[:,None])
mix=stereo+bed
wav(work/'mix-premaster.wav',mix)
stats=loudness(work/'mix-premaster.wav')
master_gain=min(10**((-18-float(stats['input_i']))/20),.80/np.max(np.abs(mix)))
mix*=master_gain
wav(work/'mixed-master.wav',mix)
cmd(['ffmpeg','-v','error','-y','-i',str(work/'mixed-master.wav'),'-c:a','aac','-b:a','192k','-t','60','-movflags','+faststart',str(ROOT/'public/score.m4a')])
final=out/'etqan-concrete-client-portrait-v6-voice-60s.mp4'
cmd(['ffmpeg','-v','error','-y','-i',str(video),'-i',str(ROOT/'public/score.m4a'),'-map','0:v:0','-map','1:a:0','-c','copy','-t','60','-movflags','+faststart',str(final)])
def video_hash(path):
    return cmd(['ffmpeg','-v','error','-i',str(path),'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-']).decode().strip()
assert video_hash(video)==video_hash(final)

h=hashlib.sha256()
def scan(folder):
    for f in sorted(folder.iterdir()):
        if f.is_dir():scan(f)
        else:h.update(str(f.relative_to(ROOT)).encode());h.update(f.read_bytes())
scan(ROOT/'src');scan(ROOT/'public');h.update((ROOT/'package-lock.json').read_bytes());source=h.hexdigest()
(work/'checkpoints').mkdir(exist_ok=True);(work/'checkpoints/source-sha256.txt').write_text(source+'\n')
result={'voiceover_included':True,'voice_source':'User-supplied ElevenLabs recording','source_duration_seconds':len(raw)/SR,'duration_seconds':60,'sample_rate':SR,'channels':2,'cues':cues,'speed_changed':False,'music_gain_db':float(20*np.log10(.65)),'additional_music_duck_db':float(20*np.log10(.18)),'voice_gain':float(gain),'master_gain':float(master_gain),'speech_only_pcm_peak_dbfs':float(20*np.log10(np.max(np.abs(stereo)))),'mixed_pcm_peak_dbfs':float(20*np.log10(np.max(np.abs(mix)))),'video_stream_unchanged':True,'video_stream_sha256':video_hash(final),'base_video_sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'source_sha256':source,'review_method':'Automatic local speech recognition for paragraph identification, silence boundaries, waveform and signal checks; not human listening approval.','original_upload_excluded':True}
(out/'audio-design.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
(ROOT/'narration/recording-alignment.json').write_text(json.dumps({'source_duration_seconds':len(raw)/SR,'speed_ratio':1,'cues':cues,'cut_method':'Inter-paragraph silences; 10ms edge fades; original speech rate retained'},ensure_ascii=False,indent=2)+'\n')
print(json.dumps(result,ensure_ascii=False,indent=2))
