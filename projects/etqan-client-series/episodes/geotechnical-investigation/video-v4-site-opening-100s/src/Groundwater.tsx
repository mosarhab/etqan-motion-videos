import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { Scene, SceneProps, Copy } from "./Scene";
import { GeoArt, GeoDefs } from "./GeoMaterials";
import { ease, gold } from "./motion";
export function groundwaterMotion(t: number) {
  return {
    sensorY: 200 + 450 * ease((t - 0.5) / 3.5) - 450 * ease((t - 5.3) / 2.2),
    capLift: 50 * ease(t / 0.7) * (1 - ease((t - 7) / 0.6)),
  };
}
export function Groundwater({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / useVideoConfig().fps,
    s = groundwaterMotion(t);
  return (
    <Scene embedded={embedded} duration={258}>
      <Copy
        title="دراسة ظروف"
        accent="المياه الجوفية"
        process="الرصد بالبيزومتر عند الحاجة."
        benefit="معلومات تدعم تخطيط الحفر والتأسيس"
        detail="بحسب ظروف الموقع وبرنامج الدراسة."
        benefitTop={1580}
      />
      <GeoArt>
        <GeoDefs id="water" />
        <path
          d="M100 450L150 420H900L850 450Z"
          fill="#816647"
          stroke="#9e8e69"
        />
        <path
          d="M100 450H850V915H100Z"
          fill="url(#water-earth)"
          stroke="#6e796c"
        />
        <path d="M850 450L900 420V885L850 915Z" fill="#304748" />
        <path
          d="M100 600Q380 570 850 615V750Q500 715 100 748Z"
          fill="#a68b59"
        />
        <path d="M100 750Q440 720 850 750V915H100Z" fill="#4c6863" />
        <path d="M100 450H850V915H100Z" fill="url(#water-grain)" />
        <rect
          x={474}
          y={327}
          width={52}
          height={525}
          rx={5}
          fill="#102b3b"
          stroke="#8cabb8"
          strokeWidth={2}
        />
        <rect
          x={487}
          y={340}
          width={26}
          height={494}
          rx={3}
          fill="#537782"
          stroke="#c4d5d2"
        />
        <rect x={493} y={340} width={14} height={494} fill="#113849" />
        {Array.from({ length: 13 }, (_, i) => (
          <path
            key={i}
            d={`M482 ${727 + i * 8}h10M508 ${727 + i * 8}h10`}
            stroke="#afc3bd"
            strokeWidth={2}
          />
        ))}
        <path
          d="M467 335H533V365H467Z"
          fill="url(#water-steel)"
          stroke="#c6d2cd"
        />
        <g transform={`translate(${-2 * s.capLift} ${-s.capLift})`}>
          <ellipse cx={500} cy={318} rx={38} ry={11} fill="#a4babd" />
          <path
            d="M462 318V333Q500 355 538 333V318"
            fill="url(#water-dark)"
            stroke="#9bb5bf"
          />
        </g>
        <path
          d={`M620 178Q550 140 500 250V${s.sensorY}`}
          fill="none"
          stroke={gold}
          strokeWidth={3}
        />
        <g transform={`translate(500 ${s.sensorY})`}>
          <rect
            x={-6}
            width={12}
            height={28}
            rx={4}
            fill="url(#water-steel)"
            stroke="#d4ded4"
          />
          <circle cy={22} r={3} fill={gold} />
        </g>
        <path
          d="M620 140H758V229H620Z"
          fill="url(#water-dark)"
          stroke="#8caab5"
        />
        <path d="M620 140L636 129H775L758 140Z" fill="#6e8a96" />
        <path d="M758 140L775 129V216L758 229Z" fill="#193746" />
        <path d="M645 175H716" stroke="#6c8d9b" strokeWidth={3} />
        <circle cx={735} cy={195} r={5} fill={gold} />
      </GeoArt>
    </Scene>
  );
}
