"""Optionally retain verified muted parts unaffected by this opening-only edit.
A fresh source checkout simply renders every part when the previous cache is absent.
"""
from pathlib import Path
import json,hashlib,shutil,subprocess
root=Path(__file__).resolve().parents[1];base=root.parent/'video-v3-spt-rocks-benefits-100s';previous=base/'work/checkpoints'
if not previous.exists():
 print('No previous checkpoints; normal render will create all frames.');raise SystemExit(0)
def files(folder):return {str(p.relative_to(folder)):p.read_bytes() for sub in ['src','public'] for p in sorted((folder/sub).rglob('*')) if p.is_file()}
def fingerprint(folder):
 h=hashlib.sha256()
 def scan(p):
  for f in sorted(p.iterdir()):
   if f.is_dir():scan(f)
   else:h.update(str(f.relative_to(folder)).encode());h.update(f.read_bytes())
 scan(folder/'src');scan(folder/'public');h.update((folder/'package-lock.json').read_bytes());return h.hexdigest()
old=files(base);new=files(root);changed=sorted(k for k in old.keys()|new.keys() if old.get(k)!=new.get(k))
assert set(changed)=={'src/Field.tsx','src/Root.tsx','src/OpeningSite.tsx','public/score.m4a'},changed
canonical=new['src/Root.tsx'].decode().replace('EtqanSeriesGeotechnicalV4','EtqanSeriesGeotechnicalV3').replace('أرض الموقع وكشف الطبقات ثم الجسات','الجسات على أرض خالية')
assert canonical==old['src/Root.tsx'].decode(),'Timeline positions/lengths outside the first scene must remain identical'
assert (root/'package-lock.json').read_text()==(base/'package-lock.json').read_text().replace('etqan-series-geotechnical-v3-100s','etqan-series-geotechnical-v4-100s'),'Pinned dependencies changed'
old_source=fingerprint(base);assert old_source==(previous/'source-sha256.txt').read_text().strip()
assert old_source==json.loads((base/'renders/verification.json').read_text())['source_sha256']
new_source=fingerprint(root);cache=root/'work/checkpoints';cache.mkdir(exist_ok=True)
if (cache/'source-sha256.txt').exists():assert (cache/'source-sha256.txt').read_text().strip()==new_source
retained=[]
for start in range(600,3000,300):
 name=f'frames-{start:04d}-{start+299:04d}.mp4';p=previous/name
 info=json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-of','json',str(p)],text=True))['streams']
 assert len(info)==1 and info[0]['codec_type']=='video','Only muted raster parts may be retained'
 v=info[0];assert (v['width'],v['height'],v['avg_frame_rate'],int(v['nb_read_frames']))==(1080,1920,'30/1',300)
 shutil.copy2(p,cache/name);retained.append({'frames':[start,start+299],'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
(cache/'source-sha256.txt').write_text(new_source+'\n')
result={'verified':True,'previous_source_sha256':old_source,'new_source_sha256':new_source,'changed_visual_frame_range':[0,377],'raster_parts_rerendered':[[0,299],[300,599]],'retained_muted_parts':retained,'basis':'All other scene code/assets and all timeline positions/durations are byte-identical after normalizing composition ID and first-scene Studio label. The master is encoded again for all 3000 frames with the updated soundtrack.','voice_recording_used':False}
(root/'renders/checkpoint-reuse.json').write_text(json.dumps(result,indent=2)+'\n');print('Verified and retained',len(retained),'unaffected muted parts; first 600 frames will be rendered again.')
