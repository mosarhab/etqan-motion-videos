import {geoMercator,geoPath} from 'd3-geo';
import {interpolate,useCurrentFrame} from 'remotion';
import geography from '../geography.json';
import {Arabic,C,Logo,Shell,Svg,Title,clamp,progress} from '../design';
import {brand} from '../brand';
export const LAB=[46.828527,24.829475] as [number,number];
export const ArrivalScene=()=>{const f=useCurrentFrame();const z=interpolate(f,[0,70,140,210],[1400,2300,16000,200000],{...clamp,easing:(x)=>x*x*(3-2*x)});const cx=interpolate(f,[0,70,140,210],[44,45,46.6753,LAB[0]],clamp);const cy=interpolate(f,[0,70,140,210],[24,24,24.7136,LAB[1]],clamp);const proj=geoMercator().center([cx,cy]).scale(z).translate([540,1000]).clipExtent([[0,500],[1080,1490]]);const path=geoPath(proj);const p=proj(LAB)!;const local=progress(f,100,175);const pin=progress(f,80,110);const pulse=(f%60)/60;
return <Shell index="02"><Title size={112} delay={15}>الرياض</Title><Svg>
 <defs><clipPath id="mapClip"><rect x="54" y="560" width="972" height="890" rx="12"/></clipPath></defs>
 <g clipPath="url(#mapClip)"><g opacity={1-local}>{geography.features.map((x,i)=><path key={i} d={path(x as any)||''} fill={x.properties.code==='SAU'?'#574f32':'#102b3e'} stroke={x.properties.code==='SAU'?C.yellow:'#38566b'} strokeWidth={x.properties.code==='SAU'?3:1.2}/>)}</g>
 <g opacity={local}>{Array.from({length:25},(_,i)=>{const a=LAB[0]+(i-12)*.005;const b=LAB[1]+(i-12)*.005;return <g key={i} fill="none" stroke="#5f879a" strokeWidth={i%4===0?2:1} opacity={i%4===0?.45:.2}><path d={path({type:'LineString',coordinates:[[a,LAB[1]-.15],[a,LAB[1]+.15]]})||''}/><path d={path({type:'LineString',coordinates:[[LAB[0]-.15,b],[LAB[0]+.15,b]]})||''}/></g>})}</g>
 <circle cx={p[0]} cy={p[1]} r={26+pulse*75} fill="none" stroke={C.yellow} strokeWidth="2" opacity={pin*(1-pulse)*.5}/><g opacity={pin}><path d={`M${p[0]-110} ${p[1]}H${p[0]+110}M${p[0]} ${p[1]-110}V${p[1]+110}`} stroke={C.yellow} strokeWidth="1" opacity=".4"/><g transform={`translate(${p[0]} ${p[1]}) scale(${.65+.35*pin})`}><path d="M0 0C-13-22-35-45-35-67a35 35 0 0 1 70 0C35-45 13-22 0 0Z" fill={C.yellow}/><circle cy="-67" r="12" fill={C.ink}/><ellipse cy="6" rx="24" ry="7" fill={C.yellow} opacity=".28"/></g></g></g>
 </Svg>
 <div style={{position:'absolute',top:1345,left:86,right:86,opacity:local}}><div dir="ltr" style={{fontFamily:'Arial',fontSize:29,letterSpacing:2,color:C.yellow,textAlign:'center'}}>24.829475° N · 46.828527° E</div><Arabic style={{fontSize:23,color:C.steel,textAlign:'center',marginTop:12}}>شبكة محلية توضيحية • الدبوس عند الإحداثيات المحددة</Arabic></div>
 <div style={{position:'absolute',top:1460,left:86,right:86,opacity:progress(f,170,200),translate:`0 ${20*(1-progress(f,170,200))}px`}}><Arabic style={{fontSize:42,textAlign:'center',lineHeight:1.6}}>{brand.name}</Arabic></div>
 <div style={{position:'absolute',top:580,left:240,width:600,display:'flex',justifyContent:'center',opacity:progress(f,215,245)}}><div style={{padding:brand.logoPresent?'24px 30px':0,background:brand.logoPresent?'#f5f4ec':'transparent',borderRadius:8}}><Logo width={brand.logoPresent?500:570} light={brand.logoPresent}/></div></div>
 </Shell>};
