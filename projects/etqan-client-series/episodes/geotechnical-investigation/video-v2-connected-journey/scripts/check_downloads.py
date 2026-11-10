"""Check anonymous public delivery URLs against the local artifact hashes."""
from pathlib import Path
import hashlib,json,sys,subprocess,time,urllib.request
root=Path(__file__).resolve().parents[1]
repo=next(p for p in root.parents if (p/'.git').exists())
relative_root=root.relative_to(repo).as_posix()
ref=sys.argv[1] if len(sys.argv)>1 else subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
items=['renders/etqan-series-geotechnical-v2-60s.mp4','renders/etqan-series-geotechnical-v2-source.zip','renders/etqan-series-geotechnical-v2-cover.png','narration/script.txt','narration/cues.json']
results=[]
for item in items:
 expected=hashlib.sha256((root/item).read_bytes()).hexdigest();url=f'https://raw.githubusercontent.com/mosarhab/etqan-motion-videos/{ref}/{relative_root}/{item}'
 for attempt in range(3):
  try:
   digest=hashlib.sha256();size=0
   with urllib.request.urlopen(url,timeout=30) as response:
    status=response.status
    while data:=response.read(1024*1024):digest.update(data);size+=len(data)
   break
  except Exception:
   if attempt==2:raise
   time.sleep(2)
 actual=digest.hexdigest();assert status==200 and actual==expected,(item,status,actual,expected)
 result={'path':item,'url':url,'status':status,'bytes':size,'sha256':actual,'matches_local':True};results.append(result);print(json.dumps(result),flush=True)
(root/'work').mkdir(exist_ok=True)
(root/'work/download-check.json').write_text(json.dumps({'public_anonymous_access':True,'commit':ref,'files':results},indent=2)+'\n')
