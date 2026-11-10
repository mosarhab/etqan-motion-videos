import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Copy } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { RigWorld } from "./Rig";
import { SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { clamp, ease, gold, muted, mix } from "./motion";
export function journeyMotion(t: number) {
  const rigTime = 1 + 14.7 * clamp(t / 15),
    transfer = ease((t - 15) / 2);
  return {
    rigTime,
    transfer,
    x: mix(302.4, 500, transfer),
    y: mix(442.8, 430, transfer),
    sx: mix(0.096, 1, transfer),
    sy: mix(0.31, 1, transfer),
    capGap: 40 * (1 - ease((t - 18) / 1.25)),
  };
}
export function Journey({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = journeyMotion(t),
    first = 1 - ease((t - 3.2) / 0.35),
    field = ease((t - 3.6) / 0.45) * (1 - ease((t - 15.9) / 0.4)),
    sample = ease((t - 16.4) / 0.5);
  return (
    <Scene embedded={embedded} duration={648} first>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          top: 254,
          right: 80,
          width: 920,
          textAlign: "right",
          opacity: first,
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
      <AbsoluteFill style={{ opacity: field }}>
        <Copy
          title="استكشاف"
          accent="طبقات التربة"
          process=""
          benefit="فهم ظروف الموقع قبل التأسيس"
          benefitTop={1650}
          benefitLabel=""
          detail=""
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: sample }}>
        <Copy
          title="عناية"
          accent="بالعينات"
          process="حفظ العينات قبل اختبارها."
          benefit="من الموقع إلى المختبر"
          benefitTop={1650}
          benefitLabel=""
          detail=""
        />
      </AbsoluteFill>
      <GeoArt>
        <GeoDefs id="journey" />
        <g opacity={1 - ease((t - 15) / 1.8)}>
          <RigWorld id="journey" t={s.rigTime} active camera />
        </g>
        <g opacity={ease((t - 15) / 0.45)}>
          <g opacity={ease((t - 16.2) / 1)}>
            <Ground id="journey" t={t} />
          </g>
          <g
            transform={`translate(${s.x} ${s.y}) scale(${s.sx} ${s.sy}) translate(-500 -430)`}
          >
            <SoilSample
              id="journey"
              x={500}
              y={260}
              w={150}
              h={350}
              capGap={s.capGap}
              label={t > 16.5}
            />
          </g>
        </g>
      </GeoArt>
    </Scene>
  );
}
