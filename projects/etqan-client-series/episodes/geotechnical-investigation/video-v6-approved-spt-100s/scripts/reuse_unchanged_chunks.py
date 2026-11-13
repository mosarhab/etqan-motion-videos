"""Optional verified reuse of unchanged V5 muted parts; standalone export renders all."""
from pathlib import Path
import json, hashlib, subprocess, shutil
root = Path(__file__).resolve().parents[1]
base = root.parent / 'video-v5-spt-report-review-100s'
prior = base / 'work/checkpoints'
if not prior.exists():
    print('No prior cache; render.mjs will render all frames.')
    raise SystemExit(0)
def files(folder):
    return {str(p.relative_to(folder)): p.read_bytes() for sub in ['src', 'public'] for p in (folder / sub).rglob('*') if p.is_file()}
def fingerprint(folder):
    h = hashlib.sha256()
    def scan(path):
        for p in sorted(path.iterdir()):
            if p.is_dir(): scan(p)
            else:
                h.update(str(p.relative_to(folder)).encode()); h.update(p.read_bytes())
    scan(folder / 'src'); scan(folder / 'public'); h.update((folder / 'package-lock.json').read_bytes())
    return h.hexdigest()
old, new = files(base), files(root)
changed = sorted(k for k in old.keys() | new.keys() if old.get(k) != new.get(k))
assert set(changed) == {'src/Root.tsx', 'src/SPT.tsx', 'src/SPTDetail.tsx', 'src/Chemistry.tsx'}, changed
assert new['src/Root.tsx'].decode().replace('EtqanSeriesGeotechnicalV6', 'EtqanSeriesGeotechnicalV5') == old['src/Root.tsx'].decode()
assert (root / 'package-lock.json').read_text() == (base / 'package-lock.json').read_text().replace('etqan-series-geotechnical-v5', 'etqan-series-geotechnical-v6')
previous_source = fingerprint(base)
assert previous_source == (prior / 'source-sha256.txt').read_text().strip()
assert previous_source == json.loads((base / 'renders/verification.json').read_text())['source_sha256']
source = fingerprint(root); cache = root / 'work/checkpoints'; cache.mkdir(exist_ok=True)
retained = []
for start in [0, 300, 1500, 1800, 2700]:
    name = f'frames-{start:04d}-{start + 299:04d}.mp4'; p = prior / name
    v = json.loads(subprocess.check_output(['ffprobe','-v','error','-count_frames','-show_streams','-of','json',str(p)], text=True))['streams']
    assert len(v) == 1 and v[0]['codec_type'] == 'video'
    assert (v[0]['width'], v[0]['height'], v[0]['avg_frame_rate'], int(v[0]['nb_read_frames'])) == (1080, 1920, '30/1', 300)
    shutil.copy2(p, cache / name)
    retained.append({'frames': [start, start + 299], 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()})
(cache / 'source-sha256.txt').write_text(source + '\n')
result = {'verified': True, 'previous_source_sha256': previous_source, 'new_source_sha256': source,
          'changed_source_files': changed, 'changed_visual_frame_ranges': [[660,1307],[2340,2597]],
          'rerendered_parts': [[600,899],[900,1199],[1200,1499],[2100,2399],[2400,2699]],
          'retained_muted_parts': retained,
          'basis': 'Only SPT and Chemistry visual code changes; all other scene code, all public assets, pinned dependencies and the complete timeline are identical. Every part intersecting those scenes is rendered again. The full master and all delivery checks are regenerated.'}
(root / 'renders/revision-cache-check.json').write_text(json.dumps(result, indent=2) + '\n')
print('Five unchanged muted parts verified and copied; five affected parts will be rendered again.')
