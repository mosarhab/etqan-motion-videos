import {useCurrentFrame} from 'remotion';
import {C,Definitions,Dim,Footer,Note,Shell,Svg,Title,progress} from '../design';
export const AsphaltScene=()=>{const f=useCurrentFrame();const scan=progress(f,50,210);return <Shell index="06"><Title size={80}>{'فحوصات الأسفلت\nوالمواد'}</Title><Svg><Definitions/>
 <ellipse cx="440" cy="1425" rx="280" ry="50" fill="#000" opacity=".3"/>
 <g transform={`translate(0 ${-20*progress(f,0,240)})`}><path d="M215 925V1320C215 1395 655 1395 655 1320V925Z" fill="url(#darkMetal)" stroke="#5e7b8a" strokeWidth="2"/><ellipse cx="435" cy="925" rx="220" ry="65" fill="#465055" stroke="#8c9a9e" strokeWidth="2"/>
 {Array.from({length:115},(_,i)=>{const xx=230+(i*83)%405;const yy=965+(i*67)%350;const size=4+i%10;return <path key={i} d={`M${xx} ${yy}l${size} ${-size*.4} ${size*.8} ${size*.8} ${-size*.5} ${size} ${-size*1.2} ${-size*.1}Z`} fill={['#8b9698','#bec3bc','#344149','#697778'][i%4]} opacity=".7"/>})}
 {Array.from({length:40},(_,i)=>{const a=i*2.4;const r=20+(i*31)%160;return <ellipse key={i} cx={435+Math.cos(a)*r} cy={925+Math.sin(a)*r*.24} rx={4+i%8} ry={2+i%4} fill={['#a2aaa6','#252f34','#687a80'][i%3]}/>})}
 <ellipse cx="435" cy={980+scan*300} rx="245" ry="67" fill="none" stroke={C.yellow} strokeWidth="2" opacity=".85"/><path d={`M190 ${980+scan*300}H160V${980+scan*300+30}M680 ${980+scan*300}H710V${980+scan*300-30}`} stroke={C.yellow} strokeWidth="3" fill="none"/>
 <Dim x1={235} y1={1470} x2={635} y2={1470}/>
 <g transform="translate(800 1030)">{[0,1,2,3].map(i=><g key={i} transform={`translate(0 ${i*88})`}><path d="M-82 0V44Q0 82 82 44V0" fill="url(#metal)" stroke="#91a7b4"/><ellipse rx="82" ry="26" fill="#142a39" stroke="#c0cbd0" strokeWidth="3"/><path d="M-64-6L64 6M-64 6L64-6M-40-20V20M0-23V23M40-20V20" stroke="#718792" opacity=".6"/></g>)}</g>
 <path d="M730 940H935M832 930V840H720" fill="none" stroke={C.yellow} strokeWidth="2" opacity={progress(f,100,140)}/>
 </g></Svg><Footer>الأسفلت والركام ضمن لغة واحدة لفحص المواد</Footer><Note/>
 </Shell>};
