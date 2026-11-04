import * as T from 'three';
import {World,V,M,mat,box,cylinder,torus,mesh,pipe,particles,camera,stage,floor,vec,ramp,mix} from './core';
import {concreteModel} from './concrete';
import {soilModel} from './soil';
import {asphaltModel} from './asphalt';
export function laboratoryWorld(env:T.Texture):World{const w=stage(env);w.scene.environmentIntensity=.63;floor(w.scene,30);w.scene.fog=new T.FogExp2('#060e18',.022);
 const a=concreteModel();a.root.scale.setScalar(.77);a.root.position.set(.15,0,-5.9);w.scene.add(a.root);
 const b=soilModel();b.root.scale.setScalar(.64);b.root.position.set(-3.65,0,-1.5);b.root.rotation.y=.23;w.scene.add(b.root);
 const c=asphaltModel();c.root.scale.setScalar(.7);c.root.position.set(3.5,0,-7.5);c.root.rotation.y=-.18;w.scene.add(c.root);
 // Modeled architecture, overhead softboxes and tactile sample benches.
 box(w.scene,18,7,.25,mat('#0d1b2c',.35,.47),[0,3.5,-12]);for(let i=-6;i<=6;i++)box(w.scene,.07,6,.1,M.brushed,[i*1.3,3.1,-11.82],.008);
 for(const z of [2,-3,-8]){box(w.scene,8,.16,1.3,M.dark,[0,7,z]);box(w.scene,7.5,.015,.88,new T.MeshBasicMaterial({color:new T.Color(2.8,3.1,3.5)}),[0,6.9,z],.02);for(const x of [-3.5,3.5])cylinder(w.scene,.022,1.5,M.brushed,[x,7.8,z]);}
 const table=new T.Group();table.position.set(2.85,0,.35);w.scene.add(table);box(table,2.4,.16,3.8,M.brushed,[0,1.25,0]);for(const x of [-.92,.92])for(const z of [-1.5,1.5])box(table,.12,1.22,.12,M.navy,[x,.61,z]);
 for(let i=0;i<4;i++){const z=-1.2+i*.8;cylinder(table,.24,.6,M.glass,[0,1.62,z]);cylinder(table,.25,.045,M.steel,[0,1.94,z]);cylinder(table,.22,.4,mat(i%2?'#8e8770':'#61665f',0,.8),[0,1.52,z]);}
 box(w.scene,.035,.01,24,M.led,[-1.85,.015,-2],.006);box(w.scene,.02,.01,24,M.cold,[1.7,.015,-2],.005);const dust=particles(w.scene,160,12);
 w.update=t=>{a.update(2+t*.35);b.update(t*.7);c.update(1+t*.4);dust.rotation.y=t*.003;const p=ramp(t,0,7);camera(w,vec([6.4,3.45,8.4],[1.2,2.95,.8],p),vec([-.1,2.7,-4.8],[.05,2.35,-5.8],p),42,.15);};w.update(0);return w;}
export function closingWorld(env:T.Texture):World{const w=stage(env,false);w.scene.fog=null;w.scene.background=new T.Color('#f0f0e9');w.scene.environmentIntensity=1.1;w.scene.children.filter(x=>x instanceof T.DirectionalLight).forEach(x=>{(x as T.DirectionalLight).intensity=1.8});
 const porcelain=mat('#f2f3ec',.14,.26);mesh(w.scene,new T.PlaneGeometry(50,50),porcelain,[0,0,0],[-Math.PI/2,0,0]);const ring=torus(w.scene,3.55,.065,M.gold,[0,-.11,-1.8]);ring.rotation.x=1.23;ring.rotation.z=.2;const ring2=torus(w.scene,3.72,.012,M.brushed,[0,-.1,-1.8]);ring2.rotation.copy(ring.rotation);w.scene.remove(ring,ring2);
 w.update=t=>{ring.rotation.z=.2+t*.035;ring2.rotation.z=.2-t*.025;camera(w,[.8+.2*Math.sin(t*.2),6.2,8.8],[0,-.1,-1.6],42,.04);};w.update(0);return w;}
