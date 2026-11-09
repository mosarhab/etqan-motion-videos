"""Package editable source, brand/font licenses, original score and QA evidence."""
from pathlib import Path
import zipfile,json,hashlib
root=Path(__file__).resolve().parents[1];out=root/'renders/etqan-concrete-portrait-v2-source.zip';files=[]
for name in ['.gitignore','README.md','ASSETS.md','QA.md','package.json','package-lock.json','tsconfig.json','requirements.txt']:
 p=root/name
 if p.exists():files.append(p)
for folder in ['src','public','scripts','narration','notes']:
 files.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix not in ['.pyc','.log'])
for name in ['verification.json','geometry-check.json','audio-design.json','playback-check.json','review-frames.json','prior-project-preservation.json','copy-revision-check.json']:
 p=root/'renders'/name
 if p.exists():files.append(p)
assert not any(p.suffix.lower() in ['.mp3','.xlsx','.env'] or p.is_symlink() for p in files)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(files):z.write(p,root.name+'/'+str(p.relative_to(root)))
with zipfile.ZipFile(out) as z:assert z.testzip() is None
result={'archive':out.name,'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'file_count':len(files),'files':[str(p.relative_to(root)) for p in sorted(files)],'excludes':['dependencies','temporary render cache','previous projects','previous voice recordings','spreadsheet uploads','rendered video and QA images']}
(root/'renders/source-package.json').write_text(json.dumps(result,indent=2)+'\n');print('Source ZIP verified:',len(files),'files;',out.stat().st_size,'bytes')
