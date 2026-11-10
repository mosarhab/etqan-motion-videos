import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art } from "./Scene";
import { Defs, Cylinder, Ground } from "./Drawing";
import { gold, ease, rand } from "./motion";
export function Opening({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30,
    a = ease((t - 0.08) / 0.7);
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
        <div style={{ fontSize: 30, color: "#a6bfcc", marginBottom: 28 }}>
          فحوصات الخرسانة
        </div>
        <div
          style={{ fontSize: 65, fontWeight: 600, lineHeight: 1.5, opacity: a }}
        >
          القوة لا تُفترض…
        </div>
        <div
          style={{
            fontSize: 106,
            fontWeight: 800,
            lineHeight: 1.45,
            color: gold,
            opacity: ease((t - 0.35) / 0.7),
          }}
        >
          بل تُختبر
        </div>
        <div
          style={{
            width: 85,
            height: 3,
            background: gold,
            margin: "23px 0 0 auto",
            transformOrigin: "right",
            transform: `scaleX(${a})`,
          }}
        />
      </div>
      <Art top={600}>
        <Defs id="opening" />
        <Ground id="opening" t={t} />
        <g>
          <Cylinder id="opening" x={485} y={200} w={210} h={420} />
          <ellipse
            cx={485}
            cy={260 + ((t * 48) % 310)}
            rx={146}
            ry={32}
            fill="none"
            stroke={gold}
            strokeWidth={1.4}
            opacity=".65"
          />
          <path
            d="M302 212H255V620H302 M670 212H718V620H670"
            stroke="#94bbc7"
            opacity=".35"
            fill="none"
          />
          {Array.from({ length: 23 }, (_, i) => (
            <circle
              key={i}
              cx={305 + rand(i) * 370}
              cy={180 + rand(i + 82) * 460}
              r={rand(i + 25) * 2}
              fill={gold}
              opacity={0.1 + rand(i + 99) * 0.3}
            />
          ))}
          <path
            d="M412 197H558"
            stroke={gold}
            strokeWidth={2}
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - ease(t / 1.4)}
          />
        </g>
        <text
          x={490}
          y={715}
          textAnchor="middle"
          fontFamily="EtqanCairo"
          fontSize={32}
          fill="#a4c1ce"
          direction="rtl"
        >
          رحلة التحقق من جودة الخرسانة
        </text>
      </Art>
      <div
        data-copy="opening-value"
        dir="rtl"
        style={{
          position: "absolute",
          right: 80,
          top: 1500,
          width: 920,
          textAlign: "right",
          fontSize: 45,
          fontWeight: 550,
          lineHeight: 1.85,
          color: "#c4d8e1",
          opacity: ease((t - 1) / 0.8),
        }}
      >
        اختبارات تعطيك صورة أوضح
        <br />
        عن جودة الخرسانة.
      </div>
    </Scene>
  );
}
