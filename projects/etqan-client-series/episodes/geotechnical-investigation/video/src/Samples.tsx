import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { ease } from "./motion";
export function Samples({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={198}>
      <Copy
        title="عناية"
        accent="بالعينات"
        process="حفظ مناسب قبل الاختبار."
        benefit="للحفاظ على قيمتها للدراسة"
        detail="من الموقع إلى المختبر."
      />
      <Art>
        <GeoDefs id="samples" />
        <Ground id="samples" t={t} />
        <g
          transform={`translate(500 430) scale(${1 + 0.035 * ease(t / 6)}) translate(-500 -430)`}
        >
          <SoilSample
            id="samples"
            x={500}
            y={190 - 15 * ease((t - 2) / 3)}
            w={180}
            h={390}
            capGap={40 * (1 - ease((t - 0.5) / 1.2))}
          />
        </g>
      </Art>
    </Scene>
  );
}
