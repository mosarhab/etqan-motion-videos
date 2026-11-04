"""Validate the rendered MP4, document the isolated delivery, and archive source."""
from pathlib import Path
import json,subprocess,hashlib,zipfile,os
root=Path(__file__).resolve().parent.parent
os.chdir(root)
video=root/'out/etqan-riyadh-brand-film-60s.mp4'
if not video.is_file():raise SystemExit('Render missing')
for name in ['render-proof.json','production-report.md','created-files.txt','etqan-riyadh-brand-film-source.zip']:
 if (root/'out'/name).exists():raise SystemExit(f'Destination already exists: {name}')
metadata=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in metadata['streams'] if s['codec_type']=='video')
a=next(s for s in metadata['streams'] if s['codec_type']=='audio')
assert (v['codec_name'],v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==('h264',1080,1920,'30/1',1800),v
assert abs(float(v['duration'])-60)<.001,v['duration']
assert abs(float(metadata['format']['duration'])-60)<.001,metadata['format']['duration']
assert a['codec_name']=='aac'
with open('work/decode-check.log','w') as log:
 result=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],stdout=log,stderr=log)
assert result.returncode==0,'MP4 decode failed'
subprocess.run(['python3','scripts/audit-project.py'],check=True,stdout=subprocess.DEVNULL)
safety=json.loads((root/'out/safety-audit.json').read_text())
proof={'status':'review_render_pending_authentic_logo','file':str(video.relative_to(root)),'bytes':video.stat().st_size,'megabytes_decimal':round(video.stat().st_size/1000000,3),'sha256':hashlib.file_digest(open(video,'rb'),'sha256').hexdigest(),'video_codec':v['codec_name'],'profile':v.get('profile'),'pixel_format':v.get('pix_fmt'),'width':v['width'],'height':v['height'],'fps':v['r_frame_rate'],'frames':int(v['nb_frames']),'duration_seconds':float(v['duration']),'container_duration_seconds':float(metadata['format']['duration']),'audio_codec':a['codec_name'],'audio_sample_rate':a['sample_rate'],'audio_channels':a['channels'],'full_decode_errors':(root/'work/decode-check.log').read_text(),'composition_metadata':json.loads((root/'work/composition-metadata.json').read_text()),'existing_files_unchanged':safety['passed'],'unsatisfied_requirements':['Authentic ETQAN logo source PNG missing at repository root; no logo asset copied or invented','Exact navy/yellow cannot be sampled without authentic logo','Opening/arrival and final authentic logo reveal and English tagline legibility pending source PNG'],'browser_preview':json.loads((root/'work/browser-preview-proof.json').read_text()),'ffprobe':metadata}
(root/'out/render-proof.json').write_text(json.dumps(proof,indent=2,ensure_ascii=False)+'\n')
authored=[p for p in root.rglob('*') if p.is_file() and p.parts[len(root.parts)] not in ['node_modules','work','out'] and '__pycache__' not in p.parts]
paths='\n'.join(f'- `{p.relative_to(root)}`' for p in sorted(authored))
report=f'''# ETQAN Riyadh · production and verification report

**Review render completed. Branded delivery is not final: the authentic source logo is missing.**

The new independent project is `/workspace/etqan-motion-videos/projects/etqan-riyadh-brand-film-60s/`. No existing project, video, shared configuration, dependency or root file changed. This repository contained no earlier video projects. Existing source contents were not read; repository inspection used file/directory listings and metadata. All {safety['preexisting_files_checked']} recorded pre-existing files retain their size, mtime_ns, ctime_ns and mode. No new files were found outside the isolated project. See [safety-audit.json](safety-audit.json).

## Render proof

- Output: `out/etqan-riyadh-brand-film-60s.mp4`
- Duration: {proof['duration_seconds']:.3f} seconds; 1800 frames; 30/1 fps
- Image: 1080 × 1920; H.264 {proof['profile']}; {proof['pixel_format']}
- Audio: original synthesized score; AAC; {a['sample_rate']} Hz; {a['channels']} channels
- Size: {proof['bytes']:,} bytes ({proof['megabytes_decimal']} MB)
- SHA-256: `{proof['sha256']}`
- TypeScript check passed. Composition metadata checked before rendering. Full MP4 decoded with FFmpeg without errors. Chromium loaded the Studio composition, played the exported MP4, and sought to 46 seconds with 1080×1920 dimensions and a 60-second browser-reported duration. FFprobe and browser evidence: [render-proof.json](render-proof.json).

## Production

Eight separate scene components and connected Studio compositions follow the requested exact chapter timing: 0–7, 7–17, 17–25, 25–34, 34–43, 43–51, 51–56 and 56–60 seconds. A separate main composition, `EtqanRiyadhBrandFilm60s`, contains 1800 frames. Engineering-line transition overlays preserve this duration. All motion uses frame-number-driven easing, procedural deterministic geometry and layered SVG illustrations. Cairo fonts are local and preloaded. Arabic copy uses native RTL shaping. No actual laboratory footage, personnel, client report, test result, accreditation or scale claim is fabricated.

The film begins with an orthographic Earth, resolves into the Arabian Peninsula and Saudi outline, then follows Riyadh to the laboratory point at **24.829475° N, 46.828527° E**. The pin shares the map's Mercator projection and is never manually assigned a screen location. Natural Earth boundaries are public domain. The original local-area grid is explicitly labeled as illustrative and is not a street map. No Google imagery, tiles or trademarks are rendered. See `CREDITS.md`.

The sample journey animates a site, pathway and three labeled sample containers. Soil strata and an extracting sampler, concrete cylinders and a moving compression platen, and an asphalt core scanning ring and sieves form original engineering vignettes. Decorative measurements have no numeric test values and are identified as symbolic. Reporting is expressly an illustrative template without client data. The ending preserves the exact supplied Arabic name and tagline.

## Visual verification

Representative frames 0, 90, 205, 270, 365, 455, 509, 620, 850, 1000, 1160, 1290, 1400, 1580, 1679, 1740 and 1799 were rendered and inspected, covering the globe, Saudi outline, pin/grid, Arabic title, sample pathway, soil, concrete, asphalt, report, scene seams, final name and final-frame hold. Font shaping is connected and RTL; key titles stay inside portrait safe margins. Review corrections resolved globe/title overlap, report-label overflow and platen/specimen clearance. [review-contact-sheet.jpg](review-contact-sheet.jpg) shows six reviewed representative frames. [decoded-mp4-contact-sheet.jpg](decoded-mp4-contact-sheet.jpg) also shows seven frames decoded from the actual MP4, including the final frame. The authentic final logo cannot be inspected because its source is absent.

## Unsatisfied requirements

`/workspace/etqan-motion-videos/etqan-logo.png` was absent. No substitute logo was generated, no original logo was modified, and no `public/assets/etqan-logo.png` was invented. Therefore the authentic-logo arrival, premium final logo reveal, tiny English tagline legibility, and exact logo-derived palette remain **unsatisfied**. Navy `#123c60` and yellow `#efc447` are provisional. Every scene visibly states that this is a preview with the original logo unavailable. The missing-logo area is text explaining the absence, not recreated brand artwork.

The Remotion template downloader could not complete its direct DNS lookup; an isolated equivalent scaffold was authored manually, with its own package.json and lockfile. Chromium needed a relative in-project temp path to respect Unix socket path limits. Shared-memory capture caused an encoder pipe failure; persistent Remotion frame capture and system FFmpeg H.264/AAC encoding completed the export. The in-composition original-score timing and volume are preserved in the encoded soundtrack. No MP4 from an existing project was touched. The film was not deployed, published, pushed to GitHub or sent to any external service. A public artifact-upload facility was unavailable; preview/download is provided by a localhost-only server exposing this output directory.

## Preview and source

- Play/download locally: http://localhost:3001/preview.html
- Remotion Studio: http://localhost:3000/EtqanRiyadhBrandFilm60s
- Source archive: [etqan-riyadh-brand-film-source.zip](etqan-riyadh-brand-film-source.zip), excluding dependencies, caches and MP4. Reinstall reproducibly with `npm ci --cache work/npm-cache`.
- Exact paths of every newly present file, including dependencies and caches: [created-files.txt](created-files.txt). All paths are repository-relative and start with `projects/etqan-riyadh-brand-film-60s/`.

## Authored source, documentation and licensed assets

{paths}

## User-facing generated outputs

- `out/etqan-riyadh-brand-film-60s.mp4`
- `out/preview.html`
- `out/review-contact-sheet.jpg`
- `out/decoded-mp4-contact-sheet.jpg`
- `out/render-proof.json`
- `out/safety-audit.json`
- `out/production-report.md`
- `out/created-files.txt`
- `out/etqan-riyadh-brand-film-source.zip`
'''
(root/'out/production-report.md').write_text(report)
# Include prospective archive and manifest names so the final manifest covers both.
repo=root.parent.parent
all_paths={str(p.relative_to(repo)) for p in root.rglob('*') if p.is_file() or p.is_symlink()}
all_paths.add(str((root/'out/created-files.txt').relative_to(repo)))
all_paths.add(str((root/'out/etqan-riyadh-brand-film-source.zip').relative_to(repo)))
(root/'out/created-files.txt').write_text('\n'.join(sorted(all_paths))+'\n')
with zipfile.ZipFile(root/'out/etqan-riyadh-brand-film-source.zip','x',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for p in sorted(authored):z.write(p,p.relative_to(root))
 for name in ['production-report.md','render-proof.json','safety-audit.json','created-files.txt','preview.html','review-contact-sheet.jpg','decoded-mp4-contact-sheet.jpg']:
  z.write(root/'out'/name,'out/'+name)
print(json.dumps({k:v for k,v in proof.items() if k not in ['ffprobe','composition_metadata']},indent=2))
print('Exact newly present file paths:',len(all_paths))
