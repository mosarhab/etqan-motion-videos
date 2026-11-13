import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs } from "./GeoMaterials";
import { Ground } from "./Drawing";
import { ease, rand, gold } from "./motion";
export function RockCore({
  id,
  x,
  y,
  kind,
}: {
  id: string;
  x: number;
  y: number;
  kind: number;
}) {
  const clip = id + "-rock-" + kind;
  return (
    <g transform={`translate(${x} ${y})`}>
      <defs>
        <clipPath id={clip}>
          <path d="M-76 20Q0 -9 76 20V290Q0 324 -76 290Z" />
        </clipPath>
        <linearGradient id={clip + "-body"}>
          <stop stopColor={kind === 1 ? "#696565" : "#9f9e8e"} />
          <stop offset=".35" stopColor={kind === 1 ? "#c0a9a0" : "#dedbc5"} />
          <stop offset=".75" stopColor={kind === 1 ? "#a3938b" : "#c2c6b5"} />
          <stop offset="1" stopColor={kind === 1 ? "#4c5860" : "#657e81"} />
        </linearGradient>
      </defs>
      <path
        d="M-76 20Q0 -9 76 20V290Q0 324 -76 290Z"
        fill={`url(#${clip}-body)`}
        stroke="#abbfba"
        strokeWidth={1.5}
      />
      <g clipPath={`url(#${clip})`}>
        {kind === 0 &&
          Array.from({ length: 130 }, (_, i) => (
            <ellipse
              key={i}
              cx={-75 + rand(i + 4) * 150}
              cy={20 + rand(i + 230) * 285}
              rx={0.7 + rand(i + 75) * 2}
              ry={0.5 + rand(i + 12) * 1.5}
              fill={i % 4 ? "#6f7770" : "#eeead0"}
              opacity=".24"
            />
          ))}
        {kind === 1 &&
          Array.from({ length: 120 }, (_, i) => {
            const x = -78 + rand(i + 10) * 156,
              y = 20 + rand(i + 310) * 280,
              r = 2 + rand(i + 40) * 6;
            return (
              <path
                key={i}
                d={`M${x - r} ${y}l${r * 0.8} ${-r} ${r * 1.5} ${r * 0.2} ${r * 0.2} ${r * 1.3} ${-r * 1.2} ${r * 0.7}Z`}
                fill={["#403e40", "#dbcabd", "#b6b6aa", "#8e7c76"][i % 4]}
                opacity=".75"
              />
            );
          })}
        {kind === 2 &&
          Array.from({ length: 14 }, (_, i) => (
            <path
              key={i}
              d={`M-110 ${i * 29 - 30}Q-10 ${i * 29 + 40} 32 ${i * 29 + 8}T110 ${i * 29 + 50}`}
              fill="none"
              stroke={i % 3 ? "#7c9897" : "#f4efe1"}
              strokeOpacity={i % 3 ? 0.5 : 0.7}
              strokeWidth={i % 3 ? 1.3 : 3.4}
            />
          ))}
        <path
          d="M-70 188Q-19 177 -2 202T70 197"
          fill="none"
          stroke="#263e46"
          strokeOpacity=".32"
          strokeWidth={1.2}
        />
      </g>
      <ellipse
        cy={20}
        rx={76}
        ry={21}
        fill={kind === 1 ? "#b4a29a" : "#cfd2c1"}
        stroke="#dce1d0"
      />
      <path
        d="M-63 40V278"
        stroke="#ecedda"
        strokeOpacity=".15"
        strokeWidth={3}
      />
    </g>
  );
}
export function Rocks({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps;
  return (
    <Scene embedded={embedded} duration={318}>
      <Copy
        title="التربة"
        accent="والطبقات الصخرية"
        process="أمثلة عامة؛ وتُدرَس خصائص الصخر في كل موقع."
        benefit="توصيف الصخر لدراسة سلوكه الهندسي"
        detail="مع درجة التجوية والفواصل."
      />
      <Art>
        <GeoDefs id="rocks" />
        <Ground id="rocks" t={t} />
        {[
          { x: 210, family: "رسوبية", name: "حجر جيري" },
          { x: 500, family: "نارية", name: "جرانيت" },
          { x: 790, family: "متحوّلة", name: "رخام" },
        ].map((s, i) => {
          const a = ease((t - i * 0.4) / 1);
          return (
            <g
              key={i}
              opacity={a}
              transform={`translate(0 ${25 * (1 - a) - 6 * Math.sin(t * 0.5 + i)})`}
            >
              <RockCore id="rocks" x={s.x} y={205} kind={i} />
              <text
                x={s.x}
                y={575}
                textAnchor="middle"
                direction="rtl"
                fontFamily="EtqanCairo"
                fontSize={34}
                fill={gold}
              >
                {s.family}
              </text>
              <text
                x={s.x}
                y={620}
                textAnchor="middle"
                direction="rtl"
                fontFamily="EtqanCairo"
                fontSize={29}
                fill="#bed3dc"
              >
                {s.name}
              </text>
            </g>
          );
        })}
      </Art>
    </Scene>
  );
}
