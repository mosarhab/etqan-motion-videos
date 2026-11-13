import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Copy } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { SPTDetail } from "./SPTDetail";
import { clamp, ease, mix, gold, muted } from "./motion";
export function sptMotion(t: number) {
  const q = clamp((t - 0.4) / 9) * 9,
    phase = q % 1,
    hit = Math.min(9, Math.floor(q) + ease((phase - 0.78) / 0.08)),
    drive = hit * 6,
    withdraw = 364 * ease((t - 9.5) / 2.9),
    lift =
      phase < 0.55
        ? 110 * ease(phase / 0.55)
        : phase < 0.8
          ? 110 * (1 - ((phase - 0.55) / 0.25) ** 2)
          : 0;
  return {
    drive,
    withdraw,
    tip: 810 + drive - withdraw,
    anvil: 490 + drive - withdraw,
    hammerLift: t < 9.4 ? lift : 0,
    transfer: ease((t - 12.4) / 2.1),
    capGap: 40 * (1 - ease((t - 17) / 1.25)),
  };
}

export function SPT({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = sptMotion(t),
    firstCopy = 1 - ease((t - 14) / .4),
    sample = ease((t - 14.6) / .5);
  return (
    <Scene embedded={embedded} duration={648}>
      <SPTDetail t={t} drive={s.drive} withdraw={s.withdraw} lift={s.hammerLift} />
      <AbsoluteFill style={{ opacity: firstCopy }}>
        <div data-copy="SPT-heading" dir="rtl" style={{position:"absolute",right:80,top:246,width:470,textAlign:"right",opacity:"var(--copy-opacity)"}}>
          <div style={{fontSize:28,fontWeight:500,color:muted,marginBottom:22}}>إتقان | من الفحص إلى القرار</div>
          <div style={{fontSize:64,fontWeight:750,lineHeight:1.3}}>اختبار الاختراق</div>
          <div style={{fontSize:80,fontWeight:800,lineHeight:1.35,color:gold,marginTop:5}}>القياسي SPT</div>
          <div style={{margin:"20px 0 21px auto",width:82,height:3,background:gold}} />
          <div style={{fontSize:32,lineHeight:1.8,color:"#c6d9e1",fontWeight:500}}>مقاومة الاختراق في طبقات التربة.</div>
        </div>
        <div data-copy="SPT-benefit" dir="rtl" style={{position:"absolute",right:80,top:1590,width:920,textAlign:"right",opacity:"var(--copy-opacity)"}}>
          <div style={{fontSize:26,fontWeight:500,color:gold,marginBottom:11}}>الفائدة لمشروعك</div>
          <div style={{fontSize:46,fontWeight:750,lineHeight:1.55}}>مؤشرات تدعم دراسة التأسيس</div>
          <div style={{fontSize:34,lineHeight:1.85,color:"#a9c3cf",marginTop:12}}>تُقرأ مع وصف الطبقات ونتائج المختبر.</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sample }}>
        <Copy title="عناية" accent="بالعينات" process="حفظ مناسب قبل الاختبار."
          benefit="عينات تحفظ قيمتها للدراسة" detail="وفق نوع العينة ومتطلبات الدراسة." benefitTop={1570} />
      </AbsoluteFill>
      <GeoArt>
        <GeoDefs id="spt" />
        <g opacity={ease((t - 12.4) / .35)}>
          <g opacity={ease((t - 13.5) / 1)}><Ground id="spt" t={t} /></g>
          <g transform={`translate(${mix(315,500,s.transfer)} ${mix(312.6666667,430,s.transfer)}) scale(${mix(.1333333333,1,s.transfer)} ${mix(.25,1,s.transfer)}) translate(-500 -430)`}>
            <SoilSample id="spt" x={500} y={260} w={150} h={350} capGap={s.capGap} label={t>13.5} />
          </g>
        </g>
      </GeoArt>
    </Scene>
  );
}
