"""Check recorded metadata without opening any pre-existing repository file."""
from pathlib import Path
import os,json,datetime
project=Path(__file__).resolve().parent.parent
repo=project.parent.parent
baseline=json.loads((project/'work/preexisting-file-metadata.json').read_text())
changed=[]
missing=[]
for name,expected in baseline.items():
 p=repo/name
 try:
  s=p.lstat()
 except FileNotFoundError:
  missing.append(name);continue
 current={'size':s.st_size,'mtime_ns':s.st_mtime_ns,'ctime_ns':s.st_ctime_ns,'mode':s.st_mode}
 if current!=expected:changed.append({'path':name,'before':expected,'after':current})
new_outside=[]
for base,dirs,files in os.walk(repo):
 for name in files:
  p=Path(base)/name
  rel=str(p.relative_to(repo))
  if rel not in baseline and not p.is_relative_to(project):new_outside.append(rel)
report={'repository':str(repo),'isolated_project':str(project),'method':'lstat size/mtime_ns/ctime_ns/mode; existing file contents never opened','preexisting_files_checked':len(baseline),'preexisting_changed':changed,'preexisting_missing':missing,'new_files_outside_project':new_outside,'passed':not(changed or missing or new_outside)}
(project/'out/safety-audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
if not report['passed']:raise SystemExit(1)
