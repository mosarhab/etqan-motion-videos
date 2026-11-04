import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {loadFont} from '@remotion/fonts';
import {brand} from './brand';

loadFont({family:'Cairo',url:staticFile('assets/cairo-arabic-600-normal.woff2'),weight:'600'});
loadFont({family:'Cairo',url:staticFile('assets/cairo-arabic-700-normal.woff2'),weight:'700'});
loadFont({family:'Cairo',url:staticFile('assets/cairo-latin-600-normal.woff2'),weight:'600'});
export const C={navy:brand.navy,yellow:brand.yellow,ink:'#07121d',steel:'#98b4c4',paper:'#f5f4ec',white:'#f7fafb'};
export const ease=Easing.bezier(.2,.8,.2,1);
export const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
export const progress=(f:number,start:number,end:number)=>interpolate(f,[start,end],[0,1],{...clamp,easing:ease});
export const Arabic=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><div dir="rtl" lang="ar" style={{fontFamily:'Cairo',fontWeight:600,lineHeight:1.55,color:C.white,...style}}>{children}</div>;
export const Svg=({children,style={}}:{children:React.ReactNode;style?:React.CSSProperties})=><svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute',inset:0,...style}}>{children}</svg>;
export const Definitions=()=> <defs>
  <linearGradient id="metal" x1="0" x2="1"><stop stopColor="#405464"/><stop offset=".3" stopColor="#b0c2ca"/><stop offset=".55" stopColor="#e1e9e9"/><stop offset=".7" stopColor="#788f9d"/><stop offset="1" stopColor="#243a4a"/></linearGradient>
  <linearGradient id="concrete" x1="0" x2="1"><stop stopColor="#6c777c"/><stop offset=".3" stopColor="#bec5c3"/><stop offset=".6" stopColor="#dce0d9"/><stop offset="1" stopColor="#747f83"/></linearGradient>
  <linearGradient id="soil" x1="0" x2="1"><stop stopColor="#8f7451"/><stop offset=".5" stopColor="#cab186"/><stop offset="1" stopColor="#6e5b44"/></linearGradient>
  <radialGradient id="halo"><stop stopColor={C.yellow} stopOpacity=".14"/><stop offset="1" stopColor={C.yellow} stopOpacity="0"/></radialGradient>
  <linearGradient id="darkMetal"><stop stopColor="#1b2c36"/><stop offset=".45" stopColor="#57646b"/><stop offset="1" stopColor="#111d25"/></linearGradient>
</defs>;
export const Title=({children,delay=10,size=84,top=290}:{children:React.ReactNode;delay?:number;size?:number;top?:number})=>{const f=useCurrentFrame();return <div style={{position:'absolute',top,left:86,right:86,opacity:progress(f,delay,delay+25),translate:`0 ${interpolate(f,[delay,delay+30],[30,0],{...clamp,easing:ease})}px`}}><Arabic style={{fontWeight:700,fontSize:size,textAlign:'right',lineHeight:1.48,whiteSpace:'pre-line'}}>{children}</Arabic><div style={{width:90,height:5,background:C.yellow,marginTop:32,marginLeft:'auto',scale:`${progress(f,delay+12,delay+45)} 1`,transformOrigin:'right'}}/></div>};
export const Footer=({children}:{children:React.ReactNode})=><Arabic style={{position:'absolute',bottom:215,left:86,right:86,fontSize:29,color:'#9eb3bf',textAlign:'right'}}>{children}</Arabic>;
export const Shell=({children,index='01',label='الرياض • المملكة العربية السعودية',light=false}:{children:React.ReactNode;index?:string;label?:string;light?:boolean})=>{const f=useCurrentFrame();return <AbsoluteFill style={{overflow:'hidden',background:light?C.paper:C.ink,fontFamily:'Cairo',color:C.white}}>
 <AbsoluteFill style={{background:light?'radial-gradient(ellipse at 50% 38%,#ffffff 0%,#eceee9 85%)':'radial-gradient(ellipse at 58% 49%,#163347 0%,#0a1d2b 39%,#060e18 85%)'}}/>
 <Svg><defs><pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke={light?'#8296a0':'#5c889f'} strokeWidth="1" opacity=".12"/></pattern></defs><rect width="1080" height="1920" fill="url(#grid)"/><g opacity={light?.18:.32} stroke={light?C.navy:'#60879d'} strokeWidth="1"><path d="M54 150V100H104M976 100H1026V150M54 1750V1800H104M976 1800H1026V1750"/></g>{Array.from({length:32},(_,i)=><circle key={i} cx={80+(i*149)%920} cy={180+(i*227)%1500} r={i%4===0?2:1} fill={light?C.navy:'#afcedd'} opacity={.1+.15*(.5+.5*Math.sin(i+f*.013))}/>)}<line x1="86" y1="1744" x2="994" y2="1744" stroke={light?'#bbc4c8':'#294352'}/><line x1="86" y1="1744" x2={86+908*((f%300)/300)} y2="1744" stroke={C.yellow} strokeWidth="3"/></Svg>
 <Arabic style={{position:'absolute',top:117,right:86,fontSize:25,color:light?C.navy:'#9bb4c5'}}>{label}</Arabic><div style={{position:'absolute',top:120,left:86,fontSize:23,fontFamily:'Arial',letterSpacing:4,color:light?C.navy:C.yellow}}>{index} / 08</div>
 {children}
 {!brand.logoPresent&&<Arabic style={{position:'absolute',bottom:109,left:86,right:86,fontSize:23,textAlign:'center',color:light?'#7b6635':'#b3a36b'}}>نسخة معاينة • الشعار الأصلي غير متوفر</Arabic>}
 </AbsoluteFill>};
export const Logo=({width=620,light=false}:{width?:number;light?:boolean})=>brand.logoPresent?<Img src={staticFile('assets/etqan-logo.png')} style={{width,height:'auto',objectFit:'contain'}}/>:<div style={{width,padding:'32px 20px',border:`1px solid ${light?'#bdc7cb':'#385261'}`,textAlign:'center',boxSizing:'border-box'}}><Arabic style={{fontSize:30,color:light?C.navy:C.steel}}>الشعار الأصلي غير متوفر</Arabic></div>;
export const Dim=({x1,y1,x2,y2}:{x1:number;y1:number;x2:number;y2:number})=><g fill="none" stroke={C.yellow} strokeWidth="2" opacity=".7"><path d={`M${x1} ${y1}L${x2} ${y2}`}/><path d={`M${x1-8} ${y1-8}l16 16M${x2-8} ${y2-8}l16 16`}/></g>;
export const Note=({text='رسوم توضيحية • القياسات رمزية'}:{text?:string})=><Arabic style={{position:'absolute',top:1580,right:86,left:86,fontSize:26,textAlign:'right',color:'#8da9b9'}}>{text}</Arabic>;
