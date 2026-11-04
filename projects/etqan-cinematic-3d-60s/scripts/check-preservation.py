from pathlib import Path
import json
root=Path(__file__).resolve().parent.parent
repo=root.parent.parent
baseline=json.loads((root/'work/old-file-metadata.json').read_text())
changed=[];missing=[]
for name,old in baseline.items():
 p=repo/name
 try:s=p.lstat()
 except FileNotFoundError:missing.append(name);continue
 now={'size':s.st_size,'mtime_ns':s.st_mtime_ns,'ctime_ns':s.st_ctime_ns,'mode':s.st_mode}
 if now!=old:changed.append(name)
report={'preexisting_files_checked':len(baseline),'modified_preexisting_files':changed,'missing_preexisting_files':missing,'passed':not changed and not missing,'scope':'All authored changes confined to projects/etqan-cinematic-3d-60s/; Git metadata excluded from this file-content preservation check.'}
(root/'work/preservation-proof.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
if not report['passed']:raise SystemExit(1)
