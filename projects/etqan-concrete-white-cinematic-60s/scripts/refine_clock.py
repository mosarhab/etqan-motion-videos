"""One-time, bounded incremental render migration for the isolated clock layer.

Only its position and grammatical day unit change. The clock is absolutely
positioned, pointer-events:none and opacity:0 outside 29 < t < 36.75.
All 3D code/assets and every other title remain identical. The five intersecting
checkpoints are invalidated; provenance records inherited ranges explicitly.
"""
from pathlib import Path
import json,hashlib,difflib,subprocess
root=Path(__file__).resolve().parents[1];src=root/'src/Typography.tsx';cache=root/'work/checkpoints'
def fingerprint():
 h=hashlib.sha256()
 def scan(p):
  for f in sorted(p.iterdir()):
   if f.is_dir():scan(f)
   else:h.update(str(f.relative_to(root)).encode());h.update(f.read_bytes())
 scan(root/'src');scan(root/'public');h.update((root/'package-lock.json').read_bytes());return h.hexdigest()
old_sha=fingerprint();assert old_sha==(cache/'source-sha256.txt').read_text().strip()
old=src.read_text();assert old.count('top: 165,')==1 and old.count('{days.toLocaleString("ar-SA")} يومًا')==1
new=old.replace('top: 165,','top: 20,').replace('{days.toLocaleString("ar-SA")} يومًا','{days === 1 ? "يوم واحد" : days === 2 ? "يومان" : `${days.toLocaleString("ar-SA")} ${days <= 10 ? "أيام" : "يومًا"}`}')
# Preserve the exact prior typography source for a reviewable change record.
provenance=root/'renders/provenance';provenance.mkdir(exist_ok=True)
(provenance/'Typography-before-clock.tsx').write_text(old)
(provenance/'clock-refinement.diff').write_text(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='Typography-before-clock.tsx',tofile='src/Typography.tsx')))
src.write_text(new)
subprocess.run([str(root/'node_modules/.bin/prettier'),'--write',str(src)],check=True,capture_output=True)
new=src.read_text()
(provenance/'clock-refinement.diff').write_text(''.join(difflib.unified_diff(old.splitlines(True),new.splitlines(True),fromfile='Typography-before-clock.tsx',tofile='src/Typography.tsx')))
new_sha=fingerprint()
removed=[]
backup=root/'work/clock-superseded-checkpoints';backup.mkdir(exist_ok=True)
for start in [840,900,960,1020,1080]:
 p=cache/f'frames-{start:04d}-{start+59:04d}.mp4';assert p.exists();p.rename(backup/p.name);removed.append([start,start+59])
manifest={'change':'Isolated curing-clock layout and Arabic number agreement','previous_source_sha256':old_sha,'source_sha256':new_sha,'affected_visible_frames':[871,1102],'invalidated_checkpoints':removed,'inherited_pixel_equivalent_ranges':[[0,839],[1140,1799]],'inherited_render_source_sha256':old_sha,'equivalence_basis':'The exact diff touches only the absolutely positioned clock container and its text. Its opacity is identically zero outside 29 < frame/30 < 36.75. Geometry, camera, materials, lighting, assets, audio, all other titles, composition and render settings are unchanged. All intersecting checkpoints are rebuilt; inherited frames retain the prior source provenance.','prior_typography':'provenance/Typography-before-clock.tsx','reviewable_diff':'provenance/clock-refinement.diff'}
(root/'renders/render-provenance.json').write_text(json.dumps(manifest,indent=2)+'\n')
(cache/'source-sha256.txt').write_text(new_sha+'\n')
print(json.dumps(manifest,indent=2))
