import * as T from 'three';
import {World,M,box,cylinder,torus,bolt,pipe,mesh,granular,floor,particles,camera,stage,ramp,vec,mix} from './core';
export function concreteModel(){const root=new T.Group();root.name='Concrete compression machine';box(root,3.6,.65,2.65,M.navy,[0,.34,0],.13);box(root,3.85,.14,2.9,M.dark,[0,.08,0]);box(root,3.45,.14,2.5,M.brushed,[0,.72,0]);
 for(const x of [-1.3,1.3])for(const z of [-.85,.85]){cylinder(root,.12,3.8,M.steel,[x,2.68,z]);cylinder(root,.23,.18,M.brushed,[x,.94,z],6);cylinder(root,.23,.22,M.brushed,[x,4.63,z],6);torus(root,.135,.025,M.gold,[x,1.1,z]);}
 box(root,3.55,.49,2.5,M.navy,[0,4.82,0],.12);box(root,3.75,.11,2.6,M.brushed,[0,5.09,0]);box(root,3.55,.045,.055,M.led,[0,4.76,1.29],.01);
 cylinder(root,.79,.25,M.steel,[0,1.08,0]);cylinder(root,.9,.1,M.dark,[0,.92,0]);cylinder(root,.69,.18,M.brushed,[0,1.27,0]);
 const specimen=new T.Group();specimen.position.y=1.37;root.add(specimen);const concrete=granular('#8f9690');cylinder(specimen,.44,1.76,concrete,[0,.88,0],96);torus(specimen,.435,.008,concrete,[0,.012,0]);
 const cracks=new T.Group();specimen.add(cracks);for(let k=0;k<6;k++){const a=(k/6)*Math.PI*2;const pts:[number,number,number][]=[];for(let j=0;j<8;j++){const aa=a+Math.sin(j*2.1+k)*.045;pts.push([Math.sin(aa)*.444,.15+j*.205,Math.cos(aa)*.444]);}pipe(cracks,pts,.0035,new T.MeshStandardMaterial({color:'#4b4e49',roughness:1}));}
 const upper=new T.Group();root.add(upper);upper.position.y=3.64;cylinder(upper,.79,.2,M.steel,[0,0,0]);cylinder(upper,.65,.12,M.brushed,[0,-.14,0]);torus(upper,.72,.018,M.gold,[0,-.1,0]);
 const piston=cylinder(root,.35,1.17,M.steel,[0,4.2,0]);cylinder(root,.54,.38,M.navy,[0,4.51,0]);torus(root,.39,.055,M.brushed,[0,4.25,0]);
 for(const x of [-1.55,1.55])for(const y of [.25,.5])bolt(root,x,y,1.35,1.2);
 for(let i=0;i<7;i++)box(root,.045,.36,.045,M.dark,[-.7+i*.23,.35,1.36],.006);
 pipe(root,[[.5,4.63,-.5],[1.9,4.65,-.6],[1.9,1.3,-1.1],[1.3,.8,-1.2]],.045,M.rubber);pipe(root,[[-.5,4.63,-.5],[-1.9,4.65,-.6],[-1.9,2,-1.1],[-1.3,.8,-1.2]],.025,M.brushed);
 const update=(t:number)=>{const approach=ramp(t,.7,3.4);const load=ramp(t,3.6,7.7);const compression=.024*load;specimen.scale.y=1-compression;upper.position.y=3.64-.37*approach-1.76*compression;const length=4.45-upper.position.y-.12;piston.scale.y=length/1.17;piston.position.y=upper.position.y+.1+length/2;cracks.visible=t>6.6;cracks.scale.setScalar(1+.003*load);};
 return{root,update};}
export function concreteWorld(env:T.Texture):World{const w=stage(env);floor(w.scene);const m=concreteModel();w.scene.add(m.root);const dust=particles(w.scene,90,8);
 w.update=(t)=>{m.update(t);dust.rotation.y=t*.012;const p=ramp(t,0,10);const q=ramp(t,3.3,7.3);camera(w,vec([6.9,4.5,10],[-5.9,3.6,9.6],p),[0,2.05,0],mix(39,34,q),.1);};w.update(0);return w;}
