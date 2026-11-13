import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Copy } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { OpeningSite, openingMotion } from "./OpeningSite";
import { ease, gold, muted } from "./motion";
export function fieldMotion(t: number) {
  return { rigTime: openingMotion(t).rigTime };
}
export function Field({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={378} first>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 254,
          right: 80,
          width: 920,
          textAlign: "right",
          opacity: 1 - ease((t - 3.3) / 0.4),
        }}
      >
        <div style={{ fontSize: 30, color: muted, marginBottom: 33 }}>
          إتقان | من الفحص إلى القرار
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.5,
            color: gold,
          }}
        >
          قبل التأسيس…
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
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 254,
          right: 80,
          width: 920,
          textAlign: "right",
          opacity: ease((t - 4.05) / 0.45) * (1 - ease((t - 7.2) / 0.4)),
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
      <AbsoluteFill style={{ opacity: ease((t - 7.7) / 0.4) }}>
        <Copy
          title="الجسات"
          accent="واستكشاف الطبقات"
          process=""
          benefit="فهم ظروف الموقع قبل التأسيس"
          detail=""
          benefitTop={1630}
          benefitLabel="الفائدة لمشروعك"
        />
      </AbsoluteFill>
      <GeoArt>
        <GeoDefs id="field" />
        <OpeningSite id="field" t={t} />
      </GeoArt>
    </Scene>
  );
}
