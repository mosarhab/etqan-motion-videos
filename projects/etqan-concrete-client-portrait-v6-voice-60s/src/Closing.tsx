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
        data-copy="closing-contact"
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
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            gap: 32,
            whiteSpace: "nowrap",
          }}
        >
          <span>تواصل معنا</span>
          <span
            data-copy="closing-phone"
            dir="ltr"
            style={{
              fontSize: 52,
              fontWeight: 750,
              color: gold,
              fontVariantNumeric: "tabular-nums",
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            0551603205
            <svg
              data-contact="closing-phone-icon"
              aria-hidden="true"
              width={44}
              height={44}
              viewBox="0 0 24 24"
              fill="none"
              stroke={gold}
              strokeWidth={1.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <path d="M4 3h4l2 5-3 2c2 4 4 6 8 8l2-3 5 2v4c-9 3-20-8-18-18Z" />
            </svg>
          </span>
        </div>
        <div>لخدمات فحص الخرسانة</div>
      </div>
    </Scene>
  );
}
