import {useCurrentFrame} from 'remotion';
import {Arabic,C,Definitions,Note,Shell,Svg,Title,progress} from '../design';
export const ResultsScene=()=>{const f=useCurrentFrame();const reveal=progress(f,10,75);return <Shell index="07"><Title size={75} delay={5}>{'نتائج دقيقة تدعم\nالقرار الهندسي'}</Title><Svg><Definitions/>
 <g transform={`translate(${40*(1-reveal)} ${45*(1-reveal)}) rotate(${-3+reveal*3} 540 1100)`}>
 <rect x="205" y="715" width="670" height="760" rx="16" fill="#000" opacity=".2" transform="translate(20 30)"/><rect x="205" y="715" width="670" height="760" rx="16" fill={C.paper}/><path d="M205 731Q205 715 221 715H859Q875 715 875 731V820H205Z" fill={C.navy}/>
 <text x="815" y="782" textAnchor="start" fill={C.white} fontFamily="Cairo" fontSize="39" direction="rtl">تقرير فني</text>
 <text x="810" y="902" textAnchor="start" fill={C.navy} fontFamily="Cairo" fontSize="26" direction="rtl">عرض توضيحي • دون بيانات فعلية</text>
 {[0,1,2].map(i=><g key={i} opacity={progress(f,25+i*10,55+i*10)}><rect x="268" y={950+i*93} width="545" height="68" rx="3" fill={i%2?'#e3e8e5':'#e9ece7'}/><path d={`M785 ${970+i*93}H${510-i*35}M785 ${991+i*93}H${580-i*20}`} stroke="#82919a" strokeWidth="4"/><circle cx="305" cy={984+i*93} r="14" stroke={C.navy} strokeWidth="2" fill="none"/><path d={`M297 ${984+i*93}l6 6 13-15`} stroke={C.navy} strokeWidth="3" fill="none"/></g>)}
 <path d="M280 1370L420 1260L560 1370L700 1260L810 1370H280M420 1260H700M420 1260L560 1370L700 1260" fill="none" stroke={C.navy} strokeWidth="3" pathLength="1" strokeDasharray="1" strokeDashoffset={1-progress(f,40,110)}/>{[280,420,560,700,810].map((x,i)=><circle key={i} cx={x} cy={i%2?1260:1370} r="7" fill={C.yellow} stroke={C.navy} strokeWidth="2" opacity={reveal}/>)}
 </g></Svg><Note text="تمثيل بصري للتقرير ودعم القرار • ليس تقرير عميل"/>
 </Shell>};
