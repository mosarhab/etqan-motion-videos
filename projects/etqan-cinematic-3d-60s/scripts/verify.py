"""Verify the final MP4 and report the production's real technical limits."""
from pathlib import Path
import subprocess,json,hashlib,os
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent.parent
os.chdir(root)
video=root/'out/etqan-cinematic-3d-60s.mp4'
for name in ['render-proof.json','verification-report.md','contact-sheet.jpg']:
 if (root/'out'/name).exists():raise SystemExit('Refusing to overwrite '+name)
meta=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]))
v=next(s for s in meta['streams'] if s['codec_type']=='video')
a=next(s for s in meta['streams'] if s['codec_type']=='audio')
assert (v['codec_name'],v['width'],v['height'],v['r_frame_rate'],int(v['nb_frames']))==('h264',1080,1920,'30/1',1800)
assert float(v['duration'])==60 and float(meta['format']['duration'])==60
assert a['codec_name']=='aac' and a['channels']==2
with open('work/decode-final.log','w') as log:subprocess.run(['ffmpeg','-v','error','-i',str(video),'-f','null','-'],check=True,stdout=log,stderr=log)
vol=subprocess.run(['ffmpeg','-hide_banner','-i',str(video),'-vn','-af','volumedetect','-f','null','-'],text=True,stdout=subprocess.PIPE,stderr=subprocess.PIPE,check=True)
volume_lines=[x for x in vol.stderr.splitlines() if 'mean_volume' in x or 'max_volume' in x]
assert volume_lines and not any('-inf' in x for x in volume_lines)
Path('work/final-audio-volume.txt').write_text('\n'.join(volume_lines)+'\n')
subprocess.run(['python3','scripts/check-preservation.py'],check=True,stdout=subprocess.DEVNULL)
preservation=json.loads(Path('work/preservation-proof.json').read_text())
logo=Path('public/assets/etqan-logo.png').read_bytes();logo_blob=hashlib.sha1(f'blob {len(logo)}\0'.encode()+logo).hexdigest();assert logo_blob=='731714d1fbf04b75278aa277dc697f498af9881d'
frames=[90,420,650,900,1190,1460,1610,1650,1690,1765,1799]
folder=Path('work/decoded-final');folder.mkdir(exist_ok=False)
expr="select='"+'+'.join(f'eq(n,{x})' for x in frames)+"'"
subprocess.run(['ffmpeg','-v','error','-n','-i',str(video),'-vf',expr,'-fps_mode','vfr',str(folder/'frame-%02d.png')],check=True)
canvas=Image.new('RGB',(1440,2010),'#101820');draw=ImageDraw.Draw(canvas)
for i,frame in enumerate(frames):
 im=Image.open(folder/f'frame-{i+1:02d}.png');im.thumbnail((360,640));canvas.paste(im,((i%4)*360,(i//4)*670+30));draw.text(((i%4)*360+9,(i//4)*670+8),f'MP4 frame {frame}',fill='white')
canvas.save('out/contact-sheet.jpg',quality=94)
proof={'status':'rendered_and_decoded','project':'projects/etqan-cinematic-3d-60s/','file':'out/'+video.name,'bytes':video.stat().st_size,'sha256':hashlib.file_digest(video.open('rb'),'sha256').hexdigest(),'video_codec':v['codec_name'],'profile':v.get('profile'),'pixel_format':v.get('pix_fmt'),'resolution':[1080,1920],'fps':'30/1','frames':1800,'duration_seconds':float(v['duration']),'container_duration_seconds':float(meta['format']['duration']),'audio_codec':a['codec_name'],'audio_channels':a['channels'],'audio_sample_rate':a['sample_rate'],'audio_volume_check':volume_lines,'full_decode_errors':Path('work/decode-final.log').read_text(),'logo_blob_sha':logo_blob,'logo_unchanged':True,'brand_palette':{'navy':'#1D305B','yellow':'#F6C717'},'render_method':'Native frame-driven Three.js meshes inside Remotion ThreeCanvas; PBR and generated reflection environment; no photos or static scene images','three_pass_resolution':[720,1280],'output_typography_and_logo_resolution':[1080,1920],'frame_interpolation':False,'representative_decoded_frames':frames,'location_anchor_source':'Coordinates explicitly supplied by the user earlier in this thread for the same Maps reference','location_anchor':{'latitude':24.829475,'longitude':46.828527},'location_short_link_independently_verified':False,'abstract_city_is_surveyed_streets':False,'preservation':preservation,'ffprobe':meta}
Path('out/render-proof.json').write_text(json.dumps(proof,ensure_ascii=False,indent=2)+'\n')
report=f'''# ETQAN · Cinematic 3D · التحقق من الإنتاج

أُنتج هذا الفيلم في مشروع مستقل: `projects/etqan-cinematic-3d-60s/`. المشاهد مبنية من هندسة ثلاثية الأبعاد فعلية داخل Three.js وRemotion، وليست صورًا ثابتة أو شرائح مصوّرة. لا تُستخدم صور فوتوغرافية أو صور مولّدة بالذكاء الاصطناعي أو لقطات مخزون. الصورة الثابتة الوحيدة المستخدمة في الإعلان هي شعار ETQAN الأصلي.

## مواصفات الملف

- الملف: `etqan-cinematic-3d-60s.mp4`
- المدة: **60.000 ثانية**، 1800 إطار، 30 إطارًا/ثانية
- الأبعاد: **1080×1920**، رأسي 9:16
- الفيديو: H.264 {v.get('profile')}; {v.get('pix_fmt')}
- الصوت: AAC ستيريو، {a['sample_rate']} Hz، موسيقى ومؤثرات أصلية
- الحجم: {video.stat().st_size:,} بايت
- SHA-256: `{proof['sha256']}`
- نجح فحص TypeScript، وفحص بيانات التركيب، وفك ترميز الملف كاملًا باستخدام FFmpeg دون أخطاء.
- يحتوي الصوت على إشارة غير صامتة؛ نتائج مستوى الصوت محفوظة في [ملف التحقق](render-proof.json).

## المشاهد والحركة

الأرض ثلاثية الأبعاد ذات كتل قارية مثلثة من بيانات جغرافية مفتوحة، وإضاءة حافة جوية وجسيمات أصلية. تنتقل الكاميرا إلى مجسم السعودية ثم موقع الرياض. بعد ذلك تتحرك داخل بيئة مختبر افتراضية، وتعرض سحب عينة تربة وخليّة فحص، وجهاز ضغط خرسانة بأعمدة ومكبس وصفيحتي تحميل، ثم جهاز تحميل أسفلت بأسلوب Marshall مع رأسين منحنيين وعينة وغرابيل وركام. يربط مونتاج بكاميرات متحركة بيئات الفحص قبل ظهور الشعار.

تُحسب الكاميرات والأجزاء الميكانيكية والجسيمات والانتقالات من رقم الإطار. رُندرت الحالات الزمنية الأصلية لكل الإطارات، دون توليد إطارات وسيطة بالـ optical flow. الخامات انعكاسية ومولّدة برمجيًا، مع ظلال وعمق مجال ومعالجة لونية سينمائية. تفاصيل الشدات والخراطيم والمسامير والعيّنات هندسة فعلية وليست أيقونات مسطّحة.

التوقيت هو 0–8، 8–18، 18–25، 25–35، 35–45، 45–53، 53–57، 57–60 ثانية. النصوص مقتصرة على العبارات العربية المطلوبة، واسم المختبر، والمدينة، والعبارة الختامية. لا أرقام مشاهد، أو إحداثيات، أو لوحات بيانات، أو جداول، أو تقارير أو نتائج مختلقة، أو ملصقات معاينة في الإعلان.

## الهوية والمراجعة البصرية

الشعار نسخة مطابقة للأصل في جذر المستودع، Git blob `{logo_blob}`، دون قص أو تغيير ألوان أو حروف أو نسب. استُخدم الكحلي `#1D305B` والأصفر `#F6C717` من ألوانه الأصلية. خط Cairo محلي مع اتجاه عربي RTL. فُحصت لقطات كل مشهد والنص العربي وظهور الشعار والنهاية بصريًا. [لوحة الإطارات المفكوكة من MP4](contact-sheet.jpg) تعرض أمثلة من الملف الفعلي.

## حدود يجب معرفتها

- الأسلوب **رسوم سينمائية ثلاثية الأبعاد في الزمن الحقيقي**، وليس تصويرًا حقيقيًا أو إعادة بناء فوتوغرافية لمختبر ETQAN الفعلي. لا يظهر أشخاص أو منشآت يُدّعى أنها موثقة.
- بسبب اعتماد البيئة على GPU برمجي، يُرندر التمرير ثلاثي الأبعاد داخليًا بدقة 720×1280 مع تنعيم حواف، ثم يُركّب مع العربية والشعار بدقة 1080×1920. دقة MP4 النهائية 1080×1920. هذه الحدود التقنية موثقة بدل الادعاء بجودة path tracing فوتوغرافية.
- تعذّر فتح رابط Google Maps المختصر للتحقق المستقل. موضع المنارة يستند إلى الإحداثيات التي زوّد بها المستخدم سابقًا لنفس الرابط. لا يُعرض عنوان شارع أو إحداثيات على الشاشة، والكتل العمرانية إجرائية تجريدية وليست شبكة شوارع أو مباني مساحية دقيقة. لا يُدّعى أن موقع الخرائط الحي قد تم التحقق منه بشكل مستقل.

## حفظ المشاريع السابقة

فُحصت بيانات {preservation['preexisting_files_checked']:,} ملفًا سابقًا. لم يتغيّر أو يُحذف أي منها. التعديلات المؤلفة محصورة بالمشروع الجديد، ولا تُستخدم المشاريع السابقة كاعتماديات. راجع [التحقق الآلي](render-proof.json) و[CREDITS.md](../CREDITS.md) للمصادر والتراخيص.

## التسليم

جارٍ التحقق من التنزيل العام عبر HTTPS. لا يُعد التسليم الخارجي مكتملًا حتى يتم رفع الفرع وتنزيل MP4 ومطابقة بصمته. سيُضاف إثبات التنزيل إلى هذا التقرير بعد الاختبار الفعلي.
'''
Path('out/verification-report.md').write_text(report)
print(json.dumps({k:x for k,x in proof.items() if k not in ['ffprobe']},ensure_ascii=False,indent=2))
