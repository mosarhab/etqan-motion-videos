import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { DirectShearApparatus } from "./LabApparatus";
import { Ground } from "./Drawing";
import { ease } from "./motion";
export function Shear({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={288}>
      <Copy
        title="اختبار"
        accent="القص المباشر"
        process="تحديد خصائص مقاومة التربة للقص."
        benefit="بيانات لدراسة التحمل والاستقرار"
        detail="تتكامل مع بقية معلومات الموقع والدراسة."
      />
      <Art>
        <GeoDefs id="shear" />
        <Ground id="shear" t={t} />
        <g
          transform={`translate(490 430) scale(${1 + 0.065 * ease(t / 8)}) translate(-490 -430)`}
        >
          <DirectShearApparatus id="shear" t={t} />
        </g>
      </Art>
    </Scene>
  );
}
