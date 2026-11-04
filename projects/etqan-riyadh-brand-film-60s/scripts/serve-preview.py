"""Localhost-only, output-directory-only preview with byte-range video seeking."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from functools import partial
import re,shutil
output=Path(__file__).resolve().parent.parent/'out'
class PreviewHandler(SimpleHTTPRequestHandler):
 def end_headers(self):
  self.send_header('Accept-Ranges','bytes')
  self.send_header('Cache-Control','no-store')
  super().end_headers()
 def send_head(self):
  self.byte_range=None
  target=Path(self.translate_path(self.path)).resolve()
  if not target.is_relative_to(output.resolve()):
   self.send_error(403);return None
  header=self.headers.get('Range')
  if not header or not target.is_file():return super().send_head()
  match=re.fullmatch(r'bytes=(\d*)-(\d*)',header)
  if not match:return super().send_head()
  size=target.stat().st_size
  first,last=match.groups()
  if first:start=int(first);end=min(int(last) if last else size-1,size-1)
  else:start=max(0,size-int(last));end=size-1
  if start>=size or start>end:
   self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.send_header('Content-Length','0');self.end_headers();return None
  self.send_response(206)
  self.send_header('Content-Type',self.guess_type(str(target)))
  self.send_header('Content-Length',str(end-start+1))
  self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
  self.end_headers()
  stream=target.open('rb');stream.seek(start);self.byte_range=(start,end);return stream
 def copyfile(self,source,out):
  if not self.byte_range:return super().copyfile(source,out)
  remaining=self.byte_range[1]-self.byte_range[0]+1
  while remaining:
   data=source.read(min(1024*1024,remaining))
   if not data:break
   out.write(data);remaining-=len(data)
handler=partial(PreviewHandler,directory=str(output))
ThreadingHTTPServer(('127.0.0.1',3001),handler).serve_forever()
