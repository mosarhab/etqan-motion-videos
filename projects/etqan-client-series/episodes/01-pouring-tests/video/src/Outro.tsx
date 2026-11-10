import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art } from "./Scene";
import { Defs, SvgLabel } from "./Drawing";
import { Logo } from "./Brand";
import { EquipmentPair } from "./Equipment";
import { gold, ease } from "./motion";
export function Outro({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={240} last>
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
        <div style={{ fontSize: 46, fontWeight: 650, lineHeight: 1.5 }}>
          سلسلة إتقان
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            lineHeight: 1.4,
            color: gold,
          }}
        >
          من الفحص إلى القرار
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
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 850,
          width: 920,
          textAlign: "right",
          fontSize: 34,
          lineHeight: 1.8,
          color: "#c4d7df",
        }}
      >
        فحوصات الخرسانة وقت الصب
      </div>
      <Art>
        <Defs id="outro" />
        <EquipmentPair id="outro" t={t} />
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
          top: 1510,
          width: 920,
          textAlign: "center",
          color: "#c4d7df",
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#eef5f6",
          }}
        >
          تواصل معنا
        </div>
        <div
          data-copy="closing-phone-group"
          dir="ltr"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            marginTop: 8,
            whiteSpace: "nowrap",
            color: gold,
          }}
        >
          <svg
            data-contact="closing-phone-icon"
            aria-hidden="true"
            width={52}
            height={52}
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
          <span
            data-copy="closing-phone"
            dir="ltr"
            style={{
              fontSize: 64,
              fontWeight: 750,
              lineHeight: 1.35,
              color: gold,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            0551603205
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 34,
            lineHeight: 1.5,
            color: "#a9c3cf",
            whiteSpace: "nowrap",
          }}
        >
          لخدمات فحص الخرسانة
        </div>
      </div>
    </Scene>
  );
}
