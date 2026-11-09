import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Defs, Ground, SvgLabel } from "./Drawing";
import { ease, clamp, gold } from "./motion";
function liftProfile(x: number) {
  x = clamp(x);
  const a = 0.05;
  if (x < a) return (x * x) / (2 * a * (1 - a));
  if (x > 1 - a) return 1 - (1 - x) ** 2 / (2 * a * (1 - a));
  return (x - a / 2) / (1 - a);
}
export function Fresh({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30;
  const lift = 335 * liftProfile((t - 2.0) / 5),
    settle = ease((t - 4.7) / 3.6),
    h = 300 - settle * 70;
  const top = 50 + settle * 17,
    V = (300 / 3) * (98 * 98 + 98 * 48 + 48 * 48);
  const bottom = (-top + Math.sqrt((12 * V) / h - 3 * top * top)) / 2;
  const side = -105 * ease((t - 7.3) / 1.2);
  const probe = 85 * (1 - ease((t - 3.0) / 2.0));
  return (
    <Scene embedded={embedded} duration={438}>
      <Art>
        <Defs id="fresh" />
        <Ground id="fresh" t={t} />
        <g transform="translate(305 0)">
          <path
            d="M-185 624H185L205 638H-205Z"
            fill="#284b60"
            stroke="#829da6"
            strokeWidth={1.5}
          />
          <path
            d={`M${-top} ${622 - h}Q0 ${610 - h} ${top} ${622 - h}L${bottom} 622Q0 640 ${-bottom} 622Z`}
            fill="url(#fresh-wet)"
            stroke="#bcc1aa"
            strokeOpacity=".6"
          />
          <path
            d={`M${-top} ${622 - h}Q0 ${610 - h} ${top} ${622 - h}L${bottom} 622Q0 640 ${-bottom} 622Z`}
            fill="url(#fresh-grain)"
          />
          <g
            opacity={1 - ease((t - 10.5) / 1.5)}
            transform={`translate(${side} ${-lift})`}
          >
            <path
              d="M-50 322H50L100 622H-100Z"
              fill="url(#fresh-steel)"
              fillOpacity=".94"
              stroke="#b4c8ce"
              strokeWidth={1.7}
            />
            <ellipse
              cx={0}
              cy={322}
              rx={50}
              ry={10}
              fill="#102f42"
              stroke="#b5c7cd"
              strokeWidth={2}
            />
            <path
              d="M-50 322L-100 622M50 322L100 622"
              fill="none"
              stroke="#e3e8e4"
              opacity=".5"
            />
            <path
              d="M-78 425H-112V477H-88 M78 425H112V477H88"
              fill="none"
              stroke="url(#fresh-steel)"
              strokeWidth={7}
            />
            <path
              d="M-95 620H-134V626H-88 M95 620H134V626H88"
              fill="#8daab5"
              stroke="#c3d0cd"
            />
            <path d="M-35 355V582" stroke="#dbe5e2" opacity=".18" />
          </g>
        </g>
        <g transform="translate(702 0)">
          <path
            d="M-130 400H130V620H-130Z"
            fill="#123348"
            stroke="#88aab8"
            strokeWidth={2}
          />
          <path d="M-124 411H124V613H-124Z" fill="url(#fresh-wet)" />
          <path d="M-124 411H124V613H-124Z" fill="url(#fresh-grain)" />
          <path
            d="M-130 400H130 M-130 620H130"
            stroke="#c2d1ce"
            strokeWidth={3}
          />
          <g transform={`translate(0 ${-probe})`}>
            <path d="M0 359V520" stroke="#b6d2d9" strokeWidth={8} />
            <path d="M0 411V520" stroke="#d4e3df" strokeWidth={8} />
            <rect
              x={-34}
              y={296}
              width={68}
              height={82}
              rx={6}
              fill="#0b2438"
              stroke="#94b7c4"
              strokeWidth={2}
            />
            <rect
              x={-24}
              y={309}
              width={48}
              height={37}
              rx={2}
              fill="#183e50"
              stroke="#819fad"
              strokeWidth={0.7}
            />
            <path d="M-15 328H15" stroke={gold} strokeWidth={2} />
            <circle cx={-12} cy={362} r={4} fill={gold} />
            <circle cx={12} cy={362} r={4} fill="#8aaab8" />
          </g>
          <path
            d="M-99 545H-58M58 545H99"
            stroke="#d9c375"
            strokeWidth={1}
            strokeDasharray="3 5"
            opacity={ease((t - 5) / 0.5) * 0.6}
          />
        </g>
        <SvgLabel x={305} y={712}>
          اختبار الهبوط
        </SvgLabel>
        <SvgLabel x={702} y={712}>
          درجة الحرارة
        </SvgLabel>
      </Art>
      <Copy
        title="الهبوط"
        accent="ودرجة الحرارة"
        process="نراجع قوام الخرسانة ودرجة حرارتها."
        benefit="تحقّق قبل الصب"
        detail="للمساعدة في تقييم ملاءمتها لمتطلبات المشروع."
      />
    </Scene>
  );
}
