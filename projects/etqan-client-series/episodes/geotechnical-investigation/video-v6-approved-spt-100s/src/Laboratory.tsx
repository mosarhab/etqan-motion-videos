import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { SieveStation, SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { ease, mix } from "./motion";
export function labTransferMotion(t: number) {
  return { x: 180, y: 462, w: 72, h: 143, arrived: 1, labelOpacity: 0 };
}
export function Laboratory({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = labTransferMotion(t),
    arrived = s.arrived,
    pour = ease((t - 2.5) / 0.8) * (1 - ease((t - 4) / 0.7));
  return (
    <Scene embedded={embedded} duration={288}>
      <Copy
        title="التدرّج الحبيبي"
        accent="وتصنيف التربة"
        process="دراسة توزيع أحجام الحبيبات."
        benefit="تحديد نوع التربة تمهيدًا لتقييمها"
        detail="واختيار الفحوص المناسبة لخصائصها."
      />
      <Art>
        <GeoDefs id="gradation" />
        <Ground id="gradation" t={t} />
        <g opacity={ease((t - 0.35) / 0.8)}>
          <SieveStation
            id="gradation"
            t={Math.max(0, (t - 2) * 0.85)}
            sampleOpacity={arrived}
          />
        </g>
        <g opacity={1 - arrived}>
          <SoilSample
            id="gradation-transfer"
            x={s.x}
            y={s.y}
            w={s.w}
            h={s.h}
            label
            labelOpacity={s.labelOpacity}
          />
        </g>
        <GeoDefs id="gradation-transfer" />
        <g
          opacity={ease((t - 1.8) / 0.4) * (1 - ease((t - 4.8) / 0.6))}
          transform={`translate(${mix(290, 540, ease((t - 1.8) / 1))} 118) rotate(${24 * pour})`}
        >
          <path
            d="M-92 0V22Q0 53 92 22V0"
            fill="url(#gradation-steel)"
            stroke="#b6c9c8"
          />
          <ellipse
            rx={92}
            ry={16}
            fill="#8a7652"
            stroke="#d4dfd9"
            strokeWidth={2}
          />
          <ellipse
            rx={84}
            ry={12}
            fill="url(#gradation-earth)"
            opacity={1 - ease((t - 2.6) / 1.5)}
          />
        </g>
      </Art>
    </Scene>
  );
}
