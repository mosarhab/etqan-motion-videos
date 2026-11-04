import {useCurrentFrame} from 'remotion';
import {C,Definitions,Dim,Footer,Note,Shell,Svg,Title,progress} from '../design';
export const ConcreteScene=()=>{const f=useCurrentFrame();const load=progress(f,120,225);const travel=92*progress(f,30,120)+5*load;return <Shell index="05"><Title>فحوصات الخرسانة</Title><Svg><Definitions/>
 <ellipse cx="540" cy="1435" rx="370" ry="55" fill="#000" opacity=".25"/>
 <g transform={`translate(0 ${-12*progress(f,0,270)})`}>
 <path d="M245 710H835L865 750H215Z" fill="#5c7180" stroke="#8eacbc" strokeWidth="2"/><rect x="240" y="750" width="66" height="635" fill="url(#metal)"/><rect x="774" y="750" width="66" height="635" fill="url(#metal)"/>
 <rect x="435" y="750" width="210" height={130+travel} fill="url(#metal)"/>
 <g transform={`translate(0 ${travel})`}><path d="M347 870H733V918H347Z" fill="url(#metal)" stroke="#becbd2" strokeWidth="2"/><path d="M360 918H720" stroke={C.yellow} strokeWidth="5"/></g>
 <g transform={`translate(540 1340) scale(1 ${1-load*.015}) translate(-540 -1340)`}><path d="M425 1010V1320C425 1355 655 1355 655 1320V1010Z" fill="url(#concrete)" stroke="#b5c4c8" strokeWidth="2"/><ellipse cx="540" cy="1010" rx="115" ry="30" fill="#c6ceca" stroke="#e3e7df" strokeWidth="2"/>{Array.from({length:70},(_,i)=><ellipse key={i} cx={435+(i*71)%207} cy={1040+(i*47)%275} rx={1+i%3} ry={1+i%2} fill={i%3?'#545f62':'#f5f6ee'} opacity=".35"/>)}</g>
 <path d="M340 1350H740V1395H340Z" fill="url(#metal)"/><path d="M200 1395H880V1440H200Z" fill="#273e50" stroke="#819cad" strokeWidth="2"/>
 <g stroke={C.yellow} strokeWidth="3" fill="none" opacity={.3+.7*load}><path d="M540 930V980m-15-15 15 15 15-15M540 1330V1280m-15 15 15-15 15 15"/><Dim x1={710} y1={1020} x2={710} y2={1330}/></g>
 <g transform="translate(875 1120)"><circle r="75" fill="#0a1c2a" stroke="#5e7f94" strokeWidth="3"/><path d="M-51 25A57 57 0 1 1 51 25" fill="none" stroke="#5a7584" strokeWidth="8"/><path d="M-51 25A57 57 0 1 1 51 25" fill="none" stroke={C.yellow} strokeWidth="8" pathLength="1" strokeDasharray="1" strokeDashoffset={1-load*.76}/><path d="M0 0L0-44" stroke={C.yellow} strokeWidth="3" transform={`rotate(${-110+load*160})`}/><circle r="7" fill={C.yellow}/></g>
 </g></Svg><Footer>نماذج أسطوانية • تمثيل بصري لفحص الضغط</Footer><Note/>
 </Shell>};
