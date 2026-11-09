import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art } from "./Scene";
import { Defs, Cylinder, Ground } from "./Drawing";
import { gold, ease, rand } from "./motion";
export function Opening({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30,
    a = ease((t - 0.1) / 0.8);
  return (
    <Scene embedded={embedded} duration={192} first>
      <Art>
        <Defs id="opening" />
        <Ground id="opening" t={t} />
        <g transform={`translate(0 ${8 * Math.sin(t * 0.6)})`}>
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
        <SvgFooter />
      </Art>
      <div
        dir="rtl"
        style={{
          position: "absolute",
          right: 88,
          top: 278,
          width: 705,
          textAlign: "right",
        }}
      >
        <div style={{ fontSize: 27, color: "#a6bfcc", marginBottom: 38 }}>
          فحوصات الخرسانة
        </div>
        <div
          style={{ fontSize: 66, fontWeight: 600, lineHeight: 1.6, opacity: a }}
        >
          القوة لا تُفترض…
        </div>
        <div
          style={{
            fontSize: 111,
            fontWeight: 800,
            lineHeight: 1.4,
            color: gold,
            opacity: ease((t - 0.45) / 0.7),
          }}
        >
          بل تُختبر
        </div>
        <div
          style={{
            width: 85,
            height: 3,
            background: gold,
            margin: "28px 0 32px auto",
            transformOrigin: "right",
            transform: `scaleX(${a})`,
          }}
        />
        <div
          style={{
            fontSize: 34,
            color: "#bdd1da",
            lineHeight: 1.9,
            opacity: ease((t - 1.2) / 0.8),
          }}
        >
          اعرف ما الذي نفحصه،
          <br />
          ولماذا يهمّ مشروعك.
        </div>
      </div>
    </Scene>
  );
}
function SvgFooter() {
  return (
    <text
      x={490}
      y={715}
      textAnchor="middle"
      fontFamily="EtqanCairo"
      fontSize={28}
      fill="#a4c1ce"
      direction="rtl"
    >
      رحلة التحقق من جودة الخرسانة
    </text>
  );
}
