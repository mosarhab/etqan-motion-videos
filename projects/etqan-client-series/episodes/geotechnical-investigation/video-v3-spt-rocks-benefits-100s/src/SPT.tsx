import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Copy } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { SoilBlock } from "./Rig";
import { SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { clamp, ease, mix } from "./motion";
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
export function SPTApparatus({ t, id }: { t: number; id: string }) {
  const s = sptMotion(t);
  return (
    <g data-test="split-spoon-SPT">
      <g opacity={1 - ease((t - 11.8) / 1.4)}>
        <SoilBlock id={id} bottom={620} />
        <rect x={480} y={620} width={40} height={190} rx={4} fill="#10202a" />
        <path d="M480 620V810M520 620V810" stroke="#43595a" strokeWidth={1.2} />
      </g>
      <g opacity={1 - ease((t - 9.5) / 1.1)}>
        <path
          d="M448 156V596M552 156V596"
          stroke={`url(#${id}-steel)`}
          strokeWidth={8}
        />
        <path
          d="M431 145H569V174H431Z"
          fill={`url(#${id}-dark)`}
          stroke="#91a8b1"
        />
        <path
          d={`M500 174V${374 + s.drive - s.withdraw - s.hammerLift}`}
          stroke="#aabdc0"
          strokeWidth={3}
        />
        <g transform={`translate(0 ${s.drive - s.withdraw - s.hammerLift})`}>
          <path
            d="M449 374H551V490H449Z"
            fill={`url(#${id}-steel)`}
            stroke="#c6d0ca"
          />
          <ellipse
            cx={500}
            cy={374}
            rx={51}
            ry={13}
            fill="#a7b7b4"
            stroke="#e0e5d6"
          />
          <path d="M449 464H551V490H449Z" fill={`url(#${id}-orange)`} />
          <path d="M468 389V450M534 389V450" stroke="#526e7b" strokeWidth={3} />
        </g>
      </g>
      <g opacity={1 - ease((t - 13.1) / 0.8)}>
        <path
          d={`M500 ${s.anvil - 50}V${s.tip - 110}`}
          stroke={`url(#${id}-steel)`}
          strokeWidth={12}
        />
        <path
          d={`M470 ${s.anvil}H530V${s.anvil + 17}H470Z`}
          fill={`url(#${id}-steel)`}
          stroke="#becac4"
        />
        <g transform={`translate(500 ${s.tip - 110})`}>
          <path
            d="M-10 0H10V110H-10Z"
            fill={`url(#${id}-steel)`}
            stroke="#cfdbd2"
          />
          <path d="M0 5V102" stroke="#405e70" strokeWidth={1.3} />
          <path d="M-10 106H10L7 117H-7Z" fill={`url(#${id}-steel)`} />
          <rect
            x={-6}
            y={12}
            width={12}
            height={88}
            fill={`url(#${id}-earth)`}
            opacity={ease((t - 10.6) / 0.8)}
          />
          <path d="M-11 5H11M-11 103H11" stroke="#a5bbbf" strokeWidth={3} />
        </g>
      </g>
    </g>
  );
}
export function SPT({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = sptMotion(t),
    sample = ease((t - 14.6) / 0.5);
  return (
    <Scene embedded={embedded} duration={648}>
      <AbsoluteFill style={{ opacity: 1 - ease((t - 14) / 0.4) }}>
        <Copy
          title="اختبار الاختراق"
          accent="القياسي SPT"
          process="مقاومة الاختراق في طبقات التربة."
          benefit="مؤشرات تدعم دراسة التأسيس"
          detail="تُقرأ مع وصف الطبقات ونتائج المختبر."
          benefitTop={1590}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sample }}>
        <Copy
          title="عناية"
          accent="بالعينات"
          process="حفظ مناسب قبل الاختبار."
          benefit="عينات تحفظ قيمتها للدراسة"
          detail="وتوصيف للطبقات أثناء الاستكشاف."
          benefitTop={1570}
        />
      </AbsoluteFill>
      <GeoArt>
        <GeoDefs id="spt" />
        <SPTApparatus t={t} id="spt" />
        <g opacity={ease((t - 12.4) / 0.35)}>
          <g opacity={ease((t - 13.5) / 1)}>
            <Ground id="spt" t={t} />
          </g>
          <g
            transform={`translate(500 ${mix(446, 430, s.transfer)}) scale(${mix(0.092, 1, s.transfer)} ${mix(0.282, 1, s.transfer)}) translate(-500 -430)`}
          >
            <SoilSample
              id="spt"
              x={500}
              y={260}
              w={150}
              h={350}
              capGap={s.capGap}
              label={t > 13.5}
            />
          </g>
        </g>
      </GeoArt>
    </Scene>
  );
}
