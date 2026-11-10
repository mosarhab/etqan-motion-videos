import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { AtterbergApparatus } from "./LabApparatus";
import { Ground } from "./Drawing";
import { ease } from "./motion";
export function Atterberg({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={258}>
      <Copy
        title="اختبارات"
        accent="حدود أتربرج"
        process="تحديد خصائص لدونة التربة."
        benefit="فهم سلوكها مع تغيّر الرطوبة"
        detail=""
      />
      <Art>
        <GeoDefs id="atterberg" />
        <Ground id="atterberg" t={t} />
        <g
          transform={`translate(490 430) scale(${1 + 0.075 * ease(t / 8)}) translate(-490 -430)`}
        >
          <AtterbergApparatus id="atterberg" t={t} />
        </g>
      </Art>
    </Scene>
  );
}
