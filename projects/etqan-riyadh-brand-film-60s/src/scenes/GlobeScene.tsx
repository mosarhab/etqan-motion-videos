import {geoGraticule,geoOrthographic,geoMercator,geoPath} from 'd3-geo';
import {interpolate,useCurrentFrame} from 'remotion';
import geography from '../geography.json';
import {C,Shell,Svg,Title,clamp,progress} from '../design';
const countries=geography.features;
export const GlobeScene=()=>{const f=useCurrentFrame();const q=progress(f,0,175);const globe=geoOrthographic().rotate([-interpolate(q,[0,1],[10,44]),-22]).scale(350+q*90).translate([540,1050]);const gp=geoPath(globe);const region=geoMercator().center([44,24]).scale(1400).translate([540,1050]).clipExtent([[0,620],[1080,1520]]);const rp=geoPath(region);const mix=progress(f,155,209);return <Shell index="01">
 <Title size={82}>{'في قلب المملكة\nالعربية السعودية'}</Title>
 <Svg><defs><radialGradient id="earth"><stop stopColor="#204c66"/><stop offset=".77" stopColor="#102d41"/><stop offset="1" stopColor="#030d18"/></radialGradient><radialGradient id="atmos"><stop offset=".78" stopColor="#78bdd6" stopOpacity="0"/><stop offset=".93" stopColor="#78bdd6" stopOpacity=".14"/><stop offset="1" stopColor="#78bdd6" stopOpacity="0"/></radialGradient></defs>
 <g opacity={1-mix}><circle cx="540" cy="1050" r={470+q*45} fill="url(#atmos)"/><circle cx="540" cy="1050" r={350+q*90} fill="url(#earth)"/>{countries.map((x,i)=><path key={i} d={gp(x as any)||''} fill={x.properties.code==='SAU'?C.yellow:'#2b5368'} stroke="#87aabe" strokeWidth=".7" opacity={x.properties.code==='SAU'?1:.7}/>)}<path d={gp(geoGraticule().step([20,20])())||''} fill="none" stroke="#94bbca" strokeWidth=".65" opacity=".27"/><ellipse cx="540" cy="1050" rx={510+q*80} ry="190" fill="none" stroke={C.yellow} strokeWidth="1" opacity=".35" transform="rotate(-24 540 1050)"/><circle cx="540" cy="1050" r={365+q*90} fill="none" stroke="#8fbdcf" strokeOpacity=".2"/></g>
 <g opacity={mix}>{countries.map((x,i)=><path key={i} d={rp(x as any)||''} fill={x.properties.code==='SAU'?'#b99e50':'#173448'} stroke={x.properties.code==='SAU'?C.yellow:'#456377'} strokeWidth={x.properties.code==='SAU'?3:1}/>)}</g>
 <path d="M86 1500H400L470 1430" fill="none" stroke={C.yellow} strokeWidth="2" strokeDasharray="420" strokeDashoffset={420*(1-progress(f,90,175))}/><circle cx="470" cy="1430" r="5" fill={C.yellow} opacity={progress(f,130,160)}/>
 </Svg>
 </Shell>};
