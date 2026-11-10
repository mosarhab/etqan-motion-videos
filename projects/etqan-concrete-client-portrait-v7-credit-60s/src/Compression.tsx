import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Cylinder, Defs, Ground, SvgLabel } from "./Drawing";
import { ease, gold, rand } from "./motion";
export function Compression({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30;
  const contact = ease((t - 1.7) / 3.2),
    load = ease((t - 4.9) / 2.3),
    crack = ease((t - 7.3) / 1.45),
    travel = 55 * contact + 1.0 * load;
  return (
    <Scene embedded={embedded} duration={378}>
      <Art>
        <Defs id="press" />
        <Ground id="press" t={t} />
        <path
          d="M210 108H772V163H210Z"
          fill="#173b55"
          stroke="#95b3c1"
          strokeWidth={2}
        />
        <path d="M217 162H765" stroke={gold} strokeWidth={3} />
        {[249, 733].map((x) => (
          <g key={x}>
            <rect
              x={x - 18}
              y={164}
              width={36}
              height={453}
              fill="url(#press-steel)"
              stroke="#99b4bd"
            />
            <rect
              x={x - 30}
              y={600}
              width={60}
              height={31}
              rx={3}
              fill="#214b63"
              stroke="#adc4c9"
            />
            <path
              d={`M${x - 29} 107V94H${x + 29}V107`}
              fill="#325268"
              stroke="#93b3c1"
            />
          </g>
        ))}
        <rect
          x={395}
          y={155}
          width={190}
          height={70}
          rx={5}
          fill="url(#press-steel)"
          stroke="#aec7cb"
        />
        <path d="M402 225H578" stroke={gold} strokeWidth={3} />
        <rect
          x={450}
          y={225}
          width={80}
          height={22 + travel}
          fill="url(#press-steel)"
          stroke="#afc5c9"
        />
        <g transform={`translate(0 ${travel})`}>
          <path
            d="M453 245Q490 205 527 245Z"
            fill="url(#press-steel)"
            stroke="#adc5cb"
          />
          <rect
            x={370}
            y={245}
            width={240}
            height={17}
            rx={3}
            fill="url(#press-steel)"
            stroke="#b7cdd1"
          />
          <path d="M370 261H610" stroke="#d6e0db" strokeWidth={2} />
        </g>
        <Cylinder
          id="press"
          x={490}
          y={317 + load * 0.9}
          w={150}
          h={300 - load * 0.9}
          crack={crack}
        />
        <rect
          x={362}
          y={617}
          width={256}
          height={19}
          rx={3}
          fill="url(#press-steel)"
          stroke="#b8ccd0"
        />
        <rect
          x={354}
          y={636}
          width={272}
          height={20}
          rx={3}
          fill="#254f65"
          stroke="#87a9b7"
        />
        <path
          d="M210 654H772L785 668H196Z"
          fill="#224a60"
          stroke="#9db8c3"
          strokeWidth={1.4}
        />
        <path d="M216 666H766" stroke={gold} strokeWidth={2} />
        <path
          d="M585 208Q846 202 842 401V552"
          fill="none"
          stroke="#607e91"
          strokeWidth={5}
        />
        <rect
          x={796}
          y={552}
          width={92}
          height={96}
          rx={4}
          fill="#14374f"
          stroke="#8faab6"
          strokeWidth={1.5}
        />
        <path d="M807 566H878" stroke="#91b1bd" />
        <circle cx={859} cy={581} r={5} fill={gold} />
        <g opacity={load * 0.65} fill="none" stroke={gold} strokeWidth={2}>
          <path d="M324 373V457l-6-8m6 8 6-8 M656 373V457l-6-8m6 8 6-8" />
        </g>
        {Array.from({ length: 5 }, (_, i) => {
          const age = Math.max(0, (t - 7.9 - i * 0.09) * 0.18);
          return (
            <path
              key={i}
              d="M-2-2 3-1 2 3-3 2Z"
              transform={`translate(${429 + i * 29 + age * 7} ${Math.min(612, 480 + i * 16 + age * age * 120)}) rotate(${i * 22 + age * 60})`}
              fill="#c8cbb7"
              opacity={age > 0 ? 0.7 : 0}
            />
          );
        })}
        <SvgLabel x={490} y={715}>
          قياس المقاومة لتقييم المطابقة
        </SvgLabel>
      </Art>
      <Copy
        title="مقاومة"
        accent="الضغط"
        process="نطبّق الحمل على العينة الأسطوانية حتى الكسر."
        benefit="نتائج تدعم القرار"
        detail="لتقييم المطابقة للمقاومة المطلوبة في المشروع."
      />
    </Scene>
  );
}
