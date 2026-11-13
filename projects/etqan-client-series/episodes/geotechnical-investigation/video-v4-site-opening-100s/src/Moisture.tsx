import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { GeoDefs, Bolt } from "./GeoMaterials";
import { SoilSample } from "./GeoProps";
import { Ground } from "./Drawing";
import { ease, mix, gold } from "./motion";
export function moistureMotion(t: number) {
  const a = ease((t - 0.6) / 1.2),
    into = ease((t - 3.1) / 1),
    back = ease((t - 6.3) / 1.2);
  return {
    jarX: mix(500, 180, a),
    jarY: mix(136.19, 462, a),
    jarW: mix(150, 72, a),
    jarH: mix(350, 143, a),
    tinX: 360 + 390 * into * (1 - back),
    dry: ease((t - 4.2) / 2),
    door:
      ease((t - 2.5) / 0.6) * (1 - ease((t - 4.1) / 0.4)) +
      ease((t - 6.1) / 0.4) * (1 - ease((t - 7.7) / 0.3)),
    steam: ease((t - 4) / 0.7) * (1 - ease((t - 6.1) / 0.4)),
  };
}
export function Moisture({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = moistureMotion(t);
  return (
    <Scene embedded={embedded} duration={258}>
      <Copy
        title="المحتوى"
        accent="المائي الطبيعي"
        process="مقارنة الكتلة قبل التجفيف وبعده."
        benefit="فهم حالة التربة وقت أخذ العينة"
        detail="للمساعدة في تفسير سلوكها ونتائج فحوصها."
      />
      <Art>
        <GeoDefs id="moisture" />
        <Ground id="moisture" t={t} />
        <g opacity={ease((t - 0.4) / 0.8)}>
          <path
            d="M253 535H492V615H253Z"
            fill="url(#moisture-white)"
            stroke="#a6bbc1"
          />
          <path d="M253 535L275 521H513L492 535Z" fill="#aabfbe" />
          <path d="M492 535L513 521V600L492 615Z" fill="#3c5c6b" />
          <path
            d="M260 520H470V534H260Z"
            fill="url(#moisture-steel)"
            stroke="#cddbd5"
          />
          <rect x={275} y={565} width={92} height={23} rx={3} fill="#183747" />
          {[402, 441].map((x) => (
            <circle
              key={x}
              cx={x}
              cy={577}
              r={7}
              fill={x === 402 ? gold : "#506f7d"}
            />
          ))}
          <path d="M622 241L645 220H911L887 241Z" fill="#a9bebc" />
          <path
            d="M622 241H887V614H622Z"
            fill="url(#moisture-white)"
            stroke="#a4bdc0"
          />
          <path d="M887 241L911 220V593L887 614Z" fill="#335463" />
          <rect
            x={651}
            y={293}
            width={209}
            height={276}
            rx={3}
            fill="#132a37"
            stroke="#7895a0"
            strokeWidth={5}
          />
          <path
            d="M664 520H849M664 440H849M664 360H849"
            stroke="url(#moisture-steel)"
            strokeWidth={5}
          />
          {Array.from({ length: 6 }, (_, i) => (
            <path
              key={i}
              d={`M673 ${535 + i * 8}H840`}
              stroke="#3c5663"
              strokeWidth={2}
            />
          ))}
          <path d="M647 268H829" stroke="#678895" strokeWidth={4} />
          <circle cx={852} cy={268} r={7} fill={gold} />
          <g opacity={0.4 * (1 - s.door)}>
            <rect x={651} y={293} width={209} height={276} fill="#5c8796" />
            <path d="M834 335V470" stroke="#dce4d7" strokeWidth={8} />
          </g>
        </g>
        <SoilSample
          id="moisture"
          x={s.jarX}
          y={s.jarY}
          w={s.jarW}
          h={s.jarH}
          label
          labelOpacity={1 - ease((t - 0.65) / 0.6)}
        />
        <g
          opacity={ease((t - 1.8) / 0.5)}
          transform={`translate(${s.tinX} 488)`}
        >
          <path
            d="M-70 0V26Q0 49 70 26V0"
            fill="url(#moisture-steel)"
            stroke="#bfd0ca"
          />
          <ellipse
            rx={70}
            ry={16}
            fill={s.dry > 0.5 ? "#a18b60" : "#6d5c42"}
            stroke="#dae1d2"
          />
          <ellipse rx={64} ry={13} fill="url(#moisture-grain)" />
        </g>
        <g fill="none" stroke="#b0d0da" strokeWidth={2} opacity={s.steam * 0.4}>
          {[710, 748, 786].map((x, i) => (
            <path
              key={x}
              d={`M${x} 461q${8 * Math.sin(t * 2 + i)} -15 0 -30t0 -30`}
            />
          ))}
        </g>
      </Art>
    </Scene>
  );
}
