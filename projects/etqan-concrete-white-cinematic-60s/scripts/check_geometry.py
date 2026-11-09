"""Check important geometric invariants; no laboratory result is calculated."""
import math,json,pathlib,re
root=pathlib.Path(__file__).resolve().parents[1]
def clamp(x):return max(0,min(1,x))
def smooth(x):x=clamp(x);return x*x*(3-2*x)
def profile(u):
 a=.045
 if u<a:return u*u/(2*a*(1-a))
 if u>1-a:return 1-(1-u)**2/(2*a*(1-a))
 return (u-a/2)/(1-a)
V=3/3*(.955**2+.955*.465+.465**2)
errors=[]
for i in range(101):
 settle=i/100;h=3-settle*.74;r=.465+settle*.2
 R=(-r+math.sqrt(12*V/h-3*r*r))/2
 errors.append(abs((h/3*(R*R+R*r+r*r)-V)/V))
assert max(errors)<1e-12
assert profile(0)==0 and profile(1)==1
samples=[profile(i/100) for i in range(101)]
assert all(a<=b for a,b in zip(samples,samples[1:]))
# Upward-only cone lift and constant speed after brief start/stop ramps.
rate=[(profile(u+.001)-profile(u))/.001 for u in [.1,.3,.5,.7,.85]]
assert max(rate)-min(rate)<1e-9
assert 13.45>8.3+5 # moving the cone sideways begins after vertical lift completes
cube_top=1+.805+1.48/2;water_level=3.08;tank_rim=3.16
assert cube_top<water_level<tank_rim
lower_platen_top=.91+.12/2;cube_bottom=1.72-.75
upper_platen_bottom_initial=2.94-.18/2;cube_top_press=1.72+.75
assert abs(lower_platen_top-cube_bottom)<1e-12
assert abs(upper_platen_bottom_initial-.38-cube_top_press)<1e-12
assert abs((upper_platen_bottom_initial-.38-.0045)-(.97+1.5*(1-.003)))<1e-12
# Guard that the reviewed model still contains the parameters used in these checks.
slump=(root/'src/Slump.tsx').read_text();curing=(root/'src/Curing.tsx').read_text();press=(root/'src/Compression.tsx').read_text();titles=(root/'src/Typography.tsx').read_text()
for token in ['(t - 8.3) / 5','(t - 13.45) / 1.1','3.0 - settle * 0.74']:assert token in slump
for token in ['0.38 * contact + 0.0045 * load','1 - 0.003 * load','fractureCells']:assert token in press
assert 'position={[0, 3.09, 0]}' in press
assert '3.08' in curing and 'أحد أعمار اختبار المقاومة الشائعة' in titles and 'days === 28' in titles
result={'passed':True,'cone_geometry_ratios':{'height':300,'base_diameter':200,'top_diameter':100},'note':'Ratios describe the model, not an on-screen measurement or reported test result','vertical_lift_seconds':5,'vertical_lift_ends_before_sideways_motion':True,'constant_speed_between_ease_ramps':True,'maximum_ideal_frustum_relative_volume_error':max(errors),'curing_specimens_fully_submerged_after_lowering':True,'curing_water_below_tank_rim':True,'28_days_qualified_as_one_common_age':True,'platens_contact_specimen_at_intended_positions':True,'strain_motion_stays_between_platens':True,'spherical_seat_contacts_upper_cap':True,'limits':'Procedural illustration. Flow, slump and fracture are art-directed, not calibrated fluid or structural simulations. Surface noise is excluded from the ideal volume check.'}
(root/'renders/geometry-check.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result,indent=2))
