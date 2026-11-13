import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { SoilBlock } from "./Rig";
import { ReportCover, SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { ease, gold, mix } from "./motion";
export function Report({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    a = ease((t - 1.6) / 2.8),
    report = ease((t - 3.2) / 0.8);
  return (
    <Scene embedded={embedded} duration={258}>
      <Copy
        title="تحليل النتائج"
        accent="وتوصيات التأسيس"
        process="تحليل الطبقات والفحوص وملاحظات المياه."
        benefit="توصيات تدعم قرار التأسيس"
        detail="بتقييم قدرة التحمل والهبوط وظروف الموقع."
      />
      <Art>
        <GeoDefs id="report" />
        <Ground id="report" t={t} />
        <g
          opacity={1 - report}
          transform={`translate(${mix(30, 240, a)} ${mix(-55, 45, a)}) scale(${mix(0.45, 0.28, a)})`}
        >
          <SoilBlock id="report-site" bottom={640} />
          <GeoDefs id="report-site" />
        </g>
        <g
          opacity={1 - report}
          transform={`translate(${mix(730, 550, a)} ${mix(175, 280, a)}) scale(${mix(0.7, 0.3, a)})`}
        >
          <SoilSample id="report" x={0} y={0} w={120} h={260} label={false} />
        </g>
        <g
          opacity={1 - report}
          fontFamily="EtqanCairo"
          fill="#c4d6dc"
          fontSize={29}
          direction="rtl"
          textAnchor="middle"
        >
          <text x={mix(250, 395, a)} y={mix(135, 240, a)}>
            بيانات الموقع
          </text>
          <text x={mix(730, 600, a)} y={mix(135, 240, a)}>
            نتائج المختبر
          </text>
        </g>
        <g
          opacity={ease((t - 0.8) / 0.8) * (1 - report)}
          fill="none"
          stroke={gold}
          strokeWidth={2}
        >
          <path
            d="M275 510Q350 545 470 380"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - a}
          />
          <path
            d="M730 485Q650 545 530 380"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - a}
          />
        </g>
        <g
          opacity={report}
          transform={`translate(500 430) scale(${mix(0.76, 1.05, ease((t - 3.2) / 5.6))}) translate(-500 -430)`}
        >
          <ReportCover id="report" t={Math.max(0, (t - 2.5) * 1.2)} />
        </g>
      </Art>
    </Scene>
  );
}
