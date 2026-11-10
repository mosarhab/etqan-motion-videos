import React from "react";
import { useCurrentFrame } from "remotion";
import { Scene, SceneProps, Art, Copy } from "./Scene";
import { Defs, Cylinder, Ground, FluidStream, SvgLabel } from "./Drawing";
import { ease, clamp, gold } from "./motion";
export function Samples({ embedded = false }: SceneProps) {
  const t = useCurrentFrame() / 30;
  const active = Math.min(2, Math.max(0, Math.floor((t - 0.65) / 2)));
  const phase = t - 0.65 - active * 2;
  const xs = [220, 490, 760];
  const moving =
    xs[active] + (active < 2 ? 270 * ease((phase - 1.55) / 0.4) : 0);
  const rodA = ease((t - 7) / 0.3) * (1 - ease((t - 9.2) / 0.3));
  const rodY =
    299 +
    Math.sin((t - 7) * Math.PI * 4) *
      27 *
      ease((t - 7) / 0.35) *
      (1 - ease((t - 8.8) / 0.4));
  const level = ease((t - 9.5) / 1.3);
  return (
    <Scene embedded={embedded} duration={378}>
      <Art>
        <Defs id="samples" />
        <Ground id="samples" t={t} />
        <path
          d="M115 125V570M865 125V570M115 125H865"
          fill="none"
          stroke="#476d80"
          strokeWidth={5}
        />
        <path d="M115 124H865" fill="none" stroke="#a2bec7" strokeWidth={1} />
        {xs.map((x, i) => {
          const fill = ease((t - 0.65 - i * 2) / 1.45);
          const h = 296 * Math.max(0.001, fill);
          return (
            <g key={i}>
              <path
                d={`M${x - 81} 322V620Q${x} 647 ${x + 81} 620V322`}
                fill="#102c40"
                stroke="#7295a3"
                strokeWidth={2}
              />
              <path
                d={`M${x - 81} 322Q${x} 301 ${x + 81} 322`}
                fill="none"
                stroke="#c6d6d8"
                strokeWidth={2}
              />
              {fill > 0.002 && (
                <Cylinder id="samples" x={x} y={620 - h} w={150} h={h} wet />
              )}
              <path
                d={`M${x - 81} 322V620Q${x} 647 ${x + 81} 620V322`}
                fill="url(#samples-steel)"
                fillOpacity=".18"
                stroke="#bed0d1"
                strokeWidth={1.5}
              />
              <path
                d={`M${x - 68} 335V611M${x + 68} 335V611`}
                stroke="#a9c0c5"
                strokeWidth={2}
              />
              {[402, 541].map((y) => (
                <g key={y}>
                  <rect
                    x={x - 91}
                    y={y}
                    width={20}
                    height={18}
                    rx={2}
                    fill="#2c5167"
                    stroke="#a5bcc5"
                  />
                  <circle cx={x - 81} cy={y + 9} r={3} fill={gold} />
                  <rect
                    x={x + 71}
                    y={y}
                    width={20}
                    height={18}
                    rx={2}
                    fill="#2c5167"
                    stroke="#a5bcc5"
                  />
                  <circle cx={x + 81} cy={y + 9} r={3} fill={gold} />
                </g>
              ))}
              <path
                d={`M${x - 101} 643H${x + 101}`}
                stroke="#809da9"
                strokeWidth={7}
              />
            </g>
          );
        })}
        <g opacity={1 - ease((t - 6.8) / 0.5)}>
          <g transform={`translate(${moving} 0)`}>
            <rect
              x={-31}
              y={113}
              width={62}
              height={27}
              rx={3}
              fill="#275069"
              stroke="#aac4ce"
            />
            <path
              d="M-80 170H80L54 202H-54Z"
              fill="url(#samples-steel)"
              stroke="#b6c9cb"
            />
            <path d="M0 140V169" stroke="#94b7c0" strokeWidth={5} />
          </g>
          <FluidStream
            x={moving}
            y={201}
            bottom={620 - 296 * ease((t - 0.65 - active * 2) / 1.45)}
            id="samples"
            t={t}
            visible={phase > 0 && phase < 1.45 && t < 6.1}
          />
        </g>
        <g opacity={rodA}>
          <path
            d={`M490 ${rodY - 220}V${rodY + 200}`}
            stroke="#b5cdd3"
            strokeWidth={9}
          />
          <ellipse cx={490} cy={rodY + 200} rx={4.5} ry={4} fill="#b5cdd3" />
        </g>
        <g
          opacity={ease((t - 9.4) / 0.2)}
          transform={`translate(${165 + 650 * level} 0)`}
        >
          <path d="M0 317V350" stroke="#d5dfda" strokeWidth={7} />
          <path d="M-37 316H37" stroke="url(#samples-steel)" strokeWidth={7} />
        </g>
      </Art>
      <Copy
        title="إعداد العينات"
        accent="الأسطوانية"
        process=""
        benefit="تجهيز دقيق للعينات…"
        detail="لتقييم سليم لمقاومة الخرسانة."
        benefitLabel=""
      />
    </Scene>
  );
}
