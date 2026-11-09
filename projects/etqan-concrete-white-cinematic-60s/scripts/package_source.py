"""Ship editable source and licensed assets; never cache, old uploads or dependencies."""
from pathlib import Path
import zipfile,json,hashlib
root=Path(__file__).resolve().parents[1];out=root/'renders/etqan-concrete-source.zip'
files=[]
for p in root.iterdir():
 if p.is_file() and (p.name in ['.gitignore','README.md','ASSETS.md','QA.md','package.json','package-lock.json','tsconfig.json','remotion.config.ts','requirements.txt']):files.append(p)
for folder in ['src','public','scripts','narration']:
 files.extend(p for p in (root/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.suffix not in ['.pyc','.log'])
for name in ['verification.json','geometry-check.json','camera-check.json','audio-design.json','score-loudness.json','brand-check.json','playback-check.json','review-frames.json','prior-project-preservation.json','arabic-copy-audit.json','render-provenance.json']:
 p=root/'renders'/name
 if p.exists():files.append(p)
if (root/'renders/provenance').exists():files.extend(p for p in (root/'renders/provenance').rglob('*') if p.is_file())
assert all(p.suffix.lower() not in ['.mp3','.xlsx','.env'] for p in files)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(files):z.write(p,root.name+'/'+str(p.relative_to(root)))
with zipfile.ZipFile(out) as z:assert z.testzip() is None
result={'archive':out.name,'bytes':out.stat().st_size,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'file_count':len(files),'files':[str(p.relative_to(root)) for p in sorted(files)],'excludes':['node_modules','work','rendered video and QA images','previous projects','private voice recordings','spreadsheets']}
(root/'renders/source-package.json').write_text(json.dumps(result,indent=2)+'\n');print(out.name, len(files),'files',out.stat().st_size,'bytes; integrity passed')
