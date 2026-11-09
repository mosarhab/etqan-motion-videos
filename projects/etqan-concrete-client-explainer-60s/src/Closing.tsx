import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art } from "./Scene";
import { Defs, Cylinder, Ground, SvgLabel } from "./Drawing";
import { Logo } from "./Brand";
import { gold, ease } from "./motion";
export function Closing({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30;
  return (
    <Scene embedded={embedded} duration={150} last>
      <Art>
        <Defs id="closing" />
        <Ground id="closing" t={t} />
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={ease((t - 0.1 - i * 0.14) / 0.65)}>
            <Cylinder id="closing" x={270 + i * 220} y={355} w={126} h={252} />
          </g>
        ))}
        <SvgLabel x={490} y={708} color={gold} size={34}>
          الدقة أساس الثقة
        </SvgLabel>
      </Art>
      <div
        style={{
          position: "absolute",
          left: 188,
          top: 235,
          opacity: ease(t / 0.65),
        }}
      >
        <Logo width={760} />
      </div>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 88,
          top: 299,
          width: 690,
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 67, fontWeight: 750, lineHeight: 1.5 }}>
          نتائج تدعم
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.4,
            color: gold,
          }}
        >
          القرار الهندسي
        </div>
        <div
          style={{
            height: 3,
            width: 85,
            background: gold,
            margin: "29px 0 35px auto",
          }}
        />
        <div style={{ fontSize: 36, lineHeight: 1.9, color: "#c4d7df" }}>
          تواصل معنا لخدمات
          <br />
          فحص الخرسانة.
        </div>
      </div>
    </Scene>
  );
}
