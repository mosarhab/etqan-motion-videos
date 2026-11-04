import {useCurrentFrame} from 'remotion';
import {Arabic,C,Logo,Shell,Svg,progress} from '../design';
import {brand} from '../brand';
export const OutroScene=()=>{const f=useCurrentFrame();return <Shell index="08" light label="الدقة أساس الثقة"><Svg><defs><radialGradient id="outHalo"><stop stopColor="#ffffff"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient></defs><circle cx="540" cy="840" r="570" fill="url(#outHalo)"/><g fill="none" stroke={C.navy} opacity=".12"><circle cx="540" cy="840" r="390"/><circle cx="540" cy="840" r="420"/><path d="M100 840H210M870 840H980M540 400V510M540 1170V1280"/></g><path d="M400 1400H680" stroke={C.yellow} strokeWidth="6" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(f,15,60)}/></Svg>
 <div style={{position:'absolute',top:610,left:40,width:1000,height:430,display:'flex',alignItems:'center',justifyContent:'center',opacity:progress(f,0,25),scale:.96+.04*progress(f,0,45)}}><Logo width={1000} light/></div>
 <Arabic style={{position:'absolute',top:1120,left:90,right:90,color:C.navy,fontSize:49,fontWeight:700,textAlign:'center',lineHeight:1.65,opacity:progress(f,12,38)}}>{brand.name}</Arabic>
 <Arabic style={{position:'absolute',top:1450,left:90,right:90,color:C.navy,fontSize:65,fontWeight:700,textAlign:'center',opacity:progress(f,23,50)}}>الدقة أساس الثقة</Arabic>
 </Shell>};
