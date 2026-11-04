import {useCurrentFrame} from 'remotion';
import {C,Definitions,Dim,Footer,Note,Shell,Svg,Title,progress} from '../design';
export const SoilScene=()=>{const f=useCurrentFrame();const drive=progress(f,45,140);const extract=progress(f,160,240);const layers=['#b9a078','#99815f','#746653','#546067'];return <Shell index="04"><Title>فحوصات التربة</Title><Svg><Definitions/>
 <ellipse cx="540" cy="1400" rx="390" ry="60" fill="#000" opacity=".22"/>
 <g transform={`translate(0 ${14-28*progress(f,0,270)})`}><path d="M170 880L350 770L930 855L750 970Z" fill="#ccb58d" stroke="#ddcaab" strokeWidth="2"/>
 {layers.map((col,i)=><g key={i}><path d={`M170 ${880+i*112}L750 ${970+i*112}V${1082+i*112}L170 ${992+i*112}Z`} fill={col} stroke="#132b3a" strokeWidth="2"/><path d={`M750 ${970+i*112}L930 ${855+i*112}V${967+i*112}L750 ${1082+i*112}Z`} fill={col} style={{filter:'brightness(.65)'}}/>{Array.from({length:21},(_,j)=><ellipse key={j} cx={200+(j*73)%510} cy={915+i*112+(j*29)%55+(j*73%510)*.15} rx={2+j%4} ry="2" fill={i%2?'#e0c799':'#584c3c'} opacity=".45"/>)}</g>)}
 <g transform={`translate(${100*extract} ${-210*extract})`}><rect x="494" y={550+drive*190} width="72" height="460" fill="url(#metal)" stroke="#b4c5ce" strokeWidth="2"/><ellipse cx="530" cy={550+drive*190} rx="36" ry="9" fill="#adbdc6"/><rect x="507" y={850+drive*190} width="46" height="150" fill="url(#soil)" stroke="#b2a386"/><path d={`M486 ${550+drive*190}H574M500 ${534+drive*190}H560`} stroke={C.yellow} strokeWidth="8"/><path d={`M518 ${450+drive*190}V${510+drive*190}m-12-12 12 12 12-12`} fill="none" stroke={C.yellow} strokeWidth="3"/></g>
 <Dim x1={130} y1={880} x2={130} y2={1325}/><path d="M95 880H157M95 1325H157" stroke={C.yellow} opacity=".4"/>
 <g opacity={progress(f,160,210)} stroke={C.yellow} fill="none"><path d="M688 1040H848V720" strokeWidth="2"/><circle cx="688" cy="1040" r="7" fill={C.yellow}/><path d="M800 720H930" strokeWidth="2"/></g></g>
 </Svg><Footer>طبقات الأرض… قراءة هندسية تبدأ من العينة</Footer><Note/>
 </Shell>};
