import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { RigWorld } from "./Rig";
import { gold, muted, ease } from "./motion";
export function Intro({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={258} first>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 254,
          opacity: "var(--copy-opacity)",
          width: 920,
          textAlign: "right",
          transform: `translateY(${10 * (1 - ease(t / 0.8))}px)`,
        }}
      >
        <div style={{ fontSize: 30, color: muted, marginBottom: 27 }}>
          إتقان | من الفحص إلى القرار
        </div>
        <div style={{ fontSize: 58, fontWeight: 700, lineHeight: 1.5 }}>
          من استكشاف التربة…
        </div>
        <div
          style={{
            fontSize: 74,
            fontWeight: 800,
            lineHeight: 1.4,
            color: gold,
          }}
        >
          إلى قرار التأسيس
        </div>
        <div
          style={{
            height: 3,
            width: 85,
            background: gold,
            margin: "24px 0 0 auto",
          }}
        />
      </div>
      <GeoArt>
        <GeoDefs id="introgeo" />
        <RigWorld id="introgeo" t={t} />
      </GeoArt>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 1650,
          opacity: "var(--copy-opacity)",
          right: 80,
          width: 920,
          textAlign: "right",
          fontSize: 42,
          fontWeight: 650,
        }}
      >
        معلومات تدعم توصيات التأسيس
      </div>
    </Scene>
  );
}
