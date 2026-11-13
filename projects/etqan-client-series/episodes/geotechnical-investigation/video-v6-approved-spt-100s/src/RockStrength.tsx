import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs, Bolt } from "./GeoMaterials";
import { Ground } from "./Drawing";
import { ease, rand } from "./motion";

export function rockStrengthMotion(t: number) {
  const contact = ease((t - 0.7) / 2),
    load = ease((t - 3) / 2.6),
    crack = ease((t - 5.6) / 1.5);
  return { contact, load, crack, platenBottom: 230 + 40 * contact + 2 * load };
}

export function RockStrength({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = rockStrengthMotion(t);
  return (
    <Scene embedded={embedded} duration={288}>
      <Copy title="مقاومة" accent="العينات الصخرية"
        process="اختبار مقاومة الضغط لعينات الصخور."
        benefit="مقاومة الصخر ضمن تقييم التأسيس"
        detail="مع توصيف الصخر والتجوية والفواصل." />
      <Art>
        <GeoDefs id="rock-strength" />
        <Ground id="rock-strength" t={t} />
        <g transform={`translate(500 440) scale(${1 + 0.045 * ease(t / 8)}) translate(-500 -440)`}>
          <defs>
            <clipPath id="rock-core-face"><path d="M424 270Q500 245 576 270V540Q500 565 424 540Z" /></clipPath>
          </defs>
          <path d="M230 121L253 105H780L758 121Z" fill="#81999b" />
          <rect x={230} y={121} width={528} height={55} rx={3} fill="url(#rock-strength-dark)" stroke="#a4bec6" strokeWidth={2} />
          {[270, 700].map(x => <g key={x}>
            <rect x={x} y={176} width={30} height={414} fill="url(#rock-strength-steel)" stroke="#98b5bf" />
            <Bolt x={x + 15} y={144} r={7} />
          </g>)}
          <rect x={460} y={176} width={80} height={s.platenBottom - 206} fill="url(#rock-strength-steel)" stroke="#c5d4d2" />
          <path d="M424 270Q500 245 576 270V540Q500 565 424 540Z" fill="url(#rock-strength-white)" stroke="#c9d4c5" />
          <g clipPath="url(#rock-core-face)">
            {Array.from({ length: 155 }, (_, i) => <ellipse key={i}
              cx={424 + 152 * rand(i + 27)} cy={270 + 280 * rand(i + 166)}
              rx={0.7 + 1.8 * rand(i + 48)} ry={0.5 + 1.1 * rand(i + 249)}
              fill={i % 3 ? "#6e786d" : "#eae5cc"} opacity={0.3 + 0.18 * rand(i + 89)} />)}
            <path d="M423 345Q483 330 523 347T580 343M423 449Q485 463 580 445" fill="none" stroke="#9c9d84" strokeWidth={1.5} opacity={0.45} />
            <path d="M483 275L478 329L490 374L481 413L492 466L482 538" fill="none"
              stroke="#3b4e51" strokeWidth={1 + 2 * s.crack} pathLength={1}
              strokeDasharray={1} strokeDashoffset={1 - s.crack} opacity={s.crack} />
            <path d="M490 374L526 405L544 450" fill="none" stroke="#3b4e51"
              strokeWidth={1.6} opacity={s.crack * 0.8} />
          </g>
          <ellipse cx={500} cy={270} rx={76} ry={20} fill="#d3d3bb" stroke="#dfe3ce" />
          <g transform={`translate(0 ${s.platenBottom})`}>
            <ellipse cx={500} cy={0} rx={135} ry={20} fill="url(#rock-strength-steel)" stroke="#a4bcc1" />
            <path d="M365 -30H635V0Q500 40 365 0Z" fill="url(#rock-strength-steel)" stroke="#cbdbd5" strokeWidth={1.5} />
            <ellipse cx={500} cy={-30} rx={135} ry={16} fill="#a9c0c4" stroke="#d6e2df" />
          </g>
          <path d="M365 540Q500 564 635 540V572Q500 598 365 572Z" fill="url(#rock-strength-steel)" stroke="#b4ccd0" />
          <ellipse cx={500} cy={540} rx={135} ry={20} fill="none" stroke="#9aafb5" strokeWidth={2} />
          <path d="M218 590L244 570H780L755 590Z" fill="#819ba0" />
          <rect x={218} y={590} width={537} height={43} rx={3} fill="url(#rock-strength-dark)" stroke="#8ba6b0" />
          {[270, 700].map(x => <Bolt key={x} x={x + 15} y={610} r={6} />)}
        </g>
      </Art>
    </Scene>
  );
}
