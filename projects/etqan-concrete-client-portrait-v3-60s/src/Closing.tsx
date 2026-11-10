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
      <div
        style={{
          position: "absolute",
          left: 110,
          top: 279,
          opacity: ease(t / 0.65),
        }}
      >
        <Logo width={860} />
      </div>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 585,
          width: 920,
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 61, fontWeight: 750, lineHeight: 1.5 }}>
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
            margin: "23px 0 0 auto",
          }}
        />
      </div>
      <div
        data-copy="standards-claim"
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 856,
          width: 920,
          textAlign: "right",
          fontSize: 34,
          lineHeight: 1.8,
          color: "#c4d7df",
          opacity: ease((t - 0.7) / 0.6),
        }}
      >
        <span style={{ fontWeight: 650, color: gold }}>أجهزة مُعايرة…</span>
        <br />
        واختبارات وفق المواصفات القياسية.
      </div>
      <Art>
        <Defs id="closing" />
        <Ground id="closing" t={t} />
        {[0, 1, 2].map((i) => (
          <g key={i} opacity={ease((t - 0.1 - i * 0.14) / 0.65)}>
            <Cylinder id="closing" x={270 + i * 220} y={355} w={126} h={252} />
          </g>
        ))}
        <SvgLabel x={490} y={708} color={gold} size={38}>
          الدقة أساس الثقة
        </SvgLabel>
      </Art>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 1540,
          width: 920,
          textAlign: "right",
          fontSize: 42,
          lineHeight: 1.85,
          color: "#c4d7df",
        }}
      >
        تواصل معنا لخدمات
        <br />
        فحص الخرسانة.
      </div>
    </Scene>
  );
}
