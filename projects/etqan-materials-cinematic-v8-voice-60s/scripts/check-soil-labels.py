"""Visibility check on encoded video frames, supported by manual Arabic review.
The two fixed title boxes are above the animated material, away from header/logo.
"""
import pathlib,json
import numpy as np
from PIL import Image
root=pathlib.Path(__file__).resolve().parents[1]
regions={'classification':(60,425,490,497),'gradation':(590,425,1020,497)}
def count(frame,region):
 a=np.asarray(Image.open(root/f'renders/qa-frames/frame-{frame:04d}.jpg').crop(region))
 return int(((a[:,:,0]>175)&(a[:,:,1]>170)&(a[:,:,2]>155)).sum())
checks=json.loads((root/'renders/review-frames.json').read_text())['soil_label_frames']
reference_frame=checks['reference']
reference=count(reference_frame,regions['classification'])
assert reference>500,reference
rows=[]
for frame in checks['checked']:
 c=count(frame,regions['classification']);g=count(frame,regions['gradation'])
 assert .8*reference<c<1.2*reference,(frame,reference,c)
 assert g>500,(frame,g)
 rows.append({'frame':frame,'classification_bright_pixels':c,'gradation_bright_pixels':g})
result={'passed':True,'note':'Encoded-frame visibility proxy, read with manual review of the actual Arabic titles. Classification remains visible after gradation appears and through the last frame before the Proctor transition.','reference_frame':reference_frame,'reference_classification_bright_pixels':reference,'checked':rows}
(root/'renders/soil-labels-check.json').write_text(json.dumps(result,indent=2)+'\n')
print('Both soil labels remain visible at',*[r['frame'] for r in rows])
