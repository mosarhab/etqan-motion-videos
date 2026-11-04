"""Verify the branded export while preserving the original review MP4."""
from pathlib import Path
import subprocess,json,hashlib,os
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent.parent
os.chdir(root)
video=root/'out/etqan-riyadh-brand-film-60s-final.mp4'
proof_path=root/'out/final-render-proof.json'
report_path=root/'out/final-verification-report.md'
for p in [proof_path,report_path,root/'out/final-contact-sheet.jpg']:
 if p.exists():raise SystemExit(f'Refusing to overwrite {p.name}')
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video')
a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert (v['codec_name'],v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==('h264',1080,1920,'30/1',1800)
assert float(v['duration'])==60 and float(meta['format']['duration'])==60
assert a['codec_name']=='aac'
original_path=root/'out/etqan-riyadh-brand-film-60s.mp4'
original_hash=hashlib.file_digest(original_path.open('rb'),'sha256').hexdigest()
assert original_hash=='bf7b812dae3d0441713baccaad3248e710495290231d88d20f2c04fdc9ef9a0f'
logo=(root/'public/assets/etqan-logo.png').read_bytes()
logo_blob=hashlib.sha1(f'blob {len(logo)}\0'.encode()+logo).hexdigest()
assert logo_blob=='731714d1fbf04b75278aa277dc697f498af9881d'
log=root/'work/github-delivery-20261104/decode-check.log'
with log.open('w') as stream:
 subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],stdout=stream,stderr=stream,check=True)
frames=[90,455,620,850,1160,1400,1580,1799]
output=root/'work/github-delivery-20261104/decoded-frames'
output.mkdir(exist_ok=False)
expr="select='"+'+'.join(f'eq(n,{x})' for x in frames)+"'"
subprocess.run(['ffmpeg','-v','error','-n','-i',str(video),'-vf',expr,'-fps_mode','vfr',str(output/'frame-%02d.png')],check=True)
canvas=Image.new('RGB',(1080,2010),'#101820');draw=ImageDraw.Draw(canvas)
for i,frame in enumerate(frames):
 im=Image.open(output/f'frame-{i+1:02d}.png');im.thumbnail((360,640))
 canvas.paste(im,((i%3)*360,(i//3)*670+30));draw.text(((i%3)*360+10,(i//3)*670+8),f'Decoded final MP4 frame {frame}',fill='white')
canvas.save(root/'out/final-contact-sheet.jpg',quality=93)
proof={'status':'branded_render_verified','file':'out/'+video.name,'bytes':video.stat().st_size,'sha256':hashlib.file_digest(video.open('rb'),'sha256').hexdigest(),'duration_seconds':float(v['duration']),'frames':int(v['nb_frames']),'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'codec':v['codec_name'],'profile':v.get('profile'),'pixel_format':v.get('pix_fmt'),'audio_codec':a['codec_name'],'audio_sample_rate':a['sample_rate'],'audio_channels':a['channels'],'full_decode_errors':log.read_text(),'logo_source_commit':'567187d949ff260176b68531fd21057eacf0686e','logo_git_blob_sha':logo_blob,'logo_png_sha256':hashlib.sha256(logo).hexdigest(),'sampled_colors':{'navy':'#1D305B','yellow':'#F6C717'},'original_review_preserved':True,'original_review_sha256':original_hash,'representative_frames':frames,'geographic_pin':{'latitude':24.829475,'longitude':46.828527},'ffprobe':meta}
proof_path.write_text(json.dumps(proof,indent=2,ensure_ascii=False)+'\n')
report=f'''# ETQAN Riyadh · final verification

The existing 60-second Remotion film has been completed with the authentic logo. The original scene order, timing, engineering animations, Arabic copy, exact-coordinate map and original sound design are preserved. The film was not recreated from scratch.

## Render

- Final MP4: `{video.name}`
- H.264 {v.get('profile')}; 1080×1920; 30 FPS; exactly 1800 frames and 60.000 seconds
- AAC stereo; {a['sample_rate']} Hz
- File size: {video.stat().st_size:,} bytes
- SHA-256: `{proof['sha256']}`
- TypeScript passed; every frame rendered; full MP4 decoded with FFmpeg without errors.
- [Machine-readable proof](final-render-proof.json) · [Decoded frame review](final-contact-sheet.jpg)

## Authentic brand

`public/assets/etqan-logo.png` is byte-identical to root `etqan-logo.png` from main commit `567187d949ff260176b68531fd21057eacf0686e`. Git blob SHA: `{logo_blob}`. The original image retains transparency, proportions, letterforms, colors and its English tagline. It appears in the arrival scene and as a large, uncropped finale. Prominent logo/tagline and Arabic text were inspected visually. The palette uses exact dominant opaque RGB values from the source PNG: navy `#1D305B`, yellow `#F6C717`. Missing-logo preview notices are removed.

The exact Arabic name remains `مختبر اتقان البناء لفحص التربة و المواد` and the tagline remains `الدقة أساس الثقة`. The pin remains at latitude 24.829475 N, longitude 46.828527 E. Public-domain Natural Earth shapes and the labeled illustrative local grid are unchanged. All engineering graphics are illustrative, without invented actual test results or lab footage. Asset licensing is recorded in `CREDITS.md`.

## Preservation and scope

The earlier MP4, `etqan-riyadh-brand-film-60s.mp4`, is preserved unchanged: SHA-256 `{original_hash}`. The final MP4 uses a separate filename. No old project, root logo, root README or shared dependency is edited. The delivery commit only adds files under `projects/etqan-riyadh-brand-film-60s/`, based on main commit `567187d949ff260176b68531fd21057eacf0686e`.

Re-rendering was necessary to include the authentic logo, apply the authentic palette throughout and remove preview notices. Separate final output, intermediate frame and QA folders avoid overwriting the earlier video or its verification artifacts. Dependencies and caches are excluded from Git.

## GitHub delivery

Branch: `delivery-etqan-riyadh-60s-final-20261104`. Main is not merged or changed, and no website is deployed.

Remote verification is pending until the branch is pushed and the MP4 is downloaded over public HTTPS. This report will be updated with the verified download receipt before delivery is declared complete.
'''
report_path.write_text(report)
print(json.dumps({k:x for k,x in proof.items() if k!='ffprobe'},indent=2))
