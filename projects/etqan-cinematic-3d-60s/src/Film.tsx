import React from 'react';
import {AbsoluteFill,Img,Sequence,staticFile,useCurrentFrame,useVideoConfig} from 'remotion';
import {Audio} from '@remotion/media';
import {loadFont} from '@remotion/fonts';
import {CinematicCanvas} from './three/CinematicCanvas';
import {ramp} from './three/core';
loadFont({family:'Cairo',url:staticFile('assets/cairo-arabic-600-normal.woff2'),weight:'600'});
loadFont({family:'Cairo',url:staticFile('assets/cairo-arabic-700-normal.woff2'),weight:'700'});
loadFont({family:'Cairo',url:staticFile('assets/cairo-latin-600-normal.woff2'),weight:'600'});
const NAME='مختبر اتقان البناء لفحص التربة و المواد';
const Line=({children,duration,size=82,position='bottom',delay=18}:{children:React.ReactNode;duration:number;size?:number;position?:'bottom'|'top';delay?:number})=>{const f=useCurrentFrame();const opacity=ramp(f,delay,delay+22)*(1-ramp(f,duration-15,duration-2));return <div lang="ar" dir="rtl" style={{position:'absolute',left:86,right:86,[position==='bottom'?'bottom':'top']:position==='bottom'?145:260,fontFamily:'Cairo',fontSize:size,fontWeight:700,lineHeight:1.5,textAlign:'center',color:'#f7f7f0',opacity,translate:`0 ${18*(1-ramp(f,delay,delay+26))}px`,textShadow:'0 4px 28px rgba(0,0,0,.4)'}}>{children}</div>};
const MapTitles=()=>{const f=useCurrentFrame();return <div style={{opacity:ramp(f,32,60)*(1-ramp(f,280,298)),position:'absolute',bottom:145,left:82,right:82,textAlign:'center',color:'#f7f7f0',fontFamily:'Cairo'}}><div dir="rtl" lang="ar" style={{fontSize:49,fontWeight:700,lineHeight:1.65}}>{NAME}</div><div dir="rtl" lang="ar" style={{fontSize:34,fontWeight:600,marginTop:17,color:'#d1dbe4'}}>الرياض – المملكة العربية السعودية</div></div>};
const Closing=()=>{const f=useCurrentFrame();return <AbsoluteFill style={{fontFamily:'Cairo',color:'#1d305b',alignItems:'center'}}><div style={{position:'absolute',top:580,left:40,width:1000,opacity:ramp(f,4,27),scale:.965+.035*ramp(f,3,38)}}><Img src={staticFile('assets/etqan-logo.png')} style={{width:1000,height:'auto',objectFit:'contain'}}/></div><div dir="rtl" lang="ar" style={{position:'absolute',top:1090,left:82,right:82,textAlign:'center',fontSize:49,fontWeight:700,lineHeight:1.7,opacity:ramp(f,14,35)}}>{NAME}</div><div dir="rtl" lang="ar" style={{position:'absolute',top:1390,left:82,right:82,textAlign:'center',fontSize:77,fontWeight:700,lineHeight:1.5,opacity:ramp(f,23,47)}}>الدقة أساس الثقة</div></AbsoluteFill>};
export const Film=({offset=0,audio=true}:{offset?:number;audio?:boolean})=>{const {fps}=useVideoConfig();const local=useCurrentFrame(),f=local+offset;return <AbsoluteFill style={{background:'#050b14',overflow:'hidden'}}>
 <CinematicCanvas offset={offset}/>
 {f<1710&&<AbsoluteFill style={{background:'linear-gradient(0deg,rgba(3,8,15,.72) 0%,rgba(3,8,15,0) 27%,rgba(3,8,15,0) 85%,rgba(3,8,15,.13) 100%)',pointerEvents:'none'}}/>}
 <Sequence from={-offset} durationInFrames={8*fps} premountFor={fps} name="من قلب الرياض"><Line duration={8*fps} size={89} position="top" delay={25}>من قلب الرياض</Line></Sequence>
 <Sequence from={8*fps-offset} durationInFrames={10*fps} premountFor={fps} name="الرياض"><MapTitles/></Sequence>
 <Sequence from={18*fps-offset} durationInFrames={7*fps} premountFor={fps} name="الدقة في كل اختبار"><Line duration={7*fps} size={79}>الدقة في كل اختبار</Line></Sequence>
 <Sequence from={25*fps-offset} durationInFrames={10*fps} premountFor={fps} name="فحوصات التربة"><Line duration={10*fps}>فحوصات التربة</Line></Sequence>
 <Sequence from={35*fps-offset} durationInFrames={10*fps} premountFor={fps} name="فحوصات الخرسانة"><Line duration={10*fps}>فحوصات الخرسانة</Line></Sequence>
 <Sequence from={45*fps-offset} durationInFrames={8*fps} premountFor={fps} name="فحوصات الأسفلت والمواد"><Line duration={8*fps} size={74}>فحوصات الأسفلت والمواد</Line></Sequence>
 <Sequence from={53*fps-offset} durationInFrames={4*fps} premountFor={fps} name="القرار الهندسي"><Line duration={4*fps} size={70} delay={10}>نتائج تدعم القرار الهندسي</Line></Sequence>
 <Sequence from={57*fps-offset} durationInFrames={3*fps} premountFor={fps} name="اتقان"><Closing/></Sequence>
 {audio&&<Audio src={staticFile('assets/original-score.m4a')} premountFor={fps} volume={1}/>} 
 </AbsoluteFill>};
