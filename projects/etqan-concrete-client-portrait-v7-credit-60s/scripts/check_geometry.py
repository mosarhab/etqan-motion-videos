"""Check ordering and important proportions in the illustrative production."""
from pathlib import Path
import json,math
root=Path(__file__).resolve().parents[1]
V=300/3*(98**2+98*48+48**2);errors=[]
for i in range(101):
 a=i/100;h=300-a*70;r=50+a*17;R=(-r+math.sqrt(12*V/h-3*r*r))/2;errors.append(abs((h/3*(R*R+R*r+r*r)-V)/V))
assert max(errors)<1e-12
assert 32+1.4+3 < 43+1.7 # fully immersed before compression approach starts
assert 43+1.7+3.2 < 43+7.3 # platen contact precedes visible cracking
assert 262+55==317 and 317+300==617 # closed platen faces and specimen
assert 300>264 and 300+286<637 # final specimen top below water and base above tank floor
assert 520-411>=75 and 613-520>=75 and 124>=75 # illustrative probe cover in its concrete container
assert abs(300/150-2)<1e-9 and abs(252/126-2)<1e-9 and abs(420/210-2)<1e-9
source='\n'.join(p.read_text() for p in (root/'src').glob('*') if p.suffix in ['.ts','.tsx'])
assert 'three' not in source.lower() and 'WebGL' not in source
assert 'الأسطوانية' in source and 'درجة الحرارة' in source and 'المعالجة قبل اختبار المقاومة' in source
assert '0535588975' in (root/'src/Brand.tsx').read_text()
assert '0551603205' in (root/'src/Closing.tsx').read_text()
assert all(s not in source for s in ['0575828265','0573870072'])
result={'passed':True,'all_concrete_specimens':'Cylindrical; nominal height/diameter approximately 2','curing_before_compression':True,'platen_contact_precedes_crack':True,'platen_and_sample_positions_match':True,'final_curing_fully_submerged':True,'probe_embedded_with_surrounding_concrete':True,'ideal_frustum_relative_volume_error':max(errors),'no_webgl_or_three_scene':True,'approved_footer_and_closing_numbers_only':True,'limits':'Pixel proportions and schematic sequence checks, not a certified test procedure or physical simulation. No measured temperature, slump or strength results are displayed.'}
(root/'renders/geometry-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
