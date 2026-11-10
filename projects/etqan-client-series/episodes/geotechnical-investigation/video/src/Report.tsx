import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { ReportCover } from "./GeoProps";
import { Ground } from "./Drawing";
import { ease } from "./motion";
export function Report({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={318}>
      <Copy
        title="تحليل النتائج"
        accent="وتوصيات التأسيس"
        process="بيانات الموقع ونتائج المختبر تُقرأ معًا."
        benefit="دراسة قدرة التحمل والهبوط"
        detail="وفق ظروف الموقع ومتطلبات المشروع."
      />
      <Art>
        <GeoDefs id="report" />
        <Ground id="report" t={t} />
        <g
          transform={`translate(500 430) scale(${1 + 0.035 * ease(t / 10)}) translate(-500 -430)`}
        >
          <ReportCover id="report" t={t} />
        </g>
      </Art>
    </Scene>
  );
}
