"""Private loopback QA server; serves only generated outputs and supports media seeking."""
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from functools import partial
import re
root=Path(__file__).resolve().parent.parent/'out'
class Handler(SimpleHTTPRequestHandler):
 def end_headers(self):
  self.send_header('Accept-Ranges','bytes');self.send_header('Cache-Control','no-store');super().end_headers()
 def send_head(self):
  self.byte_range=None;p=Path(self.translate_path(self.path)).resolve()
  if not p.is_relative_to(root.resolve()):self.send_error(403);return None
  match=re.fullmatch(r'bytes=(\d*)-(\d*)',self.headers.get('Range',''))
  if not match or not p.is_file():return super().send_head()
  size=p.stat().st_size;a,b=match.groups()
  start=int(a) if a else max(0,size-int(b));end=min(int(b) if a and b else size-1,size-1)
  if start>=size or start>end:self.send_response(416);self.send_header('Content-Length','0');self.end_headers();return None
  self.send_response(206);self.send_header('Content-Type',self.guess_type(str(p)));self.send_header('Content-Range',f'bytes {start}-{end}/{size}');self.send_header('Content-Length',str(end-start+1));self.end_headers();f=p.open('rb');f.seek(start);self.byte_range=(start,end);return f
 def copyfile(self,source,out):
  if self.byte_range is None:return super().copyfile(source,out)
  n=self.byte_range[1]-self.byte_range[0]+1
  while n:
   data=source.read(min(1048576,n))
   if not data:break
   out.write(data);n-=len(data)
ThreadingHTTPServer(('127.0.0.1',3011),partial(Handler,directory=str(root))).serve_forever()
