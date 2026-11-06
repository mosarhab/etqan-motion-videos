"""Inspect the persistent corporate frame in every encoded frame of the delivery."""
import pathlib,json,subprocess,math
import numpy as np
root=pathlib.Path(__file__).resolve().parents[1]
video=root/'renders/etqan-cinematic-3d-60s.mp4'
layout=json.loads((root/'renders/frame-layout.json').read_text())
filt='[0:v]split=2[h][f];[h]crop=904:118:88:90,scale=452:59:flags=area,format=gray[hc];[f]crop=904:60:88:1720,scale=452:30:flags=area,format=gray[fc];[hc][fc]vstack=inputs=2[out]'
raw=subprocess.run(['ffmpeg','-v','error','-i',str(video),'-filter_complex',filt,'-map','[out]','-f','rawvideo','-pix_fmt','gray','-'],check=True,capture_output=True).stdout
atlas=np.frombuffer(raw,dtype=np.uint8).reshape((-1,89,452));assert len(atlas)==1800
header=atlas[:,:59,:];footer=atlas[:,59:,:]
result={'frames_checked':1800,'header_maximum_mean_gray_difference_from_frame_zero':float(np.abs(header.astype(np.int16)-header[0].astype(np.int16)).mean(axis=(1,2)).max()),'footer_maximum_mean_gray_difference_from_frame_zero':float(np.abs(footer.astype(np.int16)-footer[0].astype(np.int16)).mean(axis=(1,2)).max())}
assert result['header_maximum_mean_gray_difference_from_frame_zero']<12
assert result['footer_maximum_mean_gray_difference_from_frame_zero']<4
regions={
 'corporate_logo':(header,layout['logo'],90,170),
 'company_name':(header,{**layout['company'],'height':50},90,170),
 'company_service_line':(header,{**layout['company'],'y':150,'height':44},90,140),
 'email':(footer,layout['fields']['email'],1720,160),
 'address':(footer,layout['fields']['address'],1720,160),
 'phone':(footer,layout['fields']['phone'],1720,170),
 'creator_credit':(footer,layout['creator'],1720,95),
}
rows={}
for name,(frames,box,origin_y,threshold) in regions.items():
 x0=max(0,math.floor((box['x']-88)/2));y0=max(0,math.floor((box['y']-origin_y)/2));x1=min(452,math.ceil((box['x']+box['width']-88)/2));y1=min(frames.shape[1],math.ceil((box['y']+box['height']-origin_y)/2))
 counts=(frames[:,y0:y1,x0:x1]>threshold).sum(axis=(1,2))
 reference=int(counts[0]);minimum=int(counts.min());assert reference>25,(name,reference)
 assert minimum>=reference*.65,(name,reference,minimum)
 rows[name]={'reference_visible_pixels':reference,'minimum_visible_pixels':minimum,'present_in_all_1800_frames':True}
source=(root/'src/BrandMark.tsx').read_text()
assert all(n not in source for n in ['0575828265','0573870072','0551603205'])
assert layout['fields']['phone']['text']=='0535588975' and layout['fields']['email']['text']=='info@etqanelbnaa.com'
result.update({'regions':rows,'single_phone':'0535588975','extra_numbers_removed':True,'passed':True,'note':'Encoded-frame visibility check using measured browser layout; read with manual Arabic frame review. Header backdrop intentionally has a slight transparent gradient.'})
(root/'renders/brand-frame-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
