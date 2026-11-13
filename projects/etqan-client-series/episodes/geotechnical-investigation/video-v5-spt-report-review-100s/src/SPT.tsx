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
  const s = sptMotion(t),
    apparatus = 1 - ease((t - 13.1) / 0.8),
    frame = 1 - ease((t - 9.5) / 1.1),
    hammerBottom = s.anvil - s.hammerLift,
    rodTop = s.anvil - 250,
    samplerTop = s.tip - 110,
    zoom = 1 + 0.065 * ease((t - 0.2) / 2) * (1 - ease((t - 10) / 2.4));
  return (
    <g data-test="split-spoon-SPT" data-view="connected-detail">
      <defs><clipPath id={id + "-detail-window"}><rect x={0} y={130} width={1000} height={870} /></clipPath></defs>
      <g clipPath={`url(#${id}-detail-window)`}>
      <g transform={`translate(500 620) scale(${zoom}) translate(-500 -620)`}>
        <g opacity={1 - ease((t - 11.8) / 1.4)}>
          <SoilBlock id={id} bottom={620} />
          <rect x={472} y={620} width={56} height={197} fill="#0a1a24" />
          <path d="M472 620V817H528V620" fill="none" stroke="#73857b" strokeWidth={1.5} />
          <ellipse cx={500} cy={620} rx={28} ry={6} fill="#07141c" stroke="#8e8c6e" />
        </g>
        <g opacity={frame} data-spt="cropped-rig-mast">
          <rect x={341} y={30} width={32} height={583} fill={`url(#${id}-white)`} stroke="#96afb6" />
          <rect x={350} y={30} width={12} height={583} fill={`url(#${id}-steel)`} />
          <path d="M373 45H435L480 86M373 610L425 540" fill="none" stroke="#667d85" strokeWidth={8} />
          <rect x={329} y={245} width={58} height={98} rx={5} fill={`url(#${id}-orange)`} stroke="#edb778" />
          <rect x={334} y={610} width={52} height={10} rx={2} fill={`url(#${id}-dark)`} stroke="#859a9a" />
          <path d={`M480 86H500V${hammerBottom - 116}`} fill="none" stroke="#b3c3c2" strokeWidth={2.6} />
        </g>
        <g opacity={apparatus} data-spt="continuous-rod-and-sampler">
          {/* Rectangles retain a non-zero SVG bounding box: vertical gradient strokes vanished in V4. */}
          <rect data-spt="drive-rod" x={492} y={rodTop} width={16} height={samplerTop - rodTop + 2} fill={`url(#${id}-steel)`} stroke="#b5c9cd" strokeWidth={1.2} />
          <rect x={489} y={568 + s.drive - s.withdraw} width={22} height={20} rx={2} fill={`url(#${id}-steel)`} stroke="#e2e6d8" />
          <rect data-spt="anvil" x={466} y={s.anvil} width={68} height={17} rx={2} fill={`url(#${id}-steel)`} stroke="#d9e1d8" strokeWidth={1.5} />
          <g transform={`translate(500 ${samplerTop})`}>
            <rect x={-11} y={0} width={22} height={110} fill={`url(#${id}-steel)`} stroke="#d5e2da" strokeWidth={1.5} />
            <path d="M0 5V102" stroke="#3b596b" strokeWidth={1.5} />
            <path d="M-11 106H11L7 117H-7Z" fill={`url(#${id}-steel)`} stroke="#cfdbd5" />
            <rect x={-6} y={12} width={12} height={88} fill={`url(#${id}-earth)`} opacity={ease((t - 10.6) / 0.8)} />
            <path d="M-12 5H12M-12 103H12" stroke="#c0d1d1" strokeWidth={3} />
          </g>
        </g>
        <g opacity={frame} transform={`translate(0 ${hammerBottom - 490})`} data-spt="hammer">
          <path d="M442 374H558V490H442Z" fill={`url(#${id}-steel)`} stroke="#d8e0d7" strokeWidth={1.6} />
          <ellipse cx={500} cy={374} rx={58} ry={14} fill="#a9bdbb" stroke="#e2e8dc" />
          <path d="M442 463H558V490H442Z" fill={`url(#${id}-orange)`} />
          <path d="M456 391V450M543 391V450" stroke="#506f80" strokeWidth={3} />
        </g>
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
          detail="وفق نوع العينة ومتطلبات الدراسة."
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
