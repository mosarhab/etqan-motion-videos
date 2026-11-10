"""Verify that the approved voice/music mix is retained without audio changes."""
from pathlib import Path
import hashlib,json,subprocess
ROOT=Path(__file__).resolve().parents[1]
def audio_hash(path):
 return subprocess.run(['ffmpeg','-v','error','-i',str(path),'-map','0:a:0','-c','copy','-f','hash','-hash','sha256','-'],check=True,capture_output=True,text=True).stdout.strip()
a=ROOT/'public/score.m4a';v=ROOT/'renders/etqan-concrete-client-portrait-v7-credit-60s.mp4'
assert audio_hash(a)==audio_hash(v)
meta=json.loads((ROOT/'renders/audio-design.json').read_text())
assert hashlib.sha256(a.read_bytes()).hexdigest()==meta['upstream_score_sha256']
windows={'opening':(0,6),'fresh':(6,20),'samples':(20,32),'curing':(32,43),'compression':(43,55),'closing':(55,60)}
for c in meta['cues']:
 lo,hi=windows[c['scene']];assert lo<=c['target_start']<c['target_end']<=hi and c['speed_ratio']==1
result={'passed':True,'encoded_audio_unchanged_from_approved_v6_mix':True,'audio_packet_sha256':audio_hash(v),'all_cues_fit_their_scenes':True,'no_time_stretch':True,'limits':'Unchanged encoded mix and cue timing verification, not new human listening approval.'}
(ROOT/'renders/voice-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
