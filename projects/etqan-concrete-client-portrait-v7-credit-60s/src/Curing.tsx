import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Defs, Cylinder, Ground, SvgLabel } from "./Drawing";
import { ease, gold } from "./motion";
import { SampleAge } from "./SampleAge";
export function Curing({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30;
  const down = ease((t - 1.4) / 3),
    y = 95 + down * 205;
  const wave = Array.from(
    { length: 41 },
    (_, i) =>
      `${i ? "L" : "M"}${83 + i * 20.8} ${264 + Math.sin(i * 0.53 - t * 1.8) * (1.1 + 2.0 * Math.sin(down * Math.PI))}`,
  ).join(" ");
  return (
    <Scene embedded={embedded} duration={348}>
      <SampleAge t={t} />
      <Art>
        <Defs id="curing" />
        <Ground id="curing" t={t} />
        <path
          d="M80 222H920V647H80Z"
          fill="#0c2d41"
          stroke="#7fa8b9"
          strokeWidth={2}
        />
        <path d="M91 237H909V637H91Z" fill="#0b2b3d" />
        {[235, 490, 745].map((x, i) => (
          <g key={i}>
            <Cylinder id="curing" x={x} y={y} w={141} h={286} />
          </g>
        ))}
        <g transform={`translate(0 ${down * 205})`}>
          <path d="M130 397H850" stroke="#9dbfc8" strokeWidth={7} />
          <path
            d="M142 393V65Q142 50 158 50H176 M838 393V65Q838 50 822 50H804"
            fill="none"
            stroke="#9ebdca"
            strokeWidth={4}
          />
        </g>
        <path d={`${wave} L915 637H83Z`} fill="url(#curing-water)" />
        <path d={wave} fill="none" stroke="#8fd0da" strokeWidth={2} />
        <path
          d="M80 223V646H920V223"
          fill="none"
          stroke="#b6ced3"
          strokeWidth={5}
        />
        <path d="M80 223H920" stroke="#a8c3cc" strokeWidth={4} />
        <path
          d="M90 647H910L928 663H72Z"
          fill="#193b51"
          stroke="#9ab6c0"
          strokeWidth={1}
        />
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${165 + i * 280} 615q15 ${-10 - Math.sin(t + i) * 3} 30 0`}
            stroke="#95c7cf"
            opacity=".2"
            fill="none"
          />
        ))}
        <SvgLabel x={490} y={711}>
          المعالجة قبل اختبار المقاومة
        </SvgLabel>
      </Art>
      <Copy
        title="معالجة"
        accent="العينات"
        process="معالجة العينات وفق متطلبات المواصفات القياسية."
        benefit="أساس لتقييم المقاومة"
        detail="وفق متطلبات المعالجة والعمر المحدد للاختبار."
      />
    </Scene>
  );
}
