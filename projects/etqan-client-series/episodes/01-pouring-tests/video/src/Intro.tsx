import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art } from "./Scene";
import { Defs } from "./Drawing";
import { EquipmentPair } from "./Equipment";
import { ease, gold } from "./motion";
export function Intro({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    a = ease((t - 0.1) / 1.5);
  return (
    <Scene embedded={embedded} duration={198} first>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 254,
          width: 920,
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 30, color: "#a6bfcc", marginBottom: 30 }}>
          إتقان | من الفحص إلى القرار
        </div>
        <div style={{ fontSize: 70, fontWeight: 600, lineHeight: 1.5 }}>
          وقت الصب…
        </div>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            lineHeight: 1.45,
            color: gold,
            opacity: ease((t - 0.2) / 0.65),
          }}
        >
          ماذا نتحقّق منه؟
        </div>
        <div
          style={{
            width: 85,
            height: 3,
            background: gold,
            margin: "23px 0 0 auto",
          }}
        />
      </div>
      <Art>
        <Defs id="intro" />
        <defs>
          <clipPath id="intro-reveal">
            <rect x={1000 * (1 - a)} y={0} width={1000 * a} height={740} />
          </clipPath>
        </defs>
        <g clipPath="url(#intro-reveal)">
          <EquipmentPair id="intro" t={t} settled={false} />
        </g>
      </Art>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 1510,
          width: 920,
          textAlign: "right",
          fontSize: 45,
          lineHeight: 1.8,
          color: "#c4d8e1",
          opacity: ease((t - 1) / 0.7),
        }}
      >
        معلومة أوضح…
        <br />
        لقرار هندسي مدروس.
      </div>
    </Scene>
  );
}
